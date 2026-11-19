import { useEffect } from 'react'
import { useSiteThemeStore } from '@/store/siteThemeStore'

/**
 * Applies site light/dark to `html` (Tailwind `dark` variant) while the marketing app is mounted.
 */
export function SiteThemeSync() {
  const theme = useSiteThemeStore((s) => s.theme)

  useEffect(() => {
    const root = document.documentElement
    const isDark = theme === 'dark'
    root.classList.toggle('dark', isDark)
    root.style.colorScheme = isDark ? 'dark' : 'light'
    return () => {
      root.classList.remove('dark')
      root.style.colorScheme = ''
    }
  }, [theme])

  return null
}
