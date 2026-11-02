import type { TFunction } from 'i18next'
import { ApiRequestError } from '@/services/api'
import { errorKind } from '@/utils/errorKind'

// The backend answers in English; the messages a user can run into are translated here.
const apiMessages: Record<string, string> = {
  'Wrong email/username or password': 'errors.api.wrongCredentials',
  'Username is already taken.': 'errors.api.usernameTaken',
  'Email is already registered.': 'errors.api.emailTaken',
  'This reset link is invalid or has expired.': 'errors.api.resetLinkInvalid',
}

export function getErrorMessage(error: unknown, t: TFunction) {
  switch (errorKind(error)) {
    case 'timeout':
      return t('errors.timeout')
    case 'network':
      return t('errors.network')
    case 'server':
      return t('errors.server')
    case 'client': {
      const key = apiMessages[(error as Error).message]
      if (key) return t(key)
      return (error as ApiRequestError).status === 404 ? t('errors.notFound') : t('errors.invalid')
    }
    default:
      return t('errors.unexpected')
  }
}
