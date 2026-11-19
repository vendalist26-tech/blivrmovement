import { Link } from 'react-router-dom'
import { AdminPageShell } from '@/components/admin/AdminPageShell'
import { Card } from '@/components/ui/Card'
import { CodeSnippet } from '@/components/ui/CodeSnippet'

export function AdminSeoPage() {
  return (
    <AdminPageShell
      title="SEO & sharing"
      description="Titles and descriptions for search and social previews."
    >
      <Card className="space-y-3 p-6 text-sm text-slate-600 dark:text-zinc-400">
        <p className="leading-relaxed">
          Site title and description are currently part of the homepage JSON
          under <CodeSnippet>meta.title</CodeSnippet> and{" "}
          <CodeSnippet>meta.description</CodeSnippet>. Edit them on the{" "}
          <Link
            to="/admin/site"
            className="font-medium text-sky-700 underline dark:text-sky-400"
          >
            Homepage
          </Link>{" "}
          page for now; dedicated fields will be added here in a follow-up.
        </p>
      </Card>
    </AdminPageShell>
  )
}
