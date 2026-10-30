import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Tile } from '@/components/ui/Tile'
import { cn } from '@/utils/cn'
import { shuffle } from '@/utils/shuffle'

type TileAssemblyProps = {
  tiles: string[]
  checked: boolean
  /** Called with the picked tiles, in order, after every tap. */
  onChange: (picked: string[]) => void
  tileClassName?: string
}

/** Tap tiles from a shuffled pool to build an answer; tap a picked tile to put it back. */
export function TileAssembly({ tiles, checked, onChange, tileClassName }: TileAssemblyProps) {
  const { t } = useTranslation()
  // Tiles can repeat (e.g. two "("), so each one gets its index as an id.
  const [pool] = useState(() => shuffle(tiles.map((text, id) => ({ id, text }))))
  const [picked, setPicked] = useState<typeof pool>([])

  const update = (next: typeof pool) => {
    setPicked(next)
    onChange(next.map((tile) => tile.text))
  }

  return (
    <div className="flex flex-col gap-8">
      <div
        role="group"
        aria-label={t('lesson.answer')}
        className="flex min-h-16 flex-wrap items-end gap-2 border-b-2 border-white/60 pb-2"
      >
        {picked.map((tile) => (
          <Tile
            key={tile.id}
            disabled={checked}
            onClick={() => update(picked.filter((item) => item.id !== tile.id))}
            className={tileClassName}
          >
            {tile.text}
          </Tile>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {pool.map((tile) => {
          const isPicked = picked.some((item) => item.id === tile.id)
          return (
            <Tile
              key={tile.id}
              disabled={checked || isPicked}
              onClick={() => update([...picked, tile])}
              className={cn(tileClassName, isPicked && 'invisible')}
            >
              {tile.text}
            </Tile>
          )
        })}
      </div>
    </div>
  )
}
