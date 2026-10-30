import type { QueryClient } from '@tanstack/react-query'
import { session } from '@/lib/session'
import { router } from '@/router'

/**
 * Ends an expired session: forget the token and all cached data, then go to the login page,
 * which explains what happened. Several requests usually fail at once; once the user is on the
 * login page the later ones are ignored.
 */
export function expireSession(queryClient: QueryClient) {
  if (router.state.location.pathname === '/login') return
  session.clear()
  queryClient.clear()
  router.navigate('/login?expired=1', { replace: true })
}
