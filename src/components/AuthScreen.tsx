import type { ReactNode } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { CloseButton } from '@/components/ui/CloseButton'
import { Mascot } from '@/components/ui/Mascot'

type AuthScreenProps = {
  title: string
  mascot: 'duckLogin' | 'duckRegister'
  onClose: () => void
  children: ReactNode
}

export function AuthScreen({ title, mascot, onClose, children }: AuthScreenProps) {
  const { t } = useTranslation()
  const isLogin = mascot === 'duckLogin'

  return (
    <div className="flex min-h-dvh flex-col px-4 py-4 sm:px-8">
      <div>
        <CloseButton label={t('common.close')} onClick={onClose} />
      </div>

      <main className="flex flex-1 items-center justify-center py-8 sm:pt-16">
        <div className="relative w-full max-w-152">
          <div
            className={`absolute hidden sm:block ${isLogin ? '-top-30 -left-42' : '-top-29.5 -right-30'}`}
          >
            <Mascot variant={mascot} size="peek" />
          </div>

          <div className="relative">
            <Card padding="lg">
              <h1 className="mb-8 text-center text-4xl font-bold sm:text-5xl">{title}</h1>
              {children}
            </Card>
          </div>

          {isLogin ? (
            <span className="absolute -top-4 -left-5.5 hidden h-8.5 w-15 -rotate-18 rounded-[50%] bg-duck-wing sm:block" />
          ) : (
            <>
              <span className="absolute -top-12.5 right-25 hidden h-21.5 w-32 rounded-[50%] bg-duck-wing sm:block" />
              <span className="absolute top-15 -right-8.5 hidden h-32 w-21.5 rounded-[50%] bg-duck-wing sm:block" />
            </>
          )}
        </div>
      </main>

      <p className="text-center text-sm text-on-page sm:text-base">
        <Trans i18nKey="auth.legal" components={{ bold: <strong /> }} />
      </p>
    </div>
  )
}
