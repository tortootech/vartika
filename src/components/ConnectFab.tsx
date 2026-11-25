import { useEffect, useState } from 'react';
import { contactForm } from '../content';
import { goToContact } from '../lib/scroll';
import s from './ConnectFab.module.css';

/** Floating "Connect with me": glides to the Contact section and puts the cursor in the form. Hidden while Contact is on screen. */
export function ConnectFab() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let io: IntersectionObserver | null = null;
    // Contact mounts with the lazy chunk, so look for it until it exists
    const attach = () => {
      const el = document.getElementById('contact');
      if (!el) return false;
      io = new IntersectionObserver(([e]) => setHidden(e.isIntersecting), { rootMargin: '0px 0px -30% 0px' });
      io.observe(el);
      return true;
    };
    let timer = 0;
    if (!attach()) timer = window.setInterval(() => attach() && window.clearInterval(timer), 500);
    return () => {
      window.clearInterval(timer);
      io?.disconnect();
    };
  }, []);

  return (
    <button type="button" className={s.fab} data-hidden={hidden || undefined} tabIndex={hidden ? -1 : undefined} aria-hidden={hidden || undefined} onClick={goToContact}>
      <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
        <path d="M3 5.5h14v9H3z M3 5.5l7 5 7-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
      {contactForm.cta}
    </button>
  );
}
