/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchAdminGetConnectedInfo, updateAdminGetConnectedInfo } from '@/api/client'
import { TextField, TextAreaField } from '@/components/ui/TextField'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { Alert } from '@/components/ui/Alert'
import { useToast } from '@/components/ui/Toast'

const EMPTY_ROW = { title: '', groupTitle: '', description: '', badge: '', details: '' }

export function GetConnectedInfoEditor() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['get-connected-info'],
    queryFn: fetchAdminGetConnectedInfo,
  })
  const [rows, setRows] = useState([EMPTY_ROW])

  useEffect(() => {
    if (data?.sections?.length) {
      setRows(data.sections.map((row) => ({
        title: row.title ?? '',
        groupTitle: row.groupTitle ?? '',
        description: row.description ?? '',
        badge: row.badge ?? '',
        details: row.details ?? '',
      })))
    }
  }, [data])

  const save = useMutation({
    mutationFn: updateAdminGetConnectedInfo,
    onSuccess: () => {
      toast.success({ title: 'Info sections saved' })
      queryClient.invalidateQueries({ queryKey: ['get-connected-info'] })
      queryClient.invalidateQueries({ queryKey: ['site'] })
    },
    onError: (err) => {
      toast.error({
        title: 'Save failed',
        description: err?.response?.data?.message || err?.message || 'Could not save info sections.',
      })
    },
  })

  return (
    <Card className="p-5">
      <h2 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Join Us Info modal sections</h2>
      <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">
        Manage the content shown when users click <strong>Info</strong> in the homepage navigation.
        Use the same <strong>Group title</strong> on multiple rows to merge them into one card.
      </p>

      {isLoading && (
        <div className="mt-4 flex items-center gap-2 text-slate-500">
          <Spinner />
          <span>Loading…</span>
        </div>
      )}
      {isError && (
        <Alert variant="error" className="mt-4" role="alert">
          {error?.message || 'Failed to load settings'}{' '}
          <button type="button" className="font-medium underline" onClick={() => refetch()}>
            Retry
          </button>
        </Alert>
      )}

      {!isLoading && !isError && (
        <>
          <ul className="mt-4 space-y-3">
            {rows.map((row, index) => (
              <li key={`${row.title}-${index}`} className="rounded-xl border border-slate-200/80 p-3 dark:border-white/10">
                <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                  <TextField
                    label="Section title"
                    value={row.title}
                    onChange={(e) => {
                      const title = e.target.value
                      setRows((prev) => prev.map((r, i) => (i === index ? { ...r, title } : r)))
                    }}
                  />
                  <TextField
                    className="sm:max-w-48"
                    label="Badge (optional)"
                    value={row.badge}
                    onChange={(e) => {
                      const badge = e.target.value
                      setRows((prev) => prev.map((r, i) => (i === index ? { ...r, badge } : r)))
                    }}
                  />
                </div>
                <TextField
                  className="mt-3"
                  label="Group title (for card grouping)"
                  value={row.groupTitle}
                  onChange={(e) => {
                    const groupTitle = e.target.value
                    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, groupTitle } : r)))
                  }}
                />
                <TextField
                  className="mt-3"
                  label="Description (optional)"
                  value={row.description}
                  onChange={(e) => {
                    const description = e.target.value
                    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, description } : r)))
                  }}
                />
                <TextAreaField
                  className="mt-3"
                  label="Details"
                  rows={3}
                  value={row.details}
                  onChange={(e) => {
                    const details = e.target.value
                    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, details } : r)))
                  }}
                />
                <div className="mt-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                    onClick={() => setRows((prev) => prev.filter((_, i) => i !== index))}
                    disabled={rows.length <= 1}
                  >
                    Remove section
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setRows((prev) => [...prev, EMPTY_ROW])}
            >
              Add section
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={save.isPending}
              onClick={() => {
                const sections = rows
                  .map((row, index) => ({
                    title: row.title.trim(),
                    groupTitle: row.groupTitle.trim() || null,
                    description: row.description.trim() || null,
                    details: row.details.trim(),
                    badge: row.badge.trim() || null,
                    sortOrder: index,
                  }))
                  .filter((row) => row.title && row.details)

                if (!sections.length) {
                  toast.error({ title: 'Add at least one section with title and details.' })
                  return
                }
                save.mutate({ sections })
              }}
            >
              {save.isPending ? 'Saving…' : 'Save modal content'}
            </Button>
          </div>
        </>
      )}
    </Card>
  )
}

