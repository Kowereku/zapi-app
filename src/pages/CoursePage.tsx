import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ErrorState } from '@/components/ErrorState'
import { LessonTile } from '@/components/LessonTile'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Spinner } from '@/components/ui/Spinner'
import { useCourse } from '@/hooks/useCourse'
import { useProgress } from '@/hooks/useProgress'
import { useRetryFailedQueries } from '@/hooks/useRetryFailedQueries'

export function CoursePage() {
  const { t } = useTranslation()
  const course_id = Number(useParams().course_id)
  const course = useCourse(course_id)
  const progress = useProgress()
  const error = course.error ?? progress.error
  const retryFailed = useRetryFailedQueries()

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <ErrorState error={error} onRetry={retryFailed} />
      </div>
    )
  }

  if (!course.data || !progress.data) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" label={t('common.loading')} />
      </div>
    )
  }

  const completedIds = new Set(progress.data.completed_lessons.map((lesson) => lesson.lesson_id))
  const lessons = course.data.modules.flatMap((module) => module.lessons)
  const current = lessons.find((lesson) => !completedIds.has(lesson.id))
  const completed = lessons.filter((lesson) => completedIds.has(lesson.id)).length

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-8">
      <Card className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold sm:text-3xl">{course.data.name}</h1>
        {course.data.description && <p className="text-lg">{course.data.description}</p>}
        <ProgressBar
          value={lessons.length ? (completed / lessons.length) * 100 : 0}
          label={t('courses.progressLabel')}
        />
      </Card>

      {course.data.modules.map((module) => (
        <section key={module.id} className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-on-page">
            {t('courses.module', { number: module.order_index, title: module.title })}
          </h2>
          <ol className="flex flex-col gap-3">
            {module.lessons.map((lesson) => (
              <li key={lesson.id}>
                <LessonTile
                  lesson={lesson}
                  status={
                    completedIds.has(lesson.id)
                      ? 'done'
                      : lesson.id === current?.id
                        ? 'current'
                        : 'locked'
                  }
                  to={`/courses/${course_id}/lessons/${lesson.id}`}
                />
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  )
}
