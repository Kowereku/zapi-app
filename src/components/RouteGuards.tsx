import { Navigate, Outlet } from 'react-router'
import { session } from '@/lib/session'

/** Pages for logged-out visitors; a logged-in user goes straight to the Main Page. */
export function GuestOnly() {
  return session.getToken() ? <Navigate to="/home" replace /> : <Outlet />
}

/** Pages that need a login; without one the user goes to the login page. */
export function AuthOnly() {
  return session.getToken() ? <Outlet /> : <Navigate to="/login" replace />
}
