import { Lock } from 'lucide-react'
import { familyIcon } from '@/lib/badges'
import type { BadgeFamily } from '@/services/api'
import { cn } from '@/utils/cn'

const sizes = {
  md: { ring: 'size-24 p-2.5', icon: 'size-10', lock: 'size-7 p-1.5' },
  lg: { ring: 'size-32 p-3', icon: 'size-14', lock: 'size-8 p-1.5' },
}

type BadgeMedalProps = {
  family: BadgeFamily
  earned: boolean
  size?: keyof typeof sizes
}

/** A yellow ring for an earned badge; grey, faded and locked for one not earned yet. */
export function BadgeMedal({ family, earned, size = 'md' }: BadgeMedalProps) {
  const { ring, icon, lock } = sizes[size]
  const Icon = familyIcon[family]

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
        <Icon className={cn(icon, earned ? 'text-tile' : 'text-ink/35')} />
      </span>
      {!earned && (
        <Lock className={cn('absolute right-0 bottom-0 rounded-full bg-ink text-surface', lock)} />
      )}
    </span>
  )
}
