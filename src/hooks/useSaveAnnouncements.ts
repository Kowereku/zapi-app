import { useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useBadges } from '@/hooks/useBadges'
import { levelUpFrom, type LevelUp } from '@/lib/levelUp'
import { getBadges, type Badge, type LessonCompleteResponse, type User } from '@/services/api'

const earnedCodes = (badges: Badge[]) =>
  new Set(badges.filter((badge) => badge.awarded_at).map((badge) => badge.code))

/**
 * Works out what to announce after a lesson or quiz is saved: new badges and a level-up.
 *
 * Normally that comes straight from the save response. When a save had to be retried (its first
 * response may have been lost after the server already saved it), the badges earned and the level
 * reached since the run started are announced too.
 */
export function useSaveAnnouncements() {
  const queryClient = useQueryClient()
  // Loads the earned badges while the run is in progress, so the snapshot costs no extra request.
  useBadges()
  const earnedBefore = useRef<Set<string> | null>(null)
  const levelBefore = useRef<number | null>(null)
  const attempts = useRef(0)

  /** Call right before every save attempt. */
  const beforeSave = () => {
    attempts.current += 1
    const cached = queryClient.getQueryData<Badge[]>(['badges'])
    if (!earnedBefore.current && cached) earnedBefore.current = earnedCodes(cached)
    levelBefore.current ??= queryClient.getQueryData<User>(['currentUser'])?.level ?? null
  }

  /** Call with a successful save's new_badges; returns every badge to announce. */
  const toAnnounce = async (fromResponse: Badge[]): Promise<Badge[]> => {
    const before = earnedBefore.current
    if (attempts.current <= 1 || !before) return fromResponse
    try {
      const after = await queryClient.fetchQuery({
        queryKey: ['badges'],
        queryFn: getBadges,
        staleTime: 0,
      })
      const missed = after.filter((badge) => badge.awarded_at && !before.has(badge.code))
      // A badge can be both in the response and among the missed ones; announce it once.
      return [...new Map([...fromResponse, ...missed].map((badge) => [badge.code, badge])).values()]
    } catch {
      return fromResponse
    }
  }

  /** Call with a successful save; returns the level-up to celebrate, if any. */
  const toLevelUp = (result: LessonCompleteResponse): LevelUp | null =>
    levelUpFrom(result, attempts.current > 1 ? levelBefore.current : null)

  return { beforeSave, toAnnounce, toLevelUp }
}
