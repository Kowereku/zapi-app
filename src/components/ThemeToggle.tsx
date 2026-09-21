import { useTranslation } from 'react-i18next'
import { cn } from '@/utils/cn'
import { useTheme } from '@/hooks/useTheme'

export function ThemeToggle() {
  const { t } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 text-sm font-semibold text-ink uppercase"
    >
      <span
        aria-hidden
        className={cn(
          'relative h-5 w-9 rounded-full border-2 border-ink transition',
          isDark && 'bg-primary',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 size-3 rounded-full bg-ink transition-transform',
            isDark && 'translate-x-4',
          )}
        />
      </span>
      {t('common.darkMode')}
    </button>
  )
}
