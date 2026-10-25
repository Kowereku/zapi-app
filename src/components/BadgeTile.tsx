import { useTranslation } from 'react-i18next'
import { BadgeMedal } from '@/components/BadgeMedal'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { formatBadgeDate } from '@/lib/badges'
import type { Badge } from '@/services/api'

type BadgeTileProps = {
  badge: Badge
}

/** One badge on the Achievements page: the unlock date when earned, progress otherwise. */
export function BadgeTile({ badge }: BadgeTileProps) {
  const { t, i18n } = useTranslation()

  return (
    <Card className="flex h-full flex-col items-center gap-3 text-center">
      <BadgeMedal family={badge.family} earned={badge.awarded_at !== null} />
      <p className="text-2xl font-bold">{t(`badges.items.${badge.code}.title`)}</p>
      <p className="flex-1 text-ink/70">{t(`badges.items.${badge.code}.description`)}</p>
      {badge.awarded_at ? (
        <p className="font-semibold text-tile">
          {t('badges.unlocked', { date: formatBadgeDate(badge.awarded_at, i18n.language) })}
        </p>
      ) : (
        <div className="flex w-full items-center gap-3">
          <ProgressBar
            value={(badge.progress / badge.goal) * 100}
            label={t('badges.progressLabel')}
            showValue={false}
          />
          <span className="font-semibold">
            {badge.progress}/{badge.goal}
          </span>
        </div>
      )}
    </Card>
  )
}
