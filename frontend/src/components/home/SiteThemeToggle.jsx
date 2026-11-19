import { useSiteThemeStore } from '@/store/siteThemeStore'
import { cn } from '@/lib/cn'

function SunIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function MoonIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

/** Marketing site — distinct styles in light vs dark. */
export function SiteThemeToggle({ className = '' }) {
  const theme = useSiteThemeStore((s) => s.theme)
  const toggleTheme = useSiteThemeStore((s) => s.toggleTheme)
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
        'border text-xs transition',
        'border-amber-200/80 bg-amber-50/90 text-amber-700 ring-1 ring-amber-200/50',
        'hover:bg-amber-100/90 hover:ring-amber-300/60',
        'dark:border-zinc-600 dark:bg-zinc-800/90 dark:text-amber-200 dark:ring-zinc-600/50',
        'dark:hover:border-zinc-500 dark:hover:bg-zinc-700/90',
        className,
      )}
      title={isDark ? 'Switch to light' : 'Switch to dark'}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {isDark ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
    </button>
  )
}
