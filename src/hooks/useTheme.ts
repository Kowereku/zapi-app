import { useCallback, useSyncExternalStore } from 'react'
import { getTheme, setTheme, subscribeTheme } from '@/lib/theme'

export function useTheme() {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, () => 'dark' as const)
  const toggleTheme = useCallback(() => setTheme(theme === 'dark' ? 'light' : 'dark'), [theme])
  return { theme, toggleTheme }
}
