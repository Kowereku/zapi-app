import type { ReactNode } from 'react'
import { Link, Navigate, Outlet, useNavigate } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Mascot } from '@/components/ui/Mascot'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useWarmUpAi } from '@/hooks/useWarmUpAi'
import { session } from '@/lib/session'

// Icon-only on phones, so the tap area is padded out; the matching negative margin keeps the
// header's layout width unchanged (the nav only just fits at 360px).
const iconLinkClass = '-m-1.5 inline-flex items-center p-1.5 hover:underline'

type HeaderStatProps = {
  icon: string
  /** What phones show, e.g. "1120"; screen readers always get the full text. */
  short: ReactNode
  full: string
  className?: string
}

/** A header number that shortens to icon + value on phones, e.g. "⚡ 1120" instead of "⚡ 1120 XP". */
function HeaderStat({ icon, short, full, className }: HeaderStatProps) {
  return (
    <span className={className}>
      <span aria-hidden>{icon}</span>{' '}
      <span aria-hidden className="sm:hidden">
        {short}
      </span>
      <span className="sr-only sm:not-sr-only">{full}</span>
    </span>
  )
}

export function AppLayout() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: user, isPending } = useCurrentUser()
  useWarmUpAi()

  // Accounts created before the Choice page existed pick their area on the next visit.
  if (user && !user.track) {
    return <Navigate to="/choice" replace />
  }

  const logOut = () => {
    session.clear()
    queryClient.clear()
    navigate('/')
  }

  return (
    <div className="flex min-h-dvh flex-col">
      {/* On phones the nav gets its own row under the logo, so it never runs off the screen. */}
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 bg-chrome px-4 py-2 text-ink sm:h-16 sm:flex-nowrap sm:px-6 sm:py-0">
        <Link to="/home" className="flex items-center gap-3">
          <Mascot variant="rubberDuck" size="icon" />
          <span className="text-2xl font-extrabold text-brand uppercase sm:text-4xl">Polycode</span>
        </Link>
        <nav className="flex w-full items-center justify-between gap-3 text-sm font-medium whitespace-nowrap sm:w-auto sm:justify-end sm:gap-6 sm:text-base">
          {isPending ? (
            <span aria-hidden className="h-5 w-32 animate-pulse rounded-full bg-ink/10 sm:w-64" />
          ) : (
            user && (
              <>
                <HeaderStat
                  icon="⚡"
                  short={user.total_xp}
                  full={t('nav.xp', { count: user.total_xp })}
                />
                <HeaderStat
                  icon="⭐"
                  short={t('nav.level', { level: user.level })}
                  full={t('nav.level', { level: user.level })}
                  className="font-semibold"
                />
                <HeaderStat
                  icon="🔥"
                  short={user.streak_days}
                  full={t('nav.streak', { count: user.streak_days })}
                />
                {/* On phones only the icons show; the labels stay readable for screen readers. */}
                <Link to="/ranking" className={iconLinkClass}>
                  <span aria-hidden>📊</span>{' '}
                  <span className="sr-only sm:not-sr-only">{t('nav.ranking')}</span>
                </Link>
                <Link to="/profile" className={iconLinkClass}>
                  <span aria-hidden>👤</span>{' '}
                  <span className="sr-only sm:not-sr-only">{user.username}</span>
                </Link>
              </>
            )
          )}
          <button type="button" onClick={logOut} className="hover:underline">
            {t('nav.logOut')} &gt;
          </button>
        </nav>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
