import { useLayoutEffect, useRef } from 'react';
import { about, isTodo } from '../content';
import { gsap, prefersReducedMotion } from '../lib/scroll';
import { useSectionTriggers } from '../lib/useSectionTriggers';
import s from './About.module.css';

export function About() {
  const ref = useRef<HTMLElement>(null);
  useSectionTriggers(ref, 'cream', 'navy');

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.from('[data-story] > *', { opacity: 0, duration: 0.6, stagger: 0.05, scrollTrigger: { trigger: '[data-story]', start: 'top 80%' } });
        return;
      }
      gsap.fromTo('[data-frame]', { rotation: -6, y: 60 }, { rotation: -1.5, y: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'center center', scrub: true } });
      gsap.from('[data-story] > *', { y: 40, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '[data-story]', start: 'top 75%', toggleActions: 'play none none reverse' } });
    }, el);
    return () => ctx.revert();
  }, []);

  const words = [...about.marquee, ...about.marquee];

  return (
    <section id="about" ref={ref} className={`sheet sheet--cream ${s.section}`} aria-labelledby="about-title">
      <div className={s.inner} data-sheet-inner>
        <div className={s.split}>
          <figure className={s.frame} data-frame>
            <span className={s.tape} aria-hidden="true" />
            <div className={s.photo}>
              {isTodo(about.photo) ? (
                // no photo yet: her initials on the card (the dev build also says where the photo goes)
                <div className={s.placeholder} aria-hidden="true">
                  <span className={s.mono}>VY</span>
                  {import.meta.env.DEV && <span className="mono-label">{about.photoPlaceholder}</span>}
                </div>
              ) : (
                <img src={about.photo} alt={about.photoAlt} loading="lazy" decoding="async" />
              )}
            </div>
            <figcaption className="mono-label">Fig. 01: Vartika, Jaipur</figcaption>
          </figure>

          <div className={s.story} data-story>
            <p className="mono-label">[ {about.label} ]</p>
            <h2 id="about-title" className={`display ${s.title}`}>
              <strong>{about.title[0]}</strong>
              <br />
              <em>{about.title[1]}</em>
            </h2>
            {about.story.map((p, i) => (
              <p key={i} className={i === 0 ? s.lede : s.para}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className={s.marquee} aria-label={`Keywords: ${about.marquee.join(', ')}`} role="img">
        <div className={s.strip} aria-hidden="true">
          {words.map((w, i) => (
            <span key={i}>
              {w}
              <i className={s.sep}>✦</i>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
