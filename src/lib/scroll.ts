import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);
// dev only: lets the browser console inspect triggers
if (import.meta.env.DEV) (window as unknown as { __ST: typeof ScrollTrigger }).__ST = ScrollTrigger;

export const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isTouch =
  typeof window !== 'undefined' && window.matchMedia('(hover: none), (pointer: coarse)').matches;

let lenis: Lenis | null = null;

/** Optional gate on wheel/touch input; return false to swallow an event (used by the desk's stepped scroll). */
export type WheelGate = (d: { deltaY: number; event: WheelEvent | TouchEvent }) => boolean;
let wheelGate: WheelGate | null = null;
export const setWheelGate = (gate: WheelGate | null) => {
  wheelGate = gate;
};
const progressListeners = new Set<(p: number) => void>();

function emitProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const p = max > 0 ? window.scrollY / max : 0;
  progressListeners.forEach((fn) => fn(p));
}

/** Boot Lenis and drive it from GSAP's ticker so ScrollTrigger and Lenis share one clock. */
export function initSmoothScroll(): () => void {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  if (prefersReducedMotion) {
    window.addEventListener('scroll', emitProgress, { passive: true });
    return () => window.removeEventListener('scroll', emitProgress);
  }

  lenis = new Lenis({
    lerp: 0.14, // follows the wheel closely: smooth, but no long floaty tail
    autoRaf: false,
    virtualScroll: (d) => (wheelGate ? wheelGate(d) : true),
  });
  lenis.on('scroll', ScrollTrigger.update);
  lenis.on('scroll', emitProgress);
  const tick = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
  };
}

export const getLenis = () => lenis;

export function lockScroll(locked: boolean) {
  document.documentElement.classList.toggle('is-locked', locked);
  if (locked) lenis?.stop();
  else lenis?.start();
}

export function onScrollProgress(fn: (p: number) => void) {
  progressListeners.add(fn);
  return () => progressListeners.delete(fn);
}

/** A pinned section is moved into a fixed layer while pinned: its in-flow spacer is where it really starts. */
function flowBox(el: HTMLElement) {
  const parent = el.parentElement;
  return parent?.classList.contains('pin-spacer') ? parent : el;
}

/** Page Y where an element starts (pin spacers respected, independent of the current scroll). */
export function pageTop(el: HTMLElement) {
  const y = lenis ? lenis.scroll : window.scrollY;
  return Math.round(flowBox(el).getBoundingClientRect().top + y);
}

export function scrollToTarget(target: string | HTMLElement | number, duration = 1.6, onComplete?: () => void) {
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : typeof target === 'number' ? null : target;
  if (typeof target !== 'number' && !el) return;
  const y = typeof target === 'number' ? target : pageTop(el!);
  if (lenis) {
    lenis.scrollTo(y, { duration, force: true, onComplete });
    return;
  }
  window.scrollTo({ top: y, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  if (onComplete) {
    // native smooth scroll has no callback: wait until the page stops moving
    let last = -1;
    const check = () => {
      if (Math.abs(window.scrollY - last) < 1) return onComplete();
      last = window.scrollY;
      window.setTimeout(check, 120);
    };
    window.setTimeout(check, 120);
  }
}

/**
 * Nav jumps to a section: re-measure every trigger first (so pinned sections above report their
 * real length), then glide to the section's exact top.
 */
export function scrollToSection(selector: string, onComplete?: () => void) {
  ScrollTrigger.refresh();
  scrollToTarget(selector, 1.4, onComplete);
}

/** "Contact" and "Connect with me": land exactly on the Contact section, then put the cursor in the form. */
export function goToContact() {
  scrollToSection('#contact', () => {
    document.querySelector<HTMLElement>('#contact [data-first-field]')?.focus({ preventScroll: true });
  });
}

/** Debounced global refresh, used after lazy sections mount. */
let refreshTimer = 0;
export function requestRefresh() {
  window.clearTimeout(refreshTimer);
  refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 60);
}

export { gsap, ScrollTrigger };
