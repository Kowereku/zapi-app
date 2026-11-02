import { useNavigate, useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { AuthScreen } from '@/components/AuthScreen'
import { LoginForm } from '@/components/LoginForm'

export function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  // `expired` is set by the session-expiry handler, `reset` after a new password was saved.
  const [searchParams] = useSearchParams()
  const notice = searchParams.has('expired')
    ? t('auth.sessionExpired')
    : searchParams.has('reset')
      ? t('auth.passwordChanged')
      : undefined

  return (
    <AuthScreen
      title={t('auth.logInTitle')}
      mascot="duckLogin"
      onClose={() => navigate('/')}
      notice={notice}
    >
      <LoginForm onSuccess={() => navigate('/home')} />
    </AuthScreen>
  )
}
