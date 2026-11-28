import { useEffect, useRef } from 'react';
import { isTouch } from '../lib/scroll';
import s from './Cursor.module.css';

const INTERACTIVE = 'a, button, summary, [role="button"], [data-cursor]';

/** A small slate dot that follows the pointer exactly and grows over interactive elements. Off on touch. */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || isTouch) return;
    document.documentElement.classList.add('has-cursor');
    // The dot sits exactly under the pointer: no easing (easing reads as lag). One transform write
    // per frame at most, on a layer of its own, so it never triggers layout.
    let shown = false;
    let x = 0;
    let y = 0;
    let raf = 0;
    const draw = () => {
      raf = 0;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      x = e.clientX;
      y = e.clientY;
      if (!shown) {
        shown = true;
        draw();
        el.classList.add(s.on);
        return;
      }
      if (!raf) raf = requestAnimationFrame(draw);
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
      cancelAnimationFrame(raf);
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
