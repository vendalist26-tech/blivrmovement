import { Link } from 'react-router-dom'
import { TextLink } from '@/components/ui/TextLink'
import { AdminPageShell } from '@/components/admin/AdminPageShell'
import { GetConnectedInfoEditor } from '@/components/admin/getConnected/GetConnectedInfoEditor'

export function AdminGetConnectedInfoPage() {
  return (
    <AdminPageShell
      title="Join Us · Info modal"
      description={
        <>
          Configure meeting details shown in the homepage Info modal.{' '}
          <TextLink to="/admin/get-connected" className="text-sm">
            View submissions
          </TextLink>
        </>
      }
    >
      <GetConnectedInfoEditor />
      <p className="mt-4 text-xs text-slate-500 dark:text-zinc-500">
        <Link
          to="/admin/get-connected"
          className="font-medium text-slate-700 underline-offset-2 hover:underline dark:text-zinc-300"
        >
          ← Back to submissions
        </Link>
      </p>
    </AdminPageShell>
  )
}

