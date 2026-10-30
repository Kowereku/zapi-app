import { useNavigate, useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { AuthScreen } from '@/components/AuthScreen'
import { LoginForm } from '@/components/LoginForm'

export function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  // Set by the session-expiry handler when a logged-in request found the token no longer valid.
  const [searchParams] = useSearchParams()
  const expired = searchParams.has('expired')

  return (
    <AuthScreen
      title={t('auth.logInTitle')}
      mascot="duckLogin"
      onClose={() => navigate('/')}
      notice={expired ? t('auth.sessionExpired') : undefined}
    >
      <LoginForm onSuccess={() => navigate('/home')} />
    </AuthScreen>
  )
}
