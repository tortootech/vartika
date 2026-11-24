import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react';
import { ScrollTrigger, getLenis } from './scroll';

/**
 * One scroll lock for every modal, drawer or overlay on the site.
 *
 * While `open`:
 *  - the page behind is locked (Lenis stopped + `overlay-open` on <html>), at its current position;
 *  - the panel itself scrolls natively (it carries `data-lenis-prevent`, see the components);
 *  - Tab / Shift+Tab stay inside the panel;
 *  - any other open overlay is closed first, so only one is ever open.
 * On close (X, backdrop, Esc, unmount): Lenis restarts, the scroll position is put back exactly,
 * ScrollTrigger re-measures and focus returns to the element that opened the panel.
 */

interface Entry { close: () => void }
const stack: Entry[] = [];
let restoringFocus = false;

// Safari (and Chrome on some platforms) does not focus a button on click, so remember what was
// pressed last: that is where focus goes back to when the panel closes.
let lastPressed: HTMLElement | null = null;
if (typeof window !== 'undefined')
  window.addEventListener(
    'pointerdown',
    (e) => {
      if (!(e.target instanceof Element)) return;
      // a whole card can be clickable: its own button is the control focus returns to
      const t =
        e.target.closest<HTMLElement>('button, a[href], summary, [tabindex]') ??
        e.target.closest('[data-card]')?.querySelector<HTMLElement>('button') ??
        null;
      if (t) lastPressed = t;
    },
    { capture: true, passive: true },
  );

/** True while any overlay is open. The desk's stepped scrolling steps aside when it is. */
export const isOverlayOpen = () => stack.length > 0;
/** True while focus is being handed back to the trigger (so focus handlers don't scroll the page). */
export const isRestoringFocus = () => restoringFocus;

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

export function useScrollLock(open: boolean, panelRef: RefObject<HTMLElement | null>, requestClose: () => void) {
  const closeRef = useRef(requestClose);
  useLayoutEffect(() => {
    closeRef.current = requestClose;
  });

  // useEffect runs after layout effects, but the components open their <dialog> in an effect
  // declared after this hook, so the element that had focus is still the trigger here.
  useEffect(() => {
    if (!open) return;
    for (const other of [...stack]) other.close();

    const entry: Entry = { close: () => closeRef.current() };
    stack.push(entry);

    const html = document.documentElement;
    const lenis = getLenis();
    const y = lenis ? lenis.scroll : window.scrollY;
    const active = document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null;
    const trigger = active ?? (lastPressed?.isConnected ? lastPressed : null);
    let resized = false;

    lenis?.stop();
    html.classList.add('overlay-open');

    const onResize = () => (resized = true);
    window.addEventListener('resize', onResize);

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const panel = panelRef.current;
      if (!panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const inside = panel.contains(document.activeElement);
      if (e.shiftKey && (document.activeElement === first || !inside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !inside)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey, true);

    return () => {
      document.removeEventListener('keydown', onKey, true);
      window.removeEventListener('resize', onResize);
      const i = stack.indexOf(entry);
      if (i >= 0) stack.splice(i, 1);
      if (stack.length) return; // another overlay took over: it owns the lock now

      html.classList.remove('overlay-open');
      lenis?.start();
      // re-measure now, before focus goes back: a refresh re-wraps pinned sections, which would blur
      // a trigger inside one (e.g. a case-file card in the pinned Projects row)
      ScrollTrigger.refresh();
      // put the page back exactly where it was (a resize while open legitimately moves it)
      if (!resized) {
        if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
        else if (Math.abs(window.scrollY - y) > 1) window.scrollTo(0, y);
      }
      restoringFocus = true;
      trigger?.focus({ preventScroll: true });
      restoringFocus = false;
    };
  }, [open, panelRef]);
}
