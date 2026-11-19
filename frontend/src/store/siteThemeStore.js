import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const STORAGE = 'blivr-site-theme'

/**
 * Public marketing site color scheme. Persists; syncs to `document.documentElement` in `SiteThemeSync`.
 * @typedef {'light' | 'dark'} SiteTheme
 */

export const useSiteThemeStore = create(
  persist(
    (set, get) => ({
      /** @type {SiteTheme} */
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),
    }),
    { name: STORAGE },
  ),
)
