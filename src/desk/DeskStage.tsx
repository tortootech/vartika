import { useLayoutEffect, useRef, type CSSProperties } from 'react';
import { hero } from '../content';
import { ScrollTrigger, getLenis, gsap, prefersReducedMotion, scrollToTarget, setWheelGate } from '../lib/scroll';
import { setSection } from '../lib/store';
import { useMedia } from '../lib/useMedia';
import { Doodle, type DoodleKind } from './Doodles';
import { ToolkitLayer } from './ToolkitLayer';
import { TOOLKIT_FOLDER, folders, papers } from './layout';
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

const docLabel: Record<DoodleKind, string> = {
  dashboard: 'A sales dashboard: revenue by month, AOV and repeat rate',
  trend: 'A monthly order trend chart with a November spike',
  table: 'A table of sample order rows',
  sql: 'A SQL query that computes AOV by month',
  erd: 'An entity-relationship diagram of six tables',
  process: 'An order-to-delivery process flow with swimlanes',
  brd: 'A page from a business requirements document',
  matrix: 'A requirements traceability matrix',
  stakeholder: 'A stakeholder power and interest map',
  audit: 'An SEO audit showing 92% site health',
};

const num = (el: HTMLElement, key: string) => Number(el.dataset[key] ?? 0);
const pad = (n: number) => String(n).padStart(2, '0');

/** Phase boundary: before this time the counter reads 01, after it 02. */
const PHASE_B = 2.5;
/** Timeline times the scroll comes to rest on: one scroll = one step. */
const STOP_TIDY = 1.75;
/** Folder proportions: height = width × FOLDER_H. The back face starts BACK_TOP down (above it is the tab). */
const FOLDER_H = 1.18;
const BACK_TOP = 0.08;

export function DeskStage() {
  const stageRef = useRef<HTMLElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const isMobile = useMedia('(max-width: 767px)');
  const motion = !prefersReducedMotion;

  const folderIdx = folders.map((f, i) => ({ ...f, i })).filter((f) => !isMobile || f.mobile);
  const visibleFolders = new Set(folderIdx.map((f) => f.i));
  const paperList = papers.filter((p) => visibleFolders.has(p.folder));
  const tkPapers = papers.filter((p) => p.folder === TOOLKIT_FOLDER);

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
            onToggle: (self) => self.isActive && setSection({ index: 2, theme: 'navy' }),
          });
      }, stage);
      return () => st.revert();
    }

    // Measure every animated element in one read pass (no read/write interleaving → no layout thrash).
    // Offsets ignore transforms, so these are the tidy positions. Re-measured on every refresh.
    const boxes = new Map<HTMLElement, ReturnType<typeof boxIn>>();
    let size = { w: 0, h: 0 };
    let zw = 0; // native width of the zoom folder: big enough that its back face covers the screen
    const zoom = world.querySelector<HTMLElement>('[data-zoom]')!;
    const measure = () => {
      boxes.clear();
      size = { w: world.offsetWidth, h: world.offsetHeight };
      world.querySelectorAll<HTMLElement>('[data-slot], [data-paper]').forEach((el) => boxes.set(el, boxIn(el, world)));
      zw = Math.ceil(Math.max(size.w, size.h / (FOLDER_H * (1 - BACK_TOP))) * 1.04);
      zoom.style.setProperty('--fw', `${zw}px`);
    };
    const box = (el: HTMLElement) => boxes.get(el) ?? boxIn(el, world);
    measure();
    ScrollTrigger.addEventListener('refreshInit', measure);

    const cleanups: (() => void)[] = [];
    const ctx = gsap.context(() => {
      const W = () => size.w;
      const H = () => size.h;
      const all = <T extends HTMLElement = HTMLElement>(sel: string, root: ParentNode = world) =>
        Array.from(root.querySelectorAll<T>(sel));
      let theme: 'desk' | 'navy' = 'desk';

      const tl = gsap.timeline({
        defaults: { ease: 'power3.inOut' },
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: () => `+=${Math.round(window.innerHeight * (isMobile ? 4.0 : 4.4))}`,
          pin: true,
          scrub: 0.25,
          onUpdate: (self) => {
            const t = self.progress * tl.duration();
            theme = t > PHASE_B + 1.2 ? 'navy' : 'desk';
            setSection({ theme }); // the store ignores repeats
            setSection({ index: t < PHASE_B ? 1 : 2 });
            world.classList.toggle(s.tidy, t > 0.12);
            document.documentElement.classList.toggle('desk-steps', self.progress < 0.995);
          },
          onToggle: (self) => {
            stage.classList.toggle(s.live, self.isActive);
            if (self.isActive) setSection({ theme });
          },
        },
      });

      // ---------- Phase A: the mess gets organized ----------
      const hint = world.querySelector('[data-hint]');
      if (hint) tl.to(hint, { opacity: 0, y: 12, duration: 0.3, ease: 'power1.out' }, 0);

      // Folders (back + front panel move as one rigid piece around the slot center)
      const slots = all('[data-slot]');
      slots.forEach((slot, order) => {
        tl.fromTo(
          all('[data-folder-part]', slot),
          { x: () => num(slot, 'mx') * W() - box(slot).cx, y: () => num(slot, 'my') * H() - box(slot).cy, rotation: num(slot, 'mr') },
          { x: 0, y: 0, rotation: 0, duration: 0.7 },
          0.02 + order * 0.05,
        );
      });

      // Papers: fly above their folder, squared and shrunk, then drop in (z-swap behind the front panel)
      all('[data-paper]')
        .sort((a, b) => num(a, 'order') - num(b, 'order'))
        .forEach((p, i) => {
          const slot = p.closest<HTMLElement>('[data-slot]')!;
          const t = 0.12 + i * (isMobile ? 0.09 : 0.055);
          tl.fromTo(
            p,
            { x: () => num(p, 'mx') * W() - box(p).cx, y: () => num(p, 'my') * H() - box(p).cy, rotation: num(p, 'mr'), scale: isMobile ? 1.15 : 1.45 },
            { x: 0, y: () => -box(slot).h * 0.95, rotation: 0, scale: 1, duration: 0.6 },
            t,
          );
          tl.set(p, { zIndex: num(p, 'z') }, t + 0.6);
          tl.to(p, { y: 0, duration: 0.2, ease: 'power2.in' }, t + 0.6);
        });

      // Hero copy arrives on the cleared desk
      const copy = all('[data-hero-copy] > *');
      tl.fromTo(copy, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.08, ease: 'power2.out' }, 1.2);

      // ---------- Phase B: the Toolkit file lifts, fills the screen and opens into slide 2 ----------
      const B = PHASE_B;
      const tkSlot = world.querySelector<HTMLElement>('[data-toolkit-slot]')!;
      tl.to(copy, { opacity: 0, y: -40, duration: 0.35, stagger: 0.05, ease: 'power2.in' }, B);
      const others = slots.filter((sl) => sl !== tkSlot).flatMap((sl) => all('[data-folder-part], [data-paper]', sl));
      tl.to(others, { yPercent: 40, opacity: 0, duration: 0.5, stagger: 0.012, ease: 'power2.in' }, B);

      // Swap the real folder for an identical single-piece copy that can scale as one unit
      const realTk = all('[data-folder-part], [data-paper]', tkSlot);
      const zFront = zoom.querySelector('[data-zfront]');
      const zPapers = all('[data-zpaper]', zoom);
      const startScale = () => box(tkSlot).w / zw;
      tl.set(zoom, { xPercent: -50, yPercent: -50 }, 0);
      tl.fromTo(zoom, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, B + 0.3);
      tl.to(realTk, { autoAlpha: 0, duration: 0.01 }, B + 0.3);
      // the sheets tuck down into the pocket before the folder comes forward
      tl.to(zPapers, { yPercent: 28, duration: 0.3, ease: 'power2.in' }, B + 0.35);
      tl.to(zPapers, { opacity: 0, duration: 0.01 }, B + 0.65);
      // lift
      tl.fromTo(
        zoom,
        { x: () => box(tkSlot).cx, y: () => box(tkSlot).cy, scale: startScale },
        { x: () => box(tkSlot).cx, y: () => box(tkSlot).cy - 16, scale: () => startScale() * 1.06, duration: 0.3, ease: 'power2.out' },
        B + 0.3,
      );
      // come forward until the folder fills the screen (back face centered on the viewport)
      tl.to(
        zoom,
        { x: () => W() / 2, y: () => H() / 2 - zw * FOLDER_H * (BACK_TOP / 2), scale: 1, duration: 1, ease: 'power3.inOut' },
        B + 0.6,
      );
      // the front pocket swings open toward the viewer, the sheets slide out of view
      tl.to(zFront, { rotationX: -178, duration: 0.7, ease: 'power2.inOut' }, B + 0.85);


      // ---------- Slide 2: the toolkit index draws itself on the inside of the folder ----------
      const T = B + 1.5;
      const layer = world.querySelector('[data-tk-layer]');
      tl.fromTo(layer, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, T - 0.05);
      tl.fromTo(all('[data-tk-head]'), { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out' }, T);
      tl.fromTo(all('[data-row]'), { opacity: 0, y: 22, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.035, ease: 'power3.out' }, T + 0.15);
      const countEl = world.querySelector('[data-tk-count]');
      if (countEl) {
        const total = Number((countEl as HTMLElement).dataset.total);
        const c = { v: 0 };
        tl.fromTo(
          c,
          { v: 0 },
          { v: total, duration: 0.6, ease: 'none', onUpdate: () => (countEl.textContent = pad(Math.round(c.v))) },
          T + 0.15,
        );
      }
      tl.to({}, { duration: 0.15 }, T + 0.9); // short hold on the finished slide

      // ---------- Stepped scrolling: one gesture = one step ----------
      // messy desk → tidy desk with her name → open toolkit → free scrolling.
      // Wheel, trackpad (incl. momentum), touch swipes and keys all go through the same stepper.
      // last stop: past the pin, with the next section (Projects) at the top of the screen,
      // so one scroll from the open toolkit carries straight on to the work
      const stopTimes = [0, STOP_TIDY, T + 0.95];
      const lenis = getLenis();
      const st = tl.scrollTrigger;
      if (lenis && st) {
        let gliding = false;
        /** Where the next section starts: the bottom of the pin's spacer (exact, whatever the screen height). */
        const landingY = () => {
          const next = document.getElementById('projects');
          if (next) {
            // Projects is pinned on desktop: measure its in-flow pin spacer, not the (fixed) section itself
            const flow = next.parentElement?.classList.contains('pin-spacer') ? next.parentElement : next;
            return Math.round(flow.getBoundingClientRect().top + lenis.scroll);
          }
          const spacer = stage.parentElement?.classList.contains('pin-spacer') ? stage.parentElement : stage;
          return Math.round(spacer.getBoundingClientRect().bottom + lenis.scroll);
        };
        const stopsY = () => [
          ...stopTimes.map((tm) => st.start + (tm / tl.duration()) * (st.end - st.start)),
          landingY(),
        ];
        const locked = () => lenis.isStopped || !document.documentElement.classList.contains('intro-done');
        /** Is a move in this direction from the current position inside the stepped zone? */
        const inZone = (down: boolean) => {
          const y = lenis.scroll;
          const ys = stopsY();
          const first = ys[0];
          const last = ys[ys.length - 1];
          return down ? y >= first - 1 && y < last - 1 : y > first + 1 && y <= last + 1;
        };
        const step = (down: boolean) => {
          const y = lenis.scroll;
          const ys = stopsY();
          const target = down ? ys.find((v) => v > y + 2) : [...ys].reverse().find((v) => v < y - 2);
          if (target === undefined) return;
          gliding = true;
          lenis.scrollTo(target, {
            duration: 1.5,
            easing: (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2),
            force: true,
            lock: true,
            onComplete: () => (gliding = false),
          });
        };

        // Wheel / trackpad. A trackpad keeps firing events (momentum) after the fingers lift;
        // they belong to the same gesture and are swallowed. A new gesture starts after a quiet gap.
        // Event timestamps (not "now") are used, so a busy main thread can't fake a pause between events.
        const GAP = 220;
        let lastWheel = -1e9;
        let lastAbs = 0;
        let wheelStepped = false;
        setWheelGate(({ deltaY, event }) => {
          if (event.type !== 'wheel') return true; // touch is handled below
          const now = event.timeStamp;
          const gap = now - lastWheel;
          const abs = Math.abs(deltaY);
          // a fading tail (smaller and smaller deltas) shortly after the last event is still momentum
          const fadingTail = gap < 700 && abs <= lastAbs && abs < 40;
          if (gap > GAP && !fadingTail) wheelStepped = false;
          lastWheel = now;
          lastAbs = abs;
          if (locked()) {
            // intro still playing: this gesture is spent, so its momentum can't skip a step once it ends
            wheelStepped = true;
            if (event.cancelable) event.preventDefault();
            return false;
          }
          if (wheelStepped) {
            // the rest of a gesture that already stepped (incl. its momentum after landing on Projects)
            if (event.cancelable) event.preventDefault();
            return false;
          }
          if (Math.abs(deltaY) < 1) return true;
          const down = deltaY > 0;
          if (!gliding && !inZone(down)) return true; // outside the desk: free scrolling
          if (event.cancelable) event.preventDefault();
          if (gliding) return false;
          wheelStepped = true;
          step(down);
          return false;
        });
        cleanups.push(() => setWheelGate(null));

        // Touch: block native scrolling inside the zone, step once per swipe.
        let touchY: number | null = null;
        let touchStepped = false;
        const onTouchStart = (e: TouchEvent) => {
          touchY = e.touches[0]?.clientY ?? null;
          touchStepped = false;
        };
        const onTouchMove = (e: TouchEvent) => {
          if (touchY === null || e.touches.length > 1) return;
          const dy = touchY - e.touches[0].clientY;
          const down = dy > 0;
          if (locked()) {
            touchStepped = true;
            if (e.cancelable) e.preventDefault();
            return;
          }
          if (!gliding && !touchStepped && !inZone(down)) return; // free scrolling outside the desk
          if (e.cancelable) e.preventDefault();
          if (gliding || touchStepped || Math.abs(dy) < 24) return;
          touchStepped = true;
          step(down);
        };
        const onTouchEnd = () => (touchY = null);
        window.addEventListener('touchstart', onTouchStart, { passive: true });
        window.addEventListener('touchmove', onTouchMove, { passive: false });
        window.addEventListener('touchend', onTouchEnd, { passive: true });
        window.addEventListener('touchcancel', onTouchEnd, { passive: true });

        // Keyboard: Space / PageDown / ArrowDown step forward, the reverse keys step back.
        const onKey = (e: KeyboardEvent) => {
          const t = e.target as HTMLElement | null;
          if (e.altKey || e.ctrlKey || e.metaKey || (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
          const downKeys = ['ArrowDown', 'PageDown', ' '];
          const upKeys = ['ArrowUp', 'PageUp'];
          let down: boolean | null = null;
          if (downKeys.includes(e.key)) down = !(e.key === ' ' && e.shiftKey);
          else if (upKeys.includes(e.key)) down = false;
          if (down === null) return;
          if (locked()) {
            e.preventDefault();
            return;
          }
          if (!gliding && !inZone(down)) return;
          e.preventDefault();
          if (gliding || e.repeat) return;
          step(down);
        };
        window.addEventListener('keydown', onKey);

        cleanups.push(() => {
          window.removeEventListener('touchstart', onTouchStart);
          window.removeEventListener('touchmove', onTouchMove);
          window.removeEventListener('touchend', onTouchEnd);
          window.removeEventListener('touchcancel', onTouchEnd);
          window.removeEventListener('keydown', onKey);
        });
      }
    }, stage);

    document.documentElement.classList.add('desk-steps');
    return () => {
      ScrollTrigger.removeEventListener('refreshInit', measure);
      document.documentElement.classList.remove('desk-steps');
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, [isMobile, motion]);

  // --- subtle mouse parallax on the messy desk (one CSS variable write per frame) ---
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
                  <div className={s.back} data-folder-part style={{ ...fvars, zIndex: zBase(order) }} aria-hidden="true">
                    <div className={s.par}>
                      <div className={s.float}>
                        <div className={s.backFace}>
                          <span className={s.tab}>{pad(f.i + 1)}</span>
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
                        aria-label={docLabel[p.kind]}
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

                  <div className={s.front} data-folder-part style={{ ...fvars, zIndex: zBase(order) + 2 }} aria-hidden="true">
                    <div className={s.par}>
                      <div className={s.float}>
                        <div className={s.frontFace}>
                          <span className={s.fNum}>{String(f.i + 1).padStart(3, '0')}.</span>
                          <span className={s.fLabel}>{hero.folders[f.i]}</span>
                        </div>
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

          {/* The Toolkit folder as one piece, so it can grow to fill the screen and open */}
          {motion && (
            <div className={s.zoom} data-zoom aria-hidden="true">
              <div className={s.backFace}>
                <span className={s.tab}>{pad(TOOLKIT_FOLDER + 1)}</span>
              </div>
              {tkPapers.map((p) => (
                <div key={p.kind} className={`${s.paper} ${p.slot ? s.paperB : ''}`} data-zpaper>
                  <div className={s.sheet}>
                    <Doodle kind={p.kind} />
                  </div>
                </div>
              ))}
              <div className={s.zFront} data-zfront>
                <div className={s.frontFace}>
                  <span className={s.fNum}>{String(TOOLKIT_FOLDER + 1).padStart(3, '0')}.</span>
                  <span className={s.fLabel}>{hero.folders[TOOLKIT_FOLDER]}</span>
                </div>
                <div className={s.frontInside} />
              </div>
            </div>
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
