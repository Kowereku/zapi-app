import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { DuckyBubble } from '@/components/DuckyBubble'
import { MultipleChoiceExercise } from '@/components/MultipleChoiceExercise'
import { QuizChat } from '@/components/QuizChat'
import { QuizResult } from '@/components/QuizResult'
import { Button } from '@/components/ui/Button'
import { buttonVariants } from '@/components/ui/buttonVariants'
import { CloseButton } from '@/components/ui/CloseButton'
import { ProgressBar } from '@/components/ui/ProgressBar'
import type { LevelUp } from '@/lib/levelUp'
import { useSaveAnnouncements } from '@/hooks/useSaveAnnouncements'
import { useCompleteLesson } from '@/hooks/useCompleteLesson'
import type { Badge, LessonDetail } from '@/services/api'

const passPercent = 70

type QuizRunProps = {
  lesson: LessonDetail
  alreadyCompleted: boolean
  coursePath: string
  onRetry: () => void
}

export function QuizRun({ lesson, alreadyCompleted, coursePath, onRetry }: QuizRunProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const completeLesson = useCompleteLesson()
  const announcements = useSaveAnnouncements()
  const [newBadges, setNewBadges] = useState<Badge[]>([])
  const [levelUp, setLevelUp] = useState<LevelUp | null>(null)
  const [view, setView] = useState<'questions' | 'dialogue' | 'result'>('questions')
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [xp, setXp] = useState(0)
  const [chatIndex, setChatIndex] = useState(0)

  const questions = lesson.exercises.filter(
    (exercise) => exercise.type === 'multiple_choice' && exercise.options?.length,
  )
  const dialogue = lesson.exercises.filter((exercise) => exercise.type === 'chat')

  if (questions.length === 0) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-10 px-4">
        <DuckyBubble>{t('lesson.empty')}</DuckyBubble>
        <Link to={coursePath} className={buttonVariants({ size: 'lg' })}>
          {t('lesson.backToCourse')}
        </Link>
      </main>
    )
  }

  const correctCount = questions.filter(
    (question, position) => answers[position] === question.correct_answer,
  ).length
  const percent = Math.round((correctCount / questions.length) * 100)

  const saveResult = (mistakes_made: number) => {
    announcements.beforeSave()
    completeLesson.mutate(
      { lesson_id: lesson.id, mistakes_made },
      {
        onSuccess: async (result) => {
          setLevelUp(announcements.toLevelUp(result))
          setNewBadges(await announcements.toAnnounce(result.new_badges))
        },
      },
    )
  }

  const save = () => saveResult(questions.length - correctCount)

  const pass = (mistakes_made: number) => {
    setXp(alreadyCompleted ? 0 : lesson.xp_reward)
    setView('result')
    saveResult(mistakes_made)
  }

  const next = () => {
    const nextAnswers = [...answers, selected ?? '']
    setAnswers(nextAnswers)
    setSelected(null)
    if (index < questions.length - 1) {
      setIndex(index + 1)
      return
    }
    const nextCorrect = questions.filter(
      (question, position) => nextAnswers[position] === question.correct_answer,
    ).length
    if ((nextCorrect / questions.length) * 100 < passPercent) {
      setView('result')
    } else if (dialogue.length > 0) {
      setView('dialogue')
    } else {
      pass(questions.length - nextCorrect)
    }
  }

  if (view === 'result') {
    return (
      <QuizResult
        questions={questions}
        answers={answers}
        percent={percent}
        passPercent={passPercent}
        passed={(correctCount / questions.length) * 100 >= passPercent}
        xp={xp}
        newBadges={newBadges}
        levelUp={levelUp}
        pending={completeLesson.isPending}
        error={completeLesson.error}
        onSave={save}
        onRetry={onRetry}
        coursePath={coursePath}
      />
    )
  }

  if (view === 'dialogue') {
    return (
      <div className="flex min-h-dvh flex-col">
        <header className="mx-auto flex w-full max-w-5xl items-center gap-4 px-4 py-4">
          <CloseButton label={t('quiz.exit')} onClick={() => navigate(coursePath)} />
          <ProgressBar value={100} label={t('quiz.progress')} />
        </header>
        <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-10 px-4 py-6">
          <QuizChat
            key={dialogue[chatIndex].id}
            exercise={dialogue[chatIndex]}
            onPassed={() =>
              chatIndex < dialogue.length - 1
                ? setChatIndex(chatIndex + 1)
                : pass(questions.length - correctCount)
            }
          />
        </main>
      </div>
    )
  }

  const question = questions[index]

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center gap-4 px-4 py-4">
        <CloseButton label={t('quiz.exit')} onClick={() => navigate(coursePath)} />
        <ProgressBar value={(index / questions.length) * 100} label={t('quiz.progress')} />
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-10 px-4 py-6">
        <DuckyBubble live>
          <span className="whitespace-pre-wrap">{question.content}</span>
        </DuckyBubble>
        <MultipleChoiceExercise
          key={question.id}
          exercise={question}
          checked={false}
          onChange={(_, answer) => setSelected(answer)}
        />
      </main>

      <footer className="border-t border-on-page-muted px-4 py-6">
        <div className="mx-auto flex max-w-4xl justify-end">
          <Button variant="success" size="lg" disabled={selected === null} onClick={next}>
            {t('quiz.next')}
          </Button>
        </div>
      </footer>
    </div>
  )
}
