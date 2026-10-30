import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import EditorModule from 'react-simple-code-editor'
import { TileAssembly } from '@/components/TileAssembly'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { getCodeMode, setCodeMode, type CodeMode } from '@/lib/codeMode'
import type { Exercise } from '@/services/api'
import { cn } from '@/utils/cn'
import { buildCodeTiles } from '@/utils/codeTiles'
import { highlight } from '@/utils/highlight'
import { sameCode } from '@/utils/markMistakes'

const Editor = (EditorModule as unknown as { default: typeof EditorModule }).default

type CodeExerciseProps = {
  exercise: Exercise
  language: string
  checked: boolean
  /** `typed` is false for an answer built from blocks, which doesn't count as own code. */
  onChange: (correct: boolean | null, answer: string, typed: boolean) => void
}

export function CodeExercise({ exercise, language, checked, onChange }: CodeExerciseProps) {
  const { t } = useTranslation()
  const id = useId()
  const snippet = exercise.code_snippet ?? ''
  const [mode, setMode] = useState<CodeMode>(getCodeMode)
  const [code, setCode] = useState('')
  const [tiles] = useState(() => buildCodeTiles(snippet, language))

  // Dual mode: switching starts the answer over, and the choice is remembered on this device.
  const switchMode = () => {
    const next = mode === 'typing' ? 'blocks' : 'typing'
    setMode(next)
    setCodeMode(next)
    setCode('')
    onChange(null, '', next === 'typing')
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      {mode === 'typing' ? (
        <>
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
              onChange(value.trim() ? sameCode(value, snippet) : null, value, true)
            }}
            textareaClassName="placeholder:text-ink/60 focus-visible:outline-none"
            className="min-h-44 w-full rounded-card bg-field font-mono text-base text-ink has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-tile has-disabled:opacity-60"
          />
        </>
      ) : (
        <TileAssembly
          tiles={tiles}
          checked={checked}
          tileClassName="font-mono"
          onChange={(picked) => {
            const answer = picked.join(' ')
            onChange(picked.length === 0 ? null : sameCode(answer, snippet), answer, false)
          }}
        />
      )}
      <button
        type="button"
        disabled={checked}
        onClick={switchMode}
        className={cn(buttonVariants({ variant: 'outline', size: 'md' }), 'self-end')}
      >
        {mode === 'typing' ? t('lesson.dualMode.toBlocks') : t('lesson.dualMode.toTyping')}
      </button>
    </div>
  )
}
