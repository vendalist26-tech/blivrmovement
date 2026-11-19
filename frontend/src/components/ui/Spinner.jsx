import { cn } from '@/lib/cn'

export function Spinner({ className = '' }) {
  return (
    <span
      className={cn(
        'inline-block h-4 w-4 animate-spin rounded-full border-2',
        'border-slate-200 border-t-slate-600',
        'dark:border-white/15 dark:border-t-zinc-200',
        className,
      )}
      aria-hidden
    />
  )
}
