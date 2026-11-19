import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { cn } from '@/lib/cn'

const ToastContext = createContext(null)

const variantStyles = {
  success: 'border-emerald-200/80 bg-emerald-50/95 text-emerald-900 dark:border-emerald-500/25 dark:bg-emerald-950/60 dark:text-emerald-100',
  error: 'border-rose-200/80 bg-rose-50/95 text-rose-900 dark:border-rose-500/30 dark:bg-rose-950/60 dark:text-rose-100',
  info: 'border-slate-200/80 bg-white/95 text-slate-800 dark:border-white/10 dark:bg-zinc-900/95 dark:text-zinc-100',
}

const variantIcons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
}

function normalizeToast(input) {
  if (typeof input === 'string') {
    return { title: input }
  }
  return input ?? {}
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timeoutsRef = useRef(new Map())

  const removeToast = useCallback((id) => {
    const timeoutId = timeoutsRef.current.get(id)
    if (timeoutId) {
      window.clearTimeout(timeoutId)
      timeoutsRef.current.delete(id)
    }
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const pushToast = useCallback(
    (input) => {
      const toast = normalizeToast(input)
      const id = crypto.randomUUID()
      const duration = Math.max(1200, Number(toast.duration ?? 3200))
      const nextToast = {
        id,
        variant: toast.variant ?? 'info',
        title: toast.title ?? '',
        description: toast.description ?? '',
      }

      setToasts((prev) => [...prev, nextToast])

      const timeoutId = window.setTimeout(() => {
        removeToast(id)
      }, duration)
      timeoutsRef.current.set(id, timeoutId)
    },
    [removeToast],
  )

  const contextValue = useMemo(
    () => ({
      pushToast,
      success: (input) => pushToast({ ...normalizeToast(input), variant: 'success' }),
      error: (input) => pushToast({ ...normalizeToast(input), variant: 'error' }),
      info: (input) => pushToast({ ...normalizeToast(input), variant: 'info' }),
      removeToast,
    }),
    [pushToast, removeToast],
  )

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-3 z-120 flex flex-col gap-2 px-3 sm:inset-x-auto sm:right-4 sm:top-4 sm:w-[min(92vw,26rem)] sm:px-0">
        {toasts.map((toast) => {
          const Icon = variantIcons[toast.variant] ?? Info
          return (
            <div
              key={toast.id}
              className={cn(
                'pointer-events-auto rounded-2xl border p-3.5 shadow-xl backdrop-blur',
                'animate-[gc-success-pop_220ms_ease-out]',
                variantStyles[toast.variant] ?? variantStyles.info,
              )}
              role="status"
              aria-live="polite"
            >
              <div className="flex items-start gap-2.5">
                <Icon className="mt-0.5 h-4.5 w-4.5 shrink-0" aria-hidden />
                <div className="min-w-0 flex-1">
                  {toast.title ? <p className="text-sm font-semibold leading-tight">{toast.title}</p> : null}
                  {toast.description ? (
                    <p className="mt-1 text-xs leading-relaxed opacity-90">{toast.description}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  aria-label="Dismiss notification"
                  className="rounded-md p-1 text-current/70 transition hover:bg-black/5 hover:text-current dark:hover:bg-white/10"
                >
                  <X className="h-3.5 w-3.5" aria-hidden />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider.')
  }

  return { toast: context }
}
