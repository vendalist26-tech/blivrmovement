/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchAdminGetConnectedSettings, updateAdminGetConnectedSettings } from '@/api/client'
import { TextField } from '@/components/ui/TextField'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { Alert } from '@/components/ui/Alert'
import { useToast } from '@/components/ui/Toast'

export function GetConnectedCategoriesEditor() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['get-connected-settings'],
    queryFn: fetchAdminGetConnectedSettings,
  })
  const [rows, setRows] = useState([{ value: 'regular-member', label: 'Regular Member' }])

  useEffect(() => {
    if (data?.categories?.length) {
      setRows(data.categories.map((c) => ({ value: c.value, label: c.label })))
    }
  }, [data])

  const save = useMutation({
    mutationFn: updateAdminGetConnectedSettings,
    onSuccess: () => {
      toast.success({ title: 'Categories saved' })
      queryClient.invalidateQueries({ queryKey: ['get-connected-settings'] })
      queryClient.invalidateQueries({ queryKey: ['site'] })
    },
    onError: (err) => {
      toast.error({
        title: 'Save failed',
        description: err?.response?.data?.message || err?.message || 'Could not save categories.',
      })
    },
  })

  const addRow = () => {
    setRows((prev) => {
      const base = `new-${Date.now()}`
      return [...prev, { value: base, label: 'New category' }]
    })
  }

  const removeRow = (index) => {
    setRows((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <Card className="p-5">
      <h2 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Get Connected — categories</h2>
      <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">
        These options appear on the public form. Use short URL-safe values (lowercase, hyphens). Example:{' '}
        <span className="font-mono text-slate-600 dark:text-zinc-400">volunteer</span>,{' '}
        <span className="font-mono text-slate-600 dark:text-zinc-400">regular-member</span>.
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
              <li
                key={`${row.value}-${index}`}
                className="flex flex-col gap-2 rounded-xl border border-slate-200/80 p-3 sm:flex-row sm:items-end sm:gap-3 dark:border-white/10"
              >
                <TextField
                  className="min-w-0 flex-1"
                  label="Label"
                  value={row.label}
                  onChange={(e) => {
                    const label = e.target.value
                    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, label } : r)))
                  }}
                />
                <TextField
                  className="min-w-0 sm:max-w-[12rem]"
                  label="Value (slug)"
                  value={row.value}
                  onChange={(e) => {
                    const value = e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, '')
                      .replace(/--+/g, '-')
                    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, value } : r)))
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="shrink-0 text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                  onClick={() => removeRow(index)}
                  disabled={rows.length <= 1}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={addRow}>
              Add category
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={save.isPending}
              onClick={() => {
                const categories = rows
                  .map((r) => ({
                    value: r.value.trim(),
                    label: r.label.trim(),
                  }))
                  .filter((r) => r.value && r.label)
                if (!categories.length) {
                  toast.error({ title: 'Add at least one category with a label and value.' })
                  return
                }
                const values = categories.map((c) => c.value)
                if (new Set(values).size !== values.length) {
                  toast.error({ title: 'Each value must be unique.' })
                  return
                }
                save.mutate({ categories })
              }}
            >
              {save.isPending ? 'Saving…' : 'Save categories'}
            </Button>
          </div>
        </>
      )}
    </Card>
  )
}
