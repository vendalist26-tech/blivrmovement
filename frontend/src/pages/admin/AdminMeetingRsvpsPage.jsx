import { useMemo, useState } from 'react'
import { Eye, Trash2 } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteMeetingRsvp, fetchAdminMeetingRsvps } from '@/api/client'
import { AdminPageShell } from '@/components/admin/AdminPageShell'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { DataTable } from '@/components/ui/DataTable'
import { Spinner } from '@/components/ui/Spinner'
import { TextField } from '@/components/ui/TextField'
import { useToast } from '@/components/ui/Toast'

function formatSubmittedAt(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'

  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function formatResponseEntries(responses) {
  if (!responses || typeof responses !== 'object') return []
  return Object.entries(responses).map(([key, value]) => ({
    key,
    value: String(value ?? ''),
  }))
}

function RsvpDetailModal({ row, onClose }) {
  if (!row) return null
  const entries = formatResponseEntries(row.responses)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-white/10 dark:bg-zinc-900 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-xl text-slate-900 dark:text-zinc-50">{row.meeting_title}</h2>
        <p className="mt-1 text-sm text-slate-500">{formatSubmittedAt(row.created_at)}</p>
        <dl className="mt-4 space-y-3">
          {entries.map(({ key, value }) => (
            <div key={key} className="rounded-lg border border-slate-200/80 px-3 py-2.5 dark:border-white/10">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{key}</dt>
              <dd className="mt-1 break-words text-sm text-slate-900 dark:text-zinc-100">{value}</dd>
            </div>
          ))}
        </dl>
        <Button type="button" variant="secondary" className="mt-5 w-full" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  )
}

export function AdminMeetingRsvpsPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [q, setQ] = useState('')
  const [activeRow, setActiveRow] = useState(null)

  const queryParams = useMemo(
    () => ({
      q: q.trim() || undefined,
      per_page: 100,
    }),
    [q],
  )

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['meeting-rsvps', 'admin', queryParams],
    queryFn: () => fetchAdminMeetingRsvps(queryParams),
  })

  const remove = useMutation({
    mutationFn: (id) => deleteMeetingRsvp(id),
    onSuccess: () => {
      toast.success({ title: 'RSVP deleted' })
      queryClient.invalidateQueries({ queryKey: ['meeting-rsvps'] })
    },
    onError: (err) => {
      toast.error({
        title: 'Delete failed',
        description: err?.response?.data?.message || err?.message,
      })
    },
  })

  const rows = data?.data ?? []

  const columns = [
    {
      key: 'meeting_title',
      label: 'Meeting',
      render: (row) => (
        <span className="font-medium text-slate-900 dark:text-zinc-100">{row.meeting_title}</span>
      ),
    },
    {
      key: 'created_at',
      label: 'Submitted',
      sortable: true,
      render: (row) => (
        <span className="whitespace-nowrap text-slate-600 dark:text-zinc-400">
          {formatSubmittedAt(row.created_at)}
        </span>
      ),
    },
    {
      key: 'preview',
      label: 'Responses',
      render: (row) => {
        const entries = formatResponseEntries(row.responses).slice(0, 2)
        return (
          <span className="line-clamp-2 text-slate-600 dark:text-zinc-400">
            {entries.map((e) => `${e.key}: ${e.value}`).join(' · ') || '—'}
          </span>
        )
      },
    },
    {
      key: 'actions',
      label: '',
      className: 'w-28',
      render: (row) => (
        <div className="flex justify-end gap-1">
          <Button type="button" variant="ghost" size="sm" onClick={() => setActiveRow(row)} aria-label="View">
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={remove.isPending}
            onClick={() => remove.mutate(row.id)}
            aria-label="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <AdminPageShell
      title="Meeting RSVPs"
      description="All featured-meeting RSVP submissions. Responses update automatically when you change the form fields in Upcoming meetings."
    >
      <Card className="space-y-4 p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <TextField
            label="Search"
            className="flex-1"
            placeholder="Name, email, meeting…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Button type="button" variant="secondary" onClick={() => refetch()} className="shrink-0">
            Refresh
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-2 text-slate-500">
            <Spinner />
            <span className="text-sm">Loading submissions…</span>
          </div>
        ) : null}

        {isError ? (
          <Alert variant="error">
            {error?.response?.data?.message || error?.message || 'Could not load RSVPs.'}
          </Alert>
        ) : null}

        {!isLoading && !isError && rows.length === 0 ? (
          <p className="text-sm text-slate-500">No RSVPs yet.</p>
        ) : null}

        {!isLoading && rows.length > 0 ? (
          <>
            <div className="hidden md:block">
              <DataTable columns={columns} rows={rows} emptyText="No RSVPs yet." />
            </div>

            <ul className="space-y-3 md:hidden">
              {rows.map((row) => (
                <li
                  key={row.id}
                  className="rounded-xl border border-slate-200/90 p-4 dark:border-white/10"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 dark:text-zinc-100">{row.meeting_title}</p>
                      <p className="mt-0.5 text-sm text-slate-500">{formatSubmittedAt(row.created_at)}</p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button type="button" variant="ghost" size="sm" onClick={() => setActiveRow(row)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={remove.isPending}
                        onClick={() => remove.mutate(row.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <dl className="mt-3 space-y-2">
                    {formatResponseEntries(row.responses).map(({ key, value }) => (
                      <div key={key}>
                        <dt className="text-[0.65rem] font-medium uppercase tracking-wide text-slate-500">
                          {key}
                        </dt>
                        <dd className="mt-0.5 break-words text-sm text-slate-800 dark:text-zinc-200">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </Card>

      <RsvpDetailModal row={activeRow} onClose={() => setActiveRow(null)} />
    </AdminPageShell>
  )
}
