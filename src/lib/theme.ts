import { storage } from './storage'

export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'polycode.theme'
const listeners = new Set<() => void>()

export function getTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  storage.set(STORAGE_KEY, theme)
  listeners.forEach((notify) => notify())
}

export function subscribeTheme(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
