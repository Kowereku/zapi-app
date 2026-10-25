import { Link, Navigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { DuckyBubble } from '@/components/DuckyBubble'
import { NewBadgeCard } from '@/components/NewBadgeCard'
import { Button } from '@/components/ui/Button'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { Spinner } from '@/components/ui/Spinner'
import { Tile } from '@/components/ui/Tile'
import { ApiRequestError, type Badge, type Exercise } from '@/services/api'
import { getErrorMessage } from '@/utils/getErrorMessage'

type QuizResultProps = {
  questions: Exercise[]
  answers: string[]
  percent: number
  passPercent: number
  passed: boolean
  xp: number
  newBadges: Badge[]
  pending: boolean
  error: Error | null
  onSave: () => void
  onRetry: () => void
  coursePath: string
}

export function QuizResult({
  questions,
  answers,
  percent,
  passPercent,
  passed,
  xp,
  newBadges,
  pending,
  error,
  onSave,
  onRetry,
  coursePath,
}: QuizResultProps) {
  const { t } = useTranslation()

  if (error instanceof ApiRequestError && error.status === 401) {
    return <Navigate to="/login" replace />
  }

  const mistakes = questions.filter((question, index) => answers[index] !== question.correct_answer)

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col items-center gap-10 px-4 py-8">
      <DuckyBubble live>
        <p className="font-bold">{passed ? t('quiz.passedTitle') : t('quiz.failedTitle')}</p>
        <p className="text-lg">{t('quiz.score', { percent })}</p>
        <p className="text-lg">
          {!passed
            ? t('quiz.needed', { percent: passPercent })
            : xp > 0
              ? t('quiz.xp', { count: xp })
              : t('quiz.noXp')}
        </p>
      </DuckyBubble>

      {passed && newBadges.map((badge) => <NewBadgeCard key={badge.code} badge={badge} />)}

      {passed && pending && <Spinner size="lg" label={t('lesson.complete.saving')} />}
      {passed && error && (
        <div className="flex flex-col items-center gap-4">
          <p role="alert" className="rounded-card bg-surface px-4 py-2 font-medium text-danger">
            {getErrorMessage(error, t)}
          </p>
          <Button onClick={onSave}>{t('lesson.complete.retry')}</Button>
        </div>
      )}

      {mistakes.length > 0 && (
        <section className="flex w-full flex-col gap-6">
          <h2 className="text-xl font-semibold text-on-page">{t('quiz.review')}</h2>
          {mistakes.map((question) => (
            <div key={question.id} className="flex flex-col gap-3">
              <p className="text-lg font-medium whitespace-pre-wrap">{question.content}</p>
              <Tile state="wrong" disabled>
                {t('quiz.yourAnswer')} {answers[questions.indexOf(question)]}
              </Tile>
              <Tile state="correct" disabled>
                {t('quiz.correctAnswer')} {question.correct_answer}
              </Tile>
            </div>
          ))}
        </section>
      )}

      <div className="flex w-full max-w-xl flex-col gap-4 sm:flex-row">
        <Button variant="success" size="lg" fullWidth onClick={onRetry}>
          {t('quiz.retake')}
        </Button>
        <Link
          to={coursePath}
          className={buttonVariants({ variant: 'outline', size: 'lg', fullWidth: true })}
        >
          {t('lesson.backToCourse')}
        </Link>
      </div>
    </main>
  )
}
