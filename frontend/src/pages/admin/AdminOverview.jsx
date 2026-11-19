import { Link } from 'react-router-dom'
import { adminNavIconProps, adminNavItems } from '@/config/adminNav'
import { Card } from '@/components/ui/Card'
import { AdminPageShell } from '@/components/admin/AdminPageShell'
import { cn } from '@/lib/cn'

export function AdminOverview() {
  const links = adminNavItems.filter((item) => !item.end)

  return (
    <AdminPageShell
      title="Dashboard"
      description="Manage your public site, appearance, and future modules from one place."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {links.map((item) => {
          const CardIcon = item.Icon
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'group block rounded-2xl outline-none transition',
                'focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2',
                'dark:focus-visible:ring-offset-zinc-950',
              )}
            >
              <Card className="h-full p-5 transition group-hover:border-sky-200/80 group-hover:shadow-md group-hover:shadow-sky-100/50 dark:group-hover:border-sky-500/20">
                <div className="flex items-start gap-3">
                  <span
                    className="flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-zinc-200"
                    aria-hidden
                  >
                    <CardIcon
                      className="h-5 w-5"
                      {...adminNavIconProps}
                    />
                  </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-medium text-slate-900 group-hover:text-sky-800 dark:text-zinc-100 dark:group-hover:text-sky-200">
                    {item.label}
                  </h2>
                  <p className="mt-3 text-sm font-medium text-sky-600 group-hover:underline dark:text-sky-400/90">
                    Open →
                  </p>
                </div>
              </div>
            </Card>
            </Link>
          )
        })}
      </div>
    </AdminPageShell>
  )
}
