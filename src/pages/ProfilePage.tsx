import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { BadgeMedal } from '@/components/BadgeMedal'
import { CourseProgressCard } from '@/components/CourseProgressCard'
import { StatTile } from '@/components/StatTile'
import { Badge } from '@/components/ui/Badge'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { Card } from '@/components/ui/Card'
import { Mascot } from '@/components/ui/Mascot'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Spinner } from '@/components/ui/Spinner'
import { useProfile } from '@/hooks/useProfile'
import { badgeTitle, formatBadgeDate } from '@/lib/badges'
import { trackIcon } from '@/lib/tracks'
import type { Badge as BadgeData, Track } from '@/services/api'
import { cn } from '@/utils/cn'
import { getErrorMessage } from '@/utils/getErrorMessage'

const headingClass = 'text-3xl font-bold text-on-page sm:text-4xl'
const labelClass = 'text-sm font-semibold tracking-wider text-ink/70 uppercase'

function LatestBadgeCard({ badge }: { badge: BadgeData | null }) {
  const { t, i18n } = useTranslation()
  if (!badge?.awarded_at) {
    return (
      <Card className="flex items-center">
        <p className="text-lg">{t('profile.noBadges')}</p>
      </Card>
    )
  }
  return (
    <Card className="flex items-center gap-6">
      <BadgeMedal family={badge.family} earned />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h3 className={labelClass}>{t('profile.latestBadge')}</h3>
        <p className="text-2xl font-bold">{badgeTitle(badge, t)}</p>
        <p className="text-ink/70">{t(`badges.items.${badge.code}.description`)}</p>
        <p className="font-semibold text-tile">
          {t('badges.unlocked', { date: formatBadgeDate(badge.awarded_at, i18n.language) })}
        </p>
      </div>
    </Card>
  )
}

function NextBadgeCard({ badge }: { badge: BadgeData | null }) {
  const { t } = useTranslation()
  if (!badge) {
    return (
      <Card className="flex items-center">
        <p className="text-lg">{t('profile.allBadges')}</p>
      </Card>
    )
  }
  return (
    <Card className="flex items-center gap-6">
      <BadgeMedal family={badge.family} earned={false} />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <h3 className={labelClass}>{t('profile.nextBadge')}</h3>
        <p className="text-2xl font-bold">{badgeTitle(badge, t)}</p>
        <div className="flex items-center gap-3">
          <ProgressBar
            value={(badge.progress / badge.goal) * 100}
            label={t('badges.progressLabel')}
            showValue={false}
          />
          <span className="font-semibold">
            {badge.progress}/{badge.goal}
          </span>
        </div>
        <p className="text-ink/70">{t('profile.toGo', { count: badge.goal - badge.progress })}</p>
      </div>
    </Card>
  )
}

function TrackBadge({ track, className }: { track: Track; className?: string }) {
  const { t } = useTranslation()
  return (
    <Badge className={className}>
      {trackIcon(track)} {t(`choice.tracks.${track}.name`)}
    </Badge>
  )
}

export function ProfilePage() {
  const { t, i18n } = useTranslation()
  const profile = useProfile()

  if (profile.error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Card>
          <p role="alert" className="font-medium text-danger">
            {getErrorMessage(profile.error, t)}
          </p>
        </Card>
      </div>
    )
  }

  if (!profile.data) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" label={t('common.loading')} className="text-on-page" />
      </div>
    )
  }

  const { user, stats, latest_badge, next_badge, courses, suggested_course } = profile.data
  const inProgress = courses.filter((item) => !item.completed)
  const memberSince = new Intl.DateTimeFormat(i18n.language, {
    month: 'long',
    year: 'numeric',
  }).format(new Date(user.created_at))

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8">
      <div className="flex flex-col items-center gap-6 sm:flex-row">
        <Card padding="lg" className="flex w-full flex-1 flex-col gap-6">
          <div className="flex flex-wrap items-center gap-5">
            <span
              aria-hidden
              className="flex size-20 shrink-0 items-center justify-center rounded-full bg-primary text-4xl font-bold text-on-primary uppercase"
            >
              {user.username[0]}
            </span>
            <div className="min-w-0 flex-1">
              <h1 className="text-3xl font-bold wrap-break-word sm:text-4xl">{user.username}</h1>
              <p className="text-lg font-medium text-ink/70">
                {t('profile.memberSince', { date: memberSince })}
              </p>
            </div>
            {user.track && <TrackBadge track={user.track} />}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatTile value={`⚡ ${stats.total_xp}`} label={t('profile.stats.xp')} />
            <StatTile value={`🔥 ${stats.streak_days}`} label={t('profile.stats.streak')} />
            <StatTile value={`🏅 ${stats.badges_earned}`} label={t('profile.stats.badges')} />
            <StatTile value={`🎓 ${stats.courses_completed}`} label={t('profile.stats.courses')} />
          </div>
        </Card>
        <Mascot variant="ducky" size="md" />
      </div>

      <section className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className={headingClass}>{t('profile.achievements')}</h2>
          <Link to="/achievements" className="text-lg font-semibold text-on-page underline">
            {t('badges.seeAll')}
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <LatestBadgeCard badge={latest_badge} />
          <NextBadgeCard badge={next_badge} />
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className={headingClass}>{t('profile.continueLearning')}</h2>
        {inProgress.length > 0 ? (
          <ul className="grid gap-6 sm:grid-cols-2">
            {inProgress.map((item) => (
              <li key={item.course.id}>
                <CourseProgressCard item={item} />
              </li>
            ))}
          </ul>
        ) : (
          <Card>
            <p className="text-lg">
              {suggested_course ? t('profile.nothingInProgress') : t('profile.allDone')}
            </p>
          </Card>
        )}
      </section>

      <div className="grid gap-6 sm:grid-cols-2">
        {suggested_course && (
          <Card className="flex flex-col items-start gap-4">
            <h2 className={labelClass}>{t('profile.suggested')}</h2>
            <h3 className="flex items-center gap-3 text-2xl font-bold">
              {suggested_course.icon_url && (
                <img
                  src={suggested_course.icon_url}
                  alt=""
                  aria-hidden
                  className="size-10 object-contain"
                />
              )}
              {suggested_course.name}
            </h3>
            <p className="text-lg text-ink/70">{suggested_course.description}</p>
            {suggested_course.track && (
              <TrackBadge track={suggested_course.track} className="bg-tile/15 text-ink" />
            )}
            <Link to={`/courses/${suggested_course.id}`} className={buttonVariants()}>
              {t('courses.start')}
            </Link>
          </Card>
        )}

        <Card className={cn('flex flex-col gap-5', !suggested_course && 'sm:col-span-2')}>
          <h2 className={labelClass}>{t('profile.myCourses')}</h2>
          {courses.length > 0 ? (
            <ul className="flex flex-col gap-4">
              {courses.map(({ course, completed, completed_lessons }) => (
                <li key={course.id} className="flex flex-wrap items-center justify-between gap-3">
                  <Link
                    to={`/courses/${course.id}`}
                    className="text-lg font-semibold hover:underline"
                  >
                    {course.name}
                  </Link>
                  {completed ? (
                    <Badge>{t('profile.completed')}</Badge>
                  ) : (
                    <Badge className="bg-primary/30">
                      {t('profile.inProgress', {
                        percent: Math.round(
                          (completed_lessons / Math.max(course.lessons_count, 1)) * 100,
                        ),
                      })}
                    </Badge>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-lg">{t('profile.noCourses')}</p>
          )}
        </Card>
      </div>
    </div>
  )
}
