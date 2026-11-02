import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/TextField'
import { useForgotPassword } from '@/hooks/useForgotPassword'
import { getErrorMessage } from '@/utils/getErrorMessage'

type ForgotPasswordValues = {
  email: string
}

export function ForgotPasswordForm() {
  const { t } = useTranslation()
  const { register, handleSubmit, formState } = useForm<ForgotPasswordValues>()
  const { errors } = formState
  const forgotPassword = useForgotPassword()

  if (forgotPassword.isSuccess) {
    return (
      <p role="status" className="rounded-card bg-primary/25 px-4 py-3 text-center font-medium">
        {t('auth.resetLinkSent')}
      </p>
    )
  }

  return (
    <form
      onSubmit={handleSubmit((values) => forgotPassword.mutate(values))}
      noValidate
      className="flex flex-col gap-1"
    >
      <p className="mb-4 text-center text-lg">{t('auth.forgotIntro')}</p>
      <TextField
        label={t('auth.email')}
        type="email"
        autoComplete="email"
        error={errors.email && t('auth.errors.emailInvalid')}
        {...register('email', { required: true, pattern: /^\S+@\S+\.\S+$/ })}
      />

      <div className="relative mt-4">
        {forgotPassword.isError && (
          <p
            role="alert"
            className="absolute bottom-full mb-1 w-full text-center text-sm/5 font-medium text-danger"
          >
            {getErrorMessage(forgotPassword.error, t)}
          </p>
        )}
        <Button type="submit" size="lg" fullWidth loading={forgotPassword.isPending}>
          <span className="uppercase">{t('auth.sendResetLink')}</span>
        </Button>
      </div>
    </form>
  )
}
