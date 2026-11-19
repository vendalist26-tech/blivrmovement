import { useCallback, useMemo, useState } from 'react'
import { Edit3, ShieldCheck, Trash2, Users } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createAdminUser, deleteAdminUser, fetchAdminUsers, updateAdminUser } from '@/api/client'
import { AdminPageShell } from '@/components/admin/AdminPageShell'
import { Card } from '@/components/ui/Card'
import { DataTable } from '@/components/ui/DataTable'
import { TextField } from '@/components/ui/TextField'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { Spinner } from '@/components/ui/Spinner'
import { useToast } from '@/components/ui/Toast'
import { useAuthStore } from '@/store/authStore'

export function AdminSettingsPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)

  const [search, setSearch] = useState('')
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [editingAdmin, setEditingAdmin] = useState(null)
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [formError, setFormError] = useState('')

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: fetchAdminUsers,
  })

  const admins = useMemo(() => data?.data ?? [], [data])

  const filteredAdmins = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return admins
    return admins.filter(
      (row) =>
        row.name?.toLowerCase().includes(term) ||
        row.email?.toLowerCase().includes(term),
    )
  }, [admins, search])

  const createMutation = useMutation({
    mutationFn: createAdminUser,
    onSuccess: (res) => {
      setCreateForm({ name: '', email: '', password: '' })
      setFormError('')
      toast.success({
        title: 'Admin created',
        description: `${res?.data?.name ?? 'New admin'} can now access the admin portal.`,
      })
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: (err) => {
      const message = err?.response?.data?.message || err?.message || 'Failed to create admin.'
      setFormError(message)
      toast.error({ title: 'Create failed', description: message })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateAdminUser(id, payload),
    onSuccess: (res) => {
      setEditingAdmin(null)
      setEditForm({ name: '', email: '', password: '' })
      setFormError('')
      toast.success({
        title: 'Admin updated',
        description: `${res?.data?.name ?? 'Admin'} details were saved.`,
      })
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: (err) => {
      const message = err?.response?.data?.message || err?.message || 'Failed to update admin.'
      setFormError(message)
      toast.error({ title: 'Update failed', description: message })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteAdminUser(id),
    onSuccess: () => {
      toast.success({ title: 'Admin removed' })
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: (err) => {
      toast.error({
        title: 'Delete failed',
        description: err?.response?.data?.message || err?.message || 'Failed to delete admin.',
      })
    },
  })

  function onCreateSubmit(e) {
    e.preventDefault()
    setFormError('')
    createMutation.mutate(createForm)
  }

  const startEdit = useCallback((row) => {
    setFormError('')
    setEditingAdmin(row)
    setEditForm({
      name: row.name ?? '',
      email: row.email ?? '',
      password: '',
    })
  }, [])

  function onEditSubmit(e) {
    e.preventDefault()
    if (!editingAdmin?.id) return
    setFormError('')
    const payload = {
      name: editForm.name,
      email: editForm.email,
      ...(editForm.password ? { password: editForm.password } : {}),
    }
    updateMutation.mutate({ id: editingAdmin.id, payload })
  }

  const onDeleteAdmin = useCallback((row) => {
    if (!row?.id) return
    const confirmed = window.confirm(
      `Delete admin ${row.name}? This will revoke access immediately.`,
    )
    if (!confirmed) return
    deleteMutation.mutate(row.id)
  }, [deleteMutation])

  const columns = useMemo(
    () => [
      {
        key: 'name',
        label: 'Admin',
        render: (row) => (
          <div>
            <p className="font-medium text-slate-900 dark:text-zinc-100">{row.name}</p>
            <p className="text-xs text-slate-500 dark:text-zinc-500">{row.email}</p>
          </div>
        ),
      },
      {
        key: 'created_at',
        label: 'Created',
        render: (row) =>
          row.created_at
            ? new Date(row.created_at).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
            : '—',
      },
      {
        key: 'actions',
        label: 'Action',
        className: 'w-0 text-right',
        render: (row) => (
          <div className="flex justify-end gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="px-2.5"
              onClick={() => startEdit(row)}
              aria-label={`Edit ${row.name}`}
              title="Edit admin"
            >
              <Edit3 className="h-4 w-4" aria-hidden />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="px-2.5 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-500/10 dark:hover:text-rose-300"
              onClick={() => onDeleteAdmin(row)}
              disabled={row.id === user?.id || deleteMutation.isPending}
              aria-label={`Delete ${row.name}`}
              title={row.id === user?.id ? 'You cannot delete yourself' : 'Delete admin'}
            >
              <Trash2 className="h-4 w-4" aria-hidden />
            </Button>
          </div>
        ),
      },
    ],
    [deleteMutation.isPending, onDeleteAdmin, startEdit, user?.id],
  )

  return (
    <AdminPageShell
      title="Settings"
      description="Manage your account, admin access, and workspace controls."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
              <ShieldCheck className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-zinc-500">Signed in as</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100">{user?.name ?? '—'}</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500 dark:text-zinc-500">{user?.email ?? '—'}</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
              <Users className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-zinc-500">Admins</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100">{admins.length}</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500 dark:text-zinc-500">Active administrators with portal access.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-zinc-500">Security tips</p>
          <ul className="mt-2 space-y-1.5 text-xs text-slate-600 dark:text-zinc-400">
            <li>- Use strong passwords with 8+ characters.</li>
            <li>- Remove admin accounts no longer in use.</li>
            <li>- Rotate credentials regularly.</li>
          </ul>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Create new admin</h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">
            Add a teammate with full admin access.
          </p>
          <form className="mt-4 space-y-3" onSubmit={onCreateSubmit}>
            <TextField
              label="Full name"
              value={createForm.name}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
            <TextField
              label="Email address"
              type="email"
              value={createForm.email}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
            <TextField
              label="Password"
              type="password"
              minLength={8}
              value={createForm.password}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, password: e.target.value }))}
              required
            />
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating…' : 'Create admin'}
            </Button>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Edit admin</h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">
            Select an admin from the list, then update details.
          </p>
          {!editingAdmin ? (
            <div className="mt-4 rounded-xl border border-dashed border-slate-300/80 p-4 text-sm text-slate-500 dark:border-white/15 dark:text-zinc-500">
              Choose an admin row and click edit.
            </div>
          ) : (
            <form className="mt-4 space-y-3" onSubmit={onEditSubmit}>
              <TextField
                label="Full name"
                value={editForm.name}
                onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
              <TextField
                label="Email address"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
              <TextField
                label="New password (optional)"
                type="password"
                minLength={8}
                value={editForm.password}
                onChange={(e) => setEditForm((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="Leave blank to keep current password"
              />
              <div className="flex flex-wrap items-center gap-2">
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? 'Saving…' : 'Save changes'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setEditingAdmin(null)
                    setEditForm({ name: '', email: '', password: '' })
                    setFormError('')
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>

      {formError ? (
        <Alert variant="error" role="alert">
          {formError}
        </Alert>
      ) : null}

      <Card className="p-6">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Admin directory</h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">
              View all administrators and manage their access.
            </p>
          </div>
          <TextField
            label="Search admins"
            className="w-full sm:w-72"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by name or email"
          />
        </div>
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-zinc-500">
            <Spinner />
            <span>Loading admins…</span>
          </div>
        ) : null}
        {isError ? (
          <Alert variant="error" role="alert">
            {error?.message || 'Failed to load admins.'}{' '}
            <button type="button" onClick={() => refetch()} className="font-medium underline">
              Retry
            </button>
          </Alert>
        ) : null}
        {!isLoading && !isError ? (
          <DataTable columns={columns} rows={filteredAdmins} emptyText="No admin users found." />
        ) : null}
      </Card>
    </AdminPageShell>
  )
}
