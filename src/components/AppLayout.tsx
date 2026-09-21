import { Link, Navigate, Outlet, useNavigate } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Mascot } from '@/components/ui/Mascot'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { session } from '@/lib/session'
import { ApiRequestError } from '@/services/api'

export function AppLayout() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: user, error } = useCurrentUser()

  if (error instanceof ApiRequestError && error.status === 401) {
    return <Navigate to="/login" replace />
  }

  const logOut = () => {
    session.clear()
    queryClient.clear()
    navigate('/')
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex h-16 items-center justify-between gap-4 bg-chrome px-4 text-ink sm:px-6">
        <Link to="/home" className="flex items-center gap-3">
          <Mascot variant="rubberDuck" size="icon" />
          <span className="text-2xl font-extrabold text-brand uppercase sm:text-4xl">Polycode</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium sm:gap-6 sm:text-base">
          {user && (
            <>
              <span>⚡ {t('nav.xp', { count: user.total_xp })}</span>
              <span>🔥 {t('nav.streak', { count: user.streak_days })}</span>
              <span className="hidden sm:inline">👤 {user.username}</span>
            </>
          )}
          <button type="button" onClick={logOut} className="hover:underline">
            {t('nav.logOut')} &gt;
          </button>
        </nav>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
