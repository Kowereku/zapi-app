import { useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useBadges } from '@/hooks/useBadges'
import { getBadges, type Badge } from '@/services/api'

const earnedCodes = (badges: Badge[]) =>
  new Set(badges.filter((badge) => badge.awarded_at).map((badge) => badge.code))

/**
 * Works out which badges to announce after a lesson or quiz is saved.
 *
 * Normally that is the save response's new_badges. When a save had to be retried (its first
 * response may have been lost after the server already awarded the badges), the badges earned
 * since the run started are announced too.
 */
export function useBadgeAnnouncements() {
  const queryClient = useQueryClient()
  // Loads the earned badges while the run is in progress, so the snapshot costs no extra request.
  useBadges()
  const earnedBefore = useRef<Set<string> | null>(null)
  const attempts = useRef(0)

  /** Call right before every save attempt. */
  const beforeSave = () => {
    attempts.current += 1
    const cached = queryClient.getQueryData<Badge[]>(['badges'])
    if (!earnedBefore.current && cached) earnedBefore.current = earnedCodes(cached)
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
      const missed = after.filter(
        (badge) =>
          badge.awarded_at &&
          !before.has(badge.code) &&
          !fromResponse.some((announced) => announced.code === badge.code),
      )
      return [...fromResponse, ...missed]
    } catch {
      return fromResponse
    }
  }

  return { beforeSave, toAnnounce }
}
