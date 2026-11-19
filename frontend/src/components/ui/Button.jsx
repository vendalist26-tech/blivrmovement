import { cn } from '@/lib/cn'

const variantStyles = {
  primary: cn(
    'bg-slate-900 text-white shadow-sm shadow-slate-900/10',
    'ring-1 ring-slate-900/5 hover:bg-slate-800',
    'dark:bg-white dark:text-slate-900 dark:shadow-lg dark:shadow-black/20 dark:ring-white/20 dark:hover:bg-zinc-100',
  ),
  secondary: cn(
    'border border-slate-200/90 bg-white/90 text-slate-800 shadow-sm shadow-slate-200/40',
    'hover:border-slate-300 hover:bg-white',
    'dark:border-white/15 dark:bg-zinc-900/50 dark:text-zinc-100 dark:shadow-none dark:hover:bg-zinc-800/60',
  ),
  ghost: cn(
    'text-slate-600 hover:bg-slate-100/90 hover:text-slate-900',
    'dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-zinc-50',
  ),
  brandPrimary: 'bg-zinc-100 text-black shadow-sm hover:bg-white',
  brandSecondary:
    'border border-white/30 bg-white/5 text-zinc-100 hover:border-white/50 hover:bg-white/10',
}

const sizeStyles = {
  sm: 'gap-1.5 px-3.5 py-1.5 text-xs font-medium',
  md: 'gap-2 px-5 py-2.5 text-sm font-medium',
  lg: 'gap-2 px-6 py-3 text-sm font-medium',
}

export function Button({
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center rounded-2xl font-sans transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50',
        'active:scale-[0.98]',
        variantStyles[variant] ?? variantStyles.primary,
        sizeStyles[size] ?? sizeStyles.md,
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
