import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Editor from 'react-simple-code-editor'
import type { Exercise } from '@/services/api'
import { highlight } from '@/utils/highlight'

type CodeExerciseProps = {
  exercise: Exercise
  language: string
  disabled: boolean
  onChange: (correct: boolean | null) => void
}

const normalize = (code: string) =>
  code
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .filter(Boolean)
    .join('\n')

export function CodeExercise({ exercise, language, disabled, onChange }: CodeExerciseProps) {
  const { t } = useTranslation()
  const id = useId()
  const [code, setCode] = useState('')

  return (
    <div className="mx-auto w-full max-w-3xl">
      <label htmlFor={id} className="sr-only">
        {t('lesson.codeLabel')}
      </label>
      <Editor
        textareaId={id}
        value={code}
        highlight={(value) => highlight(value, language)}
        padding={16}
        disabled={disabled}
        placeholder={t('lesson.codePlaceholder')}
        onValueChange={(value) => {
          setCode(value)
          onChange(
            value.trim() ? normalize(value) === normalize(exercise.code_snippet ?? '') : null,
          )
        }}
        textareaClassName="placeholder:text-ink/60 focus-visible:outline-none"
        className="min-h-44 w-full rounded-card bg-field font-mono text-base text-ink has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-tile has-disabled:opacity-60"
      />
    </div>
  )
}
