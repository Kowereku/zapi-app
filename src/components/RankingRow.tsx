import { useTranslation } from 'react-i18next'
import type { LeaderboardEntry } from '@/services/api'
import { cn } from '@/utils/cn'

const medals: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

type RankingRowProps = {
  entry: LeaderboardEntry
}

/** One user in the ranking, as in the Figma "Ranking Row"; the learner's own row is highlighted. */
export function RankingRow({ entry }: RankingRowProps) {
  const { t } = useTranslation()

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-card px-4 py-3 text-ink shadow-lg shadow-black/10 sm:gap-5 sm:px-6',
        // An opaque soft yellow mixed into the card colour keeps text readable in both themes;
        // a ring instead of a border keeps the columns aligned with the other rows.
        entry.is_me
          ? 'bg-[color-mix(in_srgb,var(--color-primary)_25%,var(--color-surface))] ring-4 ring-primary'
          : 'bg-surface',
      )}
    >
      <span
        className={cn(
          'min-w-10 shrink-0 text-center font-bold tabular-nums sm:min-w-14',
          entry.position >= 100 ? 'text-lg' : 'text-2xl',
        )}
      >
        <span aria-hidden>{medals[entry.position] ?? entry.position}</span>
        <span className="sr-only">{t('ranking.position', { position: entry.position })}</span>
      </span>
      <span
        aria-hidden
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-on-primary uppercase sm:size-12"
      >
        {entry.username[0]}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        {/* A long name is cut off, but "(you)" stays visible and the full name shows on hover. */}
        <span className="flex min-w-0 gap-1.5 text-lg font-semibold sm:text-2xl">
          <span title={entry.username} className="truncate">
            {entry.username}
          </span>
          {entry.is_me && <span className="shrink-0">{t('ranking.you')}</span>}
        </span>
        {/* The ranking is ordered by XP, so phones keep it too, under the name. */}
        <span className="text-sm font-medium text-ink/70 sm:hidden">
          {t('nav.xp', { count: entry.total_xp })}
        </span>
      </span>
      <span className="shrink-0 rounded-full bg-tile/15 px-3 py-1 text-sm font-semibold text-ink sm:text-lg">
        <span aria-hidden>⭐</span> {t('nav.level', { level: entry.level })}
      </span>
      <span className="hidden w-28 shrink-0 text-right text-lg font-semibold text-ink/70 sm:block">
        {t('nav.xp', { count: entry.total_xp })}
      </span>
    </div>
  )
}
