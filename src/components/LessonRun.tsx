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
import type { LevelUp } from '@/lib/levelUp'
import { useSaveAnnouncements } from '@/hooks/useSaveAnnouncements'
import { useCheckExercise } from '@/hooks/useCheckExercise'
import { useCompleteLesson } from '@/hooks/useCompleteLesson'
import { useSaveUserLessonProgress } from '@/hooks/useUserLessonProgress'
import type { Badge, Exercise, LessonDetail } from '@/services/api'
import { isUnavailable } from '@/utils/errorKind'
import { getErrorMessage } from '@/utils/getErrorMessage'

const optionTypes: Exercise['type'][] = ['block_assembly', 'multiple_choice', 'matching']

type LessonRunProps = {
  lesson: LessonDetail
  courseId: number
  language: string
  alreadyCompleted: boolean
  coursePath: string
  nextPath: string | null
  onRetry: () => void
}

export function LessonRun({
  lesson,
  courseId,
  language,
  alreadyCompleted,
  coursePath,
  nextPath,
  onRetry,
}: LessonRunProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const completeLesson = useCompleteLesson(courseId)
  const checkExercise = useCheckExercise()
  const saveProgress = useSaveUserLessonProgress()
  const announcements = useSaveAnnouncements()
  const [view, setView] = useState<'question' | 'complete' | 'outOfHearts'>('question')
  const [index, setIndex] = useState(0)
  const [hearts, setHearts] = useState(5)
  const [mistakes_made, setMistakesMade] = useState(0)
  // Code exercises answered correctly by typing; they count towards the "Own code" badges.
  const [solvedCodeIds, setSolvedCodeIds] = useState<number[]>([])
  const [newBadges, setNewBadges] = useState<Badge[]>([])
  const [levelUp, setLevelUp] = useState<LevelUp | null>(null)
  const [correct, setCorrect] = useState<boolean | null>(null)
  const [answer, setAnswer] = useState('')
  const [checked, setChecked] = useState(false)
  const [aiUnavailable, setAiUnavailable] = useState(false)
  const [xp, setXp] = useState(0)
  const [isCompleting, setIsCompleting] = useState(false)
  const [alertError, setAlertError] = useState<string | null>(null)

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

  const handleFinish = async () => {
    if (isCompleting) return
    setIsCompleting(true)
    setAlertError(null)

    try {
      announcements.beforeSave()
      const result = await completeLesson.mutateAsync({
        lesson_id: lesson.id,
        mistakes_made,
        code_exercise_ids: solvedCodeIds,
      })
      setLevelUp(announcements.toLevelUp(result))
      setNewBadges(await announcements.toAnnounce(result.new_badges))

      // Also record final lesson progress state as completed
      await saveProgress
        .mutateAsync({
          lesson_id: lesson.id,
          body: {
            status: 'completed',
            last_position: exercises.length,
          },
        })
        .catch(() => null)

      setXp(alreadyCompleted ? 0 : lesson.xp_reward)
      setView('complete')
    } catch (err) {
      setAlertError(getErrorMessage(err, t))
    } finally {
      setIsCompleting(false)
    }
  }

  if (view === 'complete') {
    return (
      <LessonComplete
        xp={xp}
        mistakes_made={mistakes_made}
        newBadges={newBadges}
        levelUp={levelUp}
        pending={isCompleting || completeLesson.isPending}
        error={completeLesson.error}
        onRetry={handleFinish}
        coursePath={coursePath}
        nextPath={nextPath}
      />
    )
  }

  if (view === 'outOfHearts') return <OutOfHearts coursePath={coursePath} onRetry={onRetry} />

  const exercise = exercises[index]
  const checking = checkExercise.isPending || saveProgress.isPending
  const exerciseProps = {
    exercise,
    checked: checked || checking,
    onChange: (nextCorrect: boolean | null, nextAnswer: string) => {
      setCorrect(nextCorrect)
      setAnswer(nextAnswer)
    },
  }

  const finish = async (passed: boolean, nextAiUnavailable = false) => {
    if (passed) {
      try {
        await saveProgress.mutateAsync({
          lesson_id: lesson.id,
          body: {
            status: 'in_progress',
            last_position: index + 1,
          },
        })
      } catch (err) {
        setAlertError(getErrorMessage(err, t))
        return
      }
    }
    setCorrect(passed)
    setAiUnavailable(nextAiUnavailable)
    setChecked(true)
    if (passed && exercise.type === 'code') setSolvedCodeIds([...solvedCodeIds, exercise.id])
    if (!passed) {
      setHearts(hearts - 1)
      setMistakesMade(mistakes_made + 1)
    }
  }

  const check = () => {
    setAlertError(null)
    if (exercise.type !== 'code' || correct) {
      finish(correct === true)
      return
    }
    checkExercise.mutate(
      { exercise_id: exercise.id, answer },
      {
        onSuccess: (result) => finish(result.passed),
        // The answer already differs from the model answer, so without Ducky it counts as wrong;
        // the nap note explains why when the server or the AI is unavailable.
        onError: (error) => finish(false, isUnavailable(error)),
      },
    )
  }

  const next = () => {
    if (hearts === 0) {
      setView('outOfHearts')
      return
    }

    if (index === exercises.length - 1) {
      handleFinish()
      return
    }

    setIndex(index + 1)
    setCorrect(null)
    setAnswer('')
    setAiUnavailable(false)
    setChecked(false)
    setAlertError(null)
  }

  const isLastQuestion = index === exercises.length - 1

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

      {alertError && (
        <div
          role="alert"
          className="mx-auto mb-4 flex w-full max-w-4xl items-center justify-between rounded-card border border-danger/40 bg-surface px-4 py-3 text-sm font-semibold text-danger shadow-md sm:text-base"
        >
          <span>⚠️ {alertError}</span>
          <button
            type="button"
            onClick={() => setAlertError(null)}
            className="cursor-pointer text-sm font-bold text-danger/80 uppercase hover:text-danger"
          >
            ✕
          </button>
        </div>
      )}

      <footer>
        {checked ? (
          <FeedbackPanel
            correct={correct === true}
            exercise={exercise}
            answer={answer}
            language={language}
            aiUnavailable={aiUnavailable}
            onContinue={next}
            continueLabel={isLastQuestion ? t('lesson.finish') : t('lesson.continue')}
            loading={isCompleting}
            disabled={isCompleting}
          />
        ) : (
          <div className="border-t border-on-page-muted px-4 py-6">
            <div className="mx-auto flex max-w-4xl justify-end">
              <Button
                variant="success"
                size="lg"
                disabled={correct === null || checking}
                loading={checking}
                onClick={check}
              >
                {t('lesson.check')}
              </Button>
            </div>
          </div>
        )}
      </footer>
    </div>
  )
}
