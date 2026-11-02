import { Suspense } from 'react'
import { Navigate, Outlet } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Spinner } from '@/components/ui/Spinner'
import { session } from '@/lib/session'

/** Pages for logged-out visitors; a logged-in user goes straight to the Main Page. */
export function GuestOnly() {
  return session.getToken() ? <Navigate to="/home" replace /> : <Outlet />
}

/** Pages that need a login; without one the user goes to the login page. */
export function AuthOnly() {
  const { t } = useTranslation()
  if (!session.getToken()) return <Navigate to="/login" replace />

  // Shown while a page loaded on demand (the lesson page, see router.tsx) is downloading.
  const loading = (
    <main className="flex min-h-dvh items-center justify-center">
      <Spinner size="lg" label={t('common.loading')} />
    </main>
  )
  return (
    <Suspense fallback={loading}>
      <Outlet />
    </Suspense>
  )
}
