import { useMutation } from '@tanstack/react-query'
import { login, register } from '@/services/api'
import { session } from '@/lib/session'

type RegisterInput = { username: string; email: string; password: string }

async function registerAndLogin(input: RegisterInput) {
  await register(input)
  return login({ username_or_email: input.username, password: input.password })
}

export function useRegister() {
  return useMutation({
    mutationFn: registerAndLogin,
    onSuccess: (token) => session.setToken(token.access_token),
  })
}
