type StatTileProps = {
  value: string
  label: string
}

export function StatTile({ value, label }: StatTileProps) {
  return (
    <div className="flex flex-col gap-1 rounded-card bg-tile/10 px-5 py-4">
      <span className="text-2xl font-bold sm:text-3xl">{value}</span>
      <span className="font-medium text-ink/70">{label}</span>
    </div>
  )
}
