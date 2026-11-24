import { useEffect, useRef } from 'react';
import { onScrollProgress } from '../lib/scroll';
import { useSection } from '../lib/store';
import { nav } from '../content';
import s from './HUD.module.css';

/** Section counter `[ 0X / 0N ]` (N = number of sections in content.ts) and the thin progress bar along the right edge. */
export function HUD() {
  const { index, theme } = useSection();
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const off = onScrollProgress((p) => {
      if (barRef.current) barRef.current.style.transform = `scaleY(${p.toFixed(4)})`;
    });
    return () => {
      off();
    };
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');
  const total = nav.sections.length;
  return (
    <div className={`${s.hud} ${s[theme]}`}>
      <p className={`mono-label ${s.counter}`} aria-live="polite">
        <span className="visually-hidden">
          Section {index} of {total}: {nav.sections[index - 1]?.label}
        </span>
        <span aria-hidden="true">
          [ <span className={s.num} key={index}>{pad(index)}</span> / {pad(total)} ]
        </span>
      </p>
      <div className={s.track} aria-hidden="true">
        <div className={s.bar} ref={barRef} />
      </div>
    </div>
  );
}
