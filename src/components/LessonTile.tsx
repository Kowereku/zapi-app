import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Mascot } from '@/components/ui/Mascot'
import type { Lesson } from '@/services/api'
import { cn } from '@/utils/cn'

const styles = {
  done: 'bg-success text-on-primary hover:brightness-105',
  current: 'bg-primary text-on-primary ring-4 ring-white/40 hover:bg-primary-hover',
  locked: 'bg-tile/60 text-white/70',
}

const icons = { done: '✓', current: '▶', locked: '🔒' }

type LessonTileProps = {
  lesson: Lesson
  status: keyof typeof styles
  to: string
}

export function LessonTile({ lesson, status, to }: LessonTileProps) {
  const { t } = useTranslation()
  const className = cn(
    'flex min-h-16 flex-1 items-center gap-4 rounded-card px-5 py-3 transition',
    styles[status],
  )
  const content = (
    <>
      <span aria-hidden className="w-6 text-center text-xl font-bold">
        {icons[status]}
      </span>
      <span className="flex-1 text-lg font-semibold">{lesson.title}</span>
      {/* Replaying a done lesson gives no XP, so only upcoming lessons show it. */}
      <span className="text-sm font-semibold">
        {status === 'current' && t('courses.start')}
        {status === 'locked' && t('nav.xp', { count: lesson.xp_reward })}
      </span>
      <span className="sr-only">{t(`courses.status.${status}`)}</span>
    </>
  )

  if (status === 'locked') {
    return (
      <div aria-disabled className={className}>
        {content}
      </div>
    )
  }

  if (status === 'done') {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <Mascot variant="ducky" size="icon" />
      <Link to={to} className={className}>
        {content}
      </Link>
    </div>
  )
}
