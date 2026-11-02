import { useMutation } from '@tanstack/react-query'
import { forgotPassword } from '@/services/api'

export function useForgotPassword() {
  return useMutation({ mutationFn: forgotPassword })
}
