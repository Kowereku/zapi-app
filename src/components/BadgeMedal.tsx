import { familyIcon } from '@/lib/badges'
import type { BadgeFamily } from '@/services/api'
import { cn } from '@/utils/cn'

const sizes = {
  md: { ring: 'size-24 p-2.5', emoji: 'text-4xl', lock: 'text-xl' },
  lg: { ring: 'size-32 p-3', emoji: 'text-6xl', lock: 'text-2xl' },
}

type BadgeMedalProps = {
  family: BadgeFamily
  earned: boolean
  size?: keyof typeof sizes
}

/** A yellow ring for an earned badge; grey, faded and locked for one not earned yet. */
export function BadgeMedal({ family, earned, size = 'md' }: BadgeMedalProps) {
  const { ring, emoji, lock } = sizes[size]

  return (
    <span
      aria-hidden
      className={cn(
        'relative inline-flex shrink-0 rounded-full',
        earned ? 'bg-primary' : 'bg-ink/20',
        ring,
      )}
    >
      <span
        className={cn(
          'flex size-full items-center justify-center rounded-full',
          earned ? 'bg-surface' : 'bg-ink/5',
        )}
      >
        <span className={cn(emoji, !earned && 'opacity-35 grayscale')}>{familyIcon[family]}</span>
      </span>
      {!earned && <span className={cn('absolute right-0 bottom-0', lock)}>🔒</span>}
    </span>
  )
}
