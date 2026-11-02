import { Link, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { AuthScreen } from '@/components/AuthScreen'
import { ForgotPasswordForm } from '@/components/ForgotPasswordForm'

export function ForgotPasswordPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <AuthScreen title={t('auth.forgotTitle')} mascot="duckLogin" onClose={() => navigate('/login')}>
      <ForgotPasswordForm />
      <Link to="/login" className="mt-6 block text-center font-semibold hover:underline">
        {t('auth.backToLogin')}
      </Link>
    </AuthScreen>
  )
}
