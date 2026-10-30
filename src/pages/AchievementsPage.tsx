import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { BadgeTile } from '@/components/BadgeTile'
import { ErrorState } from '@/components/ErrorState'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Spinner } from '@/components/ui/Spinner'
import { useBadges } from '@/hooks/useBadges'
import { useRetryFailedQueries } from '@/hooks/useRetryFailedQueries'
import { familyIcon } from '@/lib/badges'

export function AchievementsPage() {
  const { t } = useTranslation()
  const badges = useBadges()
  const retryFailed = useRetryFailedQueries()

  if (badges.error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <ErrorState error={badges.error} onRetry={retryFailed} />
      </div>
    )
  }

  if (!badges.data) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" label={t('common.loading')} className="text-on-page" />
      </div>
    )
  }

  const list = badges.data
  const earned = list.filter((badge) => badge.awarded_at).length
  // Families in the order their first badge appears, which is the definition order.
  const families = [...new Set(list.map((badge) => badge.family))]

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-8">
      <div className="flex flex-col gap-3">
        <Link to="/profile" className="self-start font-semibold text-on-page underline">
          {t('achievements.backToProfile')}
        </Link>
        <h1 className="text-4xl font-bold text-on-page sm:text-6xl">{t('achievements.title')}</h1>
        <div className="flex flex-wrap items-center gap-4">
          <p className="text-xl text-on-page sm:text-2xl">
            {t('achievements.summary', { earned, total: list.length })}
          </p>
          <ProgressBar
            value={(earned / list.length) * 100}
            label={t('achievements.title')}
            showValue={false}
            className="max-w-sm flex-1"
          />
        </div>
      </div>

      {families.map((family) => (
        <section key={family} className="flex flex-col gap-4">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h2 className="text-2xl font-bold text-on-page sm:text-3xl">
              {familyIcon[family]} {t(`badges.families.${family}.name`)}
            </h2>
            <p className="text-lg text-on-page-muted">
              {t(`badges.families.${family}.description`)}
            </p>
          </div>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {list
              .filter((badge) => badge.family === family)
              .map((badge) => (
                <li key={badge.code}>
                  <BadgeTile badge={badge} />
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
