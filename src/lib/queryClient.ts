import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { expireSession } from '@/lib/sessionExpiry'
import { ApiRequestError } from '@/services/api'
import { isUnavailable } from '@/utils/errorKind'

/** Every request that finds the session expired ends up here, wherever it was made. */
const handleError = (error: Error) => {
  if (error instanceof ApiRequestError && error.sessionExpired) expireSession(queryClient)
}

export const queryClient: QueryClient = new QueryClient({
  queryCache: new QueryCache({ onError: handleError }),
  mutationCache: new MutationCache({ onError: handleError }),
  defaultOptions: {
    queries: {
      // One quiet retry when the server is unreachable, slow or failing; a 4xx won't change.
      retry: (failureCount, error) => failureCount < 1 && isUnavailable(error),
    },
    mutations: {
      // Saves are never repeated behind the user's back; the user retries them.
      retry: false,
    },
  },
})
