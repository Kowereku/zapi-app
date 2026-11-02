import { useState, type SubmitEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { DuckyBubble } from '@/components/DuckyBubble'
import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/TextField'
import { useChatExercise } from '@/hooks/useChatExercise'
import type { ChatMessage, Exercise } from '@/services/api'
import { isUnavailable } from '@/utils/errorKind'
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

  const unavailable = chat.error && isUnavailable(chat.error)
  // Ducky keeps one bubble with his latest message; only the learner's latest answer is shown.
  const lastAnswer = chat.isPending ? draft.trim() : messages.at(-2)?.content

  return (
    <div className="flex flex-col gap-6">
      <DuckyBubble live thinking={chat.isPending}>
        {unavailable ? t('quiz.aiNap') : messages.at(-1)?.content}
      </DuckyBubble>

      {lastAnswer && (
        <p className="max-w-md self-end rounded-card bg-tile px-5 py-3 text-lg wrap-break-word text-white">
          {lastAnswer}
        </p>
      )}

      {chat.error &&
        (unavailable ? (
          // Ducky can't answer, so the question can be skipped and the quiz still finished.
          <Button size="lg" onClick={onPassed} className="self-start">
            {t('quiz.skip')}
          </Button>
        ) : (
          <p role="alert" className="rounded-card bg-surface px-4 py-2 font-medium text-danger">
            {getErrorMessage(chat.error, t)}
          </p>
        ))}

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
