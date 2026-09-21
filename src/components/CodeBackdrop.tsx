import { useState } from 'react'

const snippets = [
  '< >',
  'cout << "" << endl();',
  '{ }',
  '[ ]',
  'console.log();',
  'System.out.println();',
]

const random = (min: number, max: number) => min + Math.random() * (max - min)

export function CodeBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none"
    >
      {snippets.map((text) => (
        <FallingSnippet key={text} text={text} />
      ))}
    </div>
  )
}

function FallingSnippet({ text }: { text: string }) {
  const [left, setLeft] = useState(() => random(0, 75))
  const [top] = useState(() => random(5, 90))
  const [duration] = useState(() => random(30, 50))
  const [delay] = useState(() => -random(0, duration))

  return (
    <span
      className="absolute text-3xl whitespace-nowrap text-on-page-muted motion-safe:animate-fall md:text-5xl"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
      }}
      // Respawn in a new column each time the snippet falls off the bottom.
      onAnimationIteration={() => setLeft(random(0, 75))}
    >
      {text}
    </span>
  )
}
