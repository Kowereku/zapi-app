import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ErrorState } from '@/components/ErrorState'
import { LessonRun } from '@/components/LessonRun'
import { QuizRun } from '@/components/QuizRun'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { Spinner } from '@/components/ui/Spinner'
import { useCourse } from '@/hooks/useCourse'
import { useLesson } from '@/hooks/useLesson'
import { useProgress } from '@/hooks/useProgress'
import { useRetryFailedQueries } from '@/hooks/useRetryFailedQueries'
import { useWarmUpAi } from '@/hooks/useWarmUpAi'

export function LessonPage() {
  const { t } = useTranslation()
  const params = useParams()
  const course_id = Number(params.course_id)
  const lesson_id = Number(params.lesson_id)
  const [attempt, setAttempt] = useState(0)
  const lesson = useLesson(lesson_id)
  const course = useCourse(course_id)
  const progress = useProgress()
  useWarmUpAi()
  const coursePath = `/courses/${course_id}`
  const error = lesson.error ?? course.error ?? progress.error
  const retryFailed = useRetryFailedQueries()

  // A failed background refetch must not replace a lesson that is already on screen.
  if (error && !(lesson.data && course.data && progress.data)) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4">
        <ErrorState error={error} onRetry={retryFailed} />
        {/* Lessons have no header, so this is the way out while the server is unreachable. */}
        <Link to={coursePath} className={buttonVariants({ variant: 'outline', size: 'lg' })}>
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
  const alreadyCompleted = progress.data.completed_lessons.some(
    (item) => item.lesson_id === lesson_id,
  )

  if (lesson.data.is_quiz) {
    return (
      <QuizRun
        key={`${lesson_id}-${attempt}`}
        lesson={lesson.data}
        alreadyCompleted={alreadyCompleted}
        coursePath={coursePath}
        onRetry={() => setAttempt(attempt + 1)}
      />
    )
  }

  return (
    <LessonRun
      // A new lesson or a retry starts a fresh run (question 1, full hearts).
      key={`${lesson_id}-${attempt}`}
      lesson={lesson.data}
      courseId={course_id}
      language={course.data.language}
      alreadyCompleted={alreadyCompleted}
      coursePath={coursePath}
      nextPath={next ? `${coursePath}/lessons/${next.id}` : null}
      onRetry={() => setAttempt(attempt + 1)}
    />
  )
}
