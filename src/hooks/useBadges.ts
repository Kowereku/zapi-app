import { useQuery } from '@tanstack/react-query'
import { getBadges } from '@/services/api'

export function useBadges() {
  return useQuery({ queryKey: ['badges'], queryFn: getBadges })
}
