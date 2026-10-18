import { useState } from 'react'
import { Tile } from '@/components/ui/Tile'
import type { Exercise } from '@/services/api'
import { shuffle } from '@/utils/shuffle'

type MatchingExerciseProps = {
  exercise: Exercise
  checked: boolean
  onChange: (correct: boolean | null, answer: string) => void
}

export function MatchingExercise({ exercise, checked, onChange }: MatchingExerciseProps) {
  const options = exercise.options as [string, string][]
  // Left and right sides are referred to by the index of their original pair.
  const [rights] = useState(() => shuffle(options.map((_, index) => index)))
  const [pairs, setPairs] = useState<{ left: number; right: number }[]>([])
  const [left, setLeft] = useState<number | null>(null)

  const isCorrect = (pair: (typeof pairs)[number]) =>
    options[pair.left][1] === options[pair.right][1]

  const update = (next: typeof pairs) => {
    setPairs(next)
    onChange(
      next.length === options.length ? next.every(isCorrect) : null,
      [...next]
        .sort((a, b) => a.left - b.left)
        .map((pair) => options[pair.right][1])
        .join('\n'),
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      {pairs.length > 0 && (
        <ul className="flex flex-col gap-3">
          {pairs.map((pair) => (
            <li key={pair.left}>
              <Tile
                state={checked ? (isCorrect(pair) ? 'correct' : 'wrong') : 'selected'}
                disabled={checked}
                onClick={() => update(pairs.filter((item) => item !== pair))}
                className="w-full justify-between"
              >
                <span>{options[pair.left][0]}</span>
                <span aria-hidden>↔</span>
                <span>{options[pair.right][1]}</span>
              </Tile>
            </li>
          ))}
        </ul>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-3">
          {options.map(
            ([text], index) =>
              !pairs.some((pair) => pair.left === index) && (
                <Tile
                  key={index}
                  state={left === index ? 'selected' : 'default'}
                  aria-pressed={left === index}
                  disabled={checked}
                  onClick={() => setLeft(index)}
                >
                  {text}
                </Tile>
              ),
          )}
        </div>
        <div className="flex flex-col gap-3">
          {rights.map(
            (index) =>
              !pairs.some((pair) => pair.right === index) && (
                <Tile
                  key={index}
                  disabled={checked || left === null}
                  onClick={() => {
                    if (left === null) return
                    update([...pairs, { left, right: index }])
                    setLeft(null)
                  }}
                >
                  {options[index][1]}
                </Tile>
              ),
          )}
        </div>
      </div>
    </div>
  )
}
