import type { ComponentProps } from 'react'
import { buttonVariants, type ButtonVariantOptions } from './buttonVariants'
import { Spinner } from './Spinner'

type ButtonProps = Omit<ComponentProps<'button'>, 'className'> &
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
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonVariants({ variant, size, fullWidth })}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  )
}
