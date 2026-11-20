import { useSyncExternalStore } from 'react';

export type Theme = 'desk' | 'cream' | 'navy';
interface State { index: number; theme: Theme }

let state: State = { index: 1, theme: 'desk' };
const listeners = new Set<() => void>();

export function setSection(patch: Partial<State>) {
  const next = { ...state, ...patch };
  if (next.index === state.index && next.theme === state.theme) return;
  state = next;
  document.documentElement.dataset.barTheme = state.theme;
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const useSection = () => useSyncExternalStore(subscribe, () => state);
