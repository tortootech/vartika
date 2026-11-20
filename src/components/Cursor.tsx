import { useEffect, useRef } from 'react';
import { gsap, isTouch } from '../lib/scroll';
import s from './Cursor.module.css';

const INTERACTIVE = 'a, button, summary, [role="button"], [data-cursor]';

/** A small slate dot that trails the pointer and grows over interactive elements. Off on touch. */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || isTouch) return;
    document.documentElement.classList.add('has-cursor');
    const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' });
    let shown = false;
    const move = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      if (!shown) {
        shown = true;
        gsap.set(el, { x: e.clientX, y: e.clientY });
        el.classList.add(s.on);
      }
      xTo(e.clientX);
      yTo(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const hit = (e.target as Element | null)?.closest?.(INTERACTIVE);
      el.classList.toggle(s.grow, !!hit);
    };
    const leave = () => el.classList.remove(s.on);
    const enter = () => shown && el.classList.add(s.on);
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    document.documentElement.addEventListener('pointerenter', enter);
    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.documentElement.removeEventListener('pointerleave', leave);
      document.documentElement.removeEventListener('pointerenter', enter);
    };
  }, []);

  if (isTouch) return null;
  return (
    <div ref={ref} className={s.cursor} aria-hidden="true">
      <div className={s.dot} />
    </div>
  );
}
