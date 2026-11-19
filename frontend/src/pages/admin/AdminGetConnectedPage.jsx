import { useCallback, useMemo, useState } from 'react'
import { Eye, Trash2 } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  deleteAdminGetConnected,
  fetchAdminGetConnected,
  fetchAdminGetConnectedSettings,
} from '@/api/client'
import { TextLink } from '@/components/ui/TextLink'
import { AdminPageShell } from '@/components/admin/AdminPageShell'
import { Alert } from '@/components/ui/Alert'
import { Spinner } from '@/components/ui/Spinner'
import { TextField } from '@/components/ui/TextField'
import { SelectSearch } from '@/components/ui/SelectSearch'
import { CustomDatePicker } from '@/components/ui/CustomDatePicker'
import { DataTable } from '@/components/ui/DataTable'
import { Button } from '@/components/ui/Button'
import { GetConnectedDetailsModal } from '@/components/admin/getConnected/GetConnectedDetailsModal'
import { useToast } from '@/components/ui/Toast'

const CHURCH_STATUS_OPTIONS = [
  { value: 'no-church', label: "I don't have a church" },
  { value: 'not-frequent', label: "I have a church but don't attend frequently" },
  { value: 'started', label: 'Just started going to church' },
  { value: 'committed', label: 'Fully committed to a church' },
]

const YES_NO_OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
]

export function AdminGetConnectedPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [q, setQ] = useState('')
  const [churchStatus, setChurchStatus] = useState('')
  const [acceptedJesus, setAcceptedJesus] = useState('')
  const [submittedOn, setSubmittedOn] = useState('')
  const [category, setCategory] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortDir, setSortDir] = useState('desc')
  const [activeRow, setActiveRow] = useState(null)

  const queryParams = useMemo(
    () => ({
      q: q || undefined,
      church_status: churchStatus || undefined,
      category: category || undefined,
      accepted_jesus: acceptedJesus || undefined,
      submitted_on: submittedOn || undefined,
      sort_by: sortBy,
      sort_dir: sortDir,
      per_page: 100,
    }),
    [acceptedJesus, category, churchStatus, q, sortBy, sortDir, submittedOn],
  )

  const { data: gcSettings } = useQuery({
    queryKey: ['get-connected-settings'],
    queryFn: fetchAdminGetConnectedSettings,
  })

  const categoryOptionsForTable = useMemo(
    () => (gcSettings?.categories ?? []).map((c) => ({ value: c.value, label: c.label })),
    [gcSettings?.categories],
  )

  const labelForCategory = useCallback(
    (value) => {
      if (value == null || value === '') return '—'
      return categoryOptionsForTable.find((c) => c.value === value)?.label ?? value
    },
    [categoryOptionsForTable],
  )

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['get-connected', queryParams],
    queryFn: () => fetchAdminGetConnected(queryParams),
  })
  const deleteMutation = useMutation({
    mutationFn: (row) => deleteAdminGetConnected(row.id),
    onSuccess: (_, row) => {
      if (activeRow?.id === row.id) {
        setActiveRow(null)
      }
      toast.success({
        title: 'Submission deleted',
        description: `${row.full_name} was removed successfully.`,
      })
      queryClient.invalidateQueries({ queryKey: ['get-connected'] })
    },
    onError: (err) => {
      toast.error({
        title: 'Delete failed',
        description: err?.response?.data?.message || err?.message || 'Failed to delete submission.',
      })
    },
  })

  const handleDelete = useCallback((row) => {
    if (!row?.id) return
    const confirmed = window.confirm(`Delete submission from ${row.full_name}? This cannot be undone.`)
    if (!confirmed) return
    deleteMutation.mutate(row)
  }, [deleteMutation])

  const rows = data?.data ?? []
  const meta = data?.meta

  const columns = useMemo(
    () => [
      {
        key: 'full_name',
        label: 'Name',
        sortable: true,
        render: (row) => (
          <div>
            <p className="font-medium text-slate-900 dark:text-zinc-100">{row.full_name}</p>
            <p className="text-xs text-slate-500 dark:text-zinc-500">{row.email}</p>
          </div>
        ),
      },
      { key: 'age', label: 'Age', sortable: true },
      { key: 'location', label: 'Location', sortable: true },
      {
        key: 'category',
        label: 'Category',
        sortable: true,
        render: (row) => labelForCategory(row.category),
      },
      { key: 'occupation', label: 'Occupation', sortable: true },
      {
        key: 'church_status',
        label: 'Church Status',
        sortable: true,
        render: (row) =>
          CHURCH_STATUS_OPTIONS.find((o) => o.value === row.church_status)?.label ?? '—',
      },
      {
        key: 'accepted_jesus',
        label: 'Accepted Jesus',
        sortable: true,
        render: (row) => (row.accepted_jesus === 'yes' ? 'Yes' : 'No'),
      },
      {
        key: 'created_at',
        label: 'Submitted',
        sortable: true,
        render: (row) =>
          new Date(row.created_at).toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
      },
      {
        key: 'actions',
        label: 'Action',
        render: (row) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setActiveRow(row)}
              aria-label="View details"
              title="View details"
              className="px-2.5"
            >
              <Eye className="h-4.5 w-4.5" aria-hidden />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(row)}
              aria-label="Delete submission"
              title="Delete submission"
              className="px-2.5 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-500/10 dark:hover:text-rose-300"
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="h-4.5 w-4.5" aria-hidden />
            </Button>
          </div>
        ),
      },
    ],
    [deleteMutation.isPending, handleDelete, labelForCategory],
  )

  const onSort = (key) => {
    if (sortBy === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
      return
    }
    setSortBy(key)
    setSortDir('asc')
  }

  return (
    <AdminPageShell
      title="Join Us Submissions"
      description={
        <>
          Form submissions from the public Join Us page.{' '}
          <TextLink to="/admin/get-connected/categories" className="text-sm">
            Manage categories
          </TextLink>
        </>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <TextField
          label="Search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Name, email, location..."
        />
        <SelectSearch
          label="Category"
          options={categoryOptionsForTable}
          value={category}
          onChange={(v) => setCategory(v)}
          placeholder="All"
        />
        <SelectSearch
          label="Church status"
          options={CHURCH_STATUS_OPTIONS}
          value={churchStatus}
          onChange={(v) => setChurchStatus(v)}
          placeholder="All"
        />
        <SelectSearch
          label="Accepted Jesus"
          options={YES_NO_OPTIONS}
          value={acceptedJesus}
          onChange={(v) => setAcceptedJesus(v)}
          placeholder="All"
        />
        <CustomDatePicker
          label="Submitted on"
          value={submittedOn}
          onChange={(v) => setSubmittedOn(v)}
          placeholder="Any date"
        />
      </div>

      <div className="flex items-center gap-2 pt-1">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => {
            setQ('')
            setChurchStatus('')
            setCategory('')
            setAcceptedJesus('')
            setSubmittedOn('')
            setSortBy('created_at')
            setSortDir('desc')
          }}
        >
          Clear filters
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-500">
          <Spinner />
          <span>Loading submissions…</span>
        </div>
      )}
      {isError && (
        <Alert variant="error" role="alert">
          {error?.message || 'Failed to load submissions'}{' '}
          <button type="button" onClick={() => refetch()} className="font-medium underline">
            Retry
          </button>
        </Alert>
      )}
      {!isLoading && !isError && (
        <>
          {meta && (
            <p className="text-xs text-slate-500 dark:text-zinc-500">
              Showing {rows.length} of {meta.total} submissions.
            </p>
          )}
          <DataTable
            columns={columns}
            rows={rows}
            sortBy={sortBy}
            sortDir={sortDir}
            onSort={onSort}
            emptyText="No submissions yet."
          />
        </>
      )}

      <GetConnectedDetailsModal
        row={activeRow}
        open={Boolean(activeRow)}
        onClose={() => setActiveRow(null)}
        onDelete={handleDelete}
        isDeleting={deleteMutation.isPending}
        categoryLabel={activeRow ? labelForCategory(activeRow.category) : undefined}
      />
    </AdminPageShell>
  )
}

