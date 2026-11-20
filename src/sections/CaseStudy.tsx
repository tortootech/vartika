import { useEffect, useRef } from 'react';
import { isTodo, type Project } from '../content';
import { Txt } from '../components/Todo';
import { gsap, lockScroll, prefersReducedMotion } from '../lib/scroll';
import s from './CaseStudy.module.css';

/** Full case study in a native <dialog>: focus trap, Esc to close, focus returns to the card. */
export function CaseStudy({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d || !project) return;
    d.showModal();
    lockScroll(true);
    const paper = d.querySelector('[data-paper]');
    if (!prefersReducedMotion) {
      gsap.fromTo(paper, { y: 80, rotation: 1.5, opacity: 0 }, { y: 0, rotation: 0, opacity: 1, duration: 0.6, ease: 'power3.out' });
      gsap.fromTo(d.querySelectorAll('[data-reveal]'), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, delay: 0.15, ease: 'power2.out' });
    }
    return () => lockScroll(false);
  }, [project]);

  const close = () => ref.current?.close();

  return (
    <dialog
      ref={ref}
      className={s.dialog}
      aria-labelledby="case-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      {project && (
        <article className={s.paper} data-paper data-lenis-prevent>
          <header className={s.head}>
            <p className="mono-label">Case file {project.file}</p>
            <button type="button" className={s.close} onClick={close} aria-label="Close case study">
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </header>

          <h2 id="case-title" className={`display ${s.title}`} data-reveal>
            <strong>{project.title}</strong>
          </h2>
          <p className={s.kicker} data-reveal>
            <em>{project.kicker}</em>
          </p>

          <dl className={s.metrics} data-reveal>
            {project.metrics.map((m) => (
              <div key={m.label}>
                <dt>{m.label}</dt>
                <dd>{m.value}</dd>
              </div>
            ))}
          </dl>

          <div className={s.grid}>
            <section data-reveal>
              <h3 className="mono-label">001. The problem</h3>
              <p>{project.problem}</p>
            </section>
            <section data-reveal>
              <h3 className="mono-label">002. Her approach</h3>
              <ol className={s.steps}>
                {project.approach.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ol>
            </section>
            <section data-reveal>
              <h3 className="mono-label">003. Deliverables</h3>
              <ul className={s.chips}>
                {project.deliverables.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </section>
            <section data-reveal>
              <h3 className="mono-label">004. Outcome</h3>
              <p>{project.outcome}</p>
            </section>
          </div>

          <footer className={s.foot} data-reveal>
            {isTodo(project.link) ? (
              <Txt v={project.link} />
            ) : (
              <a className={s.link} href={project.link} target="_blank" rel="noreferrer">
                Open the full work ↗
              </a>
            )}
            <button type="button" className={s.back} onClick={close}>
              Back to the files
            </button>
          </footer>
        </article>
      )}
    </dialog>
  );
}
