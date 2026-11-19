import { useEffect } from 'react'
import { scrollToHash } from '@/lib/smoothScroll'

/**
 * Intercepts in-page anchor clicks for reliable smooth scrolling (respects reduced motion).
 */
export function SmoothScroll() {
  useEffect(() => {
    const onClick = (event) => {
      const anchor = event.target.closest('a[href^="#"]')
      if (!anchor) return

      const hash = anchor.getAttribute('href')
      if (!hash) return

      if (hash.length > 1 && !document.querySelector(hash)) return

      event.preventDefault()
      scrollToHash(hash)
      window.history.pushState(null, '', hash)
    }

    document.addEventListener('click', onClick)

    const { hash } = window.location
    if (hash) {
      requestAnimationFrame(() => scrollToHash(hash))
    }

    return () => document.removeEventListener('click', onClick)
  }, [])

  return null
}
