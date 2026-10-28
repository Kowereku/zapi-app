import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { BadgeMedal } from '@/components/BadgeMedal'
import type { Badge } from '@/services/api'

type NewBadgeCardProps = {
  badge: Badge
}

/** Announces a badge earned by the lesson or quiz that was just completed. */
export function NewBadgeCard({ badge }: NewBadgeCardProps) {
  const { t } = useTranslation()

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-3 rounded-card border-4 border-primary bg-surface px-8 py-7 text-center text-ink shadow-[0_0_40px_rgba(255,204,0,0.45)]">
      <p className="text-sm font-semibold tracking-widest text-brand uppercase">
        {t('badges.newBadge')}
      </p>
      <BadgeMedal family={badge.family} earned size="lg" />
      <p className="text-3xl font-bold">{t(`badges.families.${badge.family}.name`)}</p>
      <p className="text-lg text-ink/70">{t(`badges.items.${badge.code}.description`)}</p>
      <Link to="/achievements" className="font-semibold text-brand underline">
        {t('badges.seeAll')}
      </Link>
    </div>
  )
}
