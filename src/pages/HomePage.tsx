import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Mascot } from '@/components/ui/Mascot'
import { useCurrentUser } from '@/hooks/useCurrentUser'

export function HomePage() {
  const { t } = useTranslation()
  const { data: user } = useCurrentUser()

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 py-8 sm:flex-row">
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
  )
}
