import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { cn } from '@/lib/cn'

function subscribeReducedMotion(callback) {
  if (typeof window === 'undefined') return () => {}
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  mq.addEventListener('change', callback)
  return () => mq.removeEventListener('change', callback)
}

function getReducedMotionSnapshot() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Scroll-triggered entrance: fade, lift, and subtle scale. Respects `prefers-reduced-motion`.
 */
export function Reveal({ children, className = '', delay = 0, as: Comp = 'div', style, ...rest }) {
  const ref = useRef(null)
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false,
  )
  const [inView, setInView] = useState(false)
  const visible = reduced || inView

  useEffect(() => {
    if (reduced) return
    const el = ref.current
    if (!el) return
    const ob = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true)
            ob.unobserve(entry.target)
            break
          }
        }
      },
      { root: null, rootMargin: '0px 0px -3% 0px', threshold: 0.04 },
    )
    ob.observe(el)
    return () => ob.disconnect()
  }, [reduced])

  const transitionStyle =
    !reduced && delay > 0
      ? { ...style, transitionDelay: visible ? `${delay}ms` : '0ms' }
      : style

  return (
    <Comp
      ref={ref}
      className={cn(
        !reduced && [
          'will-change-[transform,opacity,filter]',
          'transition-[transform,opacity,filter] duration-[1200ms]',
          'ease-[cubic-bezier(0.16,1,0.3,1)]',
        ],
        !visible &&
          !reduced &&
          'translate-y-16 scale-[0.96] opacity-0 [filter:blur(10px)]',
        (visible || reduced) && 'translate-y-0 scale-100 opacity-100 [filter:blur(0)]',
        className,
      )}
      style={transitionStyle}
      {...rest}
    >
      {children}
    </Comp>
  )
}
