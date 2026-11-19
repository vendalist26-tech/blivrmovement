/* eslint-disable no-unused-vars */
import { useEffect, useId, useState } from 'react'
import { cn } from '@/lib/cn'
// import { SiteThemeToggle } from '@/components/home/SiteThemeToggle'

const links = [
  { label: 'Info', href: '#upcoming-meetings' },
  { label: 'Who we are', href: '#who' },
  { label: 'Beliefs', href: '#believe' },
  { label: 'Mission', href: '#mission' },
  { label: 'Gatherings', href: '#gatherings' },
]

const headerClass = cn(
  'border-b border-slate-200/80 bg-white/95 shadow-[0_1px_0_0_rgba(15,23,42,0.04)]',
  'backdrop-blur-xl supports-backdrop-filter:bg-white/90',
  'dark:border-zinc-800/90 dark:bg-zinc-950/95',
  'dark:shadow-[0_1px_0_0_rgba(0,0,0,0.4)]',
  'dark:supports-backdrop-filter:bg-zinc-950/90',
)

const darkHeaderClass = cn(
  'border-b border-white/10 bg-zinc-950/95 shadow-[0_1px_0_0_rgba(0,0,0,0.4)]',
  'backdrop-blur-xl supports-backdrop-filter:bg-zinc-950/90',
)

const linkBase = cn(
  'text-slate-700 hover:bg-slate-200/60 hover:text-slate-900',
  'active:bg-slate-200/50',
  'dark:text-zinc-200 dark:hover:bg-white/10 dark:hover:text-white',
)

/**
 * @param {{ brand?: string, className?: string, forceDark?: boolean }} props
 */
export function TopNav({
  brand = '',
  className = '',
  forceDark = false,
}) {
  const [open, setOpen] = useState(false)
  const [isSticky, setIsSticky] = useState(false)
  const panelId = useId()
  const labelId = useId()

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      setIsSticky(window.scrollY > 8)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed left-0 right-0 top-0 z-50 border-b transition-[background-color,box-shadow,border-color,backdrop-filter] duration-200',
        forceDark
          ? darkHeaderClass
          : isSticky || open
            ? headerClass
            : 'border-transparent bg-transparent shadow-none backdrop-blur-0 supports-backdrop-filter:bg-transparent',
        className,
      )}
    >
      <div
        className={cn(
          'relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between gap-3 sm:gap-5',
          'px-4 sm:px-6 lg:px-8',
          'min-h-15 pt-[max(0.5rem,env(safe-area-inset-top,0px))] pb-2.5 sm:min-h-16 sm:pb-3',
        )}
      >
        <a
          href="#top"
          onClick={() => setOpen(false)}
          className={cn(
            'group flex min-w-0 items-center gap-2 sm:gap-2.5 font-display text-lg font-medium tracking-tight sm:text-xl',
            forceDark ? 'text-white' : isSticky || open ? 'text-slate-900 dark:text-white' : 'text-white',
          )}
        >
          <img
            src="/blvr-logo.jpeg"
            alt=""
            className={cn(
              'h-8 w-8 shrink-0 rounded-sm object-contain ring-1',
              forceDark
                ? 'ring-white/25'
                : isSticky || open
                  ? 'ring-slate-200/80 dark:ring-zinc-700/80'
                  : 'ring-white/30',
            )}
          />
          {/* <span className="truncate">{brand}</span> */}
        </a>

        <nav
          className="hidden items-center gap-1.5 sm:gap-2 md:flex"
          aria-label="Primary"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                'shrink-0 rounded-md px-2 py-1.5 text-sm font-medium tracking-tight transition',
                'sm:px-2.5 sm:py-2',
                forceDark
                  ? 'text-white/90 hover:bg-white/15 hover:text-white active:bg-white/15'
                  : isSticky || open
                    ? linkBase
                    : 'text-white/90 hover:bg-white/15 hover:text-white active:bg-white/15',
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={cn(
              'inline-flex h-11 w-11 items-center justify-center rounded-[0.55rem] text-2xl leading-none transition',
              forceDark
                ? 'bg-black/30 text-white backdrop-blur-sm'
                : isSticky || open
                ? 'bg-white text-slate-800 dark:bg-zinc-900 dark:text-zinc-100'
                : 'bg-black/25 text-white backdrop-blur-sm',
            )}
            aria-expanded={open}
            aria-controls={panelId}
            aria-haspopup="true"
            aria-labelledby={labelId}
          >
            <span id={labelId} className="sr-only">
              {open ? 'Close menu' : 'Open menu'}
            </span>
            <span aria-hidden>{open ? '×' : '≡'}</span>
          </button>
        </div>
      </div>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10 bg-slate-900/40 backdrop-blur-sm dark:bg-black/50 md:hidden"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            id={panelId}
            className="absolute left-0 right-0 top-full z-20 max-h-[min(70dvh,24rem)] overflow-y-auto border-b border-slate-200/90 bg-slate-50/98 px-4 py-2 shadow-lg dark:border-zinc-800 dark:bg-zinc-950/98 md:hidden"
            role="menu"
            aria-label="Site sections"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-0.5 pb-2">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-3.5 text-base font-medium text-slate-800 active:bg-slate-200/70 dark:text-zinc-100 dark:active:bg-white/10"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </>
      )}

    </header>
  )
}
