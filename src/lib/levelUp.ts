import type { LessonCompleteResponse } from '@/services/api'

/** A level reached by the save that was just made, with the new ranking position. */
export type LevelUp = {
  level: number
  /** Position in the ranking; the ranking line is hidden when null. */
  rank: number | null
}

/**
 * The level-up to celebrate after a save, or null when the level didn't change.
 *
 * levelAtStart is the level before a retried save: if an earlier attempt already raised the
 * level but its response was lost, the retry still celebrates it.
 */
export const levelUpFrom = (
  result: Pick<LessonCompleteResponse, 'level_before' | 'level_after' | 'rank'>,
  levelAtStart?: number | null,
): LevelUp | null => {
  const before = Math.min(result.level_before, levelAtStart ?? result.level_before)
  return result.level_after > before ? { level: result.level_after, rank: result.rank } : null
}
