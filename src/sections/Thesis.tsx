import { useLayoutEffect, useRef } from 'react';
import { chapters, githubProfile, isTodo, thesisIntro, type Chapter, type ThesisLink } from '../content';
import { ToolGlyph } from '../desk/ToolIcons';
import { gsap, prefersReducedMotion } from '../lib/scroll';
import { useSectionTriggers } from '../lib/useSectionTriggers';
import { Poster } from './Poster';
import s from './Thesis.module.css';

/** GitHub links fall back to the profile; any other unfinished link is simply not shown. */
const usableLinks = (links: ThesisLink[]) =>
  links.flatMap((l) => {
    if (!isTodo(l.href)) return [l];
    if (/github/i.test(l.label)) return [{ ...l, href: githubProfile }];
    return [];
  });

/** Pinned "two papers on the desk" only where there is room; everywhere else the chapters stack. */
const PIN_QUERY = '(min-width: 1180px) and (min-height: 620px)';

function Paper({ c }: { c: Chapter }) {
  const links = usableLinks(c.links);
  return (
    <article className={s.chapter} data-chapter aria-labelledby={`${c.id}-q`}>
      <div className={`${s.sheet} ${s.under1}`} data-under aria-hidden="true" />
      <div className={`${s.sheet} ${s.under2}`} data-under aria-hidden="true" />
      <div className={`${s.sheet} ${s.paper}`} data-paper>
        <div className={s.fit} data-fit>
          <div className={s.colA}>
            <p className={`mono-label ${s.label}`}>
              <span className={s.no}>{c.no}</span> {c.label}
            </p>
            {c.noteAtLabel && <p className={`mono-label ${s.note} ${s.noteTop}`}>{c.note}</p>}
            <div className={s.poster}>
              <Poster marks={c.marks} motif={c.id === 'pricevolume' ? 'price' : undefined} />
            </div>
            <h3 id={`${c.id}-q`} className={`display ${s.question}`}>
              {c.question}
            </h3>
            <p className={s.thesis}>{c.thesis}</p>
            {!c.noteAtLabel && <p className={`mono-label ${s.note}`}>{c.note}</p>}
          </div>

          <div className={s.colB}>
            <h4 className={`mono-label ${s.h}`}>{c.listTitle}</h4>
            <ol className={s.points}>
              {c.points.filter((p) => !isTodo(p)).map((p, i) => (
                <li key={p} data-point>
                  <span className={s.pn} aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>{p}</span>
                </li>
              ))}
            </ol>

            <h4 className={`mono-label ${s.h}`}>What she built</h4>
            <ul className={s.chips}>
              {c.built.map((b) => (
                <li key={b} data-chip>
                  {b}
                </li>
              ))}
            </ul>

            <h4 className={`mono-label ${s.h}`}>Tools</h4>
            <ul className={s.tools}>
              {c.tools.map((t) => (
                <li key={t.name}>
                  <button type="button" className={s.tool} aria-describedby={`${c.id}-${t.icon}-tip`}>
                    <ToolGlyph icon={t.icon} />
                    <span>{t.name}</span>
                  </button>
                  <span role="tooltip" id={`${c.id}-${t.icon}-tip`} className={s.tip}>
                    {t.did}
                  </span>
                </li>
              ))}
            </ul>

            <div className={s.links}>
              {links.map((l, i) => (
                <a
                  key={l.label}
                  className={i === 0 ? s.primary : s.secondary}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {l.label}
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function Thesis() {
  const ref = useRef<HTMLElement>(null);

  // built before useSectionTriggers so the counter triggers below see this section's pin spacing
  useLayoutEffect(() => {
    const section = ref.current;
    if (!section) return;
    const mm = gsap.matchMedia();
    const papers = gsap.utils.toArray<HTMLElement>('[data-chapter]', section);

    /** Scale a paper's content down (never up) so it always fits the screen: no clipping, no overlap. */
    const fitAll = () => {
      section.querySelectorAll<HTMLElement>('[data-fit]').forEach((f) => {
        const paper = f.parentElement!;
        f.style.transform = '';
        f.style.width = '';
        const cs = getComputedStyle(paper);
        const room = paper.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
        const k = Math.min(1, room / f.scrollHeight);
        if (k < 1) {
          f.style.transform = `scale(${k.toFixed(4)})`;
          f.style.width = `${(100 / k).toFixed(3)}%`;
        }
      });
    };
    const clearFit = () =>
      section.querySelectorAll<HTMLElement>('[data-fit]').forEach((f) => {
        f.style.transform = '';
        f.style.width = '';
      });

    const posterIn = (c: HTMLElement, tl: gsap.core.Timeline, at: number) => {
      tl.fromTo(c.querySelectorAll('[data-wipe]'), { attr: { height: 0 } }, { attr: { height: 400 }, duration: 0.7, ease: 'power2.inOut' }, at);
      tl.fromTo(c.querySelectorAll('[data-poster]'), { '--sp': 1 }, { '--sp': 0, duration: 1.1, ease: 'power2.out' }, at - 0.4);
      const draw = c.querySelectorAll('[data-draw]');
      if (draw.length) tl.fromTo(draw, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.8, ease: 'power1.inOut' }, at + 0.2);
      const tag = c.querySelector('[data-tag] > g');
      if (tag) tl.fromTo(tag, { scale: 0, transformOrigin: '0px 0px' }, { scale: 1, duration: 0.3, ease: 'back.out(2)' }, at + 0.9);
      tl.fromTo(c.querySelectorAll('[data-chip]'), { y: 14, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.4, ease: 'power2.out' }, at + 0.1);
    };

    if (!prefersReducedMotion) {
      mm.add(PIN_QUERY, () => {
        section.dataset.mode = 'pin';
        fitAll();
        const [one, two] = papers;
        const sheets = (c: HTMLElement) => [...c.querySelectorAll<HTMLElement>('[data-under]'), c.querySelector<HTMLElement>('[data-paper]')!];
        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${Math.round(window.innerHeight * 2.2)}`,
            pin: true,
            scrub: 0.3,
            invalidateOnRefresh: true,
            onRefreshInit: fitAll,
          },
        });
        // 1. paper stack: two blank sheets, then chapter 1, slide up onto the desk and settle
        gsap.set(two, { xPercent: 115, rotation: 6 });
        tl.to('[data-intro]', { y: -40, opacity: 0.18, duration: 1.2, ease: 'power1.in' }, 0.2);
        tl.fromTo(sheets(one), { yPercent: 120, rotation: (i: number) => [7, -5, 4][i] }, { yPercent: 0, rotation: (i: number) => [-2.2, 1.6, 0][i], duration: 1.6, stagger: 0.22 }, 0);
        posterIn(one, tl, 1.4);
        // 2. hold, so chapter 1 can be read
        tl.to({}, { duration: 1.6 });
        // 3. chapter 1 slides off to the left as chapter 2 comes in from the right
        tl.to(one, { xPercent: -118, rotation: -6, duration: 1.6, ease: 'power2.inOut' }, '>');
        tl.to(two, { xPercent: 0, rotation: 0, duration: 1.6, ease: 'power2.inOut' }, '<');
        posterIn(two, tl, tl.duration() - 0.3);
        // 4. hold on chapter 2 before the pin releases
        tl.to({}, { duration: 1.4 });
        return () => {
          delete section.dataset.mode;
          clearFit();
        };
      });
      mm.add(`not all and ${PIN_QUERY}`, () => {
        // stacked: each paper rises into place as it scrolls in; no pin, no parallax
        section.dataset.mode = 'stack';
        papers.forEach((c) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: c, start: 'top 82%', toggleActions: 'play none none none' } });
          tl.from(c.querySelector('[data-paper]'), { y: 50, opacity: 0, duration: 0.8, ease: 'power3.out' }, 0);
          posterIn(c, tl, 0.3);
        });
        return () => delete section.dataset.mode;
      });
    } else {
      section.dataset.mode = 'stack';
      papers.forEach((c) =>
        gsap.from(c, { opacity: 0, duration: 0.6, scrollTrigger: { trigger: c, start: 'top 85%', toggleActions: 'play none none none' } }),
      );
    }

    const onFonts = () => section.dataset.mode === 'pin' && fitAll();
    document.fonts?.ready.then(onFonts);
    return () => {
      mm.revert();
      gsap.killTweensOf(papers);
    };
  }, []);

  useSectionTriggers(ref, 'desk', 'navy'); // follows the navy toolkit

  return (
    <section id="thesis" ref={ref} className={`sheet ${s.section}`} aria-labelledby="thesis-title">
      <div className={s.desk} aria-hidden="true" />
      <header className={s.intro} data-intro>
        <p className="mono-label">[ {thesisIntro.label} ]</p>
        <h2 id="thesis-title" className={`display ${s.title}`}>
          <strong>{thesisIntro.title[0]}</strong> <em>{thesisIntro.title[1]}</em>
        </h2>
        <p className={s.sub}>{thesisIntro.sub}</p>
      </header>
      <div className={s.stage}>
        {chapters.map((c) => (
          <Paper key={c.id} c={c} />
        ))}
      </div>
    </section>
  );
}
