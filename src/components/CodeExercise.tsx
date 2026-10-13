import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import type { Exercise } from '@/services/api'

type CodeExerciseProps = {
  exercise: Exercise
  disabled: boolean
  onChange: (correct: boolean | null) => void
}

const normalize = (code: string) =>
  code
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .filter(Boolean)
    .join('\n')

export function CodeExercise({ exercise, disabled, onChange }: CodeExerciseProps) {
  const { t } = useTranslation()
  const id = useId()

  return (
    <div className="mx-auto w-full max-w-3xl">
      <label htmlFor={id} className="sr-only">
        {t('lesson.codeLabel')}
      </label>
      <textarea
        id={id}
        rows={6}
        spellCheck={false}
        disabled={disabled}
        placeholder={t('lesson.codePlaceholder')}
        onChange={(event) =>
          onChange(
            event.target.value.trim()
              ? normalize(event.target.value) === normalize(exercise.code_snippet ?? '')
              : null,
          )
        }
        className="w-full rounded-card bg-field p-4 font-mono text-base text-ink placeholder:text-ink/60 focus-visible:outline-tile disabled:opacity-60"
      />
    </div>
  )
}
