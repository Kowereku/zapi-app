import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { Card } from '@/components/ui/Card'
import type { CourseListItem } from '@/services/api'

type CourseCardProps = {
  course: CourseListItem
  progress: number
}

export function CourseCard({ course, progress }: CourseCardProps) {
  const { t } = useTranslation()

  return (
    <Card className="flex h-full flex-col gap-4">
      <h3 className="flex items-center gap-3 text-2xl font-bold">
        {course.icon_url && (
          <img src={course.icon_url} alt="" aria-hidden className="size-10 object-contain" />
        )}
        {course.name}
      </h3>
      <p className="flex-1 text-lg">{course.description}</p>
      <p className="font-semibold">{t('courses.progress', { percent: Math.round(progress) })}</p>
      <Link to={`/courses/${course.id}`} className={buttonVariants({ fullWidth: true })}>
        {progress > 0 ? t('courses.continue') : t('courses.start')}
      </Link>
    </Card>
  )
}
