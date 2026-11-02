import { lazy } from 'react'
import { createBrowserRouter, Outlet } from 'react-router'
import { AppLayout } from '@/components/AppLayout'
import { CodeBackdrop } from '@/components/CodeBackdrop'
import { AuthOnly, GuestOnly } from '@/components/RouteGuards'
import { AchievementsPage } from '@/pages/AchievementsPage'
import { ChoicePage } from '@/pages/ChoicePage'
import { CoursePage } from '@/pages/CoursePage'
import { HomePage } from '@/pages/HomePage'
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { RankingPage } from '@/pages/RankingPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { ResetPasswordPage } from '@/pages/ResetPasswordPage'
import { RouteErrorPage } from '@/pages/RouteErrorPage'
import { StartPage } from '@/pages/StartPage'

// The code editor and Prism are only needed in lessons, so they download with this page.
// eslint-disable-next-line react-refresh/only-export-components -- the rule is about hot reload only
const LessonPage = lazy(() =>
  import('@/pages/LessonPage').then((module) => ({ default: module.LessonPage })),
)

/** The app's routes; exported so code outside React (the session-expiry handler) can navigate. */
export const router = createBrowserRouter([
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
          { path: '/forgot-password', Component: ForgotPasswordPage },
        ],
      },
      // Not guest-only: the emailed link must work even in a browser that is still logged in.
      { path: '/reset-password', Component: ResetPasswordPage },
      { path: '*', Component: NotFoundPage },
    ],
    // A page that throws while rendering shows the friendly crash screen, not a blank page.
    ErrorBoundary: RouteErrorPage,
  },
  {
    Component: AuthOnly,
    ErrorBoundary: RouteErrorPage,
    children: [
      {
        Component: AppLayout,
        children: [
          { path: '/home', Component: HomePage },
          { path: '/courses/:course_id', Component: CoursePage },
          { path: '/profile', Component: ProfilePage },
          { path: '/achievements', Component: AchievementsPage },
          { path: '/ranking', Component: RankingPage },
        ],
      },
      { path: '/choice', Component: ChoicePage },
      { path: '/courses/:course_id/lessons/:lesson_id', Component: LessonPage },
    ],
  },
])
