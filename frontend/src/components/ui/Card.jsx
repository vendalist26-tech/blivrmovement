import { cn } from '@/lib/cn'

export function Card({ as: Comp = 'div', className = '', children, ...rest }) {
  return (
    <Comp
      className={cn(
        'rounded-2xl border border-slate-200/80 bg-white/80 shadow-sm shadow-slate-200/30 backdrop-blur-sm',
        'dark:border-white/10 dark:bg-zinc-900/45 dark:shadow-lg dark:shadow-black/20',
        className,
      )}
      {...rest}
    >
      {children}
    </Comp>
  )
}

export function CardHeader({ className = '', children }) {
  return <div className={cn('space-y-1.5 p-6 pb-0', className)}>{children}</div>
}

export function CardContent({ className = '', children }) {
  return <div className={cn('p-6 pt-4', className)}>{children}</div>
}
