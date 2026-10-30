import { useQueryClient, type Query } from '@tanstack/react-query'

export const isFailed = (query: Query) => query.state.status === 'error'

/** Refetches every failed query on screen, so one "Try again" recovers a page with several. */
export function useRetryFailedQueries() {
  const queryClient = useQueryClient()
  return () => queryClient.refetchQueries({ type: 'active', predicate: isFailed })
}
