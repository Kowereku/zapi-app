import type { ComponentProps } from 'react'
import { cn } from '@/utils/cn'
import { buttonVariants, type ButtonVariantOptions } from './buttonVariants'
import { Spinner } from './Spinner'

type ButtonProps = ComponentProps<'button'> &
  ButtonVariantOptions & {
    loading?: boolean
  }

export function Button({
  variant,
  size,
  fullWidth,
  loading = false,
  disabled,
  children,
  type = 'button',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  )
}
