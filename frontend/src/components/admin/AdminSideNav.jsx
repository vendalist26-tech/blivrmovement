import { NavLink } from 'react-router-dom'
import { adminNavIconProps, adminNavItems } from '@/config/adminNav'
import { TextLink } from '@/components/ui/TextLink'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/cn'

const linkClassWide = ({ isActive }) =>
  cn(
    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition',
    'text-slate-600 hover:bg-slate-100/90 hover:text-slate-900',
    'dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-zinc-50',
    isActive &&
      'bg-sky-100/90 text-sky-950 ring-1 ring-sky-200/80 dark:bg-sky-500/15 dark:text-sky-100 dark:ring-sky-500/30',
  )

const linkClassIcons = ({ isActive }) =>
  cn(
    'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-center text-base leading-none transition',
    'text-slate-600 hover:bg-slate-100/90 hover:text-slate-900',
    'dark:text-zinc-300 dark:hover:bg-white/10',
    isActive &&
      'bg-sky-100/90 text-sky-950 ring-1 ring-sky-200/80 dark:bg-sky-500/15 dark:text-sky-100 dark:ring-sky-500/30',
  )

/**
 * @param {'wide' | 'icons'} props.variant
 */
export function AdminSideNav({ onNavClick, variant = 'wide', className = '' }) {
  const user = useAuthStore((s) => s.user)
  const icons = variant === 'icons'

  return (
    <div
      className={cn(
        'flex h-full min-h-0 w-full min-w-0 flex-col',
        className,
      )}
    >
      <div
        className={cn(
          'shrink-0 border-b border-slate-200/60 dark:border-white/10',
          icons ? 'px-2 py-3' : 'px-4 py-4',
        )}
      >
        <TextLink
          to="/admin"
          className={cn(
            'no-underline',
            icons ? 'flex items-center justify-center' : 'block text-left',
          )}
          onClick={onNavClick}
        >
          {icons ? (
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 font-display text-sm font-semibold text-white dark:bg-white/15 dark:text-white"
              title="BLiVR Admin"
            >
              B
            </span>
          ) : (
            <>
              <span className="font-display text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                BLiVR
              </span>
              <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500">
                Admin
              </span>
            </>
          )}
        </TextLink>
      </div>

      <nav
        className={cn(
          'min-h-0 flex-1 space-y-1 overflow-y-auto p-2',
          icons && 'flex flex-col items-center',
        )}
        aria-label="Admin sections"
      >
        {adminNavItems.map((item) => {
          const NavIcon = item.Icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onNavClick}
              className={icons ? linkClassIcons : linkClassWide}
              title={item.label}
              aria-label={item.label}
            >
              {({ isActive }) =>
                icons ? (
                  <NavIcon
                    className="h-5 w-5 text-current"
                    aria-hidden
                    {...adminNavIconProps}
                  />
                ) : (
                  <>
                    <span
                      className={cn(
                        'flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-lg',
                        !isActive &&
                          'bg-slate-100/90 text-slate-800 dark:bg-white/10 dark:text-zinc-100',
                        isActive &&
                          'bg-sky-200/50 text-sky-950 dark:bg-sky-500/20 dark:text-sky-100',
                      )}
                      aria-hidden
                    >
                      <NavIcon className="h-4 w-4" {...adminNavIconProps} />
                    </span>
                    <span
                      className={cn(
                        'min-w-0 font-semibold',
                        !isActive && 'text-slate-800 dark:text-zinc-200',
                      )}
                    >
                      {item.label}
                    </span>
                  </>
                )
              }
            </NavLink>
          )
        })}
      </nav>

      {user?.email && (
        <div
          className={cn(
            'mt-auto shrink-0 border-t border-slate-200/60 p-2 dark:border-white/10',
            !icons && 'p-3',
          )}
        >
          {icons ? (
            <div
              className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100/90 text-sm text-slate-500 dark:bg-white/10 dark:text-zinc-400"
              title={user.email}
              aria-label={user.email}
            >
              @
            </div>
          ) : (
            <p
              className="truncate rounded-lg bg-slate-100/80 px-2.5 py-2 text-xs text-slate-500 dark:bg-white/5 dark:text-zinc-400"
              title={user.email}
            >
              {user.email}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
