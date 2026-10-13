import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { DuckyBubble } from '@/components/DuckyBubble'
import { Button } from '@/components/ui/Button'
import { buttonVariants } from '@/components/ui/buttonVariants'

type OutOfHeartsProps = {
  coursePath: string
  onRetry: () => void
}

export function OutOfHearts({ coursePath, onRetry }: OutOfHeartsProps) {
  const { t } = useTranslation()

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-10 px-4 py-8">
      <DuckyBubble live>{t('lesson.outOfHearts')}</DuckyBubble>
      <div className="flex w-full max-w-xl flex-col gap-4 sm:flex-row">
        <Button variant="success" size="lg" fullWidth onClick={onRetry}>
          {t('lesson.tryAgain')}
        </Button>
        <Link
          to={coursePath}
          className={buttonVariants({ variant: 'outline', size: 'lg', fullWidth: true })}
        >
          {t('lesson.backToCourse')}
        </Link>
      </div>
    </main>
  )
}
