import type { ComponentProps } from 'react'

type CloseButtonProps = Omit<ComponentProps<'button'>, 'children' | 'className'> & {
  label: string
}

export function CloseButton({ label, type = 'button', ...props }: CloseButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className="inline-flex size-10 items-center justify-center rounded-full text-ink transition hover:bg-black/10"
      {...props}
    >
      <CloseIcon />
    </button>
  )
}

export function CloseIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
    >
      <path d="M4 4l12 12M16 4L4 16" />
    </svg>
  )
}
