import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { LANGUAGES } from '@/locale'

export function LanguageSelect() {
  const { t, i18n } = useTranslation()
  const id = useId()

  return (
    <div className="inline-flex items-center gap-1 text-sm font-semibold text-ink uppercase">
      <label htmlFor={id}>{t('common.language')}:</label>
      <select
        id={id}
        value={i18n.resolvedLanguage}
        onChange={(event) => void i18n.changeLanguage(event.target.value)}
        className="cursor-pointer bg-transparent font-semibold uppercase"
      >
        {LANGUAGES.map(({ code, label }) => (
          <option key={code} value={code} className="text-ink normal-case">
            {label}
          </option>
        ))}
      </select>
    </div>
  )
}
