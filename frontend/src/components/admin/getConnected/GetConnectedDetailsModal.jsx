import { Button } from '@/components/ui/Button'
import { formatUpcomingMeetings } from '@/lib/upcomingMeetings'

const CHURCH_STATUS_OPTIONS = [
  { value: 'no-church', label: "I don't have a church" },
  { value: 'not-frequent', label: "I have a church but don't attend frequently" },
  { value: 'started', label: 'Just started going to church' },
  { value: 'committed', label: 'Fully committed to a church' },
]

/** Formats API date strings (e.g. YYYY-MM-DD or ISO) for display. */
function formatDateOfBirth(value) {
  if (value == null || value === '') return '—'
  const d = value instanceof Date ? value : new Date(String(value))
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function GetConnectedDetailsModal({
  row,
  open,
  onClose,
  onDelete,
  isDeleting = false,
  categoryLabel,
}) {
  if (!open || !row) return null

  return (
    <div
      className="fixed inset-0 z-90 flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-[2px]"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex max-h-[88dvh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-900/20 dark:border-white/10 dark:bg-zinc-900"
        role="dialog"
        aria-modal="true"
        aria-labelledby="submission-detail-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-200/80 p-5 dark:border-white/10">
          <div>
            <h3 id="submission-detail-title" className="text-lg font-semibold text-slate-900 dark:text-zinc-100">
              Submission details
            </h3>
            <p className="text-sm text-slate-500 dark:text-zinc-500">
              {row.full_name} · {row.email}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-500/10 dark:hover:text-rose-300"
              onClick={() => onDelete?.(row)}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting…' : 'Delete'}
            </Button>
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>

        <div className="overflow-y-auto p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <Detail label="Full name" value={row.full_name} />
            <Detail label="Age" value={row.age} />
            <Detail label="Date of birth" value={formatDateOfBirth(row.date_of_birth)} />
            <Detail label="Location" value={row.location} />
            <Detail label="Phone" value={row.phone} />
            <Detail label="Email" value={row.email} />
            <Detail
              label="Category"
              value={categoryLabel ?? (row.category ? String(row.category) : '—')}
            />
            <Detail label="Instagram" value={row.instagram_handle || '—'} />
            <Detail label="Occupation" value={row.occupation || '—'} />
            <Detail label="Student?" value={row.is_student || '—'} />
            <Detail label="School" value={row.school_name || '—'} />
            <Detail label="Program" value={row.program || '—'} />
            <Detail label="Year of study" value={row.year_of_study || '—'} />
            <Detail
              label="Church status"
              value={CHURCH_STATUS_OPTIONS.find((o) => o.value === row.church_status)?.label ?? '—'}
            />
            <Detail label="Accepted Jesus" value={row.accepted_jesus === 'yes' ? 'Yes' : 'No'} />
            <Detail
              className="sm:col-span-2"
              label="Interests"
              value={Array.isArray(row.interests) && row.interests.length ? row.interests.join(', ') : '—'}
            />
            <Detail
              className="sm:col-span-2"
              label="Upcoming meetings"
              value={formatUpcomingMeetings(row.upcoming_meetings)}
            />
            <Detail className="sm:col-span-2" label="Talents / Gifts" value={row.talents || '—'} />
            <Detail className="sm:col-span-2" label="Extra notes" value={row.extra_notes || '—'} />
            <Detail className="sm:col-span-2" label="Prayer requests" value={row.prayer_requests || '—'} />
          </div>
        </div>
      </div>
    </div>
  )
}

function Detail({ label, value, className = '' }) {
  return (
    <div className={`rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 dark:border-white/10 dark:bg-zinc-950/50 ${className}`}>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-500">{label}</p>
      <p className="mt-1 whitespace-pre-wrap text-sm text-slate-800 dark:text-zinc-200">{value}</p>
    </div>
  )
}

