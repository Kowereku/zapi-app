import Prism from 'prismjs'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-jsx'

export const highlight = (code: string, language: string) =>
  Prism.highlight(code, Prism.languages[language] ?? Prism.languages.plain, language)
