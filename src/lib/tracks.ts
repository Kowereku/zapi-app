import type { Track } from '@/services/api'

/** Areas shown on the Choice page, in the order of the Figma design. */
export const tracks: { id: Track; icon: string }[] = [
  { id: 'data_science', icon: '📊' },
  { id: 'linux', icon: '🛡️' },
  { id: 'backend', icon: '⚙️' },
]

export const trackIcon = (track: Track) => tracks.find((item) => item.id === track)?.icon
