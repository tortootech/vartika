import { useLayoutEffect, useRef } from 'react';
import { about, isTodo } from '../content';
import { gsap, prefersReducedMotion } from '../lib/scroll';
import { useSectionTriggers } from '../lib/useSectionTriggers';
import s from './About.module.css';

export function About() {
  const ref = useRef<HTMLElement>(null);
  useSectionTriggers(ref, 5, 'cream');

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('[data-principle]');
      if (prefersReducedMotion) {
        gsap.from(items, { opacity: 0, duration: 0.6, stagger: 0.05, scrollTrigger: { trigger: '[data-principles]', start: 'top 80%' } });
        return;
      }
      gsap.fromTo('[data-frame]', { rotation: -6, y: 60 }, { rotation: -1.5, y: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'center center', scrub: true } });
      gsap.from('[data-story] > *', { y: 40, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '[data-story]', start: 'top 75%', toggleActions: 'play none none reverse' } });
      gsap.from(items, { y: 50, opacity: 0, duration: 0.8, stagger: 0.07, ease: 'power3.out', scrollTrigger: { trigger: '[data-principles]', start: 'top 78%', toggleActions: 'play none none reverse' } });
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
                <div className={s.placeholder} role="img" aria-label="Photo placeholder">
                  <svg viewBox="0 0 48 48" width="40" height="40" aria-hidden="true">
                    <rect x="6" y="10" width="36" height="28" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
                    <circle cx="24" cy="24" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M17 10l3-4h8l3 4" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <span className="mono-label">{about.photoPlaceholder}</span>
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

        <div className={s.principles} data-principles>
          <h3 className="mono-label">{about.principlesTitle}</h3>
          <ol>
            {about.principles.map((p, i) => (
              <li key={p.title} data-principle>
                <span className={s.n}>{String(i + 1).padStart(3, '0')}.</span>
                <span className={s.pt}>{p.title}</span>
                <span className={s.pb}>{p.body}</span>
              </li>
            ))}
          </ol>
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
