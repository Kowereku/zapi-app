import { useQuery } from '@tanstack/react-query'
import { getProgress } from '@/services/api'

export function useProgress() {
  return useQuery({ queryKey: ['progress'], queryFn: getProgress })
}
