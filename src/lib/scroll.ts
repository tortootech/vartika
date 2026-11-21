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
    duration: 1.15,
    easing: (t) => 1 - Math.pow(1 - t, 4),
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

export function scrollToTarget(target: string | HTMLElement | number) {
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.6 });
    return;
  }
  if (typeof target === 'number') return window.scrollTo({ top: target });
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  el?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
}

/** Debounced global refresh, used after lazy sections mount. */
let refreshTimer = 0;
export function requestRefresh() {
  window.clearTimeout(refreshTimer);
  refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 60);
}

export { gsap, ScrollTrigger };
