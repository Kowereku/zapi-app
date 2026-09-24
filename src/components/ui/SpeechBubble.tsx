import type { ComponentProps } from 'react'
import { cn } from '@/utils/cn'

export function SpeechBubble({ children, className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        "relative rounded-card bg-surface px-7 py-5 text-2xl font-medium text-ink before:absolute before:bottom-5 before:-left-3 before:size-6 before:rotate-45 before:rounded-sm before:bg-surface before:content-['']",
        className,
      )}
      {...props}
    >
      <div className="relative">{children}</div>
    </div>
  )
}
