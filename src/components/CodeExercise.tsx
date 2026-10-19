import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import EditorModule from 'react-simple-code-editor'
import type { Exercise } from '@/services/api'
import { highlight } from '@/utils/highlight'
import { splitTokens } from '@/utils/markMistakes'

const Editor = (EditorModule as unknown as { default: typeof EditorModule }).default

type CodeExerciseProps = {
  exercise: Exercise
  language: string
  checked: boolean
  onChange: (correct: boolean | null, answer: string) => void
}

const sameCode = (a: string, b: string) => splitTokens(a).join(' ') === splitTokens(b).join(' ')

export function CodeExercise({ exercise, language, checked, onChange }: CodeExerciseProps) {
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
        disabled={checked}
        placeholder={t('lesson.codePlaceholder')}
        onValueChange={(value) => {
          setCode(value)
          onChange(value.trim() ? sameCode(value, exercise.code_snippet ?? '') : null, value)
        }}
        textareaClassName="placeholder:text-ink/60 focus-visible:outline-none"
        className="min-h-44 w-full rounded-card bg-field font-mono text-base text-ink has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-tile has-disabled:opacity-60"
      />
    </div>
  )
}
