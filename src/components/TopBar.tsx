import { nav, site } from '../content';
import { scrollToTarget } from '../lib/scroll';
import { useSection } from '../lib/store';
import s from './TopBar.module.css';

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
        <span className={s.year}>{site.year}</span>
        <span className="visually-hidden"> back to top</span>
      </a>
      <a
        href="#contact"
        className={s.pill}
        onClick={(e) => {
          e.preventDefault();
          scrollToTarget('#contact');
        }}
      >
        <span className={s.pillDot} aria-hidden="true" />
        {nav.contact}
      </a>
    </header>
  );
}
