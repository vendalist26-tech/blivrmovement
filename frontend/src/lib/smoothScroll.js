export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Smooth-scroll to a hash target (or top for `#` / empty).
 * @param {string} hash - e.g. `#who` or `#top`
 */
export function scrollToHash(hash) {
  const behavior = prefersReducedMotion() ? 'auto' : 'smooth'

  if (!hash || hash === '#') {
    window.scrollTo({ top: 0, behavior })
    return true
  }

  const target = document.querySelector(hash)
  if (!target) return false

  target.scrollIntoView({ behavior, block: 'start' })
  return true
}

/** Smooth-scroll to the top of the page. */
export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}
