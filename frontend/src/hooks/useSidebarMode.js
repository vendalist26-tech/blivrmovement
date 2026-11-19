import { useCallback, useState } from 'react'

const STORAGE = 'blivr-admin-sidebar-mode'
const LEGACY_OPEN = 'blivr-admin-sidebar-open'

/**
 * @typedef {'wide' | 'icons'} SidebarMode
 */

/**
 * Desktop sidebar: full labels (wide) or icon rail (icons). Persisted. Mobile always uses full nav in a drawer.
 * @returns {[SidebarMode, (m: SidebarMode | ((p: SidebarMode) => SidebarMode)) => void]}
 */
export function useSidebarMode() {
  const [mode, setMode] = useState(() => {
    if (typeof window === 'undefined') {
      return 'wide'
    }
    try {
      const raw = window.localStorage.getItem(STORAGE)
      if (raw != null) {
        const p = JSON.parse(raw)
        if (p === 'icons' || p === 'wide') {
          return p
        }
      }
      const leg = window.localStorage.getItem(LEGACY_OPEN)
      if (leg != null) {
        return JSON.parse(leg) === true ? 'wide' : 'icons'
      }
    } catch {
      // fall through
    }
    return 'wide'
  })

  const set = useCallback((value) => {
    setMode((prev) => {
      const next = typeof value === 'function' ? value(prev) : value
      try {
        window.localStorage.setItem(STORAGE, JSON.stringify(next))
      } catch {
        // ignore
      }
      return next
    })
  }, [])

  return [mode, set]
}
