import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set) => ({
      mode: 'light',
      toggle: () => set((s) => ({ mode: s.mode === 'light' ? 'dark' : 'light' })),
      setMode: (mode) => set({ mode }),
    }),
    { name: 'ems-theme' }
  )
);
