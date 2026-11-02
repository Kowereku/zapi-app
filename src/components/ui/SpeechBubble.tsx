import type { ComponentProps } from 'react'
import { cn } from '@/utils/cn'

// Tails point up at Ducky on phones (bubble below him) and left from `sm` (bubble beside him).
const variants = {
  speech:
    'rounded-card before:-top-3 before:left-1/2 before:size-6 before:-translate-x-1/2 before:rotate-45 before:rounded-sm sm:before:top-auto sm:before:bottom-5 sm:before:-left-3 sm:before:translate-x-0',
  thought:
    "rounded-full before:-top-3.5 before:left-1/2 before:size-3 before:-translate-x-1/2 before:rounded-full after:absolute after:-top-6 after:left-1/2 after:size-2 after:-translate-x-1/2 after:rounded-full after:bg-surface after:content-[''] sm:before:top-auto sm:before:bottom-4 sm:before:-left-4 sm:before:translate-x-0 sm:after:top-auto sm:after:bottom-2 sm:after:-left-6 sm:after:translate-x-0",
}

type SpeechBubbleProps = ComponentProps<'div'> & {
  variant?: keyof typeof variants
}

export function SpeechBubble({
  variant = 'speech',
  children,
  className,
  ...props
}: SpeechBubbleProps) {
  return (
    <div
      className={cn(
        "relative bg-surface px-7 py-5 text-2xl font-medium text-ink before:absolute before:bg-surface before:content-['']",
        variants[variant],
        className,
      )}
      {...props}
    >
      <div className="relative">{children}</div>
    </div>
  )
}
