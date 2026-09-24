import { cn } from '@/utils/cn'

type ProgressBarProps = {
  value: number
  label: string
  showValue?: boolean
  className?: string
}

export function ProgressBar({ value, label, showValue = true, className }: ProgressBarProps) {
  const percent = Math.round(Math.min(100, Math.max(0, value)))

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      className={cn('relative h-5 w-full overflow-hidden rounded-full bg-tile/60', className)}
    >
      <div
        className="flex h-full items-center justify-center rounded-full bg-tile-hover transition-[width] duration-500"
        style={{ width: `${percent}%` }}
      >
        {showValue && percent > 0 && (
          <span className="text-xs font-medium text-white">{percent}%</span>
        )}
      </div>
    </div>
  )
}
