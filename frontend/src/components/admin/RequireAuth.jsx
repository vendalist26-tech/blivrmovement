import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useAuthHydrated } from '@/hooks/useAuthHydrated'
import { Spinner } from '@/components/ui/Spinner'

export function RequireAuth({ children }) {
  const hydrated = useAuthHydrated()
  const token = useAuthStore((s) => s.token)
  const location = useLocation()

  if (!hydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-2 text-slate-500 dark:text-zinc-400">
        <Spinner />
        <span className="text-sm">Loading session…</span>
      </div>
    )
  }

  if (!token) {
    return (
      <Navigate
        to="/admin/login"
        state={{ from: location.pathname }}
        replace
      />
    )
  }

  return children
}
