import { useState, type SubmitEvent } from 'react'
import { Navigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { DuckyBubble } from '@/components/DuckyBubble'
import { Button } from '@/components/ui/Button'
import { SpeechBubble } from '@/components/ui/SpeechBubble'
import { Spinner } from '@/components/ui/Spinner'
import { TextField } from '@/components/ui/TextField'
import { useChatExercise } from '@/hooks/useChatExercise'
import { ApiRequestError, type ChatMessage, type Exercise } from '@/services/api'
import { getErrorMessage } from '@/utils/getErrorMessage'

const maxMessages = 20

type QuizChatProps = {
  exercise: Exercise
  onPassed: () => void
}

export function QuizChat({ exercise, onPassed }: QuizChatProps) {
  const { t, i18n } = useTranslation()
  const chat = useChatExercise()
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: exercise.content },
  ])
  const [draft, setDraft] = useState('')
  const [passed, setPassed] = useState(false)

  if (chat.error instanceof ApiRequestError && chat.error.status === 401) {
    return <Navigate to="/login" replace />
  }

  const send = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    const next: ChatMessage[] = [...messages, { role: 'user', content: draft.trim() }]
    chat.mutate(
      {
        exercise_id: exercise.id,
        messages: next.length > maxMessages ? [next[0], ...next.slice(1 - maxMessages)] : next,
        locale: i18n.language,
      },
      {
        onSuccess: (result) => {
          setMessages([...next, { role: 'assistant', content: result.reply }])
          setDraft('')
          setPassed(result.passed)
        },
      },
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <DuckyBubble>{exercise.content}</DuckyBubble>

      <ol aria-live="polite" className="flex flex-col gap-4">
        {messages.slice(1).map((message, index) => (
          <li
            key={index}
            className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
          >
            {message.role === 'user' ? (
              <p className="max-w-md rounded-card bg-tile px-5 py-3 text-lg text-white">
                {message.content}
              </p>
            ) : (
              <SpeechBubble className="max-w-md text-lg">{message.content}</SpeechBubble>
            )}
          </li>
        ))}
      </ol>

      {chat.isPending && (
        <p className="flex items-center gap-3 text-lg">
          <Spinner size="md" />
          {t('quiz.thinking')}
        </p>
      )}

      {chat.error && (
        <p role="alert" className="rounded-card bg-surface px-4 py-2 font-medium text-danger">
          {getErrorMessage(chat.error, t)}
        </p>
      )}

      {passed ? (
        <div className="flex justify-end">
          <Button variant="success" size="lg" onClick={onPassed} autoFocus>
            {t('quiz.continue')}
          </Button>
        </div>
      ) : (
        <form onSubmit={send} className="flex flex-col gap-2 sm:flex-row sm:items-start">
          <div className="flex-1">
            <TextField
              label={t('quiz.messageLabel')}
              value={draft}
              maxLength={1000}
              autoFocus
              readOnly={chat.isPending}
              onChange={(event) => setDraft(event.target.value)}
            />
          </div>
          <Button
            type="submit"
            variant="success"
            size="lg"
            disabled={!draft.trim() || chat.isPending}
          >
            {t('quiz.send')}
          </Button>
        </form>
      )}
    </div>
  )
}
