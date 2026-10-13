import type { ComponentProps } from 'react'
import { cn } from '@/utils/cn'

const states = {
  default: 'border-white bg-tile hover:bg-tile-hover',
  selected: 'border-primary bg-tile-hover ring-2 ring-primary',
}

type TileProps = ComponentProps<'button'> & {
  state?: keyof typeof states
}

export function Tile({ state = 'default', type = 'button', className, ...props }: TileProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex min-h-12 items-center gap-3 rounded-card border px-4 py-2 text-left text-lg font-medium text-white transition',
        'disabled:cursor-not-allowed disabled:opacity-60',
        states[state],
        className,
      )}
      {...props}
    />
  )
}
