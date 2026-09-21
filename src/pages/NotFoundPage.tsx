import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { DuckyBubble } from '@/components/DuckyBubble'
import { buttonVariants } from '@/components/ui/buttonVariants'

export function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-10 px-4">
      <DuckyBubble>{t('notFound.message')}</DuckyBubble>
      <Link to="/" className={buttonVariants({ size: 'lg' })}>
        {t('notFound.backHome')}
      </Link>
    </main>
  )
}
