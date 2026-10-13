import { useState } from 'react'
import { Tile } from '@/components/ui/Tile'
import type { Exercise } from '@/services/api'

type MultipleChoiceExerciseProps = {
  exercise: Exercise
  disabled: boolean
  onChange: (correct: boolean | null) => void
}

export function MultipleChoiceExercise({
  exercise,
  disabled,
  onChange,
}: MultipleChoiceExerciseProps) {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-3">
      {(exercise.options as string[]).map((option, index) => (
        <Tile
          key={index}
          state={selected === index ? 'selected' : 'default'}
          aria-pressed={selected === index}
          disabled={disabled}
          onClick={() => {
            setSelected(index)
            onChange(option === exercise.correct_answer)
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
