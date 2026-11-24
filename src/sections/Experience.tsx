import { useLayoutEffect, useRef } from 'react';
import { experience, experienceIntro, isTodo } from '../content';
import { Txt } from '../components/Todo';
import { gsap, prefersReducedMotion } from '../lib/scroll';
import { useSectionTriggers } from '../lib/useSectionTriggers';
import s from './Experience.module.css';

const kindLabel = { work: 'Work', education: 'Education', certification: 'Certification' } as const;
const showPoint = (p: string) => import.meta.env.DEV || !isTodo(p);

export function Experience() {
  const ref = useRef<HTMLElement>(null);
  useSectionTriggers(ref, 'navy', 'cream');

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const line = el.querySelector('[data-line]');
      const entries = gsap.utils.toArray<HTMLElement>('[data-entry]');
      if (prefersReducedMotion) {
        gsap.set(line, { scaleY: 1 });
        entries.forEach((e) =>
          gsap.from(e, { opacity: 0, duration: 0.6, scrollTrigger: { trigger: e, start: 'top 85%', toggleActions: 'play none none none' } }),
        );
        return;
      }
      gsap.fromTo(line, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '[data-timeline]', start: 'top 65%', end: 'bottom 65%', scrub: true } });
      entries.forEach((e) => {
        gsap.fromTo(
          e.querySelectorAll('[data-rv]'),
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: e,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
              onToggle: (st) => e.classList.toggle(s.on, st.isActive || st.progress > 0),
            },
          },
        );
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={ref} className={`sheet sheet--navy ${s.section}`} aria-labelledby="exp-title">
      <div className={s.inner} data-sheet-inner>
        <header className={s.head}>
          <p className="mono-label">[ {experienceIntro.label} ]</p>
          <h2 id="exp-title" className={`display ${s.title}`}>
            <em>{experienceIntro.title[0]}</em> <strong>{experienceIntro.title[1]}</strong>
          </h2>
        </header>

        <div className={s.timeline} data-timeline>
          <div className={s.rail} aria-hidden="true">
            <div className={s.fill} data-line />
          </div>
          <ol className={s.list}>
            {experience.map((x) => (
              <li key={x.role} className={s.entry} data-entry>
                <span className={s.dot} aria-hidden="true" />
                <p className={`mono-label ${s.date}`} data-rv>
                  <Txt v={x.dates} />
                </p>
                <div className={s.body}>
                  <p className={`mono-label ${s.kind}`} data-rv>
                    {kindLabel[x.kind]}
                  </p>
                  <h3 className={`display ${s.role}`} data-rv>
                    {x.role}
                  </h3>
                  <p className={s.org} data-rv>
                    {x.org}
                  </p>
                  <ul className={s.points} data-rv>
                    {x.points.filter(showPoint).map((p) => (
                      <li key={p}>
                        <Txt v={p} />
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
