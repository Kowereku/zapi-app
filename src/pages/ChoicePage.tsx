import { Navigate, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { DuckyBubble } from '@/components/DuckyBubble'
import { CloseButton } from '@/components/ui/CloseButton'
import { Spinner } from '@/components/ui/Spinner'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useUpdateTrack } from '@/hooks/useUpdateTrack'
import { tracks } from '@/lib/tracks'
import { ApiRequestError, type Track } from '@/services/api'
import { cn } from '@/utils/cn'
import { getErrorMessage } from '@/utils/getErrorMessage'

export function ChoicePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: user, error } = useCurrentUser()
  const updateTrack = useUpdateTrack()

  if (error instanceof ApiRequestError && error.status === 401) {
    return <Navigate to="/login" replace />
  }

  const choose = (track: Track) => {
    updateTrack.mutate(track, { onSuccess: () => navigate('/home') })
  }

  return (
    <div className="flex min-h-dvh flex-col px-4 py-4 sm:px-8">
      {/* Users who already picked an area came here to change it, so they can go back. */}
      <div className="h-10">
        {user?.track && (
          <CloseButton
            label={t('common.close')}
            onClick={() => navigate('/home')}
            className="bg-surface"
          />
        )}
      </div>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-12 py-8">
        <div className="self-center sm:self-start sm:pl-16">
          <DuckyBubble>{t('choice.prompt')}</DuckyBubble>
        </div>

        <ul className="grid gap-6 sm:grid-cols-3">
          {tracks.map((track) => {
            const isCurrent = user?.track === track.id
            return (
              <li key={track.id}>
                <button
                  type="button"
                  disabled={updateTrack.isPending}
                  aria-pressed={isCurrent}
                  onClick={() => choose(track.id)}
                  className={cn(
                    'flex h-full w-full flex-col gap-4 rounded-card bg-surface p-6 text-left text-ink shadow-lg shadow-black/10 transition',
                    'hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary',
                    'disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0',
                    isCurrent && 'ring-4 ring-primary',
                  )}
                >
                  <span className="text-2xl font-bold sm:text-3xl">
                    <span aria-hidden>{track.icon}</span> {t(`choice.tracks.${track.id}.name`)}
                  </span>
                  <span className="text-lg">{t(`choice.tracks.${track.id}.description`)}</span>
                </button>
              </li>
            )
          })}
        </ul>

        <div className="flex min-h-12 justify-center">
          {updateTrack.isPending && <Spinner label={t('choice.saving')} className="text-on-page" />}
          {updateTrack.error && (
            <p role="alert" className="rounded-card bg-surface px-4 py-3 font-medium text-danger">
              {getErrorMessage(updateTrack.error, t)}
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
