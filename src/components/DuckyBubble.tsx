import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Mascot } from '@/components/ui/Mascot'
import { SpeechBubble } from '@/components/ui/SpeechBubble'
import { cn } from '@/utils/cn'

const dotDelays = ['', '[animation-delay:150ms]', '[animation-delay:300ms]']

type DuckyBubbleProps = {
  children: ReactNode
  live?: boolean
  /** Shows a thought bubble with animated dots instead of the message, e.g. while the AI answers. */
  thinking?: boolean
}

export function DuckyBubble({ children, live = false, thinking = false }: DuckyBubbleProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
      <div className="sm:mt-10">
        <Mascot variant="ducky" size="md" />
      </div>
      <div className="max-w-md">
        <SpeechBubble
          variant={thinking ? 'thought' : 'speech'}
          aria-live={live ? 'polite' : undefined}
        >
          {thinking ? (
            <span className="flex h-8 items-center gap-2">
              {dotDelays.map((delay) => (
                <span
                  key={delay}
                  aria-hidden
                  className={cn('size-3 animate-bounce rounded-full bg-ink/50', delay)}
                />
              ))}
              <span className="sr-only">{t('quiz.thinking')}</span>
            </span>
          ) : (
            children
          )}
        </SpeechBubble>
      </div>
    </div>
  )
}
