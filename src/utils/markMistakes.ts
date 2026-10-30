const tokenPattern = /\w+|[^\s\w]/g

export const splitTokens = (text: string) => text.match(tokenPattern) ?? []

/** Same tokens in the same order; spacing and line breaks don't matter. */
export const sameCode = (a: string, b: string) =>
  splitTokens(a).join(' ') === splitTokens(b).join(' ')

export const markMistakes = (expected: string, actual: string) => {
  const words = [...expected.matchAll(tokenPattern)]
  const typed = splitTokens(actual)
  const lengths = Array.from({ length: words.length + 1 }, () =>
    Array<number>(typed.length + 1).fill(0),
  )
  for (let i = words.length - 1; i >= 0; i--) {
    for (let j = typed.length - 1; j >= 0; j--) {
      lengths[i][j] =
        words[i][0] === typed[j]
          ? lengths[i + 1][j + 1] + 1
          : Math.max(lengths[i + 1][j], lengths[i][j + 1])
    }
  }

  const marked = Array<boolean>(expected.length).fill(false)
  let i = 0
  let j = 0
  while (i < words.length) {
    if (j < typed.length && words[i][0] === typed[j]) {
      i++
      j++
    } else if (j < typed.length && lengths[i][j + 1] >= lengths[i + 1][j]) {
      j++
    } else {
      marked.fill(true, words[i].index, words[i].index + words[i][0].length)
      i++
    }
  }
  return marked
}
