import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { AuthScreen } from '@/components/AuthScreen'
import { RegisterForm } from '@/components/RegisterForm'

export function RegisterPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <AuthScreen title={t('auth.signUpTitle')} mascot="duckRegister" onClose={() => navigate('/')}>
      <RegisterForm onSuccess={() => navigate('/home')} />
    </AuthScreen>
  )
}
