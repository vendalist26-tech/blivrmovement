import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ChevronUp } from 'lucide-react'
import { scrollToTop } from '@/lib/smoothScroll'
import { cn } from '@/lib/cn'

const SHOW_AFTER_PX = 320

export function ScrollToTop() {
  const { pathname } = useLocation()
  const [visible, setVisible] = useState(false)

  const isAdmin = pathname.startsWith('/admin')

  useEffect(() => {
    if (isAdmin) return

    const onScroll = () => {
      setVisible(window.scrollY > SHOW_AFTER_PX)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isAdmin, pathname])

  if (isAdmin) return null

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={cn(
        'fixed right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full',
        'bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))]',
        'border border-zinc-800/60 bg-zinc-950 text-white',
        'transition-[opacity,transform,border-color,background-color] duration-300',
        'hover:border-zinc-600 hover:bg-black',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
        'sm:right-6 sm:h-12 sm:w-12',
        'sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))]',
        visible
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-2 opacity-0',
      )}
    >
      <ChevronUp className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} aria-hidden />
    </button>
  )
}
