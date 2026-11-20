/* Static desk props: mug, pen, laptop edge. All inline SVG in the palette. */
export function Mug() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      <ellipse cx="54" cy="64" rx="40" ry="40" fill="var(--navy)" opacity=".18" transform="translate(4 6)" />
      <path d="M90 52c18-2 22 22 2 24" fill="none" stroke="var(--cream)" strokeWidth="9" strokeLinecap="round" />
      <path d="M90 52c18-2 22 22 2 24" fill="none" stroke="var(--cream-3)" strokeWidth="2" strokeLinecap="round" opacity=".6" />
      <circle cx="54" cy="64" r="38" fill="var(--cream)" />
      <circle cx="54" cy="64" r="31" fill="var(--navy)" />
      <circle cx="54" cy="64" r="31" fill="none" stroke="var(--slate-deep)" strokeWidth="3" />
      <ellipse cx="46" cy="56" rx="10" ry="5" fill="var(--slate)" opacity=".35" transform="rotate(-25 46 56)" />
    </svg>
  );
}

export function Steam() {
  return (
    <svg viewBox="0 0 60 90" aria-hidden="true" focusable="false">
      <path className="steam steam--a" d="M22 86c-10-14 10-22 0-38s8-24 2-40" />
      <path className="steam steam--b" d="M38 86c-8-12 10-20 2-34s6-20 0-34" />
    </svg>
  );
}

export function Pen() {
  return (
    <svg viewBox="0 0 24 220" aria-hidden="true" focusable="false">
      <rect x="4" y="22" width="16" height="170" rx="8" fill="var(--navy)" />
      <rect x="4" y="22" width="5" height="170" rx="2.5" fill="var(--slate-deep)" />
      <rect x="15" y="6" width="4" height="64" rx="2" fill="var(--cream)" />
      <path d="M4 190h16l-8 26z" fill="var(--cream-3)" />
      <path d="M10 208h4l-2 10z" fill="var(--navy)" />
    </svg>
  );
}

export function Laptop() {
  return (
    <svg viewBox="0 0 400 300" aria-hidden="true" focusable="false" preserveAspectRatio="xMinYMin slice">
      <rect x="0" y="0" width="400" height="300" rx="22" fill="var(--navy)" />
      <rect x="0" y="0" width="400" height="300" rx="22" fill="none" stroke="var(--slate-deep)" strokeWidth="3" />
      {Array.from({ length: 4 }, (_, r) =>
        Array.from({ length: 9 }, (_, c) => (
          <rect key={`${r}-${c}`} x={26 + c * 38} y={28 + r * 38} width="30" height="30" rx="5" fill="var(--navy-3)" />
        )),
      )}
      <rect x="90" y="190" width="200" height="80" rx="10" fill="var(--navy-2)" stroke="var(--navy-3)" strokeWidth="2" />
    </svg>
  );
}
