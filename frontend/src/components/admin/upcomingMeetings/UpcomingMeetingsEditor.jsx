/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { fetchAdminUpcomingMeetings, updateAdminUpcomingMeetings } from '@/api/client'
import { AdminTabs } from '@/components/admin/AdminTabs'
import { MeetingImageUpload } from '@/components/admin/upcomingMeetings/MeetingImageUpload'
import { FeaturedRsvpEditor } from '@/components/admin/upcomingMeetings/FeaturedRsvpEditor'
import { TextField, TextAreaField } from '@/components/ui/TextField'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { Alert } from '@/components/ui/Alert'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/cn'
import { DEFAULT_RSVP_CONFIG, normalizeRsvpConfig } from '@/lib/featuredMeetingRsvp'
import {
  DEFAULT_UPCOMING_MEETING_STATS,
  normalizeUpcomingMeetingStats,
} from '@/lib/upcomingMeetingStats'

const TAB_PAGE = 'page'
const TAB_STATS = 'stats'
const TAB_RSVP = 'rsvp'
const TAB_MEETINGS = 'meetings'

const EMPTY_PAGE = {
  metaTitle: '',
  heroEyebrow: '',
  heroTitle: '',
  heroDescription: '',
  homepageSectionVisible: true,
  carouselTitle: '',
  carouselSubtitle: '',
  listEyebrow: '',
  listTitle: '',
  listSubtitle: '',
  ctaEyebrow: '',
  ctaTitle: '',
  ctaBody: '',
  statsSectionVisible: true,
  stats: DEFAULT_UPCOMING_MEETING_STATS.map((s) => ({ ...s })),
  rsvp: normalizeRsvpConfig(DEFAULT_RSVP_CONFIG),
}

function formatLoadError(err) {
  return err?.response?.data?.message || err?.message || 'Could not load upcoming meetings.'
}

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function emptyMeeting(sortOrder = 0) {
  return {
    value: '',
    title: '',
    tagline: '',
    schedule: '',
    cadence: '',
    location: '',
    format: 'in-person',
    imagePath: '',
    imageUrl: '',
    imageAlt: '',
    description: '',
    highlights: [''],
    featured: false,
    isActive: true,
    sortOrder,
  }
}

function mapFromApi(meeting) {
  return {
    value: meeting.value ?? '',
    title: meeting.title ?? '',
    tagline: meeting.tagline ?? '',
    schedule: meeting.schedule ?? '',
    cadence: meeting.cadence ?? '',
    location: meeting.location ?? '',
    format: meeting.format === 'zoom' ? 'zoom' : 'in-person',
    imagePath: meeting.imagePath ?? '',
    imageUrl: meeting.imageUrl ?? '',
    imageAlt: meeting.imageAlt ?? '',
    description: meeting.description ?? '',
    highlights: meeting.highlights?.length ? [...meeting.highlights] : [''],
    featured: Boolean(meeting.featured),
    isActive: meeting.isActive !== false,
    sortOrder: meeting.sortOrder ?? 0,
  }
}

export function UpcomingMeetingsEditor() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['upcoming-meetings', 'admin'],
    queryFn: fetchAdminUpcomingMeetings,
  })

  const [page, setPage] = useState(EMPTY_PAGE)
  const [meetings, setMeetings] = useState([emptyMeeting()])
  const [activeTab, setActiveTab] = useState(TAB_PAGE)
  const [activeMeetingIndex, setActiveMeetingIndex] = useState(0)

  useEffect(() => {
    if (!data) return
    setPage({
      ...EMPTY_PAGE,
      ...data.page,
      stats: normalizeUpcomingMeetingStats(data.page?.stats),
      statsSectionVisible: data.page?.statsSectionVisible !== false,
      homepageSectionVisible: data.page?.homepageSectionVisible !== false,
      rsvp: normalizeRsvpConfig(data.page?.rsvp),
    })
    setMeetings(
      data.meetings?.length
        ? data.meetings.map(mapFromApi)
        : [emptyMeeting()],
    )
    setActiveMeetingIndex(0)
  }, [data])

  const save = useMutation({
    mutationFn: () =>
      updateAdminUpcomingMeetings({
        page: {
          ...page,
          stats: normalizeUpcomingMeetingStats(page.stats),
          statsSectionVisible: page.statsSectionVisible !== false,
          homepageSectionVisible: page.homepageSectionVisible !== false,
          rsvp: normalizeRsvpConfig(page.rsvp),
        },
        meetings: meetings.map((m, index) => ({
          value: m.value.trim(),
          title: m.title.trim(),
          tagline: m.tagline.trim() || null,
          schedule: m.schedule.trim(),
          cadence: m.cadence.trim() || null,
          location: m.location.trim(),
          format: m.format,
          imagePath: m.imagePath || null,
          imageAlt: m.imageAlt.trim() || null,
          description: m.description.trim(),
          highlights: m.highlights.map((h) => h.trim()).filter(Boolean),
          featured: m.featured,
          isActive: m.isActive,
          sortOrder: index,
        })),
      }),
    onSuccess: () => {
      toast.success({ title: 'Upcoming meetings saved' })
      queryClient.invalidateQueries({ queryKey: ['upcoming-meetings'] })
      queryClient.invalidateQueries({ queryKey: ['site'] })
    },
    onError: (err) => {
      toast.error({
        title: 'Save failed',
        description: err?.response?.data?.message || err?.message || 'Could not save.',
      })
    },
  })

  const setMeeting = (index, patch) => {
    setMeetings((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)))
  }

  const setFeatured = (index) => {
    setMeetings((prev) => prev.map((row, i) => ({ ...row, featured: i === index })))
  }

  const moveMeeting = (index, direction) => {
    setMeetings((prev) => {
      const next = [...prev]
      const target = index + direction
      if (target < 0 || target >= next.length) return prev
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
    setActiveMeetingIndex((current) => {
      const target = index + direction
      if (current === index) return target
      if (current === target) return index
      return current
    })
  }

  const addMeeting = () => {
    setMeetings((prev) => {
      const next = [...prev, emptyMeeting(prev.length)]
      setActiveMeetingIndex(next.length - 1)
      setActiveTab(TAB_MEETINGS)
      return next
    })
  }

  const removeMeeting = (index) => {
    setMeetings((prev) => {
      if (prev.length <= 1) return prev
      const next = prev.filter((_, i) => i !== index)
      setActiveMeetingIndex((current) => Math.min(current, next.length - 1))
      return next
    })
  }

  const featuredCount = meetings.filter((m) => m.featured).length
  const tabs = useMemo(
    () => [
      { id: TAB_PAGE, label: 'Page copy' },
      { id: TAB_STATS, label: 'Stat cards' },
      { id: TAB_RSVP, label: 'RSVP form' },
      { id: TAB_MEETINGS, label: 'Meetings', badge: meetings.length },
    ],
    [meetings.length],
  )

  const activeMeeting = meetings[activeMeetingIndex] ?? meetings[0]

  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-slate-200/90 px-4 py-4 dark:border-white/10 sm:px-6">
        <p className="text-sm text-slate-600 dark:text-zinc-400">
          Edit page copy, stat cards, RSVP settings, and individual meetings. Changes apply after you save.
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 px-4 py-8 text-slate-500 sm:px-6">
          <Spinner />
          <span>Loading…</span>
        </div>
      )}

      {isError && (
        <Alert variant="error" className="mx-4 mt-4 sm:mx-6" role="alert">
          {formatLoadError(error)}{' '}
          {error?.response?.status === 401 ? (
            <Link to="/admin/login" className="font-medium underline">
              Sign in
            </Link>
          ) : (
            <button type="button" className="font-medium underline" onClick={() => refetch()}>
              Retry
            </button>
          )}
        </Alert>
      )}

      {!isLoading && !isError && (
        <>
          <div className="px-4 sm:px-6">
            <AdminTabs tabs={tabs} activeId={activeTab} onChange={setActiveTab}>
              {activeTab === TAB_PAGE && <PageSettingsPanel page={page} setPage={setPage} />}

              {activeTab === TAB_STATS && <StatsSettingsPanel page={page} setPage={setPage} />}

              {activeTab === TAB_RSVP && (
                <div className="space-y-4">
                  <p className="text-sm text-slate-600 dark:text-zinc-400">
                    Configure the RSVP button on the featured meeting and which fields appear in the modal.
                  </p>
                  <FeaturedRsvpEditor
                    rsvp={page.rsvp}
                    onChange={(rsvp) => setPage((prev) => ({ ...prev, rsvp }))}
                  />
                </div>
              )}

              {activeTab === TAB_MEETINGS && (
                <MeetingsTab
                  meetings={meetings}
                  activeIndex={activeMeetingIndex}
                  onSelect={setActiveMeetingIndex}
                  onAdd={addMeeting}
                  featuredCount={featuredCount}
                >
                  {activeMeeting ? (
                    <MeetingEditorForm
                      row={activeMeeting}
                      index={activeMeetingIndex}
                      total={meetings.length}
                      onPatch={(patch) => setMeeting(activeMeetingIndex, patch)}
                      onFeatured={() => setFeatured(activeMeetingIndex)}
                      onMoveUp={() => moveMeeting(activeMeetingIndex, -1)}
                      onMoveDown={() => moveMeeting(activeMeetingIndex, 1)}
                      onRemove={() => removeMeeting(activeMeetingIndex)}
                    />
                  ) : null}
                </MeetingsTab>
              )}
            </AdminTabs>
          </div>

          <div
            className={cn(
              'sticky bottom-0 z-10 mt-6 flex flex-col gap-3 border-t border-slate-200/90 bg-white/95 px-4 py-4 backdrop-blur-sm',
              'dark:border-white/10 dark:bg-zinc-950/95 sm:flex-row sm:items-center sm:justify-between sm:px-6',
            )}
          >
            <Link
              to="/upcoming-meetings"
              target="_blank"
              rel="noopener noreferrer"
              className="text-center text-xs font-medium text-slate-600 underline-offset-2 hover:underline dark:text-zinc-400 sm:text-left"
            >
              Preview public page →
            </Link>
            <Button
              type="button"
              className="w-full sm:w-auto sm:min-w-36"
              disabled={save.isPending}
              onClick={() => save.mutate()}
            >
              {save.isPending ? 'Saving…' : 'Save all'}
            </Button>
          </div>
        </>
      )}
    </Card>
  )
}

function PanelIntro({ title, children }) {
  return (
    <div className="space-y-4">
      {title ? (
        <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">{title}</h3>
      ) : null}
      {children}
    </div>
  )
}

function StatsSettingsPanel({ page, setPage }) {
  const stats = normalizeUpcomingMeetingStats(page.stats)

  const setStat = (id, patch) => {
    setPage((p) => ({
      ...p,
      stats: normalizeUpcomingMeetingStats(
        (p.stats ?? stats).map((row) => (row.id === id ? { ...row, ...patch } : row)),
      ),
    }))
  }

  return (
    <PanelIntro title="Summary stat cards">
      <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-zinc-300">
        <input
          type="checkbox"
          checked={page.statsSectionVisible !== false}
          onChange={(e) => setPage((p) => ({ ...p, statsSectionVisible: e.target.checked }))}
        />
        Show stat cards on the meetings page
      </label>
      <p className="text-xs text-slate-500 dark:text-zinc-500">
        Counts update automatically from published meetings. Edit labels and suffixes; hide cards with the toggle.
      </p>
      <ul className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <li
            key={stat.id}
            className="rounded-xl border border-slate-200/90 p-4 dark:border-white/10"
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium capitalize text-slate-900 dark:text-zinc-100">
                {stat.id.replace('-', ' ')}
              </p>
              <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-zinc-300">
                <input
                  type="checkbox"
                  checked={stat.visible}
                  onChange={(e) => setStat(stat.id, { visible: e.target.checked })}
                />
                Show
              </label>
            </div>
            <div className="grid gap-3">
              <TextField
                label="Label"
                value={stat.label}
                onChange={(e) => setStat(stat.id, { label: e.target.value })}
              />
              <TextField
                label="Count suffix"
                value={stat.suffix}
                onChange={(e) => setStat(stat.id, { suffix: e.target.value })}
                placeholder="e.g. gatherings"
              />
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-zinc-300">
                  Count from
                </label>
                <select
                  className={cn(
                    'w-full rounded-lg border border-slate-200/90 bg-white px-3 py-2 text-sm',
                    'dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100',
                  )}
                  value={stat.countType}
                  onChange={(e) => setStat(stat.id, { countType: e.target.value })}
                >
                  <option value="total">All meetings</option>
                  <option value="in-person">In-person only</option>
                  <option value="online">Online only</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-zinc-300">Icon</label>
                <select
                  className={cn(
                    'w-full rounded-lg border border-slate-200/90 bg-white px-3 py-2 text-sm',
                    'dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100',
                  )}
                  value={stat.icon}
                  onChange={(e) => setStat(stat.id, { icon: e.target.value })}
                >
                  <option value="calendar">Calendar</option>
                  <option value="users">People</option>
                </select>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </PanelIntro>
  )
}

function PageSettingsPanel({ page, setPage }) {
  const set = (key, value) => setPage((p) => ({ ...p, [key]: value }))
  return (
    <PanelIntro title="Page & carousel copy">
      <div className="rounded-xl border border-slate-200/90 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-zinc-950/40">
        <label className="flex items-start gap-3 text-sm text-slate-700 dark:text-zinc-300">
          <input
            type="checkbox"
            className="mt-0.5"
            checked={page.homepageSectionVisible !== false}
            onChange={(e) => setPage((p) => ({ ...p, homepageSectionVisible: e.target.checked }))}
          />
          <span>
            <span className="font-medium text-slate-900 dark:text-zinc-100">Show on homepage</span>
            <span className="mt-1 block text-slate-500 dark:text-zinc-500">
              Displays the upcoming meetings carousel between Mission and Growth. The full list stays
              on /upcoming-meetings.
            </span>
          </span>
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Browser title" value={page.metaTitle} onChange={(e) => set('metaTitle', e.target.value)} />
        <TextField label="Hero eyebrow" value={page.heroEyebrow} onChange={(e) => set('heroEyebrow', e.target.value)} />
        <TextField label="Hero title" value={page.heroTitle} onChange={(e) => set('heroTitle', e.target.value)} />
        <TextField
          label="Carousel title (homepage)"
          value={page.carouselTitle}
          onChange={(e) => set('carouselTitle', e.target.value)}
        />
        <TextAreaField
          className="sm:col-span-2"
          label="Hero description"
          rows={3}
          value={page.heroDescription}
          onChange={(e) => set('heroDescription', e.target.value)}
        />
        <TextAreaField
          className="sm:col-span-2"
          label="Carousel subtitle (homepage)"
          rows={2}
          value={page.carouselSubtitle}
          onChange={(e) => set('carouselSubtitle', e.target.value)}
        />
        <TextField label="List eyebrow" value={page.listEyebrow} onChange={(e) => set('listEyebrow', e.target.value)} />
        <TextField label="List title" value={page.listTitle} onChange={(e) => set('listTitle', e.target.value)} />
        <TextAreaField
          className="sm:col-span-2"
          label="List subtitle"
          rows={2}
          value={page.listSubtitle}
          onChange={(e) => set('listSubtitle', e.target.value)}
        />
        <TextField label="CTA eyebrow" value={page.ctaEyebrow} onChange={(e) => set('ctaEyebrow', e.target.value)} />
        <TextField label="CTA title" value={page.ctaTitle} onChange={(e) => set('ctaTitle', e.target.value)} />
        <TextAreaField
          className="sm:col-span-2"
          label="CTA body"
          rows={2}
          value={page.ctaBody}
          onChange={(e) => set('ctaBody', e.target.value)}
        />
      </div>
    </PanelIntro>
  )
}

/**
 * @param {{
 *   meetings: object[]
 *   activeIndex: number
 *   onSelect: (i: number) => void
 *   onAdd: () => void
 *   featuredCount: number
 *   children: import('react').ReactNode
 * }} props
 */
function MeetingsTab({ meetings, activeIndex, onSelect, onAdd, featuredCount, children }) {
  return (
    <div className="space-y-4 lg:grid lg:grid-cols-[minmax(0,14rem)_1fr] lg:gap-6 xl:grid-cols-[minmax(0,16rem)_1fr]">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            Select meeting
          </p>
          <Button type="button" variant="secondary" size="sm" onClick={onAdd}>
            Add
          </Button>
        </div>
        {featuredCount === 0 ? (
          <p className="text-xs text-amber-700 dark:text-amber-400">No featured meeting — pick one below.</p>
        ) : null}
        <div
          className="flex gap-2 overflow-x-auto overscroll-x-contain pb-1 lg:max-h-[min(32rem,70vh)] lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:pr-1"
          role="tablist"
          aria-label="Meetings"
        >
          {meetings.map((row, index) => {
            const active = index === activeIndex
            return (
              <button
                key={`${row.value}-${index}`}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onSelect(index)}
                className={cn(
                  'shrink-0 rounded-xl border px-3 py-2.5 text-left text-sm transition lg:w-full',
                  active
                    ? 'border-slate-900 bg-slate-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                    : 'border-slate-200/90 bg-white text-slate-800 hover:border-slate-300 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-200',
                )}
              >
                <span className="block font-medium line-clamp-2">
                  {row.title || `Meeting ${index + 1}`}
                </span>
                <span
                  className={cn(
                    'mt-1 flex flex-wrap gap-1.5 text-[0.65rem] uppercase tracking-wide',
                    active ? 'text-white/80 dark:text-zinc-700' : 'text-slate-500',
                  )}
                >
                  {row.featured ? <span>Featured</span> : null}
                  {!row.isActive ? <span>Draft</span> : null}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div
        className="min-w-0 rounded-xl border border-slate-200/90 p-4 dark:border-white/10 sm:p-5"
        role="tabpanel"
      >
        {children}
      </div>
    </div>
  )
}

function MeetingEditorForm({ row, index, total, onPatch, onFeatured, onMoveUp, onMoveDown, onRemove }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="secondary" size="sm" disabled={index === 0} onClick={onMoveUp}>
          Move up
        </Button>
        <Button type="button" variant="secondary" size="sm" disabled={index >= total - 1} onClick={onMoveDown}>
          Move down
        </Button>
        <Button type="button" variant="secondary" size="sm" disabled={total <= 1} onClick={onRemove}>
          Remove
        </Button>
        <label className="ml-auto flex items-center gap-2 text-sm text-slate-700 dark:text-zinc-300">
          <input type="radio" name="featured-meeting" checked={row.featured} onChange={onFeatured} />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-zinc-300">
          <input
            type="checkbox"
            checked={row.isActive}
            onChange={(e) => onPatch({ isActive: e.target.checked })}
          />
          Published
        </label>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <MeetingImageUpload
          imagePath={row.imagePath}
          imageUrl={row.imageUrl}
          imageAlt={row.imageAlt}
          onImagePathChange={(imagePath) => onPatch({ imagePath })}
          onImageUrlChange={(imageUrl) => onPatch({ imageUrl })}
          onImageAltChange={(imageAlt) => onPatch({ imageAlt })}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField
            label="Title"
            value={row.title}
            onChange={(e) => {
              const title = e.target.value
              const patch = { title }
              if (!row.value || row.value === slugify(row.title)) {
                patch.value = slugify(title)
              }
              onPatch(patch)
            }}
          />
          <TextField
            label="Slug (form value)"
            value={row.value}
            onChange={(e) => onPatch({ value: slugify(e.target.value) })}
          />
          <TextField
            className="sm:col-span-2"
            label="Tagline"
            value={row.tagline}
            onChange={(e) => onPatch({ tagline: e.target.value })}
          />
          <TextField
            className="sm:col-span-2"
            label="Schedule"
            value={row.schedule}
            onChange={(e) => onPatch({ schedule: e.target.value })}
          />
          <TextField label="Cadence" value={row.cadence} onChange={(e) => onPatch({ cadence: e.target.value })} />
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-zinc-300">Format</label>
            <select
              className={cn(
                'w-full rounded-lg border border-slate-200/90 bg-white px-3 py-2 text-sm',
                'dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100',
              )}
              value={row.format}
              onChange={(e) => onPatch({ format: e.target.value })}
            >
              <option value="in-person">In person</option>
              <option value="zoom">Zoom</option>
            </select>
          </div>
          <TextField
            className="sm:col-span-2"
            label="Location"
            value={row.location}
            onChange={(e) => onPatch({ location: e.target.value })}
          />
          <TextAreaField
            className="sm:col-span-2"
            label="Description"
            rows={4}
            value={row.description}
            onChange={(e) => onPatch({ description: e.target.value })}
          />
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-slate-700 dark:text-zinc-300">Highlights</p>
        <ul className="space-y-2">
          {row.highlights.map((line, hi) => (
            <li key={hi} className="flex gap-2">
              <TextField
                className="flex-1"
                label={`Highlight ${hi + 1}`}
                value={line}
                onChange={(e) => {
                  const highlights = [...row.highlights]
                  highlights[hi] = e.target.value
                  onPatch({ highlights })
                }}
              />
              <Button
                type="button"
                variant="secondary"
                className="mt-6 shrink-0"
                onClick={() => onPatch({ highlights: row.highlights.filter((_, i) => i !== hi) })}
              >
                ×
              </Button>
            </li>
          ))}
        </ul>
        <Button
          type="button"
          variant="secondary"
          className="mt-2"
          onClick={() => onPatch({ highlights: [...row.highlights, ''] })}
        >
          Add highlight
        </Button>
      </div>
    </div>
  )
}
