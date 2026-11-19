import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'

function variantClass(v) {
  if (v === 'secondary') {
    return (
      'border border-slate-300 bg-white/90 text-slate-800 shadow-sm ' +
      'hover:border-slate-400 hover:bg-white ' +
      'dark:border-white/30 dark:bg-white/5 dark:text-zinc-100 ' +
      'dark:shadow-none dark:hover:border-white/50 dark:hover:bg-white/10'
    )
  }
  if (v === 'hero') {
    return (
      'border-0 bg-zinc-50 text-slate-900 shadow-lg shadow-black/25 sm:min-w-[11.5rem] ' +
      'hover:bg-white active:scale-[0.99] ' +
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ' +
      'focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950/80'
    )
  }
  if (v === 'heroSecondary') {
    return (
      'border border-white/55 bg-white/[0.06] text-white backdrop-blur-sm sm:min-w-[11.5rem] ' +
      'hover:border-white/80 hover:bg-white/12 active:scale-[0.99] ' +
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40'
    )
  }
  return (
    'bg-slate-900 text-white shadow-sm hover:bg-slate-800 ' +
    'dark:bg-zinc-100 dark:text-slate-900 dark:shadow-sm dark:hover:bg-white'
  )
}

/** Shared classes for `<a>` / `<Link>` / `<button>` so modal triggers match CTA styling. */
export function buttonLinkClassName(variant = 'primary', className = '') {
  return linkClass(variant, className)
}

function linkClass(variant, className) {
  return cn(
    'inline-flex w-full min-h-11 items-center justify-center rounded-full px-6 py-3 text-sm font-medium tracking-wide transition sm:min-h-0 sm:w-auto ' +
      (variant === 'hero' || variant === 'heroSecondary'
        ? 'px-8 py-3.5 text-sm font-semibold tracking-wide sm:px-10 '
        : ''),
    variantClass(variant),
    className,
  )
}

/**
 * In-app paths use `Link` (client navigation). Plain `<a href>` was causing full page loads;
 * some browsers (e.g. Firefox with a stale cache) could reload an old bundle and hit the catch-all route to `/`.
 * Hash links stay as `<a>` for native in-page behavior.
 */
export function ButtonLink({ href, to, children, variant = 'primary', className = '' }) {
  const path = href ?? to
  const cls = linkClass(variant, className)
  if (!path) {
    return (
      <span className={cn(cls, 'pointer-events-none opacity-50')} aria-disabled>
        {children}
      </span>
    )
  }

  if (path.startsWith('#')) {
    return (
      <a href={path} className={cls}>
        {children}
      </a>
    )
  }

  const openInNewTab =
    path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//')
  if (openInNewTab) {
    return (
      <a
        href={path}
        className={cls}
        target="_blank"
        rel="noreferrer"
      >
        {children}
      </a>
    )
  }
  if (path.startsWith('mailto:') || path.startsWith('tel:') || path.startsWith('sms:')) {
    return (
      <a href={path} className={cls}>
        {children}
      </a>
    )
  }

  return (
    <Link to={path} className={cls}>
      {children}
    </Link>
  )
}
