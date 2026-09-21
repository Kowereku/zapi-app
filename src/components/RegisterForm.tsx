import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/TextField'
import { useRegister } from '@/hooks/useRegister'
import { getErrorMessage } from '@/utils/getErrorMessage'

type RegisterValues = {
  username: string
  email: string
  password: string
  confirmPassword: string
}

type RegisterFormProps = {
  onSuccess: () => void
}

// Limits mirror the backend's UserCreate schema.
export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { t } = useTranslation()
  const { register, handleSubmit, formState } = useForm<RegisterValues>()
  const { errors } = formState
  const registerUser = useRegister()

  return (
    <form
      onSubmit={handleSubmit(({ username, email, password }) =>
        registerUser.mutate({ username, email, password }, { onSuccess }),
      )}
      noValidate
      className="flex flex-col gap-1"
    >
      <TextField
        label={t('auth.username')}
        autoComplete="username"
        error={errors.username && t('auth.errors.usernameLength')}
        {...register('username', { required: true, minLength: 3, maxLength: 50 })}
      />
      <TextField
        label={t('auth.email')}
        type="email"
        autoComplete="email"
        error={errors.email && t('auth.errors.emailInvalid')}
        {...register('email', { required: true, pattern: /^\S+@\S+\.\S+$/ })}
      />
      <TextField
        label={t('auth.password')}
        type="password"
        autoComplete="new-password"
        error={errors.password && t('auth.errors.passwordLength')}
        {...register('password', { required: true, minLength: 6, maxLength: 32 })}
      />
      <TextField
        label={t('auth.confirmPassword')}
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword && t('auth.errors.passwordMismatch')}
        {...register('confirmPassword', {
          validate: (value, values) => value === values.password,
        })}
      />

      <div className="relative mt-4">
        {registerUser.isError && (
          <p
            role="alert"
            className="absolute bottom-full mb-1 w-full text-center text-sm/5 font-medium text-danger"
          >
            {getErrorMessage(registerUser.error, t)}
          </p>
        )}
        <Button type="submit" size="lg" fullWidth loading={registerUser.isPending}>
          <span className="uppercase">{t('auth.signUpButton')}</span>
        </Button>
      </div>
    </form>
  )
}
