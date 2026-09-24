import type { ComponentProps } from 'react'
import { cn } from '@/utils/cn'

export function Badge({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-card bg-badge px-4 py-1.5 text-sm font-semibold text-on-primary',
        className,
      )}
      {...props}
    />
  )
}
