import type { LucideIcon } from 'lucide-react'

type StatTileProps = {
  icon: LucideIcon
  value: number | string
  label: string
}

export function StatTile({ icon: Icon, value, label }: StatTileProps) {
  return (
    <div className="flex flex-col gap-1 rounded-card bg-tile/10 px-5 py-4">
      <span className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
        <Icon aria-hidden className="size-6 shrink-0 text-tile sm:size-7" />
        {value}
      </span>
      <span className="font-medium text-ink/70">{label}</span>
    </div>
  )
}
