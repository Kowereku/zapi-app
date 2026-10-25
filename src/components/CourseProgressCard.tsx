import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import type { ProfileCourse } from '@/services/api'

type CourseProgressCardProps = {
  item: ProfileCourse
}

export function CourseProgressCard({ item }: CourseProgressCardProps) {
  const { t } = useTranslation()
  const { course, completed_lessons, next_lesson } = item
  const percent = course.lessons_count ? (completed_lessons / course.lessons_count) * 100 : 0

  return (
    <Card className="flex h-full flex-col gap-4">
      <h3 className="flex items-center gap-3 text-2xl font-bold">
        {course.icon_url && (
          <img src={course.icon_url} alt="" aria-hidden className="size-10 object-contain" />
        )}
        {course.name}
      </h3>
      {next_lesson && (
        <p className="flex-1 text-lg font-medium text-ink/70">
          {t('profile.nextLesson', { module: next_lesson.module_title, lesson: next_lesson.title })}
        </p>
      )}
      <div className="flex items-center gap-4">
        <ProgressBar value={percent} label={t('courses.progressLabel')} showValue={false} />
        <span className="font-semibold">{Math.round(percent)}%</span>
      </div>
      <Link to={`/courses/${course.id}`} className={buttonVariants({ fullWidth: true })}>
        {t('courses.continue')}
      </Link>
    </Card>
  )
}
