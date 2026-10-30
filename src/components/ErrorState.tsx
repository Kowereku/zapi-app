import { useIsFetching } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Mascot } from '@/components/ui/Mascot'
import { isFailed } from '@/hooks/useRetryFailedQueries'
import { errorKind } from '@/utils/errorKind'
import { getErrorMessage } from '@/utils/getErrorMessage'

type ErrorStateProps = {
  error: unknown
  onRetry: () => void
}

/** The approved "Ducky can't reach the server" card: what went wrong, and a way to try again. */
export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const { t } = useTranslation()
  // A failed query keeps its error status while it is fetched again, even with cached data.
  const retrying = useIsFetching({ predicate: isFailed }) > 0
  const kind = errorKind(error)
  const title =
    kind === 'network' || kind === 'timeout'
      ? t('errorState.offline')
      : kind === 'server'
        ? t('errorState.server')
        : t('errorState.generic')
  const body =
    kind === 'network'
      ? t('errorState.offlineBody')
      : `${getErrorMessage(error, t)} ${t('errorState.progressSafe')}`

  return (
    <Card role="alert" className="mx-auto flex w-full max-w-xl flex-col gap-4">
      <div className="flex items-center gap-4">
        <Mascot variant="ducky" size="icon" className="size-14" />
        <div className="min-w-0">
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-ink/70">{body}</p>
        </div>
      </div>
      <Button size="lg" fullWidth loading={retrying} disabled={retrying} onClick={onRetry}>
        {t('errorState.retry')}
      </Button>
    </Card>
  )
}
