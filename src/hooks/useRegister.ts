import { useMutation, useQueryClient } from '@tanstack/react-query'
import { login, register } from '@/services/api'
import { session } from '@/lib/session'

type RegisterInput = { username: string; email: string; password: string }

/** The account was created but the log in failed, so retrying the form would not work. */
export class AccountCreatedError extends Error {}

async function registerAndLogin(input: RegisterInput) {
  await register(input)
  try {
    return await login({ username_or_email: input.username, password: input.password })
  } catch {
    throw new AccountCreatedError()
  }
}

export function useRegister() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: registerAndLogin,
    onSuccess: (token) => {
      session.setToken(token.access_token)
      queryClient.clear()
    },
  })
}
