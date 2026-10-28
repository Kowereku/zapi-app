import { useTranslation } from 'react-i18next'
import { RankingRow } from '@/components/RankingRow'
import { Card } from '@/components/ui/Card'
import { Mascot } from '@/components/ui/Mascot'
import { Spinner } from '@/components/ui/Spinner'
import { useLeaderboard } from '@/hooks/useLeaderboard'
import { getErrorMessage } from '@/utils/getErrorMessage'

export function RankingPage() {
  const { t } = useTranslation()
  const leaderboard = useLeaderboard()

  if (leaderboard.error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Card>
          <p role="alert" className="font-medium text-danger">
            {getErrorMessage(leaderboard.error, t)}
          </p>
        </Card>
      </div>
    )
  }

  if (!leaderboard.data) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" label={t('common.loading')} className="text-on-page" />
      </div>
    )
  }

  const { top, me } = leaderboard.data
  const meInTop = top.some((entry) => entry.is_me)

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
      <div className="flex items-center gap-6">
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-on-page sm:text-6xl">{t('ranking.title')}</h1>
          <p className="mt-2 text-lg text-on-page sm:text-2xl">{t('ranking.subtitle')}</p>
        </div>
        <Mascot variant="ducky" size="md" className="hidden sm:block" />
      </div>

      {top.length === 0 ? (
        <Card>
          <p className="text-lg">{t('ranking.empty')}</p>
        </Card>
      ) : (
        // Each row says its own position (ties share one), so the list isn't numbered;
        // role="list" keeps the list semantics that Safari drops when the bullets are removed.
        <ul role="list" className="flex flex-col gap-3">
          {top.map((entry) => (
            <li key={`${entry.position}-${entry.username}`}>
              <RankingRow entry={entry} />
            </li>
          ))}
        </ul>
      )}

      {me && !meInTop && (
        <>
          {/* Only when someone ahead of the learner isn't listed. */}
          {me.position - 1 > top.length && (
            <p aria-hidden className="text-center text-2xl font-bold text-on-page">
              · · ·
            </p>
          )}
          <RankingRow entry={me} />
        </>
      )}
      {!me && top.length > 0 && (
        <p className="text-center text-lg text-on-page">{t('ranking.unranked')}</p>
      )}
    </div>
  )
}
