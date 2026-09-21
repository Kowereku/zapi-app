import { useTranslation } from 'react-i18next'
import { LanguageSelect } from '@/components/LanguageSelect'
import { ThemeToggle } from '@/components/ThemeToggle'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { Mascot } from '@/components/ui/Mascot'

export function StartPage() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-dvh flex-col px-4 py-4 sm:px-10">
      <header className="flex items-center justify-between">
        <ThemeToggle />
        <LanguageSelect />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-6 py-8">
        <Mascot variant="rubberDuck" size="hero" />
        <h1 className="text-5xl font-extrabold tracking-tight text-white uppercase sm:text-7xl lg:text-8xl">
          {t('brand')}
        </h1>

        <div className="mt-6 flex w-full max-w-3xl flex-col gap-4 sm:flex-row sm:justify-between">
          <div className="sm:w-80">
            <a href="/login" className={buttonVariants({ size: 'lg', fullWidth: true })}>
              {t('start.logIn')}
            </a>
          </div>
          <div className="sm:w-80">
            <a
              href="/register"
              className={buttonVariants({ variant: 'secondary', size: 'lg', fullWidth: true })}
            >
              {t('start.signUp')}
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
