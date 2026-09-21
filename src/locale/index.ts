import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { storage } from '@/lib/storage'
import en from './langs/en.json'
import pl from './langs/pl.json'

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'pl', label: 'Polski' },
] as const

export type LanguageCode = (typeof LANGUAGES)[number]['code']

const STORAGE_KEY = 'polycode.language'
const stored = storage.get(STORAGE_KEY)
const initial: LanguageCode = stored === 'pl' ? 'pl' : 'en'

void i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, pl: { translation: pl } },
  lng: initial,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

i18n.on('languageChanged', (lng) => {
  storage.set(STORAGE_KEY, lng)
  document.documentElement.lang = lng
})
document.documentElement.lang = initial

export default i18n
