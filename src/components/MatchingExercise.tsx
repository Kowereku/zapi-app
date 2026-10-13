import { useState } from 'react'
import { Tile } from '@/components/ui/Tile'
import type { Exercise } from '@/services/api'
import { shuffle } from '@/utils/shuffle'

type MatchingExerciseProps = {
  exercise: Exercise
  disabled: boolean
  onChange: (correct: boolean | null) => void
}

export function MatchingExercise({ exercise, disabled, onChange }: MatchingExerciseProps) {
  const options = exercise.options as [string, string][]
  // Left and right sides are referred to by the index of their original pair.
  const [rights] = useState(() => shuffle(options.map((_, index) => index)))
  const [pairs, setPairs] = useState<{ left: number; right: number }[]>([])
  const [left, setLeft] = useState<number | null>(null)

  const update = (next: typeof pairs) => {
    setPairs(next)
    onChange(
      next.length === options.length
        ? next.every((pair) => options[pair.left][1] === options[pair.right][1])
        : null,
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      {pairs.length > 0 && (
        <ul className="flex flex-col gap-3">
          {pairs.map((pair) => (
            <li key={pair.left}>
              <Tile
                state="selected"
                disabled={disabled}
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
                  disabled={disabled}
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
                  disabled={disabled || left === null}
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
