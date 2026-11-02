import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/TextField'
import { useResetPassword } from '@/hooks/useResetPassword'
import { getErrorMessage } from '@/utils/getErrorMessage'

type ResetPasswordValues = {
  password: string
  confirmPassword: string
}

type ResetPasswordFormProps = {
  token: string
  onSuccess: () => void
}

// Limits mirror the backend's ResetPasswordData schema, the same as at sign-up.
export function ResetPasswordForm({ token, onSuccess }: ResetPasswordFormProps) {
  const { t } = useTranslation()
  const { register, handleSubmit, formState } = useForm<ResetPasswordValues>()
  const { errors } = formState
  const resetPassword = useResetPassword()

  return (
    <form
      onSubmit={handleSubmit(({ password }) =>
        resetPassword.mutate({ token, password }, { onSuccess }),
      )}
      noValidate
      className="flex flex-col gap-1"
    >
      <TextField
        label={t('auth.newPassword')}
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
        {resetPassword.isError && (
          <p
            role="alert"
            className="absolute bottom-full mb-1 w-full text-center text-sm/5 font-medium text-danger"
          >
            {getErrorMessage(resetPassword.error, t)}
          </p>
        )}
        <Button type="submit" size="lg" fullWidth loading={resetPassword.isPending}>
          <span className="uppercase">{t('auth.saveNewPassword')}</span>
        </Button>
      </div>
    </form>
  )
}
