import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { CalendarDays, MapPin, Monitor, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { ButtonLink } from '@/components/ui/ButtonLink'

const FORMAT_META = {
  'in-person': { label: 'In person', Icon: MapPin },
  zoom: { label: 'Zoom', Icon: Monitor },
}

/**
 * @param {{
 *   open: boolean
 *   onClose: () => void
 *   meeting: {
 *     value: string
 *     title: string
 *     tagline: string
 *     schedule: string
 *     cadence: string
 *     location: string
 *     format: 'in-person' | 'zoom'
 *     image: string
 *     imageAlt: string
 *     description: string
 *     highlights?: string[]
 *   } | null
 * }} props
 */
export function MeetingDetailsModal({ open, onClose, meeting }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open || !meeting) return null

  const format = FORMAT_META[meeting.format] ?? FORMAT_META['in-person']
  const FormatIcon = format.Icon
  const joinHref = `/join-us?meeting=${encodeURIComponent(meeting.value)}`

  const modal = (
    <div
      className="fixed inset-0 z-70 flex items-end justify-center overflow-y-auto bg-zinc-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="meeting-details-title"
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'flex w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-zinc-800/80 bg-zinc-950 text-zinc-100 shadow-2xl',
          'my-0 min-h-[min(100%,28rem)] max-h-[94dvh] sm:my-6 sm:min-h-[min(100%,36rem)] sm:max-h-[90dvh] sm:rounded-2xl',
        )}
      >
        <div className="relative min-h-[16rem] shrink-0 sm:min-h-[18rem] md:min-h-[20rem]">
          <img
            src={meeting.image}
            alt={meeting.imageAlt}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-zinc-950/10"
            aria-hidden
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70 sm:right-4 sm:top-4"
            aria-label="Close details"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
              <FormatIcon className="h-3.5 w-3.5" aria-hidden />
              {format.label}
            </span>
            <p className="mt-3 text-xs font-medium uppercase tracking-[0.25em] text-zinc-400">
              {meeting.cadence}
            </p>
            <h2
              id="meeting-details-title"
              className="mt-1 font-display text-2xl tracking-tight text-white sm:text-3xl"
            >
              {meeting.title}
            </h2>
            <p className="mt-1 text-sm font-medium text-zinc-300">{meeting.tagline}</p>
          </div>
        </div>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          <ul className="space-y-2.5 text-sm text-zinc-300">
            <li className="flex gap-2.5">
              <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" aria-hidden />
              <span>{meeting.schedule}</span>
            </li>
            <li className="flex gap-2.5">
              <FormatIcon className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" aria-hidden />
              <span>{meeting.location}</span>
            </li>
          </ul>

          {meeting.description ? (
            <p className="text-sm leading-relaxed text-zinc-400 sm:text-base">{meeting.description}</p>
          ) : null}

          {meeting.highlights?.length > 0 ? (
            <ul className="space-y-2 border-t border-zinc-800/80 pt-4 text-sm text-zinc-300">
              {meeting.highlights.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="shrink-0 border-t border-zinc-800/80 px-4 py-4 sm:px-6 sm:py-5">
          <ButtonLink
            href={joinHref}
            variant="hero"
            className="w-full shadow-none sm:w-auto sm:min-w-[14rem]"
          >
            Sign up to attend
          </ButtonLink>
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
