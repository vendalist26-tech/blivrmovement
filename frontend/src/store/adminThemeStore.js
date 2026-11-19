import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const STORAGE_KEY = 'blivr-admin-theme'

/**
 * @typedef {'light' | 'dark'} AdminTheme
 */

export const useAdminThemeStore = create(
  persist(
    (set, get) => ({
      /** @type {AdminTheme} */
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),
    }),
    { name: STORAGE_KEY },
  ),
)
