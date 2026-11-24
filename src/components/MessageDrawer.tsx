import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { contact, isTodo, messageForm as t } from '../content';
import { closeDrawer, openDrawer, useDrawerOpen } from '../lib/drawer';
import { useScrollLock } from '../lib/useScrollLock';
import s from './MessageDrawer.module.css';

const KEY = (import.meta.env.VITE_WEB3FORMS_KEY as string | undefined)?.trim() || '';
const EMAIL = isTodo(contact.email) ? '' : contact.email;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Fields = { name: string; email: string; subject: string; message: string };
type Status = 'idle' | 'sending' | 'sent' | 'mailed' | 'error';
const empty: Fields = { name: '', email: '', subject: '', message: '' };

function validate(f: Fields) {
  const e: Partial<Record<keyof Fields, string>> = {};
  if (!f.name.trim()) e.name = 'Please add your name.';
  if (!EMAIL_RE.test(f.email.trim())) e.email = 'Please add an email she can reply to.';
  if (f.message.trim().length < 10) e.message = 'A few more words, please (10 characters or more).';
  return e;
}

const mailtoHref = (f: Fields) => {
  const subject = f.subject.trim() || `Message from ${f.name.trim() || 'your portfolio'}`;
  const body = `${f.message.trim()}\n\n${f.name.trim()}${f.email.trim() ? `\n${f.email.trim()}` : ''}`;
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

/** The floating "Message me" button. */
export function MessageFab() {
  const open = useDrawerOpen();
  if (!EMAIL && !KEY) return null;
  return (
    <button type="button" className={s.fab} data-hidden={open || undefined} onClick={openDrawer} aria-haspopup="dialog">
      <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
        <path d="M3 5.5h14v9H3z M3 5.5l7 5 7-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
      {t.fab}
    </button>
  );
}

/** Side drawer with the contact form. Uses the shared scroll lock (page held, focus trapped and returned). */
export function MessageDrawer() {
  const open = useDrawerOpen();
  const ref = useRef<HTMLDialogElement>(null);
  const firstRef = useRef<HTMLInputElement>(null);
  const [f, setF] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;

  const close = () => ref.current?.close();
  useScrollLock(open, ref, close);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      firstRef.current?.focus();
    }
    if (!open && d.open) d.close();
  }, [open]);

  /** Closed by X, backdrop or Esc. After a successful send the next opening starts with a clean form. */
  const onClosed = () => {
    closeDrawer();
    if (status === 'sent' || status === 'mailed') {
      setF(empty);
      setStatus('idle');
    }
  };

  if (!EMAIL && !KEY) return null; // nowhere to send a message: no drawer, no button (see MessageFab)

  const set = (k: keyof Fields) => (e: { target: { value: string } }) => {
    setF((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const submit = async (e?: FormEvent) => {
    e?.preventDefault();
    const form = ref.current?.querySelector('form');
    const honey = form?.querySelector<HTMLInputElement>('input[name="botcheck"]');
    if (honey?.checked) return; // a bot ticked the hidden box
    const errs = validate(f);
    setErrors(errs);
    const firstBad = (Object.keys(errs) as (keyof Fields)[])[0];
    if (firstBad) {
      document.getElementById(id(firstBad))?.focus();
      return;
    }
    if (!KEY) {
      window.location.href = mailtoHref(f);
      setStatus('mailed');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: KEY,
          name: f.name.trim(),
          email: f.email.trim(),
          subject: f.subject.trim() || `Portfolio message from ${f.name.trim()}`,
          message: f.message.trim(),
          from_name: 'Portfolio contact form',
          botcheck: false,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { success?: boolean };
      setStatus(res.ok && data.success ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  };

  const field = (k: keyof Fields, label: string, opts: { type?: string; area?: boolean; required?: boolean; auto?: string } = {}) => {
    const err = errors[k];
    const common = {
      id: id(k),
      name: k,
      value: f[k],
      onChange: set(k),
      required: opts.required,
      'aria-invalid': err ? true : undefined,
      'aria-describedby': err ? id(`${k}-err`) : undefined,
      autoComplete: opts.auto,
      disabled: status === 'sending',
    };
    return (
      <div className={s.field}>
        <label htmlFor={id(k)}>
          {label}
          {opts.required && <span aria-hidden="true"> *</span>}
        </label>
        {opts.area ? (
          <textarea {...common} rows={5} />
        ) : (
          <input {...common} ref={k === 'name' ? firstRef : undefined} type={opts.type ?? 'text'} />
        )}
        {err && (
          <p className={s.err} id={id(`${k}-err`)}>
            {err}
          </p>
        )}
      </div>
    );
  };

  const done = status === 'sent' || status === 'mailed';

  return (
    <dialog
      ref={ref}
      className={s.dialog}
      aria-labelledby={id('title')}
      onClose={onClosed}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className={s.panel} data-lenis-prevent>
        <span className={s.fold} aria-hidden="true" />
        <header className={s.head}>
          <p className="mono-label">Note</p>
          <button type="button" className={s.close} onClick={close} aria-label={t.close}>
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </header>
        <h2 id={id('title')} className={`display ${s.title}`}>
          <strong>{t.title}</strong>
        </h2>

        <div aria-live="polite" className={s.live}>
          {status === 'sent' && (
            <div className={s.ok}>
              <p className={s.okTitle}>{t.success[0]}</p>
              <p>{t.success[1]}</p>
            </div>
          )}
          {status === 'mailed' && (
            <div className={s.ok}>
              <p className={s.okTitle}>Your email app should now be open.</p>
              <p>The message is filled in; just press send there.</p>
            </div>
          )}
          {status === 'error' && (
            <div className={s.bad} role="alert">
              <p>{t.error}</p>
              <div className={s.row}>
                <button type="button" className={s.ghost} onClick={() => void submit()}>
                  {t.retry}
                </button>
                {EMAIL && (
                  <a className={s.ghost} href={mailtoHref(f)}>
                    {t.mailFallback}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {done ? (
          <button type="button" className={s.send} onClick={close}>
            {t.close}
          </button>
        ) : (
          <form className={s.form} onSubmit={submit} noValidate>
            <p className={s.intro}>{KEY ? t.intro : t.noKey}</p>
            {field('name', t.fields.name, { required: true, auto: 'name' })}
            {field('email', t.fields.email, { type: 'email', required: true, auto: 'email' })}
            {field('subject', t.fields.subject)}
            {field('message', t.fields.message, { area: true, required: true })}
            {/* honeypot: hidden from people and screen readers, bots tick it */}
            <input type="checkbox" name="botcheck" className={s.honey} tabIndex={-1} aria-hidden="true" autoComplete="off" />
            <button type="submit" className={s.send} disabled={status === 'sending'} aria-busy={status === 'sending'}>
              {status === 'sending' && <span className={s.spin} aria-hidden="true" />}
              {status === 'sending' ? t.sending : KEY ? t.send : t.sendMail}
            </button>
          </form>
        )}
      </div>
    </dialog>
  );
}
