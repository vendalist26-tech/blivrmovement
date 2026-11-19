import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, MapPin, Monitor } from 'lucide-react'
import { Reveal } from '@/components/home/Reveal'
import { HomeSectionPanel } from '@/components/home/HomeSectionPanel'
import { SectionDivider } from '@/components/home/SectionDivider'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { cn } from '@/lib/cn'

const AUTO_ADVANCE_MS = 6000

function subscribeReducedMotion(callback) {
  if (typeof window === 'undefined') return () => {}
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  mq.addEventListener('change', callback)
  return () => mq.removeEventListener('change', callback)
}

function getReducedMotionSnapshot() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function formatLabel(format) {
  return format === 'zoom' ? 'Zoom' : 'In person'
}

function FormatIcon({ format }) {
  const Icon = format === 'zoom' ? Monitor : MapPin
  return <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
}

function MeetingSlide({ meeting, isActive }) {
  return (
    <Link
      to="/upcoming-meetings"
      className={cn(
        'group relative flex h-full snap-center flex-col overflow-hidden rounded-md border bg-black/20',
        'transition-[border-color,transform] duration-500 ease-out',
        isActive ? 'border-white/35' : 'border-white/10 hover:border-white/25',
      )}
      aria-label={`${meeting.title} — view upcoming meetings`}
    >
      <SlideFigure meeting={meeting} />
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.22em] text-zinc-500 sm:text-xs">
          {meeting.cadence}
        </p>
        <h3 className="mt-1.5 font-display text-xl leading-tight text-white sm:text-2xl">{meeting.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{meeting.tagline}</p>
        <ul className="mt-auto space-y-1.5 pt-4 text-xs text-zinc-400 sm:text-sm">
          <li className="flex items-start gap-2">
            <CalendarDays className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-500" aria-hidden />
            <span className="line-clamp-2">{meeting.schedule}</span>
          </li>
          <li className="flex items-start gap-2">
            <FormatIcon format={meeting.format} />
            <span className="line-clamp-2">{meeting.location}</span>
          </li>
        </ul>
        <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-zinc-300 transition group-hover:text-white">
          View details
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}

function SlideFigure({ meeting }) {
  return (
    <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[5/3]">
      <img
        src={meeting.image}
        alt={meeting.imageAlt}
        className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
        loading="lazy"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/25 to-transparent"
        aria-hidden
      />
      <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/25 bg-black/55 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-white backdrop-blur-sm sm:left-4 sm:top-4 sm:text-xs">
        <FormatIcon format={meeting.format} />
        {formatLabel(meeting.format)}
      </span>
      {meeting.featured ? (
        <span className="absolute right-3 top-3 rounded-full border border-white/25 bg-black/55 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-wide text-white backdrop-blur-sm sm:right-4 sm:top-4 sm:text-xs">
          Featured
        </span>
      ) : null}
    </div>
  )
}

/**
 * @param {{ meetings?: object[], page?: Record<string, string> }} props
 */
export function UpcomingMeetingsSection({ meetings = [], page = {} }) {
  const scrollRef = useRef(null)
  const pauseAutoRef = useRef(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false,
  )

  const scrollToIndex = useCallback((index) => {
    const el = scrollRef.current
    if (!el) return
    const child = el.children[index]
    if (!child || !(child instanceof HTMLElement)) return
    const offset = child.offsetLeft - (el.clientWidth - child.clientWidth) / 2
    el.scrollTo({ left: Math.max(0, offset), behavior: reducedMotion ? 'auto' : 'smooth' })
    setActiveIndex(index)
  }, [reducedMotion])

  const goNext = useCallback(() => {
    if (!meetings.length) return
    scrollToIndex((activeIndex + 1) % meetings.length)
  }, [activeIndex, meetings.length, scrollToIndex])

  const goPrev = useCallback(() => {
    if (!meetings.length) return
    scrollToIndex((activeIndex - 1 + meetings.length) % meetings.length)
  }, [activeIndex, meetings.length, scrollToIndex])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const onScroll = () => {
      const children = Array.from(el.children).filter((c) => c instanceof HTMLElement)
      if (children.length === 0) return
      const center = el.scrollLeft + el.clientWidth / 2
      let closest = 0
      let minDist = Infinity
      children.forEach((child, i) => {
        const childCenter = child.offsetLeft + child.offsetWidth / 2
        const dist = Math.abs(center - childCenter)
        if (dist < minDist) {
          minDist = dist
          closest = i
        }
      })
      setActiveIndex(closest)
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    const id = window.setInterval(() => {
      if (pauseAutoRef.current) return
      goNext()
    }, AUTO_ADVANCE_MS)
    return () => window.clearInterval(id)
  }, [goNext, reducedMotion])

  const pauseAuto = () => {
    pauseAutoRef.current = true
  }

  const resumeAuto = () => {
    pauseAutoRef.current = false
  }

  if (!meetings.length) return null

  return (
    <section id="upcoming-meetings" className="scroll-mt-20 sm:scroll-mt-24">
      <Reveal delay={65}>
        <HomeSectionPanel className="shadow-none">
          <SectionHeading
            title={page.carouselTitle || 'Upcoming Meetings'}
            subtitle={
              page.carouselSubtitle ||
              "What's on the calendar—pop-ups, weekly rhythms, and prayer calls. Swipe or use the arrows to browse."
            }
            subtitleClass="text-zinc-400"
          />
          <SectionDivider />

          <div
            className="mt-6 sm:mt-7"
            onMouseEnter={pauseAuto}
            onMouseLeave={resumeAuto}
            onFocusCapture={pauseAuto}
            onBlurCapture={resumeAuto}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-xs font-medium tabular-nums text-zinc-500">
                {String(activeIndex + 1).padStart(2, '0')}{' '}
                <span className="text-zinc-600">/</span> {String(meetings.length).padStart(2, '0')}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goPrev}
                  className={carouselNavButtonClass}
                  aria-label="Previous meeting"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className={carouselNavButtonClass}
                  aria-label="Next meeting"
                >
                  <ChevronRight className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </div>

            <div
              ref={scrollRef}
              className={cn(
                'flex gap-4 overflow-x-auto overscroll-x-contain pb-1',
                'snap-x snap-mandatory scroll-smooth',
                '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
              )}
            >
              {meetings.map((meeting, index) => (
                <article
                  key={meeting.value}
                  className={cn(
                    'w-[min(88vw,22rem)] shrink-0 snap-center sm:w-[min(42vw,24rem)] lg:w-[min(32vw,26rem)]',
                    index === 0 && 'scroll-ml-0',
                  )}
                >
                  <MeetingSlide meeting={meeting} isActive={index === activeIndex} />
                </article>
              ))}
            </div>

            <DotRow meetings={meetings} activeIndex={activeIndex} scrollToIndex={scrollToIndex} />
          </div>

          <div className="mt-8 flex flex-col items-center gap-4 border-t border-white/10 pt-6 sm:flex-row sm:justify-between">
            <p className="max-w-md text-center text-sm text-zinc-400 sm:text-left">
              See full descriptions, times, and what to expect for every gathering.
            </p>
            <ButtonLink
              href="/upcoming-meetings"
              variant="hero"
              className="w-full shadow-none sm:w-auto sm:min-w-48"
            >
              View all meetings
            </ButtonLink>
          </div>
        </HomeSectionPanel>
      </Reveal>
    </section>
  )
}

const carouselNavButtonClass = cn(
  'flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-zinc-200',
  'transition hover:border-white/40 hover:bg-white/10 hover:text-white',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950',
)

function DotRow({ meetings, activeIndex, scrollToIndex }) {
  return (
    <div className="mt-5 flex justify-center gap-2" role="tablist" aria-label="Meeting slides">
      {meetings.map((meeting, index) => (
        <button
          key={meeting.value}
          type="button"
          role="tab"
          aria-selected={index === activeIndex}
          aria-label={`Go to ${meeting.title}`}
          onClick={() => scrollToIndex(index)}
          className={cn(
            'h-1.5 rounded-full transition-all duration-300',
            index === activeIndex ? 'w-8 bg-white' : 'w-1.5 bg-white/25 hover:bg-white/45',
          )}
        />
      ))}
    </div>
  )
}
