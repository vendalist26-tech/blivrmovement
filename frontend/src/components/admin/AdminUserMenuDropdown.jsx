import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { cn } from '@/lib/cn'

const itemCls =
  'block w-full px-3 py-2 text-left text-slate-700 transition hover:bg-slate-100/90 dark:text-zinc-200 dark:hover:bg-white/10'

export function AdminUserMenuDropdown({ onLogout, className = '' }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const user = useAuthStore((s) => s.user)

  const initial =
    (user?.name || user?.email || '?')
      .split(/\s+/)
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || '?'

  useEffect(() => {
    if (!open) {
      return
    }
    function onDoc(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    function onKey(e) {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div
      className={cn('relative', className)}
      ref={rootRef}
    >
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => setOpen((o) => !o)}
        className="gap-2 pr-2 pl-1"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
      >
        <span
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-200/90 text-xs font-semibold text-slate-800 dark:bg-white/15 dark:text-zinc-100"
          aria-hidden
        >
          {initial}
        </span>
        <span
          className="hidden max-w-28 truncate text-left text-xs sm:block"
        >
          {user?.name || 'Account'}
        </span>
        <span
          className="text-slate-500 dark:text-zinc-400"
          aria-hidden
        >
          {open ? '▴' : '▾'}
        </span>
      </Button>

      {open && (
        <div
          className="absolute right-0 z-60 mt-2 w-56 min-w-56 origin-top-right overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 py-1.5 text-sm shadow-xl shadow-slate-200/50 backdrop-blur-md dark:border-white/10 dark:bg-zinc-950/95 dark:shadow-black/40"
          role="menu"
        >
          {user?.email && (
            <div className="px-3 py-2">
              <p className="text-xs text-slate-500 dark:text-zinc-500">Signed in as</p>
              <p className="truncate text-xs font-medium text-slate-800 dark:text-zinc-200">
                {user.email}
              </p>
            </div>
          )}
          <div
            className="my-1 border-t border-slate-200/70 dark:border-white/10"
            role="none"
          />
          <Link
            to="/"
            className={itemCls}
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            View public site
          </Link>
          <div className="flex items-center justify-between gap-2 px-3 py-2">
            <span className="text-slate-600 dark:text-zinc-400">Theme</span>
            <ThemeToggle className="shrink-0" compact />
          </div>
          <Link
            to="/admin/settings"
            className={itemCls}
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            Admin settings
          </Link>
          <div
            className="my-1 border-t border-slate-200/70 dark:border-white/10"
            role="none"
          />
          <button
            type="button"
            role="menuitem"
            className="block w-full px-3 py-2 text-left text-rose-700 transition hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-950/50"
            onClick={() => {
              setOpen(false)
              onLogout()
            }}
          >
            Log out
          </button>
        </div>
      )}
    </div>
  )
}
