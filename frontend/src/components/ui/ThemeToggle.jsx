import { useAdminThemeStore } from '@/store/adminThemeStore'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

export function ThemeToggle({ className = '', compact = false }) {
  const theme = useAdminThemeStore((s) => s.theme)
  const toggleTheme = useAdminThemeStore((s) => s.toggleTheme)
  const isDark = theme === 'dark'

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={toggleTheme}
      className={cn(
        'shrink-0 border-slate-200/80 font-normal',
        'dark:border-white/12',
        className,
      )}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <span className="text-base leading-none" aria-hidden>
        {isDark ? '☀️' : '🌙'}
      </span>
      {!compact && (
        <span className="hidden sm:inline">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </Button>
  )
}
