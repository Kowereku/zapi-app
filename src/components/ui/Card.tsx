import type { ComponentProps } from 'react'

const paddings = {
  md: 'p-6',
  lg: 'px-6 py-8 sm:px-12 sm:py-10',
} as const

type CardProps = Omit<ComponentProps<'div'>, 'className'> & {
  padding?: keyof typeof paddings
}

export function Card({ padding = 'md', ...props }: CardProps) {
  return (
    <div
      className={`rounded-card bg-surface text-ink shadow-lg shadow-black/10 ${paddings[padding]}`}
      {...props}
    />
  )
}
