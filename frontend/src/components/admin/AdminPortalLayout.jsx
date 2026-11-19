import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { logoutRequest } from '@/api/client'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useSidebarMode } from '@/hooks/useSidebarMode'
import { AdminHeader } from './AdminHeader'
import { AdminSideNav } from './AdminSideNav'
import { cn } from '@/lib/cn'

export function AdminPortalLayout() {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [sidebarMode, setSidebarMode] = useSidebarMode()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const clearAuth = useAuthStore((s) => s.clearAuth)

  const isWide = sidebarMode === 'wide'
  const navVariant = !isDesktop || isWide ? 'wide' : 'icons'

  function handleMenuClick() {
    if (isDesktop) {
      setSidebarMode((m) => (m === 'wide' ? 'icons' : 'wide'))
    } else {
      setMobileOpen((o) => !o)
    }
  }

  async function handleLogout() {
    try {
      await logoutRequest()
    } catch {
      // still clear
    }
    clearAuth()
    queryClient.clear()
    navigate('/admin/login', { replace: true })
  }

  const mobileDrawerOpen = mobileOpen
  const desktopShowsWide = isWide

  return (
    <div className="flex h-svh w-full max-w-full flex-1 flex-col overflow-hidden">
      <AdminHeader
        onMenuClick={handleMenuClick}
        isDesktop={isDesktop}
        mobileDrawerOpen={mobileDrawerOpen}
        desktopShowsWide={desktopShowsWide}
        onLogout={handleLogout}
      />

      <div className="relative flex min-h-0 flex-1">
        {mobileDrawerOpen && !isDesktop && (
          <button
            type="button"
            className="fixed right-0 bottom-0 left-0 top-14 z-20 bg-slate-900/50 backdrop-blur-sm md:hidden dark:bg-black/60"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <aside
          className={cn(
            'z-30 flex h-full min-h-0 min-w-0 flex-col overflow-y-auto border-slate-200/80 bg-white/90 backdrop-blur-md transition-[width,transform,opacity] duration-300 ease-out',
            'dark:border-white/10 dark:bg-zinc-950/90',
            'max-md:fixed max-md:top-14 max-md:bottom-0 max-md:left-0',
            'max-md:w-64 max-md:border-r max-md:shadow-2xl',
            !isDesktop && (mobileDrawerOpen ? 'max-md:translate-x-0' : 'max-md:-translate-x-full max-md:border-0 max-md:shadow-none max-md:pointer-events-none'),
            'md:static md:translate-x-0 md:shadow-none',
            isDesktop && isWide && 'md:w-64 md:shrink-0 md:border-r',
            isDesktop && !isWide && 'md:w-16 md:shrink-0 md:border-r',
          )}
          aria-label="Admin navigation"
        >
          <div
            className={cn(
              'flex h-full min-h-0 flex-1 flex-col',
              isDesktop && isWide && 'w-64 min-w-64',
              isDesktop && !isWide && 'w-16 min-w-16',
              !isDesktop && 'w-64 min-w-64',
            )}
            inert={!isDesktop && !mobileDrawerOpen ? true : undefined}
          >
            <AdminSideNav
              variant={navVariant}
              onNavClick={() => setMobileOpen(false)}
            />
          </div>
        </aside>

        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
