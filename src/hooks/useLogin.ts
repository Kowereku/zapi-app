import { useMutation } from '@tanstack/react-query'
import { login } from '@/services/api'
import { session } from '@/lib/session'

export function useLogin() {
  return useMutation({
    mutationFn: login,
    onSuccess: (token) => session.setToken(token.access_token),
  })
}
