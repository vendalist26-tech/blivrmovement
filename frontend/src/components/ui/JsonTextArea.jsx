import { forwardRef } from 'react'
import { cn } from '@/lib/cn'

export const JsonTextArea = forwardRef(function JsonTextArea(
  { className = '', 'aria-label': ariaLabel = 'JSON content', ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      aria-label={ariaLabel}
      spellCheck="false"
      className={cn(
        'h-[min(70vh,560px)] w-full rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 font-mono text-xs',
        'text-slate-800 shadow-inner shadow-slate-200/30 outline-none transition',
        'placeholder:text-slate-400',
        'focus:border-sky-200 focus:ring-2 focus:ring-sky-100',
        'dark:border-white/10 dark:bg-zinc-950/90 dark:text-zinc-200',
        'dark:shadow-none dark:focus:border-sky-500/30 dark:focus:ring-sky-500/10',
        'sm:text-sm',
        className,
      )}
      {...rest}
    />
  )
})
