import { TileAssembly } from '@/components/TileAssembly'
import type { Exercise } from '@/services/api'

type BlockAssemblyExerciseProps = {
  exercise: Exercise
  checked: boolean
  onChange: (correct: boolean | null, answer: string) => void
}

export function BlockAssemblyExercise({ exercise, checked, onChange }: BlockAssemblyExerciseProps) {
  return (
    <TileAssembly
      tiles={exercise.options as string[]}
      checked={checked}
      onChange={(picked) => {
        const answer = picked.join(' ')
        onChange(picked.length === 0 ? null : answer === exercise.correct_answer, answer)
      }}
    />
  )
}
