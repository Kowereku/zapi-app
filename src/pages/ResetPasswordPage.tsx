import { Link, useNavigate, useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { AuthScreen } from '@/components/AuthScreen'
import { ResetPasswordForm } from '@/components/ResetPasswordForm'

export function ResetPasswordPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  return (
    <AuthScreen
      title={t('auth.newPasswordTitle')}
      mascot="duckLogin"
      onClose={() => navigate('/login')}
      notice={token ? undefined : t('auth.resetLinkMissing')}
    >
      {token && (
        <ResetPasswordForm
          token={token}
          onSuccess={() => navigate('/login?reset', { replace: true })}
        />
      )}
      {!token && (
        <Link
          to="/forgot-password"
          className="mt-6 block text-center font-semibold hover:underline"
        >
          {t('auth.requestNewLink')}
        </Link>
      )}
    </AuthScreen>
  )
}
