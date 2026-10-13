import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Tile } from '@/components/ui/Tile'
import type { Exercise } from '@/services/api'
import { cn } from '@/utils/cn'
import { shuffle } from '@/utils/shuffle'

type BlockAssemblyExerciseProps = {
  exercise: Exercise
  disabled: boolean
  onChange: (correct: boolean | null) => void
}

export function BlockAssemblyExercise({
  exercise,
  disabled,
  onChange,
}: BlockAssemblyExerciseProps) {
  const { t } = useTranslation()
  // Tiles can repeat (e.g. two "("), so each one gets its index as an id.
  const [pool] = useState(() =>
    shuffle((exercise.options as string[]).map((text, id) => ({ id, text }))),
  )
  const [picked, setPicked] = useState<typeof pool>([])

  const update = (next: typeof pool) => {
    setPicked(next)
    onChange(
      next.length === 0
        ? null
        : next.map((tile) => tile.text).join(' ') === exercise.correct_answer,
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div
        role="group"
        aria-label={t('lesson.answer')}
        className="flex min-h-16 flex-wrap items-end gap-2 border-b-2 border-white/60 pb-2"
      >
        {picked.map((tile) => (
          <Tile
            key={tile.id}
            disabled={disabled}
            onClick={() => update(picked.filter((item) => item.id !== tile.id))}
          >
            {tile.text}
          </Tile>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {pool.map((tile) => {
          const isPicked = picked.some((item) => item.id === tile.id)
          return (
            <Tile
              key={tile.id}
              disabled={disabled || isPicked}
              onClick={() => update([...picked, tile])}
              className={cn(isPicked && 'invisible')}
            >
              {tile.text}
            </Tile>
          )
        })}
      </div>
    </div>
  )
}
