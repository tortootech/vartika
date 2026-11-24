import { useLayoutEffect, useRef, type CSSProperties } from 'react';
import { about } from '../content';
import { gsap, prefersReducedMotion } from '../lib/scroll';
import { useSectionTriggers } from '../lib/useSectionTriggers';
import s from './About.module.css';

type Vars = CSSProperties & Record<`--${string}`, string | number>;
type Kind = 'tag' | 'num' | 'blank' | 'why' | 'q';
interface Piece { kind: Kind; text?: string; col?: number; row?: number; fx: number; fy: number; r: number; d: number }

/** Board grid: 4 columns × 5 rows. Pieces start scattered (fx/fy: fraction of the board, r: tilt). */
const COLS = 4;
const ROWS = 5;
const [t, n] = [about.tags, about.numbers];
const pieces: Piece[] = [
  // row 0–1: her path, as header tags
  { kind: 'tag', text: t[0], col: 0, row: 0, fx: 0.52, fy: 0.62, r: -14, d: 6 },
  { kind: 'tag', text: t[1], col: 1, row: 0, fx: 0.06, fy: 0.3, r: 9, d: 9 },
  { kind: 'tag', text: t[2], col: 2, row: 0, fx: 0.66, fy: 0.08, r: 16, d: 5 },
  { kind: 'tag', text: t[3], col: 3, row: 0, fx: 0.2, fy: 0.78, r: -8, d: 8 },
  { kind: 'tag', text: t[4], col: 0, row: 1, fx: 0.74, fy: 0.44, r: 12, d: 7 },
  { kind: 'tag', text: t[5], col: 1, row: 1, fx: 0.34, fy: 0.04, r: -18, d: 10 },
  // numbers from her resume
  { kind: 'num', text: n[0], col: 2, row: 1, fx: 0.04, fy: 0.58, r: -6, d: 4 },
  { kind: 'num', text: n[1], col: 3, row: 1, fx: 0.46, fy: 0.24, r: 11, d: 8 },
  { kind: 'num', text: n[2], col: 0, row: 2, fx: 0.78, fy: 0.72, r: -12, d: 6 },
  { kind: 'num', text: n[3], col: 1, row: 2, fx: 0.24, fy: 0.5, r: 7, d: 9 },
  { kind: 'num', text: n[4], col: 2, row: 2, fx: 0.58, fy: 0.86, r: -9, d: 5 },
  { kind: 'num', text: n[5], col: 3, row: 2, fx: 0.1, fy: 0.06, r: 15, d: 7 },
  { kind: 'num', text: n[6], col: 1, row: 3, fx: 0.7, fy: 0.3, r: -4, d: 6 },
  // loose spreadsheet cells
  { kind: 'blank', col: 0, row: 3, fx: 0.38, fy: 0.72, r: 21, d: 4 },
  { kind: 'blank', col: 2, row: 3, fx: 0.02, fy: 0.84, r: -16, d: 8 },
  { kind: 'blank', col: 3, row: 3, fx: 0.82, fy: 0.16, r: 8, d: 5 },
  { kind: 'blank', col: 0, row: 4, fx: 0.5, fy: 0.42, r: -22, d: 9 },
  { kind: 'blank', col: 1, row: 4, fx: 0.16, fy: 0.16, r: 13, d: 6 },
  { kind: 'blank', col: 3, row: 4, fx: 0.62, fy: 0.56, r: -10, d: 7 },
  // the one that stays: "why?"
  { kind: 'why', text: 'why?', col: 2, row: 4, fx: 0.3, fy: 0.34, r: -7, d: 12 },
  // big loose question marks: answered (they fade) as the table tidies up
  { kind: 'q', text: '?', fx: 0.12, fy: 0.12, r: -12, d: 14 },
  { kind: 'q', text: '?', fx: 0.6, fy: 0.5, r: 10, d: 11 },
  { kind: 'q', text: '?', fx: 0.3, fy: 0.66, r: 18, d: 16 },
];

/** Pin and scrub only where two columns fit; everywhere else the composition sits above the text. */
const PIN_QUERY = '(min-width: 1024px) and (min-height: 600px)';

function Beat({ text, k }: { text: string; k: string }) {
  const i = text.indexOf(k);
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span className={s.key}>{k}</span>
      {text.slice(i + k.length)}
    </>
  );
}

export function About() {
  const ref = useRef<HTMLElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = ref.current;
    const board = boardRef.current;
    if (!section || !board) return;
    const mm = gsap.matchMedia();
    const all = gsap.utils.toArray<HTMLElement>('[data-piece]', board);
    const grid = board.querySelector('[data-grid]');
    const qs = all.filter((p) => p.dataset.kind === 'q');
    const cells = all.filter((p) => p.dataset.kind !== 'q');
    const why = board.querySelector('[data-kind="why"]');

    /** From a piece's scattered spot to its cell (its CSS position), in board pixels. */
    const messy = (p: HTMLElement) => ({
      x: () => +p.dataset.fx! * board.clientWidth - p.offsetLeft,
      y: () => +p.dataset.fy! * board.clientHeight - p.offsetTop,
      rotation: +p.dataset.r!,
    });
    const tidy = (tl: gsap.core.Timeline, span: number) => {
      cells.forEach((p, i) => tl.fromTo(p, messy(p), { x: 0, y: 0, rotation: 0, ease: 'power2.inOut', duration: span * 0.55 }, (i / cells.length) * span * 0.45));
      qs.forEach((q) => tl.fromTo(q, messy(q), { x: 0, y: 0, rotation: 0, opacity: 0, scale: 0.4, ease: 'power2.in', duration: span * 0.5 }, span * 0.2));
      tl.fromTo(board, { '--amp': 1 }, { '--amp': 0, ease: 'none', duration: span * 0.8 }, 0);
      tl.fromTo(grid, { opacity: 0 }, { opacity: 1, ease: 'none', duration: span * 0.3 }, span * 0.65);
      tl.fromTo(why, { '--on': 0 }, { '--on': 1, ease: 'none', duration: span * 0.15 }, span * 0.9);
    };

    if (prefersReducedMotion) {
      section.dataset.mode = 'stack';
      board.classList.add(s.done); // the final, tidy state
      gsap.set(board, { '--amp': 0 });
      gsap.set(why, { '--on': 1 });
      gsap.set(qs, { opacity: 0 });
      return () => {
        delete section.dataset.mode;
        board.classList.remove(s.done);
      };
    }

    mm.add(PIN_QUERY, () => {
      section.dataset.mode = 'pin';
      const beats = gsap.utils.toArray<HTMLElement>('[data-beat]', section);
      const count = section.querySelector('[data-count]');
      const STEP = 2;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.round(window.innerHeight * 1.3)}`,
          pin: true,
          scrub: 0.3,
          invalidateOnRefresh: true,
          onUpdate: (st) => {
            const i = Math.min(beats.length - 1, Math.floor(st.progress * beats.length * 0.999));
            if (count) count.textContent = String(i + 1).padStart(2, '0');
          },
        },
      });
      tidy(tl, beats.length * STEP - 1);
      // beats: one at a time, each fades up into the same spot; the last one stays
      gsap.set(beats.slice(1), { autoAlpha: 0, y: 24 });
      beats.forEach((b, i) => {
        if (i > 0) tl.to(b, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, i * STEP);
        if (i < beats.length - 1) tl.to(b, { autoAlpha: 0, y: -24, duration: 0.5, ease: 'power2.in' }, (i + 1) * STEP - 0.45);
      });
      tl.to({}, { duration: 0.6 }); // hold the last beat a moment before the pin lets go
      return () => delete section.dataset.mode;
    });

    mm.add(`not all and ${PIN_QUERY}`, () => {
      section.dataset.mode = 'stack';
      // the board tidies itself as it scrolls through the screen; beats rise in one by one
      const tl = gsap.timeline({ scrollTrigger: { trigger: board, start: 'top 85%', end: 'bottom 45%', scrub: 0.3 } });
      tidy(tl, 4);
      gsap.utils.toArray<HTMLElement>('[data-beat]', section).forEach((b) =>
        gsap.from(b, { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: b, start: 'top 88%', toggleActions: 'play none none none' } }),
      );
      return () => delete section.dataset.mode;
    });

    // mouse parallax (fine pointers only): one pair of CSS variables on the board
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = board.getBoundingClientRect();
        board.style.setProperty('--mx', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
        board.style.setProperty('--my', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
      });
    };
    section.addEventListener('pointermove', onMove, { passive: true });

    return () => {
      section.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
      mm.revert();
    };
  }, []);

  useSectionTriggers(ref, 'cream', 'navy'); // after the pin, so it measures the pinned length

  return (
    <section id="about" ref={ref} className={`sheet sheet--cream ${s.section}`} aria-labelledby="about-title">
      <div className={s.inner}>
        <p className="mono-label">[ {about.label} ]</p>
        <h2 id="about-title" className="visually-hidden">
          {about.label}
        </h2>

        <div className={s.split}>
          <div className={s.board} ref={boardRef} aria-hidden="true">
            <svg className={s.grid} data-grid viewBox={`0 0 ${COLS * 10} ${ROWS * 10}`} preserveAspectRatio="none">
              {Array.from({ length: COLS + 1 }, (_, i) => (
                <line key={`c${i}`} x1={i * 10} y1={0} x2={i * 10} y2={ROWS * 10} vectorEffect="non-scaling-stroke" />
              ))}
              {Array.from({ length: ROWS + 1 }, (_, i) => (
                <line key={`r${i}`} x1={0} y1={i * 10} x2={COLS * 10} y2={i * 10} vectorEffect="non-scaling-stroke" />
              ))}
            </svg>
            {pieces.map((p, i) => {
              const style: Vars =
                p.kind === 'q'
                  ? { left: 0, top: 0, '--d': p.d, '--fd': `${5 + (i % 4)}s`, '--fdl': `${-i * 0.7}s` }
                  : {
                      left: `${(p.col! / COLS) * 100}%`,
                      top: `${(p.row! / ROWS) * 100}%`,
                      width: `${100 / COLS}%`,
                      height: `${100 / ROWS}%`,
                      '--d': p.d,
                      '--fd': `${4 + (i % 5)}s`,
                      '--fdl': `${-i * 0.9}s`,
                    };
              return (
                <div key={i} className={`${s.piece} ${s[p.kind]}`} data-piece data-kind={p.kind} data-fx={p.fx} data-fy={p.fy} data-r={p.r} style={style}>
                  <div className={s.par}>
                    <div className={s.float}>
                      <span className={s.cell}>{p.text}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={s.story}>
            <p className={`mono-label ${s.count}`} aria-hidden="true">
              <span data-count>01</span> / {String(about.beats.length).padStart(2, '0')}
            </p>
            <div className={s.beats}>
              {about.beats.map((b) => (
                <p key={b.key} className={`display ${s.beat}`} data-beat>
                  <Beat text={b.text} k={b.key} />
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
