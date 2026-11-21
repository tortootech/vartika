import { useLayoutEffect, useRef } from 'react';
import { contact, isTodo, site } from '../content';
import { gsap, prefersReducedMotion, scrollToTarget } from '../lib/scroll';
import { useSectionTriggers } from '../lib/useSectionTriggers';
import s from './Contact.module.css';

export function Contact() {
  const ref = useRef<HTMLElement>(null);
  useSectionTriggers(ref, 6, 'navy', 'cream');
  const email = contact.links.find((l) => l.label === 'Email');
  const emailHref = email && !isTodo(email.href) ? email.href : undefined;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;
      gsap.from('[data-faq] > li', { y: 40, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: '[data-faq]', start: 'top 78%', toggleActions: 'play none none reverse' } });
      // the line holds in view while cream paint sweeps across it left → right with the scroll
      // (pinSpacing must be explicit: GSAP turns it off when the parent is a flex container)
      gsap
        .timeline({
          scrollTrigger: { trigger: '[data-closing]', start: 'center 55%', end: '+=70%', pin: true, pinSpacing: true, scrub: 0.6, invalidateOnRefresh: true },
        })
        .fromTo('[data-fill]', { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', duration: 1 })
        .to({}, { duration: 0.5 }); // finish painting with room to spare before the page ends
      gsap.from('[data-closing] [data-ch]', {
        yPercent: 110,
        duration: 1,
        stagger: 0.04,
        ease: 'power4.out',
        scrollTrigger: { trigger: '[data-closing]', start: 'top 85%', toggleActions: 'play none none reverse' },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  // Fit the closing line to the full width of the viewport
  useLayoutEffect(() => {
    const el = ref.current?.querySelector<HTMLElement>('[data-closing]');
    const line = el?.querySelector<HTMLElement>('[data-base]');
    if (!el || !line) return;
    const fit = () => {
      el.style.fontSize = '100px';
      const pad = parseFloat(getComputedStyle(el).paddingLeft) * 2;
      const size = (100 * (el.clientWidth - pad)) / line.scrollWidth;
      el.style.fontSize = `${Math.floor(size * 0.99)}px`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(document.documentElement);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, []);

  const chars = contact.closing.split('');
  const Closing = emailHref ? 'a' : 'p';

  return (
    <section id="contact" ref={ref} className={`sheet sheet--navy ${s.section}`} aria-labelledby="contact-title">
      <div className={s.inner} data-sheet-inner>
        <header className={s.head}>
          <p className="mono-label">[ {contact.label} ]</p>
          <h2 id="contact-title" className="visually-hidden">
            {contact.label}
          </h2>
        </header>

        <ol className={s.faq} data-faq>
          {contact.faq.map((f, i) => (
            <li key={f.q}>
              <details open={i === 0} name="faq">
                <summary>
                  <span className={s.n}>{String(i + 1).padStart(3, '0')}.</span>
                  <span className={s.q}>{f.q}</span>
                  <span className={s.plus} aria-hidden="true" />
                </summary>
                <p className={s.a}>{f.a}</p>
              </details>
            </li>
          ))}
        </ol>

        <ul className={s.links} aria-label="Contact links">
          {contact.links.map((l) =>
            isTodo(l.href) ? (
              <li key={l.label}>
                <span className={`${s.btn} ${s.pending}`} aria-disabled="true" title={import.meta.env.DEV ? l.href : 'Link coming soon'}>
                  {l.label}
                  {import.meta.env.DEV && <small className={s.todo}>TODO</small>}
                </span>
              </li>
            ) : (
              <li key={l.label}>
                <a
                  className={s.btn}
                  href={l.href}
                  {...('download' in l && l.download ? { download: '' } : { target: l.href.startsWith('mailto:') ? undefined : '_blank', rel: 'noreferrer' })}
                >
                  {l.label}
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
            ),
          )}
        </ul>
      </div>

      <Closing className={s.closing} data-closing {...(emailHref ? { href: emailHref } : {})}>
        <span className="visually-hidden">{contact.closing}</span>
        <span className={s.base} data-base aria-hidden="true">
          {chars.map((c, i) => (
            <span key={i} className={s.chWrap}>
              <span data-ch className={s.ch}>
                {c === ' ' ? ' ' : c}
              </span>
            </span>
          ))}
        </span>
        <span className={s.fill} data-fill aria-hidden="true">
          {chars.map((c, i) => (
            <span key={i} className={s.chWrap}>
              <span className={s.ch}>{c === ' ' ? '\u00a0' : c}</span>
            </span>
          ))}
        </span>
      </Closing>

      <footer className={s.foot}>
        <p>
          {site.year} {site.name}. {contact.footer}
        </p>
        <button type="button" className={s.top} onClick={() => scrollToTarget(0)}>
          Back to the desk ↑
        </button>
      </footer>
    </section>
  );
}
