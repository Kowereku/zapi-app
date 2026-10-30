import { useEffect } from 'react'
import { Link, useRouteError } from 'react-router'
import { useTranslation } from 'react-i18next'
import { DuckyBubble } from '@/components/DuckyBubble'
import { buttonVariants } from '@/components/ui/buttonVariants'

/** Shown instead of a blank page when rendering a page throws. */
export function RouteErrorPage() {
  const { t } = useTranslation()
  const error = useRouteError()

  useEffect(() => {
    // Kept in the console for debugging; learners only see the friendly message.
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-10 px-4">
      <DuckyBubble live>
        <p className="font-bold">{t('crash.title')}</p>
        <p className="text-lg">{t('crash.body')}</p>
      </DuckyBubble>
      <div className="flex w-full max-w-xl flex-col gap-4 sm:flex-row">
        <Link to="/home" className={buttonVariants({ size: 'lg', fullWidth: true })}>
          {t('crash.home')}
        </Link>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className={buttonVariants({ variant: 'outline', size: 'lg', fullWidth: true })}
        >
          {t('crash.retry')}
        </button>
      </div>
    </main>
  )
}
