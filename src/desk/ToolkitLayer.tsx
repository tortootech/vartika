import { useId, useState } from 'react';
import { toolkit } from '../content';
import { ToolGlyph } from './ToolIcons';
import { cardTilt } from './layout';
import s from './ToolkitLayer.module.css';

/**
 * The toolkit: an index card plus three groups of tool cards.
 * In motion mode it sits inside the pinned desk and the cards are animated out of a folder.
 * In reduced-motion mode it is rendered as its own static section.
 */
export function ToolkitLayer({ standalone = false }: { standalone?: boolean }) {
  const [active, setActive] = useState<string | null>(null);
  const baseId = useId();
  const offsets = toolkit.groups.map((_, gi) => toolkit.groups.slice(0, gi).reduce((sum, g) => sum + g.tools.length, 0));
  const activeTool = toolkit.groups.flatMap((g) => g.tools).find((t) => t.name === active);

  return (
    <div className={`${s.layer} ${standalone ? s.standalone : ''}`} data-tk-layer>
      <header className={s.index} data-tk-head>
        <span className={`mono-label ${s.indexLabel}`}>[ Toolkit ]</span>
        <h2 className={`display ${s.title}`}>
          <strong>{toolkit.title[0]}</strong> <em>{toolkit.title[1]}</em>
        </h2>
        <p className={s.sub}>{toolkit.sub}</p>
      </header>

      {toolkit.groups.map((g, gi) => (
        <section key={g.id} className={`${s.group} ${s['g_' + g.id]}`} aria-label={g.label}>
          <h3 className={`mono-label ${s.groupLabel}`} data-tk-head>
            {g.label}
          </h3>
          <ul className={s.cards}>
            {g.tools.map((t, ti) => {
              const i = offsets[gi] + ti;
              const tipId = `${baseId}-tip-${i}`;
              return (
                <li key={t.name} className={s.cardWrap} data-card data-tilt={cardTilt(i)} style={standalone ? { rotate: `${cardTilt(i) * 0.5}deg` } : undefined}>
                  <button
                    type="button"
                    className={`${s.card} ${active === t.name ? s.isActive : ''}`}
                    aria-describedby={tipId}
                    aria-pressed={active === t.name}
                    onClick={() => setActive((a) => (a === t.name ? null : t.name))}
                    onMouseEnter={() => setActive(t.name)}
                    onMouseLeave={() => setActive((a) => (a === t.name ? null : a))}
                    onFocus={() => setActive(t.name)}
                  >
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

      {/* Mobile: the "what she uses it for" line shows in one caption slot instead of floating tooltips. */}
      <p className={s.caption} aria-hidden="true" data-tk-head>
        {activeTool ? (
          <>
            <strong>{activeTool.name}:</strong> {activeTool.use}
          </>
        ) : (
          'Tap a tool to see what she uses it for.'
        )}
      </p>
    </div>
  );
}
