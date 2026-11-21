import { useId, useState } from 'react';
import { toolkit } from '../content';
import { ToolGlyph } from './ToolIcons';
import s from './ToolkitLayer.module.css';

const total = toolkit.groups.reduce((n, g) => n + g.tools.length, 0);
const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Slide 2, printed on the inside of the opened folder: a clean index of tools.
 * In motion mode it sits in the pinned desk and its rows are drawn in by the scroll timeline.
 * In reduced-motion mode it renders as its own static section.
 */
export function ToolkitLayer({ standalone = false }: { standalone?: boolean }) {
  const [active, setActive] = useState<string | null>(null);
  const baseId = useId();
  const offsets = toolkit.groups.map((_, gi) => toolkit.groups.slice(0, gi).reduce((sum, g) => sum + g.tools.length, 0));
  const activeTool = toolkit.groups.flatMap((g) => g.tools).find((t) => t.name === active);

  return (
    <div className={`${s.layer} ${standalone ? s.standalone : ''}`} data-tk-layer>
      <header className={s.head}>
        <p className={`mono-label ${s.label}`} data-tk-head>
          [ 02 ] Toolkit
        </p>
        <h2 className={`display ${s.title}`}>
          <span className={s.line} data-tk-head>
            <strong>{toolkit.title[0]}</strong>
          </span>
          <span className={s.line} data-tk-head>
            <em>{toolkit.title[1]}</em>
          </span>
        </h2>
        <p className={s.sub} data-tk-head>
          {toolkit.sub}
        </p>
        <dl className={s.stats} data-tk-head>
          <div>
            <dt className="mono-label">Tools</dt>
            <dd data-tk-count data-total={total}>
              {pad(total)}
            </dd>
          </div>
          <div>
            <dt className="mono-label">Groups</dt>
            <dd>{pad(toolkit.groups.length)}</dd>
          </div>
        </dl>
      </header>

      <div className={s.groups}>
        {toolkit.groups.map((g, gi) => (
          <section key={g.id} className={`${s.group} ${s['g_' + g.id]}`} aria-label={g.label}>
            <h3 className={`mono-label ${s.groupHead}`} data-tk-head>
              <span>{g.label}</span>
              <span>{pad(g.tools.length)}</span>
            </h3>
            <ul className={s.rows}>
              {g.tools.map((t, ti) => {
                const i = offsets[gi] + ti;
                const tipId = `${baseId}-tip-${i}`;
                return (
                  <li key={t.name} className={s.rowWrap} data-row>
                    <button
                      type="button"
                      className={`${s.row} ${active === t.name ? s.isActive : ''}`}
                      aria-describedby={tipId}
                      aria-pressed={active === t.name}
                      onClick={() => setActive((a) => (a === t.name ? null : t.name))}
                      onMouseEnter={() => setActive(t.name)}
                      onMouseLeave={() => setActive((a) => (a === t.name ? null : a))}
                      onFocus={() => setActive(t.name)}
                    >
                      <span className={s.num}>{pad(i + 1)}</span>
                      <span className={s.icon}>
                        <ToolGlyph icon={t.icon} />
                      </span>
                      <span className={s.text}>
                        <span className={s.name}>{t.name}</span>
                        <span className={s.detail}>{t.detail}</span>
                      </span>
                      <span role="tooltip" id={tipId} className={s.tip}>
                        {t.use}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      {/* Touch screens: the "what she uses it for" line shows here instead of a floating tooltip. */}
      <p className={s.caption} aria-hidden="true">
        {activeTool ? (
          <>
            <strong>{activeTool.name}</strong> {activeTool.use}
          </>
        ) : (
          'Tap a tool to see what she uses it for.'
        )}
      </p>
    </div>
  );
}
