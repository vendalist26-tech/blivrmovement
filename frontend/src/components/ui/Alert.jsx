import { cn } from '@/lib/cn'

const variants = {
  error: cn(
    'border-rose-200/90 bg-rose-50/90 text-rose-900',
    'dark:border-rose-500/30 dark:bg-rose-950/50 dark:text-rose-100',
  ),
  success: cn(
    'border-emerald-200/90 bg-emerald-50/90 text-emerald-900',
    'dark:border-emerald-500/25 dark:bg-emerald-950/50 dark:text-emerald-100',
  ),
  info: cn(
    'border-slate-200/90 bg-slate-50/90 text-slate-700',
    'dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-200',
  ),
}

export function Alert({ variant = 'info', className = '', children, title, ...rest }) {
  return (
    <div
      className={cn(
        'rounded-2xl border p-3.5 text-sm leading-relaxed shadow-sm',
        'backdrop-blur-sm',
        variants[variant] ?? variants.info,
        className,
      )}
      {...rest}
    >
      {title && <p className="mb-1 font-medium">{title}</p>}
      {children}
    </div>
  )
}
