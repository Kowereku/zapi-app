import type { TFunction } from 'i18next'
import { ApiRequestError } from '@/services/api'

export function getErrorMessage(error: unknown, t: TFunction) {
  if (error instanceof ApiRequestError) return error.message
  if (error instanceof TypeError) return t('errors.network')
  return t('errors.unexpected')
}
