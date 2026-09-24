import type { ComponentProps } from 'react'
import { cn } from '@/utils/cn'

const paddings = {
  md: 'p-6',
  lg: 'px-6 py-8 sm:px-12 sm:py-10',
} as const

type CardProps = ComponentProps<'div'> & {
  padding?: keyof typeof paddings
}

export function Card({ padding = 'md', className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-card bg-surface text-ink shadow-lg shadow-black/10',
        paddings[padding],
        className,
      )}
      {...props}
    />
  )
}
