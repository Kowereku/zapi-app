import { useTranslation } from 'react-i18next'
import { AuthScreen } from '@/components/AuthScreen'
import { LoginForm } from '@/components/LoginForm'

// TODO(INZ-21): replace window.location with router navigation.
const goToStart = () => window.location.assign('/')

export function LoginPage() {
  const { t } = useTranslation()

  return (
    <AuthScreen title={t('auth.logInTitle')} mascot="duckLogin" onClose={goToStart}>
      <LoginForm onSuccess={goToStart} />
    </AuthScreen>
  )
}
