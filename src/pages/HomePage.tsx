import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { CourseCard } from '@/components/CourseCard'
import { ErrorState } from '@/components/ErrorState'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { Card } from '@/components/ui/Card'
import { Mascot } from '@/components/ui/Mascot'
import { Spinner } from '@/components/ui/Spinner'
import { useCourses } from '@/hooks/useCourses'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useProgress } from '@/hooks/useProgress'
import { useRetryFailedQueries } from '@/hooks/useRetryFailedQueries'
import { trackIcon } from '@/lib/tracks'
import type { CompletedLesson, CourseListItem } from '@/services/api'

type CourseListProps = {
  courses: CourseListItem[]
  completedLessons: CompletedLesson[]
}

function CourseList({ courses, completedLessons }: CourseListProps) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => {
        const completed = completedLessons.filter((lesson) => lesson.course_id === course.id).length
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
  )
}

export function HomePage() {
  const { t } = useTranslation()
  const { data: user } = useCurrentUser()
  const courses = useCourses()
  const progress = useProgress()
  const error = courses.error ?? progress.error
  const retryFailed = useRetryFailedQueries()
  const completedLessons = progress.data?.completed_lessons

  const track = user?.track
  const recommended = courses.data?.filter((course) => track && course.track === track) ?? []
  const others = courses.data?.filter((course) => !recommended.includes(course)) ?? []
  const headingClass = 'text-3xl font-bold text-on-page sm:text-4xl'

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

      {error ? (
        <ErrorState error={error} onRetry={retryFailed} />
      ) : courses.data && completedLessons ? (
        <>
          {track && (
            <section className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className={headingClass}>
                  {t('courses.recommended', {
                    track: `${trackIcon(track)} ${t(`choice.tracks.${track}.name`)}`,
                  })}
                </h2>
                <Link to="/choice" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                  {t('courses.changeTrack')}
                </Link>
              </div>
              {recommended.length > 0 ? (
                <CourseList courses={recommended} completedLessons={completedLessons} />
              ) : (
                <Card>
                  <p className="text-lg">{t('courses.noRecommended')}</p>
                </Card>
              )}
            </section>
          )}

          {others.length > 0 && (
            <section className="flex flex-col gap-6">
              <h2 className={headingClass}>
                {track ? t('courses.other') : t('courses.available')}
              </h2>
              <CourseList courses={others} completedLessons={completedLessons} />
            </section>
          )}
        </>
      ) : (
        <Spinner size="lg" label={t('common.loading')} className="self-center" />
      )}
    </div>
  )
}
