import { cn } from '@/lib/cn'

export function CodeSnippet({ children, className = '' }) {
  return (
    <code
      className={cn(
        'rounded-md bg-slate-200/80 px-1.5 py-0.5 font-mono text-xs text-slate-800',
        'dark:bg-sky-500/10 dark:text-sky-200/95',
        className,
      )}
    >
      {children}
    </code>
  )
}
