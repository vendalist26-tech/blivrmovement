import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchAdminSite, updateAdminSite } from '@/api/client'
import { AdminPageShell } from '@/components/admin/AdminPageShell'
import { SiteContentForm } from '@/components/admin/site/SiteContentForm'
import { Alert } from '@/components/ui/Alert'
import { CodeSnippet } from '@/components/ui/CodeSnippet'
import { Spinner } from '@/components/ui/Spinner'

export function AdminSiteContentPage() {
  const queryClient = useQueryClient()

  const { data, isLoading, isError, error, refetch, dataUpdatedAt } = useQuery({
    queryKey: ['site', 'admin'],
    queryFn: fetchAdminSite,
  })

  const save = useMutation({
    mutationFn: (value) => updateAdminSite(value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site'] })
    },
  })

  return (
    <AdminPageShell
      title="Homepage"
      description={
        <>
          Homepage sections, hero images (mobile + desktop), and section photos. The upcoming meetings
          carousel and <CodeSnippet>/upcoming-meetings</CodeSnippet> page are managed under{' '}
          <strong>Upcoming meetings</strong>. Public API:{' '}
          <code className="text-xs text-slate-500 dark:text-zinc-500">GET /api/v1/site</code>.
        </>
      }
    >
      {isLoading && (
        <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-500">
          <Spinner />
          <span>Loading…</span>
        </div>
      )}
      {isError && (
        <Alert variant="error" role="alert">
          {error?.message || 'Failed to load'}{' '}
          <button
            type="button"
            onClick={() => refetch()}
            className="font-medium underline"
          >
            Retry
          </button>
        </Alert>
      )}
      {save.isError && (
        <Alert variant="error" role="alert">
          {String(save.error?.message || 'Save failed')}
        </Alert>
      )}
      {save.isSuccess && (
        <Alert variant="success" role="status">
          Saved.
        </Alert>
      )}
      {!isLoading && data != null && (
        <SiteContentForm
          key={dataUpdatedAt}
          defaultData={data}
          onSave={(payload) => save.mutate(payload)}
          isSaving={save.isPending}
        />
      )}
    </AdminPageShell>
  )
}
