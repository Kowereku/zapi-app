import type { ComponentProps } from 'react'

export function Badge(props: Omit<ComponentProps<'span'>, 'className'>) {
  return (
    <span
      className="inline-flex items-center rounded-card bg-badge px-4 py-1.5 text-sm font-semibold text-ink"
      {...props}
    />
  )
}
