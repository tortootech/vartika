import { useLayoutEffect, useRef, useState } from 'react';
import { projects, projectsIntro, type Project } from '../content';
import { Doodle, type DoodleKind } from '../desk/Doodles';
import { gsap, prefersReducedMotion } from '../lib/scroll';
import { useSectionTriggers } from '../lib/useSectionTriggers';
import { CaseStudy } from './CaseStudy';
import s from './Projects.module.css';

const peek: Record<string, DoodleKind> = { novacart: 'bar', matri: 'check', shopsphere: 'erd', seo: 'line' };

export function Projects() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<Project | null>(null);
  useSectionTriggers(ref, 3, 'cream');

  useLayoutEffect(() => {
    const section = ref.current;
    const track = trackRef.current;
    if (!section || !track) return;
    const mm = gsap.matchMedia();

    if (!prefersReducedMotion) {
      // Desktop: pinned horizontal scroll through the case files
      mm.add('(min-width: 768px)', () => {
        const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
        const tween = gsap.to(track, {
          x: () => -dist(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${dist()}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        // each folder settles from a slight tilt as it slides into view
        gsap.utils.toArray<HTMLElement>('[data-card]', track).forEach((card) => {
          gsap.fromTo(
            card,
            { rotation: 3.5, y: 40 },
            {
              rotation: 0,
              y: 0,
              ease: 'none',
              scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 100%', end: 'left 45%', scrub: true },
            },
          );
        });
      });
      // Mobile: vertical stack, cards slide up like papers
      mm.add('(max-width: 767px)', () => {
        gsap.utils.toArray<HTMLElement>('[data-card]', track).forEach((card) => {
          gsap.from(card, {
            y: 60,
            opacity: 0,
            rotation: 2,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none reverse' },
          });
        });
      });
    }
    return () => mm.revert();
  }, []);

  return (
    <section id="projects" ref={ref} className={`sheet sheet--cream ${s.section}`} aria-labelledby="projects-title">
      <div className={s.inner} data-sheet-inner>
        <div className={s.track} ref={trackRef}>
          <header className={s.intro}>
            <p className="mono-label">[ {projectsIntro.label} ]</p>
            <h2 id="projects-title" className={`display ${s.title}`}>
              <strong>{projectsIntro.title[0]}</strong>
              <br />
              <em>{projectsIntro.title[1]}</em>
            </h2>
            <p className={s.sub}>{projectsIntro.sub}</p>
            <p className={`mono-label ${s.hint}`}>
              <span aria-hidden="true">→ </span>
              {projectsIntro.hint}
            </p>
          </header>

          {projects.map((p) => (
            <article key={p.id} className={s.card} data-card onClick={() => setOpen(p)}>
              <div className={s.back} aria-hidden="true">
                <span className={s.tab}>FILE {p.file}</span>
              </div>
              <div className={s.peek} aria-hidden="true">
                <Doodle kind={peek[p.id] ?? 'text'} />
              </div>
              <div className={s.front}>
                <div className={s.meta}>
                  <span className="mono-label">{p.kicker}</span>
                  <span className={s.num}>{p.file}.</span>
                </div>
                <h3 className={`display ${s.cardTitle}`}>
                  <button type="button" className={s.open} aria-haspopup="dialog" onClick={() => setOpen(p)}>
                    {p.title}
                  </button>
                </h3>
                <p className={s.summary}>{p.summary}</p>
                <ul className={s.tags} aria-label="Tags">
                  {p.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <span className={s.more} aria-hidden="true">
                  Open case file
                  <svg viewBox="0 0 16 16" width="14" height="14">
                    <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </span>
              </div>
            </article>
          ))}
          <div className={s.tail} aria-hidden="true" />
        </div>
      </div>
      <CaseStudy project={open} onClose={() => setOpen(null)} />
    </section>
  );
}
