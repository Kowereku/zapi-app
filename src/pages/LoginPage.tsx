import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { AuthScreen } from '@/components/AuthScreen'
import { LoginForm } from '@/components/LoginForm'

export function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <AuthScreen title={t('auth.logInTitle')} mascot="duckLogin" onClose={() => navigate('/')}>
      <LoginForm onSuccess={() => navigate('/home')} />
    </AuthScreen>
  )
}
