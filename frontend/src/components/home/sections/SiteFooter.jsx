import { cn } from '@/lib/cn'
import { Instagram } from 'lucide-react'

export function SiteFooter({ footer, brand = 'BLiVR Movement', className = '' }) {
  if (!footer) return null
  return (
    <footer
      className={cn(
        'mt-auto w-full border-t border-white/10 bg-zinc-950/95',
        'shadow-[0_-1px_0_0_rgba(0,0,0,0.4)]',
        'backdrop-blur-xl supports-backdrop-filter:bg-zinc-950/90',
        'pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-5 text-zinc-400',
        'transition-[background-color,box-shadow,border-color,backdrop-filter] duration-200',
        'sm:pt-6',
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 text-center min-[400px]:px-5 sm:flex-row sm:gap-4 sm:px-6 sm:text-left md:px-8 lg:px-10">
        <div className="min-w-0 sm:shrink-0">
          <p className="font-display text-sm text-white sm:text-base">
            {footer.line1 || brand}
          </p>
          {footer.line2 && (
            <p className="mt-0.5 text-xs text-zinc-500">{footer.line2}</p>
          )}
          {footer.tagline && (
            <p className="mt-1 text-xs text-zinc-500">{footer.tagline}</p>
          )}
        </div>
        <div className="flex flex-col gap-0.5 text-xs sm:items-end sm:text-right">
          {footer.instagram && (
            <a
              href={footer.instagram}
              className="inline-flex items-center gap-1.5 py-0.5 text-zinc-200 underline-offset-2 transition hover:text-white hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              <Instagram className="h-3.5 w-3.5" aria-hidden />
              Instagram
            </a>
          )}
          {footer.email && (
            <a
              href={`mailto:${footer.email}`}
              className="py-0.5 break-all text-zinc-200 underline-offset-2 transition hover:text-white hover:underline"
            >
              {footer.email}
            </a>
          )}
          {footer.location && (
            <p className="text-zinc-500">{footer.location}</p>
          )}
        </div>
      </div>
    </footer>
  )
}
