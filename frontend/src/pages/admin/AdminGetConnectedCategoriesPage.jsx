import { Link } from 'react-router-dom'
import { TextLink } from '@/components/ui/TextLink'
import { AdminPageShell } from '@/components/admin/AdminPageShell'
import { GetConnectedCategoriesEditor } from '@/components/admin/getConnected/GetConnectedCategoriesEditor'

export function AdminGetConnectedCategoriesPage() {
  return (
    <AdminPageShell
      title="Join Us · Categories"
      description={
        <>
          Define the options people see on the public Join Us form.{' '}
          <TextLink to="/admin/get-connected" className="text-sm">
            View submissions
          </TextLink>
        </>
      }
    >
      <GetConnectedCategoriesEditor />
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
