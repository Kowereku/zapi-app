import { shuffle } from '@/utils/shuffle'
import { splitTokens } from '@/utils/markMistakes'

/**
 * Bigger pieces than splitTokens, so a block answer isn't a pile of single characters: quoted
 * text stays one tile, and so do simple JSX tags like "<p>", operators like ">=" and "=>", and
 * words with non-ASCII letters ("Cześć"). An apostrophe inside a word ("Don't") starts no quote.
 */
const tilePattern =
  /"(?:\\.|[^"\\\n])*"|(?<![\p{L}\p{N}_])'(?:\\.|[^'\\\n])*'|<\/?\w+>|===|!==|[=!<>+\-*/]=|=>|&&|\|\||\+\+|--|[\p{L}\p{N}_]+|[^\s\w]/gu

export const splitTiles = (code: string) => code.match(tilePattern) ?? []

/** Plausible wrong pieces per course language, space-separated: e.g. a keyword from another one. */
const distractorPools: Record<string, string> = {
  python: 'print echo elif def return for in while True None : ; == [ ] { } ,',
  jsx: 'function return const let class props useState useEffect => == ; { } < > / . print',
  bash: 'echo ls cd cat rm mkdir touch chmod sudo print - + > | ; $',
  java: 'public static void int String new return if else System out println printf ; { } == .',
}
const fallbackPool = 'print return ; : { } ( ) = =='

const DISTRACTOR_COUNT = 3

/**
 * Tiles for answering a code exercise with blocks: the model answer's pieces plus up to three
 * wrong ones (fewer when the answer already uses most of the pool). A wrong piece always has a
 * token the answer lacks, so it can never be part of a correct answer.
 */
export function buildCodeTiles(code: string, language: string) {
  const used = new Set(splitTokens(code))
  const distractors = shuffle((distractorPools[language] ?? fallbackPool).split(' '))
    .filter((tile) => !splitTokens(tile).every((token) => used.has(token)))
    .slice(0, DISTRACTOR_COUNT)
  return [...splitTiles(code), ...distractors]
}
