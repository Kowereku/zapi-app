import { CodeText } from '@/components/ui/CodeText'
import type { Exercise } from '@/services/api'
import { markMistakes } from '@/utils/markMistakes'

type CorrectAnswerProps = {
  exercise: Exercise
  answer: string
  language: string
}

export function CorrectAnswer({ exercise, answer, language }: CorrectAnswerProps) {
  if (exercise.type === 'code' || exercise.type === 'block_assembly') {
    const expected = (exercise.type === 'code' && exercise.code_snippet) || exercise.correct_answer
    return (
      <pre className="my-2 rounded-card bg-field p-3 text-left font-mono text-base whitespace-pre-wrap text-ink">
        <CodeText code={expected} language={language} marked={markMistakes(expected, answer)} />
      </pre>
    )
  }

  if (exercise.type === 'matching') {
    const picked = answer.split('\n')
    return (
      <ul className="my-2 flex flex-col gap-1 text-lg">
        {(exercise.options as [string, string][]).map(([left, right], index) => (
          <li key={index}>
            {right === picked[index] ? (
              `${left}: ${right}`
            ) : (
              <strong className="underline decoration-danger decoration-2 underline-offset-4">
                {left}: {right}
              </strong>
            )}
          </li>
        ))}
      </ul>
    )
  }

  return <p className="font-mono text-lg whitespace-pre-wrap">{exercise.correct_answer}</p>
}
