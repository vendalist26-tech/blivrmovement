import { cn } from '@/lib/cn'

/**
 * @typedef {{ id: string, label: string, badge?: string | number }} AdminTab
 */

/**
 * Responsive admin tabs — scrollable on mobile, underline active state.
 * @param {{
 *   tabs: AdminTab[]
 *   activeId: string
 * onChange: (id: string) => void
 *   className?: string
 *   children: import('react').ReactNode
 * }} props
 */
export function AdminTabs({ tabs, activeId, onChange, className = '', children }) {
  return (
    <div className={cn('flex min-h-0 flex-col', className)}>
      <div
        className="-mx-1 overflow-x-auto overscroll-x-contain border-b border-slate-200/90 dark:border-white/10"
        role="tablist"
        aria-label="Sections"
      >
        <div className="flex min-w-max gap-1 px-1 pb-px sm:gap-2">
          {tabs.map((tab) => {
            const active = tab.id === activeId
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={active}
                aria-controls={`panel-${tab.id}`}
                onClick={() => onChange(tab.id)}
                className={cn(
                  'relative shrink-0 rounded-t-lg px-3.5 py-2.5 text-sm font-medium transition',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50',
                  active
                    ? 'text-slate-900 after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-slate-900 dark:text-zinc-50 dark:after:bg-zinc-50'
                    : 'text-slate-500 hover:text-slate-800 dark:text-zinc-500 dark:hover:text-zinc-200',
                )}
              >
                <span className="flex items-center gap-2">
                  {tab.label}
                  {tab.badge != null && tab.badge !== '' ? (
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-[0.65rem] font-semibold tabular-nums',
                        active
                          ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                          : 'bg-slate-200/80 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400',
                      )}
                    >
                      {tab.badge}
                    </span>
                  ) : null}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div
        role="tabpanel"
        id={`panel-${activeId}`}
        aria-labelledby={`tab-${activeId}`}
        className="min-h-0 flex-1 pt-5 sm:pt-6"
      >
        {children}
      </div>
    </div>
  )
}
