import { Fragment, type ReactNode } from 'react'
import type { TokenStream } from 'prismjs'
import { cn } from '@/utils/cn'
import { tokenize } from '@/utils/highlight'

type CodeTextProps = {
  code: string
  language: string
  marked: boolean[]
}

const renderTokens = (
  stream: TokenStream,
  marked: boolean[],
  position: { offset: number },
): ReactNode => {
  if (Array.isArray(stream)) {
    return stream.map((item, index) => (
      <Fragment key={index}>{renderTokens(item, marked, position)}</Fragment>
    ))
  }
  if (typeof stream !== 'string') {
    return (
      <span className={cn('token', stream.type, stream.alias)}>
        {renderTokens(stream.content, marked, position)}
      </span>
    )
  }

  const start = position.offset
  position.offset += stream.length
  const parts: ReactNode[] = []
  let from = 0
  while (from < stream.length) {
    const bold = marked[start + from]
    let to = from + 1
    while (to < stream.length && marked[start + to] === bold) to++
    const text = stream.slice(from, to)
    parts.push(
      bold ? (
        <strong key={from} className="underline decoration-danger decoration-2 underline-offset-4">
          {text}
        </strong>
      ) : (
        text
      ),
    )
    from = to
  }
  return parts
}

export function CodeText({ code, language, marked }: CodeTextProps) {
  return <code>{renderTokens(tokenize(code, language), marked, { offset: 0 })}</code>
}
