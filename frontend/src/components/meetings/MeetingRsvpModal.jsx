import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { CalendarDays, CheckCircle2, MapPin, Monitor, X } from 'lucide-react'
import { submitMeetingRsvp } from '@/api/client'
import { cn } from '@/lib/cn'
import { formatRsvpFieldLabel, visibleRsvpFields } from '@/lib/featuredMeetingRsvp'
import {
  RSVP_FIELD_LABEL_CLASS,
  RSVP_FIELD_WRAPPER_CLASS,
  rsvpInputMode,
  rsvpInputType,
  sanitizeRsvpInputValue,
} from '@/lib/rsvpFieldInput'
import { Button } from '@/components/ui/Button'
import { TextField, TextAreaField } from '@/components/ui/TextField'

const FORMAT_META = {
  'in-person': { label: 'In person', Icon: MapPin },
  zoom: { label: 'Zoom', Icon: Monitor },
}

function emptyFieldValues(fields) {
  const initial = {}
  for (const field of fields) {
    initial[field.id] = ''
  }
  return initial
}

/**
 * @param {{
 *   open: boolean
 *   onClose: () => void
 *   meeting: object | null
 *   rsvpConfig: object
 * }} props
 */
export function MeetingRsvpModal({ open, onClose, meeting, rsvpConfig }) {
  const fields = useMemo(() => visibleRsvpFields(rsvpConfig), [rsvpConfig])
  const dialogKey = meeting ? `${meeting.value}-${fields.map((f) => f.id).join(',')}` : 'closed'

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open || !meeting) return null

  return createPortal(
    <MeetingRsvpDialog
      key={dialogKey}
      meeting={meeting}
      rsvpConfig={rsvpConfig}
      fields={fields}
      onClose={onClose}
    />,
    document.body,
  )
}

/**
 * @param {{
 *   meeting: object
 *   rsvpConfig: object
 *   fields: import('@/lib/featuredMeetingRsvp').RsvpField[]
 *   onClose: () => void
 * }} props
 */
function MeetingRsvpDialog({ meeting, rsvpConfig, fields, onClose }) {
  const [values, setValues] = useState(() => emptyFieldValues(fields))
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [success, setSuccess] = useState(null)

  const format = FORMAT_META[meeting.format] ?? FORMAT_META['in-person']
  const FormatIcon = format.Icon

  const setFieldValue = (field, raw) => {
    const value = sanitizeRsvpInputValue(field, raw)
    setValues((prev) => ({ ...prev, [field.id]: value }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setStatus('saving')
    setErrors({})
    try {
      const result = await submitMeetingRsvp({ responses: values })
      setSuccess({
        title: result?.successTitle || rsvpConfig?.successTitle || 'You are on the list!',
        message:
          result?.successMessage ||
          rsvpConfig?.successMessage ||
          'Thanks for RSVPing. We will be in touch soon.',
      })
      setStatus('success')
    } catch (err) {
      const apiErrors = err?.response?.data?.errors ?? {}
      const next = {}
      for (const [key, msgs] of Object.entries(apiErrors)) {
        const id = key.replace(/^responses\./, '')
        next[id] = Array.isArray(msgs) ? msgs[0] : String(msgs)
      }
      setErrors(next)
      setStatus('idle')
    }
  }

  return (
    <div
      className="fixed inset-0 z-70 flex items-end justify-center overflow-y-auto bg-zinc-950/65 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={status === 'saving' ? undefined : onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="rsvp-modal-title"
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'flex w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-zinc-800/80 bg-zinc-950 text-zinc-100 shadow-2xl',
          'my-0 max-h-[92dvh] sm:my-6 sm:max-h-[88dvh] sm:rounded-2xl',
        )}
      >
        <div className="relative h-32 shrink-0 overflow-hidden sm:h-40">
          <img src={meeting.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/20"
            aria-hidden
          />
          <button
            type="button"
            onClick={onClose}
            disabled={status === 'saving'}
            className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70 sm:h-9 sm:w-9"
            aria-label="Close RSVP"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.25em] text-zinc-400 sm:text-xs">
              {rsvpConfig?.modalEyebrow || 'Featured gathering'}
            </p>
            <h2 id="rsvp-modal-title" className="mt-1 font-display text-xl text-white sm:text-2xl">
              {rsvpConfig?.modalTitle || 'Reserve your spot'}
            </h2>
            <p className="mt-1 line-clamp-2 text-sm text-zinc-300">{meeting.title}</p>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 sm:py-6">
          {status === 'success' && success ? (
            <div className="flex flex-col items-center px-2 py-6 text-center sm:py-8">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="h-7 w-7" aria-hidden />
              </span>
              <h3 className="mt-4 font-display text-2xl text-white">{success.title}</h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-400">{success.message}</p>
              <Button type="button" variant="primary" className="mt-6 w-full sm:w-auto" onClick={onClose}>
                Done
              </Button>
            </div>
          ) : (
            <>
              {rsvpConfig?.modalSubtitle ? (
                <p className="text-sm leading-relaxed text-zinc-400">{rsvpConfig.modalSubtitle}</p>
              ) : null}

              <ul className="mt-4 space-y-2.5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 px-3.5 py-3.5 text-sm text-zinc-300">
                <li className="flex gap-2.5">
                  <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" aria-hidden />
                  <span className="min-w-0 break-words">{meeting.schedule}</span>
                </li>
                <li className="flex gap-2.5">
                  <FormatIcon className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" aria-hidden />
                  <span className="min-w-0 break-words">{meeting.location}</span>
                </li>
              </ul>

              <form onSubmit={submit} className="mt-5 space-y-5 sm:mt-6 sm:space-y-5">
                {fields.map((field) => (
                  <RsvpFormField
                    key={field.id}
                    field={field}
                    values={values}
                    errors={errors}
                    onFieldChange={setFieldValue}
                  />
                ))}

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-3.5 text-base sm:py-3"
                  disabled={status === 'saving'}
                >
                  {status === 'saving' ? 'Submitting…' : rsvpConfig?.submitLabel || 'Submit RSVP'}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * @param {{
 *   field: import('@/lib/featuredMeetingRsvp').RsvpField
 *   values: Record<string, string>
 *   errors: Record<string, string>
 *   onFieldChange: (field: import('@/lib/featuredMeetingRsvp').RsvpField, raw: string) => void
 * }} props
 */
function RsvpFormField({ field, values, errors, onFieldChange }) {
  const label = formatRsvpFieldLabel(field)
  const value = values[field.id] ?? ''
  const error = errors[field.id]
  const onChange = (e) => onFieldChange(field, e.target.value)

  if (field.type === 'textarea') {
    return (
      <TextAreaField
        id={`rsvp-${field.id}`}
        className={RSVP_FIELD_WRAPPER_CLASS}
        labelClassName={RSVP_FIELD_LABEL_CLASS}
        label={label}
        rows={3}
        placeholder={field.placeholder}
        value={value}
        onChange={onChange}
        error={error}
      />
    )
  }

  return (
    <TextField
      id={`rsvp-${field.id}`}
      className={RSVP_FIELD_WRAPPER_CLASS}
      labelClassName={RSVP_FIELD_LABEL_CLASS}
      label={label}
      type={rsvpInputType(field)}
      inputMode={rsvpInputMode(field)}
      autoComplete={field.id === 'email' ? 'email' : field.id === 'full_name' ? 'name' : undefined}
      placeholder={field.placeholder}
      value={value}
      onChange={onChange}
      error={error}
      inputClassName={cn(
        field.type === 'number' &&
          '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
      )}
    />
  )
}
