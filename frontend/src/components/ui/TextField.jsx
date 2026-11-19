import { cn } from '@/lib/cn'

const controlClass = cn(
  'w-full rounded-xl border border-slate-200/90 bg-white/90 text-sm text-slate-900 shadow-inner shadow-slate-200/20 outline-none transition',
  'placeholder:text-slate-400',
  'focus:border-sky-300 focus:ring-2 focus:ring-sky-200/50',
  'dark:border-white/12 dark:bg-zinc-950/80 dark:text-zinc-100 dark:placeholder:text-zinc-500',
  'dark:shadow-none dark:focus:border-sky-500/50 dark:focus:ring-sky-500/20',
)

const defaultLabelClass =
  'text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-zinc-400'

export function TextField({
  id,
  label,
  type = 'text',
  className = '',
  labelClassName = defaultLabelClass,
  inputClassName = '',
  error,
  ...inputProps
}) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label htmlFor={id} className={labelClassName}>
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={cn(
          controlClass,
          'px-3.5 py-2.5',
          error && 'border-rose-300 focus:border-rose-400 focus:ring-rose-200/50',
          inputClassName,
        )}
        {...inputProps}
      />
      {error && (
        <p className="text-xs text-rose-600 dark:text-rose-400" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

/**
 * @param {Omit<import('react').TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> & { inputClassName?: string }} rest
 */
export function TextAreaField({
  id,
  label,
  className = '',
  labelClassName = defaultLabelClass,
  inputClassName = '',
  error,
  rows = 4,
  ...rest
}) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label htmlFor={id} className={labelClassName}>
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        className={cn(
          controlClass,
          'min-h-24 resize-y px-3.5 py-2.5',
          error && 'border-rose-300 focus:border-rose-400 focus:ring-rose-200/50',
          inputClassName,
        )}
        {...rest}
      />
      {error && (
        <p className="text-xs text-rose-600 dark:text-rose-400" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
