import { CalendarDays, ChevronRight, MapPin, Monitor } from 'lucide-react'
import { cn } from '@/lib/cn'

const FORMAT_META = {
  'in-person': {
    label: 'In person',
    Icon: MapPin,
  },
  zoom: {
    label: 'Zoom',
    Icon: Monitor,
  },
}

/**
 * @param {{
 *   meeting: {
 *     value?: string
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
 *   }
 *   featured?: boolean
 *   compact?: boolean
 *   onViewDetails?: (meeting: object) => void
 *   onRsvp?: (meeting: object) => void
 *   rsvpLabel?: string
 *   showRsvp?: boolean
 *   className?: string
 * }} props
 */
export function MeetingCard({
  meeting,
  featured = false,
  compact = false,
  onViewDetails,
  onRsvp,
  rsvpLabel = 'RSVP',
  showRsvp = false,
  className = '',
}) {
  const format = FORMAT_META[meeting.format] ?? FORMAT_META['in-person']
  const FormatIcon = format.Icon
  const showFullDetails = !compact

  return (
    <article
      className={cn(
        'group overflow-hidden rounded-md border border-zinc-800/50 bg-zinc-950 text-zinc-100',
        featured && 'lg:grid lg:grid-cols-2 lg:items-stretch lg:min-h-[34rem] xl:min-h-[38rem]',
        className,
      )}
    >
      <MeetingCardFigure featured={featured} meeting={meeting} format={format} FormatIcon={FormatIcon} />

      <div
        className={cn(
          'flex flex-col p-5 sm:p-6',
          featured && 'lg:justify-center lg:p-10 lg:pl-10',
          compact && 'flex-1',
        )}
      >
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-500">{meeting.cadence}</p>
        <h2
          className={cn(
            'mt-2 font-display tracking-tight text-white',
            featured ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl',
          )}
        >
          {meeting.title}
        </h2>
        <p className="mt-1 text-sm font-medium text-zinc-400">{meeting.tagline}</p>

        <ul className="mt-4 space-y-2 text-sm text-zinc-400">
          <li className="flex gap-2.5">
            <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" aria-hidden />
            <span>{meeting.schedule}</span>
          </li>
          <li className="flex gap-2.5">
            <FormatIcon className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" aria-hidden />
            <span>{meeting.location}</span>
          </li>
        </ul>

        {showFullDetails ? (
          <>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">{meeting.description}</p>

            {meeting.highlights?.length > 0 ? (
              <ul className="mt-4 space-y-2 border-t border-zinc-800/80 pt-4 text-sm text-zinc-300">
                {meeting.highlights.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            {showRsvp && onRsvp ? (
              <button
                type="button"
                onClick={() => onRsvp(meeting)}
                className={cn(
                  'mt-5 inline-flex w-auto self-start items-center justify-center rounded-full border border-white/30 bg-white px-5 py-2.5',
                  'text-sm font-semibold text-zinc-950 transition',
                  'hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950',
                )}
              >
                {rsvpLabel}
              </button>
            ) : null}
          </>
        ) : (
          <button
            type="button"
            onClick={() => onViewDetails?.(meeting)}
            className={cn(
              'mt-5 inline-flex w-auto self-start items-center justify-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2.5 sm:px-5',
              'text-sm font-medium text-zinc-100 transition',
              'hover:border-zinc-500 hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950',
            )}
          >
            View details
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        )}
      </div>
    </article>
  )
}

function MeetingCardFigure({ featured, meeting, format, FormatIcon }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden',
        featured
          ? 'min-h-[20rem] sm:min-h-[22rem] lg:min-h-[34rem] lg:h-full xl:min-h-[38rem]'
          : 'aspect-[16/10] sm:aspect-[5/3]',
      )}
    >
      <img
        src={meeting.image}
        alt={meeting.imageAlt}
        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        loading="lazy"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"
        aria-hidden
      />
      <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-2 p-4 sm:p-5">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
          <FormatIcon className="h-3.5 w-3.5" aria-hidden />
          {format.label}
        </span>
        {featured ? (
          <span className="inline-flex items-center rounded-full border border-white/25 bg-black/60 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white backdrop-blur-sm">
            Featured
          </span>
        ) : null}
      </div>
    </div>
  )
}
