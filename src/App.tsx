import { createBrowserRouter, Navigate, Outlet } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { AppLayout } from '@/components/AppLayout'
import { CodeBackdrop } from '@/components/CodeBackdrop'
import { queryClient } from '@/lib/queryClient'
import { session } from '@/lib/session'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { StartPage } from '@/pages/StartPage'

function GuestOnly() {
  return session.getToken() ? <Navigate to="/home" replace /> : <Outlet />
}

function AuthOnly() {
  return session.getToken() ? <Outlet /> : <Navigate to="/login" replace />
}

const router = createBrowserRouter([
  {
    element: (
      <>
        <CodeBackdrop />
        <Outlet />
      </>
    ),
    children: [
      {
        Component: GuestOnly,
        children: [
          { path: '/', Component: StartPage },
          { path: '/login', Component: LoginPage },
          { path: '/register', Component: RegisterPage },
        ],
      },
      { path: '*', Component: NotFoundPage },
    ],
  },
  {
    Component: AuthOnly,
    children: [
      {
        Component: AppLayout,
        children: [{ path: '/home', Component: HomePage }],
      },
    ],
  },
])

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App
