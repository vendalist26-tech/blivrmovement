import { CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

/**
 * Reusable light success modal.
 */
export function SuccessModal({
  open,
  title = 'Success',
  message = 'Done successfully.',
  onClose,
  continueLabel = 'Continue',
  homeHref = '/',
  homeLabel = 'Back Home',
}) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/35 px-4 backdrop-blur-[2px]"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="gc-success-modal w-full max-w-md rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xl shadow-slate-900/20"
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-modal-title"
        aria-describedby="success-modal-desc"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-200/70">
          <CheckCircle2 className="h-7 w-7 text-emerald-600" aria-hidden />
        </div>
        <h2 id="success-modal-title" className="mt-4 text-center font-display text-3xl text-slate-900">
          {title}
        </h2>
        <p id="success-modal-desc" className="mt-2 text-center text-sm leading-relaxed text-slate-600">
          {message}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button type="button" variant="primary" onClick={onClose}>
            {continueLabel}
          </Button>
          <Link
            to={homeHref}
            className={cn(
              'inline-flex items-center rounded-2xl border border-slate-200/90 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50',
            )}
            onClick={onClose}
          >
            {homeLabel}
          </Link>
        </div>
      </div>
    </div>
  )
}

