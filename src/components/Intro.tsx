import { useLayoutEffect } from 'react';
import { restReady } from '../lib/ready';
import { gsap, lockScroll, prefersReducedMotion } from '../lib/scroll';

const SEEN = 'vy-intro-seen';

/**
 * The intro screen itself is server-rendered into index.html (#boot, see vite.config.ts),
 * where "Hey, it's Vartika." types in with pure CSS before any JS loads.
 * This component takes it over: hold ≈1.5s → text lifts away while the desk camera pulls back.
 * Scroll stays locked until it finishes.
 */
export function Intro({ onDone }: { onDone: () => void }) {
  useLayoutEffect(() => {
    const el = document.getElementById('boot');
    const world = document.querySelector('[data-desk-world]');
    const finish = () => {
      try {
        sessionStorage.setItem(SEEN, '1');
      } catch {
        /* storage blocked: intro simply plays in full next time */
      }
      document.documentElement.classList.add('intro-done');
      el?.remove();
      lockScroll(false);
      onDone();
    };
    if (!el) {
      finish();
      return;
    }

    lockScroll(true);
    const quick = document.documentElement.classList.contains('quick');
    const k = quick ? 0.45 : 1;
    // the CSS type-in ends ≈1.65s (×k) after navigation; hold ≈1.5s after that
    const typedAt = 1.65 * k;
    const elapsed = performance.now() / 1000;
    const wait = Math.max(0.3, typedAt - elapsed) + (prefersReducedMotion ? 0.9 : 1.5 * k);

    let tl: gsap.core.Timeline | null = null;
    const ctx = gsap.context(() => {
      const text = el.querySelector('[data-text]');
      tl = gsap.timeline({ paused: true, onComplete: finish, defaults: { ease: 'power3.in' } });
      if (prefersReducedMotion) {
        tl.to(el, { opacity: 0, duration: 0.5, ease: 'none' });
        return;
      }
      // the desk is promoted to its own layer only for the camera move, so the scale is composited
      tl.set(world, { willChange: 'transform' })
        .to(text, { yPercent: -60, opacity: 0, duration: 0.8 * k })
        .to(el, { opacity: 0, duration: 0.9 * k, ease: 'power2.inOut' }, '-=0.35')
        .to(world, { scale: 1, duration: 1.5 * k, ease: 'power3.inOut' }, '<-0.25')
        .set(world, { willChange: 'auto' });
    });

    // start when the hold is over AND the sections below have been built (capped, never stuck)
    const sleep = (s: number) => new Promise<void>((r) => window.setTimeout(r, s * 1000));
    let cancelled = false;
    Promise.all([sleep(wait), Promise.race([restReady, sleep(wait + 3)])]).then(() => {
      if (!cancelled) tl?.play();
    });

    return () => {
      cancelled = true;
      ctx.revert();
      lockScroll(false);
    };
  }, [onDone]);

  return null;
}
