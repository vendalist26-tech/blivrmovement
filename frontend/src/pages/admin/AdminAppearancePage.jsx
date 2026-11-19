import { AdminPageShell } from '@/components/admin/AdminPageShell'
import { Card } from '@/components/ui/Card'

export function AdminAppearancePage() {
  return (
    <AdminPageShell
      title="Appearance"
      description="Control global look and feel. This will connect to the API in a follow-up (fonts, colors, and hero assets)."
    >
      <Card className="p-6 text-sm text-slate-600 dark:text-zinc-400">
        <p className="font-medium text-slate-800 dark:text-zinc-200">
          Coming soon
        </p>
        <p className="mt-2 leading-relaxed">
          Brand colors, default imagery, and typography presets will live here.
          For now, homepage content (including image URLs) is edited under
          {" "}
          <span className="text-slate-800 dark:text-zinc-200">Homepage</span>.
        </p>
      </Card>
    </AdminPageShell>
  )
}
