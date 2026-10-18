import { useState } from 'react'
import { Tile } from '@/components/ui/Tile'
import type { Exercise } from '@/services/api'

type MultipleChoiceExerciseProps = {
  exercise: Exercise
  checked: boolean
  onChange: (correct: boolean | null, answer: string) => void
}

export function MultipleChoiceExercise({
  exercise,
  checked,
  onChange,
}: MultipleChoiceExerciseProps) {
  const [selected, setSelected] = useState<number | null>(null)

  const state = (option: string, index: number) => {
    if (checked && option === exercise.correct_answer) return 'correct'
    if (checked && selected === index) return 'wrong'
    return selected === index ? 'selected' : 'default'
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-3">
      {(exercise.options as string[]).map((option, index) => (
        <Tile
          key={index}
          state={state(option, index)}
          aria-pressed={selected === index}
          disabled={checked}
          onClick={() => {
            setSelected(index)
            onChange(option === exercise.correct_answer, option)
          }}
        >
          <span
            aria-hidden
            className="flex size-7 shrink-0 items-center justify-center rounded-tile border border-white/60 text-sm"
          >
            {index + 1}
          </span>
          {option}
        </Tile>
      ))}
    </div>
  )
}
