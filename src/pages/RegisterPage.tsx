import { useTranslation } from 'react-i18next'
import { AuthScreen } from '@/components/AuthScreen'
import { RegisterForm } from '@/components/RegisterForm'

// TODO(INZ-21): replace window.location with router navigation.
const goToStart = () => window.location.assign('/')

export function RegisterPage() {
  const { t } = useTranslation()

  return (
    <AuthScreen title={t('auth.signUpTitle')} mascot="duckRegister" onClose={goToStart}>
      <RegisterForm onSuccess={goToStart} />
    </AuthScreen>
  )
}
