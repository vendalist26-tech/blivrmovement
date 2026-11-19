import { cn } from '@/lib/cn'

/**
 * Standard page title + description for admin sub-pages.
 * @param {import('react').ReactNode} [description]
 */
export function AdminPageShell({
  title,
  description,
  children,
  className = '',
}) {
  return (
    <div className={cn('space-y-6', className)}>
      <div>
        <h1 className="font-display text-2xl font-medium tracking-tight text-slate-900 dark:text-zinc-50 sm:text-3xl">
          {title}
        </h1>
        {description != null && description !== false && (
          <div className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
            {description}
          </div>
        )}
      </div>
      {children}
    </div>
  )
}
