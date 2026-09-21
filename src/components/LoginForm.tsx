import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/TextField'
import { useLogin } from '@/hooks/useLogin'
import { getErrorMessage } from '@/utils/getErrorMessage'

type LoginValues = {
  username_or_email: string
  password: string
}

type LoginFormProps = {
  onSuccess: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { t } = useTranslation()
  const { register, handleSubmit, formState } = useForm<LoginValues>()
  const { errors } = formState
  const login = useLogin()

  return (
    <form
      onSubmit={handleSubmit((values) => login.mutate(values, { onSuccess }))}
      noValidate
      className="flex flex-col gap-1"
    >
      <TextField
        label={t('auth.usernameOrEmail')}
        autoComplete="username"
        error={errors.username_or_email && t('auth.errors.required')}
        {...register('username_or_email', { required: true })}
      />
      <TextField
        label={t('auth.password')}
        type="password"
        autoComplete="current-password"
        error={errors.password && t('auth.errors.required')}
        {...register('password', { required: true })}
      />

      <div className="relative mt-4 flex flex-col items-center gap-6">
        {login.isError && (
          <p
            role="alert"
            className="absolute bottom-full mb-1 w-full text-center text-sm/5 font-medium text-danger"
          >
            {getErrorMessage(login.error, t)}
          </p>
        )}
        <Button type="submit" size="lg" fullWidth loading={login.isPending}>
          <span className="uppercase">{t('auth.logInButton')}</span>
        </Button>
        <button type="button" disabled className="font-semibold text-ink/60">
          {t('auth.forgotPassword')}
        </button>
      </div>
    </form>
  )
}
