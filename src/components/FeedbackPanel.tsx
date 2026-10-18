import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'
import { highlight } from '@/utils/highlight'

type FeedbackPanelProps = {
  correct: boolean
  answer: string
  language: string | null
  onContinue: () => void
}

export function FeedbackPanel({ correct, answer, language, onContinue }: FeedbackPanelProps) {
  const { t } = useTranslation()

  return (
    <div role="status" className="bg-feedback px-4 py-6 text-white">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 sm:flex-row sm:gap-8">
        <span
          aria-hidden
          className={cn(
            'flex size-16 shrink-0 items-center justify-center rounded-full text-3xl font-bold sm:size-24 sm:text-5xl',
            correct ? 'bg-tile' : 'bg-danger',
          )}
        >
          {correct ? '✓' : '✕'}
        </span>
        <div className="flex-1 text-center sm:text-left">
          <p className="text-2xl font-bold sm:text-3xl">
            {correct ? t('lesson.correct') : t('lesson.wrong')}
          </p>
          {!correct &&
            (language ? (
              <>
                <p className="text-lg">{t('lesson.correctAnswer')}</p>
                <pre className="my-2 rounded-card bg-field p-3 text-left font-mono text-base whitespace-pre-wrap text-ink">
                  <code dangerouslySetInnerHTML={{ __html: highlight(answer, language) }} />
                </pre>
              </>
            ) : (
              <p className="text-lg">
                {t('lesson.correctAnswer')}{' '}
                <code className="font-mono whitespace-pre-wrap">{answer}</code>
              </p>
            ))}
          <p className="text-lg">{t('lesson.nextQuestion')}</p>
        </div>
        <Button variant="success" size="lg" onClick={onContinue} autoFocus>
          {t('lesson.continue')}
        </Button>
      </div>
    </div>
  )
}
