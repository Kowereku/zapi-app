type StatTileProps = {
  /** Decorative emoji, hidden from screen readers. */
  icon: string
  value: number | string
  label: string
}

export function StatTile({ icon, value, label }: StatTileProps) {
  return (
    <div className="flex flex-col gap-1 rounded-card bg-tile/10 px-5 py-4">
      <span className="text-2xl font-bold sm:text-3xl">
        <span aria-hidden>{icon}</span> {value}
      </span>
      <span className="font-medium text-ink/70">{label}</span>
    </div>
  )
}
