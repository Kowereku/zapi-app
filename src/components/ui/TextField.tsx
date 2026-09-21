import { useId, type ComponentProps } from 'react'
import { cn } from '@/utils/cn'

type TextFieldProps = Omit<ComponentProps<'input'>, 'placeholder' | 'className'> & {
  label: string
  error?: string
}

export function TextField({ label, error, id, ...props }: TextFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`

  return (
    <div className="flex flex-col gap-0.5">
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <input
        id={inputId}
        placeholder={label}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          'h-14 w-full rounded-card bg-field px-5 text-lg font-semibold text-ink',
          'placeholder:text-ink/70 focus-visible:outline-tile',
          error && 'ring-2 ring-danger',
        )}
        {...props}
      />
      <p id={errorId} role="alert" className="min-h-5 text-sm/5 font-medium text-danger">
        {error}
      </p>
    </div>
  )
}
