import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { contact, isTodo, site } from '../content';
import { ConnectForm } from '../components/ConnectForm';
import { resumeUrl } from '../components/TopBar';
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

const I = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
const pinIcon = (<><path d="M8 14.5s4.5-4.2 4.5-8a4.5 4.5 0 0 0-9 0c0 3.8 4.5 8 4.5 8z" {...I} /><circle cx="8" cy="6.5" r="1.6" {...I} /></>);
const mailIcon = (<><rect x="1.75" y="3.25" width="12.5" height="9.5" rx="1.5" {...I} /><path d="M2.25 4l5.75 4.5L13.75 4" {...I} /></>);
const phoneIcon = (<path d="M5.2 1.9l1.4 3.2-1.5 1.1a8 8 0 0 0 4.7 4.7l1.1-1.5 3.2 1.4-.5 2.4c-.1.5-.6.9-1.1.9C6.8 14.1 1.9 9.2 1.9 3.5c0-.5.4-1 .9-1.1z" {...I} />);
const docIcon = (<><path d="M3.75 1.75h5.5l3 3v9.5h-8.5z" {...I} /><path d="M9 1.75V5h3.25M6 8.25h4M6 10.75h4" {...I} /></>);

/** One labelled block of the details list: tiny spaced-caps label, then the value. */
function Row({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className={s.row}>
      <dt className={`mono-label ${s.k}`}>{label}</dt>
      <dd className={s.v}>
        {icon && (
          <svg viewBox="0 0 16 16" width="16" height="16" className={s.icon} aria-hidden="true">
            {icon}
          </svg>
        )}
        {children}
      </dd>
    </div>
  );
}

export function Contact() {
  const ref = useRef<HTMLElement>(null);
  useSectionTriggers(ref, 'navy', 'cream');
  const emailHref = ok(contact.email) ? `mailto:${contact.email}` : undefined;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;
      gsap.from('[data-block]', { y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '[data-blocks]', start: 'top 85%', toggleActions: 'play none none none' } });
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
        <div className={s.grid} data-blocks>
          <div className={s.details}>
            <p className={`mono-label ${s.kicker}`} data-block>
              <span className={s.rule} aria-hidden="true" />
              {contact.label}
            </p>
            <h2 id="contact-title" className={`display ${s.name}`} data-block>
              <span className={s.first}>{contact.name[0]}</span>
              <span className={s.last}>{contact.name[1]}</span>
            </h2>
            <p className={`mono-label ${s.focus}`} data-block>
              {contact.focus.map((f, i) => (
                <span key={f}>
                  {i > 0 && (
                    <span className={s.bar} aria-hidden="true">
                      |
                    </span>
                  )}
                  {f}
                </span>
              ))}
            </p>

            <dl className={s.list} data-block>
              {ok(contact.location) && (
                <Row label="Location" icon={pinIcon}>
                  <span className={s.value}>{contact.location}</span>
                </Row>
              )}
              {ok(contact.email) && (
                <Row label="Email" icon={mailIcon}>
                  <a href={emailHref} className={`${s.value} ${s.accent}`}>
                    {contact.email}
                  </a>
                  <CopyButton text={contact.email} what="Email" />
                </Row>
              )}
              {ok(contact.phone) && (
                <Row label="Phone" icon={phoneIcon}>
                  <a href={`tel:${contact.phone}`} className={s.value}>
                    {contact.phoneText}
                  </a>
                  <CopyButton text={contact.phoneText} what="Phone number" />
                </Row>
              )}
              {(ok(contact.linkedin) || ok(contact.github)) && (
                <Row label="Profiles">
                  {ok(contact.linkedin) && (
                    <a href={contact.linkedin} className={s.pill} target="_blank" rel="noopener noreferrer">
                      LinkedIn
                      <span aria-hidden="true">↗</span>
                      <span className="visually-hidden"> (opens in a new tab)</span>
                    </a>
                  )}
                  {ok(contact.github) && (
                    <a href={contact.github} className={s.pill} target="_blank" rel="noopener noreferrer">
                      GitHub
                      <span aria-hidden="true">↗</span>
                      <span className="visually-hidden"> (opens in a new tab)</span>
                    </a>
                  )}
                </Row>
              )}
              {ok(contact.resume) && (
                <Row label="Resume" icon={docIcon}>
                  <a href={resumeUrl} className={s.value} target="_blank" rel="noopener noreferrer">
                    {contact.resumeText}
                    <span aria-hidden="true"> ↗</span>
                    <span className="visually-hidden"> (opens in a new tab)</span>
                  </a>
                </Row>
              )}
            </dl>
          </div>

          <div className={s.formCol} data-block>
            <ConnectForm />
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
