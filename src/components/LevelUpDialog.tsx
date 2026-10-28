import { useEffect, useId, useRef } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { BadgeMedal } from '@/components/BadgeMedal'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { Mascot } from '@/components/ui/Mascot'
import type { LevelUp } from '@/lib/levelUp'
import { cn } from '@/utils/cn'

type LevelUpDialogProps = LevelUp & {
  onClose: () => void
}

/**
 * Celebrates reaching a new level. A native modal dialog: it traps focus, Escape closes it,
 * and the page behind is dimmed through ::backdrop.
 */
export function LevelUpDialog({ level, rank, onClose }: LevelUpDialogProps) {
  const { t } = useTranslation()
  const titleId = useId()
  const rankId = useId()
  const dialog = useRef<HTMLDialogElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (dialog.current && !dialog.current.open) dialog.current.showModal()
    // The popup opens on its own after a save, so a stray Enter must not navigate away.
    closeButton.current?.focus()
  }, [])

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      aria-labelledby={titleId}
      aria-describedby={rank !== null ? rankId : undefined}
      // The global yellow focus ring is invisible on the white card, so it turns dark in here.
      // The backdrop colour is literal: some browsers don't pass theme variables to ::backdrop.
      className="m-auto w-[min(36rem,calc(100%-2rem))] rounded-card border-4 border-primary bg-surface p-6 text-center text-ink shadow-[0_0_60px_rgba(255,204,0,0.5)] backdrop:bg-[rgb(0_0_0/0.55)] **:focus-visible:outline-ink sm:p-10"
    >
      <div className="flex flex-col items-center gap-3">
        <Mascot variant="ducky" size="md" />
        <p className="text-sm font-semibold tracking-widest text-brand uppercase">
          {t('levelUp.kicker')}
        </p>
        <BadgeMedal family="level" earned size="lg" />
        <h2 id={titleId} className="text-3xl font-bold sm:text-4xl">
          {t('levelUp.title', { level })}
        </h2>
        {rank !== null && (
          <p id={rankId} className="text-lg text-ink/70">
            {t('levelUp.rank', { count: rank, ordinal: true })}
          </p>
        )}
        <div className="mt-3 flex w-full flex-col gap-3 sm:flex-row">
          <Link to="/ranking" className={buttonVariants({ size: 'lg', fullWidth: true })}>
            {t('levelUp.seeRanking')}
          </Link>
          <button
            ref={closeButton}
            type="button"
            onClick={() => dialog.current?.close()}
            className={cn(
              buttonVariants({ variant: 'outline', size: 'lg', fullWidth: true }),
              'border-2 border-ink text-ink hover:bg-ink/5',
            )}
          >
            {t('levelUp.close')}
          </button>
        </div>
      </div>
    </dialog>
  )
}
