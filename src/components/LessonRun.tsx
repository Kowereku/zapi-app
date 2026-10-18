import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { BlockAssemblyExercise } from '@/components/BlockAssemblyExercise'
import { CodeExercise } from '@/components/CodeExercise'
import { DuckyBubble } from '@/components/DuckyBubble'
import { FeedbackPanel } from '@/components/FeedbackPanel'
import { LessonComplete } from '@/components/LessonComplete'
import { MatchingExercise } from '@/components/MatchingExercise'
import { MultipleChoiceExercise } from '@/components/MultipleChoiceExercise'
import { OutOfHearts } from '@/components/OutOfHearts'
import { Button } from '@/components/ui/Button'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { CloseButton } from '@/components/ui/CloseButton'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useCompleteLesson } from '@/hooks/useCompleteLesson'
import type { Exercise, LessonDetail } from '@/services/api'

const optionTypes: Exercise['type'][] = ['block_assembly', 'multiple_choice', 'matching']
const codeTypes: Exercise['type'][] = ['code', 'block_assembly']

type LessonRunProps = {
  lesson: LessonDetail
  language: string
  alreadyCompleted: boolean
  coursePath: string
  nextPath: string | null
  onRetry: () => void
}

export function LessonRun({
  lesson,
  language,
  alreadyCompleted,
  coursePath,
  nextPath,
  onRetry,
}: LessonRunProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const completeLesson = useCompleteLesson()
  const [view, setView] = useState<'question' | 'complete' | 'outOfHearts'>('question')
  const [index, setIndex] = useState(0)
  const [hearts, setHearts] = useState(5)
  const [mistakes_made, setMistakesMade] = useState(0)
  const [correct, setCorrect] = useState<boolean | null>(null)
  const [checked, setChecked] = useState(false)
  const [xp, setXp] = useState(0)

  // Only exercises with the data their type needs can be played.
  const exercises = lesson.exercises.filter((exercise) =>
    exercise.type === 'code'
      ? exercise.code_snippet
      : optionTypes.includes(exercise.type) && exercise.options?.length,
  )

  if (exercises.length === 0) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-10 px-4">
        <DuckyBubble>{t('lesson.empty')}</DuckyBubble>
        <Link to={coursePath} className={buttonVariants({ size: 'lg' })}>
          {t('lesson.backToCourse')}
        </Link>
      </main>
    )
  }

  const save = () => completeLesson.mutate({ lesson_id: lesson.id, mistakes_made })

  if (view === 'complete') {
    return (
      <LessonComplete
        xp={xp}
        mistakes_made={mistakes_made}
        pending={completeLesson.isPending}
        error={completeLesson.error}
        onRetry={save}
        coursePath={coursePath}
        nextPath={nextPath}
      />
    )
  }

  if (view === 'outOfHearts') return <OutOfHearts coursePath={coursePath} onRetry={onRetry} />

  const exercise = exercises[index]
  const exerciseProps = { exercise, disabled: checked, onChange: setCorrect }

  const check = () => {
    setChecked(true)
    if (!correct) {
      setHearts(hearts - 1)
      setMistakesMade(mistakes_made + 1)
    }
  }

  const next = () => {
    if (hearts === 0) {
      setView('outOfHearts')
    } else if (index === exercises.length - 1) {
      // Read now: progress is refetched after saving and would flip alreadyCompleted.
      setXp(alreadyCompleted ? 0 : lesson.xp_reward)
      setView('complete')
      save()
    } else {
      setIndex(index + 1)
      setCorrect(null)
      setChecked(false)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center gap-4 px-4 py-4">
        <CloseButton label={t('lesson.exit')} onClick={() => navigate(coursePath)} />
        <ProgressBar
          value={((index + (checked ? 1 : 0)) / exercises.length) * 100}
          label={t('lesson.progress')}
        />
        <p className="shrink-0 text-xl font-bold text-danger">
          <span aria-hidden>{hearts} ❤️</span>
          <span className="sr-only">{t('lesson.hearts', { count: hearts })}</span>
        </p>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-10 px-4 py-6">
        <DuckyBubble live>{exercise.content}</DuckyBubble>
        {exercise.type === 'block_assembly' && (
          <BlockAssemblyExercise key={exercise.id} {...exerciseProps} />
        )}
        {exercise.type === 'multiple_choice' && (
          <MultipleChoiceExercise key={exercise.id} {...exerciseProps} />
        )}
        {exercise.type === 'matching' && <MatchingExercise key={exercise.id} {...exerciseProps} />}
        {exercise.type === 'code' && (
          <CodeExercise key={exercise.id} language={language} {...exerciseProps} />
        )}
      </main>

      <footer>
        {checked ? (
          <FeedbackPanel
            correct={correct === true}
            answer={(exercise.type === 'code' && exercise.code_snippet) || exercise.correct_answer}
            language={codeTypes.includes(exercise.type) ? language : null}
            onContinue={next}
          />
        ) : (
          <div className="border-t border-on-page-muted px-4 py-6">
            <div className="mx-auto flex max-w-4xl justify-end">
              <Button variant="success" size="lg" disabled={correct === null} onClick={check}>
                {t('lesson.check')}
              </Button>
            </div>
          </div>
        )}
      </footer>
    </div>
  )
}
