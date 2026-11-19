import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/cn'

/**
 * @param {{ open: boolean, onClose: () => void, title?: string, videoId: string | null }} props
 */
export function YouTubeModal({ open, onClose, title = 'Video', videoId }) {
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [open, onClose])

  if (!open || !videoId) return null

  const embedSrc = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0`

  const modal = (
    <div
      className="fixed inset-0 z-70 flex items-end justify-center overflow-y-auto bg-slate-950/60 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'flex w-full max-w-5xl flex-col gap-3 rounded-t-2xl border border-white/10 bg-zinc-950 p-3 shadow-2xl sm:rounded-2xl sm:p-4',
          'my-0 max-h-[92dvh] sm:my-4',
        )}
      >
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-white/15"
          >
            Close
          </button>
        </div>
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-black ring-1 ring-white/10">
          <iframe
            title={title}
            src={embedSrc}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
