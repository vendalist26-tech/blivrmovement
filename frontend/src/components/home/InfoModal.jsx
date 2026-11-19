import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { createPortal } from 'react-dom'

/**
 * @param {{ open: boolean, onClose: () => void, sections?: Array<{ title?: string, groupTitle?: string | null, description?: string | null, details?: string, badge?: string | null }> }} props
 */
export function InfoModal({ open, onClose, sections = [] }) {
  if (!open) return null

  const rows = sections.filter((s) => s?.title && s?.details)
  const grouped = rows.reduce((acc, section, index) => {
    const groupTitle = section.groupTitle?.trim()
    const key = groupTitle || `__single_${index}`
    const existing = acc.find((item) => item.key === key)
    if (existing) {
      existing.items.push(section)
    } else {
      acc.push({ key, heading: groupTitle || section.title, items: [section] })
    }
    return acc
  }, [])

  const modal = (
    <div
      className="fixed inset-0 z-70 flex items-end justify-center overflow-y-auto bg-slate-950/35 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="BLiVR meeting information"
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'flex w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-900/10 sm:rounded-2xl',
          'my-0 max-h-[88dvh] sm:my-6 sm:max-h-[82dvh]',
        )}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-slate-200/80 bg-white px-4 py-4 sm:px-6">
          <div className="flex min-w-0 items-start gap-3">
            <img
              src="/blvr-logo.jpeg"
              alt="BLiVR logo"
              className="mt-0.5 h-9 w-9 shrink-0 rounded-md object-cover ring-1 ring-slate-200"
            />
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">BLiVR Movement</p>
              <h2 className="font-display text-[1.75rem] leading-tight text-slate-900 sm:text-[1.9rem]">
                Meetings & Pop-ups
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-700 transition hover:bg-slate-200/80"
            aria-label="Close info"
          >
            ×
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
          {grouped.map((group, groupIndex) => (
            <section
              key={`${group.key}-${groupIndex}`}
              className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5"
            >
              <h3 className="text-[0.9rem] font-bold uppercase tracking-[0.14em]  text-black">
                {group.heading}
              </h3>
              {group.items.length > 1 ? (
                <ul className="mt-3 space-y-2.5 text-slate-700">
                  {group.items.map((item, itemIndex) => {
                    const [primaryLine = '', ...otherLines] = String(item.details).split('\n')
                    return (
                      <li key={`${item.title}-${itemIndex}`} className="text-sm sm:text-[0.95rem]">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-slate-600">{item.title}</span>
                          {primaryLine ? <span>- {primaryLine}</span> : null}
                          {item.badge ? (
                            <span className="rounded-md bg-white px-2 py-0.5 text-[0.72rem] font-medium text-slate-600 ring-1 ring-slate-200">
                              {item.badge}
                            </span>
                          ) : null}
                        </div>
                        {otherLines.length ? (
                          <p className="mt-1 whitespace-pre-line text-[0.95rem] text-slate-700 sm:text-base">
                            {otherLines.join('\n')}
                          </p>
                        ) : null}
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <>
                  {group.items[0].description ? (
                    <p className="mt-2 text-[0.9rem] text-slate-600">{group.items[0].description}</p>
                  ) : null}
                  <p className="mt-3 whitespace-pre-line text-[0.95rem] text-slate-700 sm:text-base">
                    {group.items[0].details}
                  </p>
                </>
              )}
            </section>
          ))}
          {!rows.length ? (
            <section className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
              <p className="text-sm text-slate-600">Meeting details will be posted soon.</p>
            </section>
          ) : null}
        </div>

        <div className="shrink-0 border-t border-slate-200/80 bg-white px-4 py-4 sm:px-6 sm:py-5">
          <Link
            to="/join-us"
            onClick={onClose}
            className={cn(
              'inline-flex w-full items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold tracking-wide text-white shadow-md shadow-slate-900/15 transition',
              'bg-slate-900 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2',
            )}
          >
            Sign up to attend
          </Link>
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
