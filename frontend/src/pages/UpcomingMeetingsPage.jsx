import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/cn'
import { Link } from 'react-router-dom'
import { ArrowLeft, CalendarRange, Users } from 'lucide-react'
import { Reveal } from '@/components/home/Reveal'
import { HomeSectionPanel } from '@/components/home/HomeSectionPanel'
import { MeetingCard } from '@/components/meetings/MeetingCard'
import { MeetingDetailsModal } from '@/components/meetings/MeetingDetailsModal'
import { MeetingRsvpModal } from '@/components/meetings/MeetingRsvpModal'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { BrandLoadingScreen } from '@/components/ui/BrandLoadingScreen'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { useUpcomingMeetings } from '@/hooks/useUpcomingMeetings'
import { visibleUpcomingMeetingStats } from '@/lib/upcomingMeetingStats'

const STAT_ICONS = {
  calendar: CalendarRange,
  users: Users,
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <li className="flex items-center gap-3 rounded-md border border-zinc-800/50 bg-zinc-950 px-4 py-3.5 text-zinc-100">
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white text-zinc-950">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</p>
        <p className="font-display text-lg text-white">{value}</p>
      </div>
    </li>
  )
}

export function UpcomingMeetingsPage() {
  const [detailMeeting, setDetailMeeting] = useState(null)
  const [rsvpMeeting, setRsvpMeeting] = useState(null)
  const { data, isLoading, isError, refetch } = useUpcomingMeetings()
  const page = data?.page ?? {}
  const meetings = data?.meetings ?? []
  const rsvp = data?.rsvp

  const { featured, rest } = useMemo(() => {
    const featuredMeeting = meetings.find((m) => m.featured)
    const others = meetings.filter((m) => !m.featured)
    return { featured: featuredMeeting, rest: others }
  }, [meetings])

  const showFeaturedRsvp = Boolean(
    featured && rsvp?.enabled && (rsvp?.fields?.some((f) => f.visible) ?? false),
  )

  const statCounts = useMemo(() => {
    const inPerson = meetings.filter((m) => m.format === 'in-person').length
    return {
      total: meetings.length,
      inPerson,
      online: meetings.length - inPerson,
    }
  }, [meetings])

  const visibleStats = useMemo(
    () => visibleUpcomingMeetingStats(page, statCounts),
    [page, statCounts],
  )

  useEffect(() => {
    if (page.metaTitle) {
      document.title = page.metaTitle
    }
  }, [page.metaTitle])

  if (isLoading) {
    return <BrandLoadingScreen />
  }

  if (isError) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-white px-6 text-center">
        <p className="text-zinc-600">We could not load upcoming meetings.</p>
        <Button type="button" variant="primary" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white text-zinc-950">
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-6 sm:px-6 sm:pt-7 lg:px-8 lg:pt-8">
        <Reveal delay={0}>
          <Link
            to="/"
            className="mb-5 inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-800 transition hover:border-zinc-400 hover:bg-zinc-50 hover:text-zinc-950"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to home
          </Link>
        </Reveal>

        <Reveal delay={30}>
          <HomeSectionPanel className="relative shadow-none">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">
                  {page.heroEyebrow || 'Gather with us'}
                </p>
                <h1 className="mt-2 font-display text-4xl text-white sm:text-5xl lg:text-6xl">
                  {page.heroTitle || 'Upcoming Meetings'}
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
                  {page.heroDescription}
                </p>
              </div>
              <img
                src="/blvr-logo.jpeg"
                alt=""
                className="hidden h-16 w-16 rounded-md border border-white/15 object-cover sm:block lg:h-20 lg:w-20"
                aria-hidden
              />
            </div>
          </HomeSectionPanel>
        </Reveal>

        {meetings.length > 0 ? (
          <>
            {visibleStats.length > 0 ? (
              <Reveal delay={60}>
                <ul
                  className={cn(
                    'mt-6 grid gap-3 sm:mt-8',
                    visibleStats.length === 1 && 'sm:grid-cols-1',
                    visibleStats.length === 2 && 'sm:grid-cols-2',
                    visibleStats.length >= 3 && 'sm:grid-cols-3',
                  )}
                >
                  {visibleStats.map((stat) => {
                    const Icon = STAT_ICONS[stat.icon] ?? Users
                    return (
                      <StatCard key={stat.id} icon={Icon} label={stat.label} value={stat.value} />
                    )
                  })}
                </ul>
              </Reveal>
            ) : null}

            {featured ? (
              <Reveal delay={90}>
                <MeetingCard
                  meeting={featured}
                  featured
                  className="mt-8 sm:mt-10"
                  showRsvp={showFeaturedRsvp}
                  rsvpLabel={rsvp?.buttonLabel || 'RSVP'}
                  onRsvp={setRsvpMeeting}
                />
              </Reveal>
            ) : null}

            <Reveal delay={120}>
              <div className="mt-10 sm:mt-12">
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">
                  {page.listEyebrow || 'All gatherings'}
                </p>
                <h2 className="mt-2 font-display text-2xl text-zinc-950 sm:text-3xl md:text-4xl">
                  {page.listTitle || 'Pick what fits your week'}
                </h2>
                <p className="mt-2 max-w-2xl text-pretty text-sm text-zinc-600 sm:text-base">
                  {page.listSubtitle}
                </p>
              </div>
            </Reveal>

            <div className="mt-6 grid gap-6 sm:mt-8 sm:gap-8 lg:grid-cols-2">
              {rest.map((meeting, index) => (
                <Reveal key={meeting.value} delay={140 + index * 40}>
                  <MeetingCard
                    meeting={meeting}
                    className="h-full"
                    compact
                    onViewDetails={setDetailMeeting}
                  />
                </Reveal>
              ))}
            </div>
          </>
        ) : (
          <Alert variant="info" className="mt-8">
            No meetings are published yet. Check back soon.
          </Alert>
        )}

        <Reveal delay={200}>
          <HomeSectionPanel className="mt-12 text-center shadow-none sm:mt-14">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-500">
              {page.ctaEyebrow || 'Next step'}
            </p>
            <h2 className="mt-2 font-display text-2xl text-white sm:text-3xl">
              {page.ctaTitle || 'Ready to join a gathering?'}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400 sm:text-base">{page.ctaBody}</p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink href="/join-us" variant="hero" className="shadow-none sm:min-w-48">
                Sign up to attend
              </ButtonLink>
              <ButtonLink href="/" variant="heroSecondary" className="shadow-none sm:min-w-48">
                Back to home
              </ButtonLink>
            </div>
          </HomeSectionPanel>
        </Reveal>
      </main>

      <MeetingDetailsModal
        open={Boolean(detailMeeting)}
        meeting={detailMeeting}
        onClose={() => setDetailMeeting(null)}
      />

      <MeetingRsvpModal
        open={Boolean(rsvpMeeting)}
        meeting={rsvpMeeting}
        rsvpConfig={rsvp}
        onClose={() => setRsvpMeeting(null)}
      />
    </div>
  )
}
