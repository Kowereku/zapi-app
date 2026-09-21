import { cn } from '@/utils/cn'

const variants = {
  /** Yellow - log in, sign up, start */
  primary: 'bg-primary text-ink hover:bg-primary-hover',
  /** Teal with white border - sign up*/
  secondary: 'border border-white bg-tile text-white hover:bg-tile-hover',
  /** Green with white border - continue */
  success: 'border-2 border-white bg-success font-bold uppercase text-white hover:brightness-105',
  /** Transparent with white border - report */
  outline: 'border border-white bg-transparent text-white hover:bg-white/10',
} as const

const sizes = {
  sm: 'h-8 px-4 text-sm',
  md: 'h-11 px-6 text-base',
  lg: 'h-14 px-8 text-lg',
} as const

export type ButtonVariant = keyof typeof variants
export type ButtonSize = keyof typeof sizes

export type ButtonVariantOptions = {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

export function buttonVariants({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
}: ButtonVariantOptions = {}) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-card font-semibold transition',
    'disabled:cursor-not-allowed disabled:opacity-60',
    variants[variant],
    sizes[size],
    fullWidth && 'w-full',
  )
}
