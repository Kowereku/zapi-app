import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { DuckyBubble } from '@/components/DuckyBubble'
import { LessonRun } from '@/components/LessonRun'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { Spinner } from '@/components/ui/Spinner'
import { useCourse } from '@/hooks/useCourse'
import { useLesson } from '@/hooks/useLesson'
import { useProgress } from '@/hooks/useProgress'
import { ApiRequestError } from '@/services/api'
import { getErrorMessage } from '@/utils/getErrorMessage'

export function LessonPage() {
  const { t } = useTranslation()
  const params = useParams()
  const course_id = Number(params.course_id)
  const lesson_id = Number(params.lesson_id)
  const [attempt, setAttempt] = useState(0)
  const lesson = useLesson(lesson_id)
  const course = useCourse(course_id)
  const progress = useProgress()
  const coursePath = `/courses/${course_id}`
  const error = lesson.error ?? course.error ?? progress.error

  if (error instanceof ApiRequestError && error.status === 401) {
    return <Navigate to="/login" replace />
  }

  // A failed background refetch must not replace a lesson that is already on screen.
  if (error && !(lesson.data && course.data && progress.data)) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-10 px-4">
        <DuckyBubble>{getErrorMessage(error, t)}</DuckyBubble>
        <Link to={coursePath} className={buttonVariants({ size: 'lg' })}>
          {t('lesson.backToCourse')}
        </Link>
      </main>
    )
  }

  if (!lesson.data || !course.data || !progress.data) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <Spinner size="lg" label={t('common.loading')} />
      </main>
    )
  }

  const lessons = course.data.modules.flatMap((module) => module.lessons)
  const position = lessons.findIndex((item) => item.id === lesson_id)
  const next = position === -1 ? undefined : lessons[position + 1]

  return (
    <LessonRun
      // A new lesson or a retry starts a fresh run (question 1, full hearts).
      key={`${lesson_id}-${attempt}`}
      lesson={lesson.data}
      alreadyCompleted={progress.data.completed_lessons.some(
        (item) => item.lesson_id === lesson_id,
      )}
      coursePath={coursePath}
      nextPath={next ? `${coursePath}/lessons/${next.id}` : null}
      onRetry={() => setAttempt(attempt + 1)}
    />
  )
}
