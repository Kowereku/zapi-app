import { ChartColumn, Cog, Shield, type LucideIcon } from 'lucide-react'
import type { Track } from '@/services/api'

/** Areas shown on the Choice page, in the order of the Figma design. */
export const tracks: { id: Track; icon: LucideIcon }[] = [
  { id: 'data_science', icon: ChartColumn },
  { id: 'linux', icon: Shield },
  { id: 'backend', icon: Cog },
]

export const trackIcon = Object.fromEntries(tracks.map((item) => [item.id, item.icon])) as Record<
  Track,
  LucideIcon
>
