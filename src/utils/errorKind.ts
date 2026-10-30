import { ApiRequestError } from '@/services/api'

/** What kind of failure an error is; messages, retries and fallbacks all start from this. */
export type ErrorKind = 'timeout' | 'network' | 'server' | 'client' | 'unknown'

export function errorKind(error: unknown): ErrorKind {
  // AbortSignal.timeout makes fetch reject with a DOMException named TimeoutError; some engines
  // report it as AbortError instead. No caller aborts requests itself, so both mean a timeout.
  if (error instanceof DOMException && ['TimeoutError', 'AbortError'].includes(error.name)) {
    return 'timeout'
  }
  // fetch rejects with a TypeError when the server can't be reached at all.
  if (error instanceof TypeError) return 'network'
  if (error instanceof ApiRequestError) return error.status >= 500 ? 'server' : 'client'
  return 'unknown'
}

/** True when the server is unreachable, too slow or failing: worth retrying or falling back. */
export const isUnavailable = (error: unknown) =>
  ['timeout', 'network', 'server'].includes(errorKind(error))
