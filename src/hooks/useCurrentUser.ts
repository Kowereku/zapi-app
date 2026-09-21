import { useQuery } from '@tanstack/react-query'
import { getCurrentUser } from '@/services/api'

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    retry: false,
  })
}
