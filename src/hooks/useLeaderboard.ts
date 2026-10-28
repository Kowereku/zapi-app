import { useQuery } from '@tanstack/react-query'
import { getLeaderboard } from '@/services/api'

export function useLeaderboard() {
  return useQuery({ queryKey: ['leaderboard'], queryFn: getLeaderboard })
}
