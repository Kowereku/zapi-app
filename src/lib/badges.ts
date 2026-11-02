import type { TFunction } from 'i18next'
import { Flame, GraduationCap, Keyboard, Star, Target, Trophy, type LucideIcon } from 'lucide-react'
import type { Badge, BadgeFamily } from '@/services/api'

/** Icon shown in the medal of every badge in a family. */
export const familyIcon: Record<BadgeFamily, LucideIcon> = {
  courses: GraduationCap,
  streak: Flame,
  flawless_lesson: Target,
  perfect_quiz: Trophy,
  own_code: Keyboard,
  level: Star,
}

/** Families with a single badge, whose name alone identifies it. */
const singleBadgeFamilies: BadgeFamily[] = ['flawless_lesson', 'perfect_quiz']

/** "Streak · 3 days", or just "Flawless lesson" when the family has one badge. */
export const badgeTitle = (badge: Badge, t: TFunction) => {
  const family = t(`badges.families.${badge.family}.name`)
  return singleBadgeFamilies.includes(badge.family)
    ? family
    : `${family} · ${t(`badges.items.${badge.code}.title`)}`
}

export const formatBadgeDate = (iso: string, language: string) =>
  new Intl.DateTimeFormat(language, { day: 'numeric', month: 'short', year: 'numeric' }).format(
    new Date(iso),
  )
