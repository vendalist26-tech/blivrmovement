import { useAdminThemeStore } from '@/store/adminThemeStore'
import { cn } from '@/lib/cn'

export function AdminLayout({ children }) {
  const theme = useAdminThemeStore((s) => s.theme)

  return (
    <div className={cn(theme === 'dark' && 'dark')}>
      <div
        className={cn(
          'admin-app min-h-screen font-sans antialiased transition-[background,color] duration-300',
          /* Light: soft cool canvas, barely-there gradient */
          'bg-admin-canvas bg-linear-to-br from-slate-50 via-white to-sky-50/40 text-slate-800',
          /* Dark: deep neutral with blue undertone */
          'dark:bg-linear-to-br dark:from-zinc-950 dark:via-zinc-950 dark:to-slate-950/90 dark:text-zinc-100',
        )}
      >
        {children}
      </div>
    </div>
  )
}
