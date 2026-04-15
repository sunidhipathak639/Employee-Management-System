import { create } from 'zustand';

let idSeq = 0;

/**
 * Lightweight toast queue (no extra npm deps). Used by {@link ../notify.js}.
 */
export const useToastStore = create((set, get) => ({
  /** @type {{ id: number; message: string; severity: 'error' | 'success' | 'warning' | 'info' }[]} */
  items: [],
  /**
   * @param {string} message
   * @param {'error' | 'success' | 'warning' | 'info'} severity
   */
  push(message, severity = 'error') {
    const text = message || 'Something went wrong';
    const { items } = get();
    const last = items[items.length - 1];
    if (last && last.message === text && last.severity === severity) return;
    const id = ++idSeq;
    set({ items: [...items, { id, message: text, severity }].slice(-5) });
  },
  /** @param {number} id */
  dismiss(id) {
    set({ items: get().items.filter((x) => x.id !== id) });
  },
}));
