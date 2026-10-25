import Prism from 'prismjs'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-java'

const grammar = (language: string) => Prism.languages[language] ?? Prism.languages.plain

export const highlight = (code: string, language: string) =>
  Prism.highlight(code, grammar(language), language)

export const tokenize = (code: string, language: string) => Prism.tokenize(code, grammar(language))
