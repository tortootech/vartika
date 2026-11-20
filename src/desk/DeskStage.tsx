import { useLayoutEffect, useRef, type CSSProperties } from 'react';
import { hero } from '../content';
import { ScrollTrigger, gsap, prefersReducedMotion, scrollToTarget } from '../lib/scroll';
import { setSection } from '../lib/store';
import { useMedia } from '../lib/useMedia';
import { Doodle } from './Doodles';
import { Laptop, Mug, Pen, Steam } from './Props';
import { ToolkitLayer } from './ToolkitLayer';
import { TOOLKIT_CENTER, TOOLKIT_FOLDER, cardSpin, folders, notes, papers, pen } from './layout';
import s from './DeskStage.module.css';

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/** Layout position of `el` inside `root`, ignoring transforms (so it is the tidy position). */
function boxIn(el: HTMLElement, root: HTMLElement) {
  let x = 0;
  let y = 0;
  let n: HTMLElement | null = el;
  while (n && n !== root) {
    x += n.offsetLeft;
    y += n.offsetTop;
    n = n.offsetParent as HTMLElement | null;
  }
  return { cx: x + el.offsetWidth / 2, cy: y + el.offsetHeight / 2, w: el.offsetWidth, h: el.offsetHeight };
}

const num = (el: HTMLElement, key: string) => Number(el.dataset[key] ?? 0);

/** Phase boundary: before this time the counter reads 01, after it 02. */
const PHASE_B = 2.8;

export function DeskStage() {
  const stageRef = useRef<HTMLElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const isMobile = useMedia('(max-width: 767px)');
  const motion = !prefersReducedMotion;

  const folderIdx = folders.map((f, i) => ({ ...f, i })).filter((f) => !isMobile || f.mobile);
  const visibleFolders = new Set(folderIdx.map((f) => f.i));
  const paperList = papers.filter((p) => visibleFolders.has(p.folder));
  const noteList = notes.filter((n) => !isMobile || n.mobile);

  // --- the scrubbed timeline -------------------------------------------------
  useLayoutEffect(() => {
    const stage = stageRef.current;
    const world = worldRef.current;
    if (!stage || !world) return;

    if (!motion) {
      const st = gsap.context(() => {
        ScrollTrigger.create({
          trigger: stage,
          start: 'top 50%',
          end: 'bottom 50%',
          onToggle: (self) => self.isActive && setSection({ index: 1, theme: 'desk' }),
        });
        const tk = document.getElementById('toolkit');
        if (tk)
          ScrollTrigger.create({
            trigger: tk,
            start: 'top 50%',
            end: 'bottom 50%',
            onToggle: (self) => self.isActive && setSection({ index: 2, theme: 'desk' }),
          });
      }, stage);
      return () => st.revert();
    }

    // Measure every animated element in one read pass (no read/write interleaving → no layout thrash).
    // Offsets ignore transforms, so these are the tidy positions. Re-measured on every refresh.
    const boxes = new Map<HTMLElement, ReturnType<typeof boxIn>>();
    let size = { w: 0, h: 0 };
    const measure = () => {
      boxes.clear();
      size = { w: world.offsetWidth, h: world.offsetHeight };
      world.querySelectorAll<HTMLElement>('[data-slot], [data-note], [data-pen], [data-paper], [data-card]').forEach((el) => boxes.set(el, boxIn(el, world)));
    };
    const box = (el: HTMLElement) => boxes.get(el) ?? boxIn(el, world);
    measure();
    ScrollTrigger.addEventListener('refreshInit', measure);

    const ctx = gsap.context(() => {
      const W = () => size.w;
      const H = () => size.h;
      const all = <T extends HTMLElement = HTMLElement>(sel: string, root: ParentNode = world) =>
        Array.from(root.querySelectorAll<T>(sel));

      const tl = gsap.timeline({
        defaults: { ease: 'power3.inOut' },
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: () => `+=${Math.round(window.innerHeight * (isMobile ? 4.2 : 4.6))}`,
          pin: true,
          scrub: 0.9,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const t = self.progress * tl.duration();
            setSection({ index: t < PHASE_B ? 1 : 2 });
            world.classList.toggle(s.tidy, t > 0.12);
          },
          onToggle: (self) => {
            stage.classList.toggle(s.live, self.isActive);
            if (self.isActive) setSection({ theme: 'desk' });
          },
        },
      });

      // ---------- Phase A: the mess gets organized ----------
      const hint = world.querySelector('[data-hint]');
      if (hint) tl.to(hint, { opacity: 0, y: 12, duration: 0.3, ease: 'power1.out' }, 0);

      // Folders (back + front panel move as one rigid piece around the slot center)
      const slots = all('[data-slot]');
      slots.forEach((slot, order) => {
        const parts = all('[data-folder-part]', slot);
        const mx = num(slot, 'mx');
        const my = num(slot, 'my');
        const mr = num(slot, 'mr');
        tl.fromTo(
          parts,
          { x: () => mx * W() - box(slot).cx, y: () => my * H() - box(slot).cy, rotation: mr },
          { x: 0, y: 0, rotation: 0, duration: 1 },
          0.05 + order * 0.08,
        );
      });

      // Sticky notes: peel up, then line up along the top edge
      all('[data-note]').forEach((note, i) => {
        const peel = note.firstElementChild as HTMLElement;
        const t = 0.12 + i * 0.1;
        tl.fromTo(
          note,
          { x: () => num(note, 'mx') * W() - box(note).cx, y: () => num(note, 'my') * H() - box(note).cy, rotation: num(note, 'mr') },
          { x: 0, y: 0, rotation: num(note, 'tr'), duration: 0.85 },
          t,
        );
        tl.to(peel, { scale: 1.12, rotation: 7, duration: 0.22, ease: 'power2.out' }, t);
        tl.to(peel, { scale: 1, rotation: 0, duration: 0.45, ease: 'power2.inOut' }, t + 0.3);
      });

      // Pen squares up next to the folders
      const penEl = world.querySelector<HTMLElement>('[data-pen]');
      if (penEl) {
        tl.fromTo(
          penEl,
          { x: () => pen.messy.x * W() - box(penEl).cx, y: () => pen.messy.y * H() - box(penEl).cy, rotation: pen.messy.r },
          { x: 0, y: 0, rotation: 0, duration: 1.2 },
          0.2,
        );
      }

      // Papers: fly above their folder, squared and shrunk, then drop in (z-swap behind the front panel)
      all('[data-paper]')
        .sort((a, b) => num(a, 'order') - num(b, 'order'))
        .forEach((p, i) => {
          const slot = p.closest<HTMLElement>('[data-slot]')!;
          const t = 0.25 + i * (isMobile ? 0.16 : 0.1);
          tl.fromTo(
            p,
            {
              x: () => num(p, 'mx') * W() - box(p).cx,
              y: () => num(p, 'my') * H() - box(p).cy,
              rotation: num(p, 'mr'),
              scale: 1.15,
            },
            { x: 0, y: () => -box(slot).h * 0.95, rotation: 0, scale: 1, duration: 1 },
            t,
          );
          tl.set(p, { zIndex: num(p, 'z') }, t + 1);
          tl.to(p, { y: 0, duration: 0.3, ease: 'power2.in' }, t + 1);
        });

      // Hero copy arrives on the cleared desk
      const copy = all('[data-hero-copy] > *');
      tl.fromTo(copy, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.1, ease: 'power2.out' }, 2.0);

      // ---------- Phase B: one folder opens, the toolkit spills out ----------
      const B = PHASE_B;
      tl.to(copy, { opacity: 0, y: -40, duration: 0.35, stagger: 0.05, ease: 'power2.in' }, B);
      tl.to(all('[data-note]'), { yPercent: -70, opacity: 0, duration: 0.4, stagger: 0.04, ease: 'power2.in' }, B);

      // The mug slides down out of the toolkit's way
      const mug = world.querySelector('[data-mug]');
      if (mug) tl.to(mug, { y: () => H() * 0.26, x: () => W() * 0.025, rotation: 8, duration: 0.8 }, B + 0.2);

      const tkSlot = world.querySelector<HTMLElement>('[data-toolkit-slot]')!;
      const others = slots.filter((sl) => sl !== tkSlot).flatMap((sl) => all('[data-folder-part], [data-paper]', sl));
      tl.to(others, { yPercent: 45, opacity: 0, duration: 0.5, stagger: 0.015, ease: 'power2.in' }, B);

      const tkBack = tkSlot.querySelector('[data-back]')!;
      const tkFront = tkSlot.querySelector<HTMLElement>('[data-front]')!;
      const tkPapers = all('[data-paper]', tkSlot);
      const tkShadow = tkSlot.querySelector('[data-lift]')!;
      const group = [tkBack, tkFront, tkShadow, ...tkPapers];
      const toCenterX = () => TOOLKIT_CENTER.x * W() - box(tkSlot).cx;
      const toCenterY = () => TOOLKIT_CENTER.y * H() - box(tkSlot).cy;

      tl.to(group, { y: -18, duration: 0.3, ease: 'power2.out' }, B + 0.1);
      tl.to(tkShadow, { opacity: 1, duration: 0.3, ease: 'power1.out' }, B + 0.1);
      tl.to(group, { x: toCenterX, y: () => toCenterY() - 18, duration: 0.6 }, B + 0.35);
      tl.set(tkFront, { transformOrigin: '50% 100%', transformPerspective: 1000 }, B + 0.94);
      tl.to(tkFront, { rotationX: -172, duration: 0.55, ease: 'power2.inOut' }, B + 0.95);
      tl.to(tkPapers, { yPercent: -25, opacity: 0, duration: 0.35, ease: 'power1.in' }, B + 1.2);

      // Tool cards pop out of the open folder to their grouped places
      const fx = () => TOOLKIT_CENTER.x * W();
      const fy = () => TOOLKIT_CENTER.y * H() - 18;
      all('[data-card]').forEach((card, i) => {
        tl.fromTo(
          card,
          { x: () => fx() - box(card).cx, y: () => fy() - box(card).cy, scale: 0.3, opacity: 0, rotation: cardSpin(i) },
          { x: 0, y: 0, scale: 1, opacity: 1, rotation: num(card, 'tilt'), duration: 0.6, ease: 'back.out(1.5)' },
          B + 1.2 + i * 0.05,
        );
      });
      tl.fromTo(all('[data-tk-head]'), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }, B + 1.35);
      tl.to([tkBack, tkFront, tkShadow], { yPercent: 25, opacity: 0, duration: 0.45, ease: 'power2.in' }, B + 2.0);
      tl.to({}, { duration: 0.4 }, B + 2.4); // hold the finished toolkit
    }, stage);

    return () => {
      ScrollTrigger.removeEventListener('refreshInit', measure);
      ctx.revert();
    };
  }, [isMobile, motion]);

  // --- mouse parallax (one CSS variable write per frame) ---------------------
  useLayoutEffect(() => {
    const world = worldRef.current;
    if (!world || !motion || !window.matchMedia('(hover: hover)').matches) return;
    let raf = 0;
    let mx = 0;
    let my = 0;
    const onMove = (e: PointerEvent) => {
      mx = (e.clientX / window.innerWidth) * 2 - 1;
      my = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0;
          world.style.setProperty('--mx', mx.toFixed(3));
          world.style.setProperty('--my', my.toFixed(3));
        });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [motion]);

  const [first, ...rest] = hero.name.split(' ');
  const zBase = (i: number) => 10 + i * 3;

  return (
    <>
      <section
        id="top"
        ref={stageRef}
        className={`${s.stage} ${motion ? s.motion : s.still}`}
        aria-label="Introduction: a messy desk that organizes itself"
      >
        <div ref={worldRef} className={s.world} data-desk-world>
          <div className={s.desk} aria-hidden="true" />

          <div className={s.laptop} style={{ '--d': 3 } as Vars} aria-hidden="true">
            <div className={s.par}>
              <Laptop />
            </div>
          </div>

          {!isMobile && (
            <div className={s.mug} data-mug style={{ '--d': 5 } as Vars} role="img" aria-label="A cup of coffee, still steaming">
              <div className={s.par}>
                <Mug />
                <div className={s.steam}>
                  <Steam />
                </div>
              </div>
            </div>
          )}

          <div className={s.pen} data-pen style={{ '--d': pen.depth } as Vars} aria-hidden="true">
            <div className={s.par}>
              <div className={s.float} style={{ '--fd': '7s', '--fdl': '-2s' } as Vars}>
                <Pen />
              </div>
            </div>
          </div>

          {/* Sticky notes: tidy state is a row along the top edge */}
          <ul className={s.notes} aria-label="Sticky notes">
            {noteList.map((n, i) => (
              <li
                key={i}
                className={`${s.note} ${s['tone_' + n.tone]}`}
                data-note
                data-mx={n.messy.x}
                data-my={n.messy.y}
                data-mr={n.messy.r}
                data-tr={n.tidyR}
                style={{ '--d': n.depth, zIndex: 54 + i, rotate: motion ? undefined : `${n.tidyR}deg` } as Vars}
              >
                <div className={s.peel}>
                  <div className={s.par}>
                    <div className={s.float} style={{ '--fd': `${5 + i}s`, '--fdl': `${-i * 1.3}s` } as Vars}>
                      <div className={s.noteFace}>{hero.notes[notes.indexOf(n)]}</div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Folder row: tidy layout. Back panel, papers and front panel are siblings so papers can tuck in between. */}
          <div className={s.row} role="list" aria-label="Folders">
            {folderIdx.map((f, order) => {
              const isTk = f.i === TOOLKIT_FOLDER;
              const fvars = { '--d': f.depth, '--fd': `${6 + (order % 3)}s`, '--fdl': `${-order * 1.7}s` } as Vars;
              return (
                <div
                  key={f.i}
                  role="listitem"
                  className={s.slot}
                  data-slot
                  data-toolkit-slot={isTk || undefined}
                  data-mx={f.messy.x}
                  data-my={f.messy.y}
                  data-mr={f.messy.r}
                  aria-label={`Folder: ${hero.folders[f.i]}`}
                >
                  {isTk && <div className={s.lift} data-lift style={{ zIndex: zBase(order) - 1 }} aria-hidden="true" />}
                  <div className={s.back} data-folder-part data-back style={{ ...fvars, zIndex: zBase(order) }} aria-hidden="true">
                    <div className={s.par}>
                      <div className={s.float}>
                        <div className={s.backFace}>
                          <span className={s.tab}>{String(f.i + 1).padStart(2, '0')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {paperList
                    .filter((p) => p.folder === f.i)
                    .map((p) => (
                      <div
                        key={p.kind}
                        className={`${s.paper} ${p.slot ? s.paperB : ''}`}
                        data-paper
                        data-order={order * 2 + p.slot}
                        data-mx={p.messy.x}
                        data-my={p.messy.y}
                        data-mr={p.messy.r}
                        data-z={zBase(order) + 1}
                        style={{ '--d': p.depth, '--fd': `${5 + (p.depth % 4)}s`, '--fdl': `${-p.depth * 0.6}s`, zIndex: motion ? 40 + papers.indexOf(p) : zBase(order) + 1 } as Vars}
                        role="img"
                        aria-label={`A sheet with a ${p.kind === 'erd' ? 'entity-relationship diagram' : p.kind + ' sketch'}`}
                      >
                        <div className={s.par}>
                          <div className={s.float}>
                            <div className={s.sheet}>
                              <Doodle kind={p.kind} />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                  <div className={s.front} data-folder-part data-front style={{ ...fvars, zIndex: zBase(order) + 2 }} aria-hidden="true">
                    <div className={s.par}>
                      <div className={s.float}>
                        <div className={s.frontFace}>
                          <span className={s.fNum}>{String(f.i + 1).padStart(3, '0')}.</span>
                          <span className={s.fLabel}>{hero.folders[f.i]}</span>
                        </div>
                        <div className={s.frontInside} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* End-of-phase-A copy */}
          <div className={s.copy} data-hero-copy>
            <h1 className={`display ${s.name}`}>
              <strong>{first}</strong> <em>{rest.join(' ')}</em>
            </h1>
            <p className={s.lead}>{hero.lead}</p>
            <div>
              <a
                className={s.cta}
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget('#projects');
                }}
              >
                {hero.cta}
                <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                  <path d="M8 2v11M3 8.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </a>
            </div>
          </div>

          {motion && (
            <p className={`mono-label ${s.hint}`} data-hint aria-hidden="true">
              <span className={s.hintDot} /> {hero.scrollHint}
            </p>
          )}

          {motion && <ToolkitLayer />}
        </div>
      </section>

      {!motion && (
        <section id="toolkit" aria-label="Technical toolkit" className={s.toolkitStatic}>
          <ToolkitLayer standalone />
        </section>
      )}
    </>
  );
}
