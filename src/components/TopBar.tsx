import { contact, resumeButton, site } from '../content';
import { scrollToTarget } from '../lib/scroll';
import { useSection } from '../lib/store';
import s from './TopBar.module.css';

/** The resume lives in /public; BASE_URL keeps the link right under any base path (e.g. /vartika/). */
export const resumeUrl = `${import.meta.env.BASE_URL}${contact.resume}`;

export function TopBar() {
  const { theme } = useSection();
  return (
    <header className={`${s.bar} ${s[theme]}`}>
      <a
        href="#top"
        className={s.brand}
        onClick={(e) => {
          e.preventDefault();
          scrollToTarget(0);
        }}
      >
        <span className={s.name}>{site.barName}</span>
        <span className="visually-hidden"> back to top</span>
      </a>
      <div className={s.actions}>
        <a className={s.resume} href={resumeUrl} target="_blank" rel="noopener noreferrer" aria-label={resumeButton.aria}>
          <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
            <path d="M4 1.75h5.5L12.5 4.75v9.5h-8.5z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
            <path d="M9.25 1.75v3.25h3.25M6.25 8h4M6.25 10.5h4M6.25 5.75h1.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <span aria-hidden="true">{resumeButton.label}</span>
        </a>
      </div>
    </header>
  );
}
