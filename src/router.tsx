import { createBrowserRouter, Outlet } from 'react-router'
import { AppLayout } from '@/components/AppLayout'
import { CodeBackdrop } from '@/components/CodeBackdrop'
import { AuthOnly, GuestOnly } from '@/components/RouteGuards'
import { AchievementsPage } from '@/pages/AchievementsPage'
import { ChoicePage } from '@/pages/ChoicePage'
import { CoursePage } from '@/pages/CoursePage'
import { HomePage } from '@/pages/HomePage'
import { LessonPage } from '@/pages/LessonPage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { RankingPage } from '@/pages/RankingPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { RouteErrorPage } from '@/pages/RouteErrorPage'
import { StartPage } from '@/pages/StartPage'

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
        ],
      },
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
