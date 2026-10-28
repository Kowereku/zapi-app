import { useRef, useState } from 'react'
import { Link, Navigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { DuckyBubble } from '@/components/DuckyBubble'
import { LevelUpDialog } from '@/components/LevelUpDialog'
import { NewBadgeCard } from '@/components/NewBadgeCard'
import { Button } from '@/components/ui/Button'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { Spinner } from '@/components/ui/Spinner'
import type { LevelUp } from '@/lib/levelUp'
import { ApiRequestError, type Badge } from '@/services/api'
import { getErrorMessage } from '@/utils/getErrorMessage'

type LessonCompleteProps = {
  xp: number
  mistakes_made: number
  newBadges: Badge[]
  levelUp: LevelUp | null
  pending: boolean
  error: Error | null
  onRetry: () => void
  coursePath: string
  nextPath: string | null
}

export function LessonComplete({
  xp,
  mistakes_made,
  newBadges,
  levelUp,
  pending,
  error,
  onRetry,
  coursePath,
  nextPath,
}: LessonCompleteProps) {
  const { t } = useTranslation()
  const [levelUpSeen, setLevelUpSeen] = useState(false)
  const primaryAction = useRef<HTMLAnchorElement>(null)

  const closeLevelUp = () => {
    setLevelUpSeen(true)
    // The button that led here is gone, so focus moves to the main action instead of <body>.
    requestAnimationFrame(() => primaryAction.current?.focus())
  }

  // The session has expired, so retrying can't succeed.
  if (error instanceof ApiRequestError && error.status === 401) {
    return <Navigate to="/login" replace />
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-10 px-4 py-8">
      <DuckyBubble live>
        <p className="font-bold">{t('lesson.complete.title')}</p>
        <p className="text-lg">
          {xp > 0 ? t('lesson.complete.xp', { count: xp }) : t('lesson.complete.noXp')}
        </p>
        <p className="text-lg">{t('lesson.complete.mistakes', { count: mistakes_made })}</p>
      </DuckyBubble>

      {newBadges.map((badge) => (
        <NewBadgeCard key={badge.code} badge={badge} />
      ))}

      {levelUp && !levelUpSeen && <LevelUpDialog {...levelUp} onClose={closeLevelUp} />}

      {pending ? (
        <Spinner size="lg" label={t('lesson.complete.saving')} />
      ) : error ? (
        <div className="flex flex-col items-center gap-4">
          <p role="alert" className="rounded-card bg-surface px-4 py-2 font-medium text-danger">
            {getErrorMessage(error, t)}
          </p>
          <Button onClick={onRetry}>{t('lesson.complete.retry')}</Button>
        </div>
      ) : (
        <div className="flex w-full max-w-xl flex-col gap-4 sm:flex-row">
          <Link
            ref={primaryAction}
            to={nextPath ?? coursePath}
            className={buttonVariants({ variant: 'success', size: 'lg', fullWidth: true })}
          >
            {nextPath ? t('lesson.complete.next') : t('lesson.backToCourse')}
          </Link>
          {nextPath && (
            <Link
              to={coursePath}
              className={buttonVariants({ variant: 'outline', size: 'lg', fullWidth: true })}
            >
              {t('lesson.backToCourse')}
            </Link>
          )}
        </div>
      )}
    </main>
  )
}
