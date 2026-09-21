import { storage } from './storage'

export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'theme'
const listeners = new Set<() => void>()

export function getTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  storage.set(STORAGE_KEY, theme)
  listeners.forEach((notify) => notify())
}

export function initTheme() {
  const stored = storage.get(STORAGE_KEY)
  document.documentElement.dataset.theme = stored === 'light' ? 'light' : 'dark'
}

export function subscribeTheme(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
