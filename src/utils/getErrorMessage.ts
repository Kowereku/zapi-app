import type { TFunction } from 'i18next'
import { errorKind } from '@/utils/errorKind'

export function getErrorMessage(error: unknown, t: TFunction) {
  switch (errorKind(error)) {
    case 'timeout':
      return t('errors.timeout')
    case 'network':
      return t('errors.network')
    case 'server':
      return t('errors.server')
    case 'client':
      // 4xx messages come from the backend and explain what to fix (e.g. a wrong password).
      return (error as Error).message
    default:
      return t('errors.unexpected')
  }
}
