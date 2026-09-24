import { cn } from '@/utils/cn'

const sizes = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-10',
} as const

type SpinnerProps = {
  size?: keyof typeof sizes
  label?: string
  className?: string
}

export function Spinner({ size = 'md', label, className }: SpinnerProps) {
  return (
    <span
      role={label ? 'status' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(
        'inline-block animate-spin rounded-full border-2 border-current border-t-transparent',
        sizes[size],
        className,
      )}
    />
  )
}
