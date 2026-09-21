import type { ReactNode } from 'react'
import { Mascot } from '@/components/ui/Mascot'
import { SpeechBubble } from '@/components/ui/SpeechBubble'

type DuckyBubbleProps = {
  children: ReactNode
  live?: boolean
}

export function DuckyBubble({ children, live = false }: DuckyBubbleProps) {
  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
      <div className="sm:mt-10">
        <Mascot variant="ducky" size="md" />
      </div>
      <div className="max-w-md">
        <SpeechBubble aria-live={live ? 'polite' : undefined}>{children}</SpeechBubble>
      </div>
    </div>
  )
}
