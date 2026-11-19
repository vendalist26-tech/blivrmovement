import { Button } from '@/components/ui/Button'
import { AdminUserMenuDropdown } from './AdminUserMenuDropdown'
import { cn } from '@/lib/cn'

function PanelToggleIcon({ wide, className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      {wide ? (
        <>
          <rect x="3" y="4" width="6" height="16" rx="1.2" />
          <rect x="12" y="4" width="9" height="16" rx="1.2" opacity="0.35" />
        </>
      ) : (
        <>
          <rect x="3" y="4" width="2.5" height="16" rx="0.5" />
          <rect x="6.5" y="4" width="14.5" height="16" rx="1.2" opacity="0.35" />
        </>
      )}
    </svg>
  )
}

/**
 * Top header for the admin portal. Menu toggles: mobile drawer, or wide vs icon rail on desktop.
 */
export function AdminHeader({
  onMenuClick,
  isDesktop,
  mobileDrawerOpen,
  /** Desktop: true when labels are visible. */
  desktopShowsWide,
  onLogout,
  className = '',
}) {
  const label = isDesktop
    ? (desktopShowsWide
      ? 'Use icon bar'
      : 'Show full labels')
    : (mobileDrawerOpen ? 'Close menu' : 'Open menu')

  return (
    <header
      className={cn(
        'sticky top-0 z-50 flex w-full min-w-0 shrink-0 items-center justify-between gap-3',
        'border-b border-slate-200/80 bg-white/90 px-4 py-3.5',
        'shadow-sm shadow-slate-200/30 backdrop-blur-md',
        'dark:border-white/10 dark:bg-zinc-950/90 dark:shadow-lg dark:shadow-black/20',
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onMenuClick}
          className="shrink-0 px-2.5"
          title={label}
          aria-label={label}
          aria-expanded={isDesktop ? desktopShowsWide : mobileDrawerOpen}
        >
          {isDesktop ? (
            <PanelToggleIcon
              className="h-4 w-4"
              wide={desktopShowsWide}
            />
          ) : (
            <span className="text-base leading-none" aria-hidden>
              {mobileDrawerOpen ? '✕' : '☰'}
            </span>
          )}
        </Button>
        <div className="min-w-0">
          <p className="truncate font-display text-base font-semibold tracking-tight text-slate-900 dark:text-zinc-50 sm:text-lg">
            BLiVR Admin
          </p>
          <p className="hidden text-xs text-slate-500 sm:block dark:text-zinc-500">
            Control center
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <AdminUserMenuDropdown onLogout={onLogout} />
      </div>
    </header>
  )
}
