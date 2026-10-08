import { useTranslation } from 'react-i18next'
import { CourseCard } from '@/components/CourseCard'
import { Card } from '@/components/ui/Card'
import { Mascot } from '@/components/ui/Mascot'
import { Spinner } from '@/components/ui/Spinner'
import { useCourses } from '@/hooks/useCourses'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useProgress } from '@/hooks/useProgress'
import { getErrorMessage } from '@/utils/getErrorMessage'

export function HomePage() {
  const { t } = useTranslation()
  const { data: user } = useCurrentUser()
  const courses = useCourses()
  const progress = useProgress()
  const error = courses.error ?? progress.error
  const completedLessons = progress.data?.completed_lessons

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8">
      <div className="flex flex-col items-center gap-6 sm:flex-row">
        <div className="flex-1">
          <Card>
            {user && (
              <h1 className="text-xl font-semibold uppercase sm:text-2xl">
                {t('home.welcome', { username: user.username })}
              </h1>
            )}
            <p className="text-lg sm:text-2xl">{t('home.intro')}</p>
          </Card>
        </div>
        <Mascot variant="ducky" size="md" />
      </div>

      <h2 className="text-3xl font-bold text-on-page sm:text-4xl">{t('courses.available')}</h2>

      {error ? (
        <Card>
          <p role="alert" className="font-medium text-danger">
            {getErrorMessage(error, t)}
          </p>
        </Card>
      ) : courses.data && completedLessons ? (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.data.map((course) => {
            const completed = completedLessons.filter(
              (lesson) => lesson.course_id === course.id,
            ).length
            return (
              <li key={course.id}>
                <CourseCard
                  course={course}
                  progress={course.lessons_count ? (completed / course.lessons_count) * 100 : 0}
                />
              </li>
            )
          })}
        </ul>
      ) : (
        <Spinner size="lg" label={t('common.loading')} className="self-center" />
      )}
    </div>
  )
}
