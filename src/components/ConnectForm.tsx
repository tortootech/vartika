import { useId, useRef, useState, type FormEvent } from 'react';
import { contact, contactForm as t, isTodo } from '../content';
import s from './ConnectForm.module.css';

const KEY = (import.meta.env.VITE_WEB3FORMS_KEY as string | undefined)?.trim() || '';
const EMAIL = isTodo(contact.email) ? '' : contact.email;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s()-]{7,20}$/;

type Fields = { name: string; email: string; phone: string; message: string };
type Status = 'idle' | 'sending' | 'sent' | 'mailed' | 'error';
const empty: Fields = { name: '', email: '', phone: '', message: '' };

function validate(f: Fields) {
  const e: Partial<Record<keyof Fields, string>> = {};
  if (!f.name.trim()) e.name = 'Please add your name.';
  if (!EMAIL_RE.test(f.email.trim())) e.email = 'Please add an email address I can reply to.';
  if (f.phone.trim() && !PHONE_RE.test(f.phone.trim())) e.phone = 'That doesn’t look like a phone number. Leave it blank if you like.';
  if (f.message.trim().length < 10) e.message = 'A few more words, please (10 characters or more).';
  return e;
}

const mailtoHref = (f: Fields) => {
  const subject = `Portfolio message from ${f.name.trim() || 'a visitor'}`;
  const body = [f.message.trim(), '', f.name.trim(), f.email.trim(), f.phone.trim()].filter((x, i) => i < 2 || x).join('\n');
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

/** Inline contact form. Sends through Web3Forms (no backend of our own); without a key it hands over to the visitor's email app. */
export function ConnectForm() {
  const [f, setF] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const honeyRef = useRef<HTMLInputElement>(null);
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;

  const set = (k: keyof Fields) => (e: { target: { value: string } }) => {
    const v = k === 'message' ? e.target.value.slice(0, t.maxMessage) : e.target.value;
    setF((x) => ({ ...x, [k]: v }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
    if (status === 'error') setStatus('idle');
  };

  const submit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (status === 'sending') return;
    if (honeyRef.current?.checked) return; // a bot ticked the hidden box
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
          subject: `Portfolio message from ${f.name.trim()}`,
          from_name: 'Portfolio contact form',
          name: f.name.trim(),
          email: f.email.trim(),
          phone: f.phone.trim() || undefined,
          message: f.message.trim(),
          botcheck: false,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { success?: boolean };
      if (res.ok && data.success) {
        setStatus('sent');
        setF(empty);
      } else setStatus('error');
    } catch {
      setStatus('error');
    }
  };

  const field = (k: keyof Fields, label: string, opts: { type?: string; area?: boolean; required?: boolean; auto?: string; first?: boolean } = {}) => {
    const err = errors[k];
    const describedBy = [err && id(`${k}-err`), k === 'message' && id('count')].filter(Boolean).join(' ') || undefined;
    const common = {
      id: id(k),
      name: k,
      value: f[k],
      onChange: set(k),
      required: opts.required,
      'aria-required': opts.required || undefined,
      'aria-invalid': err ? true : undefined,
      'aria-describedby': describedBy,
      autoComplete: opts.auto,
      disabled: status === 'sending',
      ...(opts.first ? { 'data-first-field': true } : {}),
    };
    return (
      <div className={s.field}>
        <label htmlFor={id(k)}>
          {label}
          {opts.required && (
            <span className={s.req} aria-hidden="true">
              {' '}
              *
            </span>
          )}
        </label>
        {opts.area ? (
          <textarea {...common} rows={5} maxLength={t.maxMessage} />
        ) : (
          <input {...common} type={opts.type ?? 'text'} />
        )}
        {k === 'message' && (
          <p className={s.count} id={id('count')} aria-live="polite">
            {f.message.length} / {t.maxMessage}
          </p>
        )}
        {err && (
          <p className={s.err} id={id(`${k}-err`)}>
            {err}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className={s.card}>
      <h3 className={`display ${s.title}`} id={id('title')}>
        <strong>{t.title}</strong>
      </h3>
      {!KEY && <p className={s.note}>{t.noKey}</p>}

      <form className={s.form} onSubmit={submit} noValidate aria-labelledby={id('title')}>
        {field('name', t.fields.name, { required: true, auto: 'name', first: true })}
        {field('email', t.fields.email, { type: 'email', required: true, auto: 'email' })}
        {field('phone', t.fields.phone, { type: 'tel', auto: 'tel' })}
        {field('message', t.fields.message, { area: true, required: true })}
        {/* honeypot: hidden from people and screen readers; bots tick it */}
        <input ref={honeyRef} type="checkbox" name="botcheck" className={s.honey} tabIndex={-1} aria-hidden="true" autoComplete="off" />
        <button type="submit" className={s.send} disabled={status === 'sending'} aria-busy={status === 'sending'}>
          {status === 'sending' && <span className={s.spin} aria-hidden="true" />}
          {status === 'sending' ? t.sending : KEY ? t.send : t.sendMail}
          {status !== 'sending' && <span aria-hidden="true">→</span>}
        </button>
      </form>

      <div aria-live="polite" className={s.live}>
        {status === 'sent' && <p className={s.ok}>{t.success}</p>}
        {status === 'mailed' && <p className={s.ok}>Your email app should now be open with the message filled in.</p>}
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
    </div>
  );
}
