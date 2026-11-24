import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { contact, isTodo, site } from '../content';
import { openDrawer } from '../lib/drawer';
import { gsap, prefersReducedMotion, scrollToTarget } from '../lib/scroll';
import { useSectionTriggers } from '../lib/useSectionTriggers';
import s from './Contact.module.css';

const ok = (v?: string) => !isTodo(v);

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // older browsers / no permission: the classic hidden-textarea copy
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const done = document.execCommand('copy');
    ta.remove();
    return done;
  }
}

function CopyButton({ text, what }: { text: string; what: string }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 1500);
    return () => window.clearTimeout(id);
  }, [copied]);
  return (
    <button
      type="button"
      className={s.copy}
      onClick={async () => setCopied(await copyText(text))}
      aria-label={copied ? `${what} copied` : `Copy ${what.toLowerCase()}`}
    >
      <span aria-hidden="true">{copied ? 'Copied' : 'Copy'}</span>
      <span className="visually-hidden" aria-live="polite">
        {copied ? `${what} copied to the clipboard` : ''}
      </span>
    </button>
  );
}

export function Contact() {
  const ref = useRef<HTMLElement>(null);
  useSectionTriggers(ref, 'navy', 'cream');
  const emailHref = ok(contact.email) ? `mailto:${contact.email}` : undefined;
  const links = [
    ok(contact.linkedin) && { label: 'LinkedIn', href: contact.linkedin },
    ok(contact.github) && { label: 'GitHub', href: contact.github },
  ].filter(Boolean) as { label: string; href: string }[];

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;
      gsap.from('[data-block]', { y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '[data-blocks]', start: 'top 80%', toggleActions: 'play none none none' } });
      // the line holds in view while cream paint sweeps across it left → right with the scroll
      // (pinSpacing must be explicit: GSAP turns it off when the parent is a flex container)
      gsap
        .timeline({
          scrollTrigger: { trigger: '[data-closing]', start: 'center 55%', end: '+=70%', pin: true, pinSpacing: true, scrub: 0.2, invalidateOnRefresh: true },
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

        <div className={s.blocks} data-blocks>
          <div className={s.block} data-block>
            <h3 className={`mono-label ${s.k}`}>{contact.summaryTitle}</h3>
            <p className={s.summary}>{contact.summary}</p>
          </div>

          <dl className={s.block} data-block>
            {ok(contact.email) && (
              <div className={s.row}>
                <dt className={`mono-label ${s.k}`}>Email</dt>
                <dd className={s.v}>
                  <a href={emailHref} className={s.big}>
                    {contact.email}
                  </a>
                  <CopyButton text={contact.email} what="Email" />
                </dd>
              </div>
            )}
            {ok(contact.phone) && (
              <div className={s.row}>
                <dt className={`mono-label ${s.k}`}>Phone</dt>
                <dd className={s.v}>
                  <a href={`tel:${contact.phone}`} className={s.big}>
                    {contact.phoneText}
                  </a>
                  <CopyButton text={contact.phoneText} what="Phone number" />
                </dd>
              </div>
            )}
            {(links.length > 0 || ok(contact.resume)) && (
              <div className={s.row}>
                <dt className={`mono-label ${s.k}`}>Links</dt>
                <dd className={s.v}>
                  <ul className={s.links}>
                    {links.map((l) => (
                      <li key={l.label}>
                        <a className={s.btn} href={l.href} target="_blank" rel="noopener noreferrer">
                          {l.label}
                          <span aria-hidden="true">↗</span>
                        </a>
                      </li>
                    ))}
                    {ok(contact.resume) && (
                      <li>
                        <a className={s.btn} href={contact.resume} download>
                          Resume (PDF)
                          <span aria-hidden="true">↓</span>
                        </a>
                      </li>
                    )}
                  </ul>
                </dd>
              </div>
            )}
            {ok(contact.location) && (
              <div className={s.row}>
                <dt className={`mono-label ${s.k}`}>Location</dt>
                <dd className={s.v}>
                  <span className={s.plain}>{contact.location}</span>
                </dd>
              </div>
            )}
          </dl>

          <div className={`${s.block} ${s.ctaBlock}`} data-block>
            <button type="button" className={s.cta} onClick={openDrawer} aria-haspopup="dialog">
              {contact.cta}
              <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
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
        <button type="button" className={s.top} onClick={() => scrollToTarget(0, 2)}>
          Back to the desk ↑
        </button>
      </footer>
    </section>
  );
}
