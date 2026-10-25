import { createBrowserRouter, Navigate, Outlet } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { AppLayout } from '@/components/AppLayout'
import { CodeBackdrop } from '@/components/CodeBackdrop'
import { queryClient } from '@/lib/queryClient'
import { session } from '@/lib/session'
import { ChoicePage } from '@/pages/ChoicePage'
import { CoursePage } from '@/pages/CoursePage'
import { HomePage } from '@/pages/HomePage'
import { LessonPage } from '@/pages/LessonPage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ProfilePage } from '@/pages/ProfilePage'
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
        children: [
          { path: '/home', Component: HomePage },
          { path: '/courses/:course_id', Component: CoursePage },
          { path: '/profile', Component: ProfilePage },
        ],
      },
      { path: '/choice', Component: ChoicePage },
      { path: '/courses/:course_id/lessons/:lesson_id', Component: LessonPage },
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
