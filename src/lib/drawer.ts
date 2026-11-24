import { useSyncExternalStore } from 'react';

/** Open/closed state of the "Send a message" drawer, shared by the floating button, Contact and the drawer. */
let open = false;
const listeners = new Set<() => void>();
const set = (v: boolean) => {
  if (v === open) return;
  open = v;
  listeners.forEach((l) => l());
};
export const openDrawer = () => set(true);
export const closeDrawer = () => set(false);
export const useDrawerOpen = () =>
  useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => open,
  );
