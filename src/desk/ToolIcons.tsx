import type { ToolIcon } from '../content';

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
const F = { fill: 'var(--slate)' } as const;

const paths: Record<ToolIcon, React.ReactNode> = {
  sql: (<><ellipse cx="12" cy="5.5" rx="7" ry="2.5" {...S} /><path d="M5 5.5v13c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-13M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5" {...S} /></>),
  excel: (<><rect x="3.5" y="3.5" width="17" height="17" rx="2" {...S} /><rect x="3.5" y="3.5" width="17" height="4.5" rx="2" {...F} /><path d="M3.5 8h17M3.5 12.5h17M3.5 16.5h17M9.5 8v12.5M15 8v12.5" {...S} strokeWidth={1.1} /></>),
  python: (<><path d="M8 4c-2 0-3 1-3 3v2.5c0 1.4-.8 2.5-2 2.5 1.2 0 2 1.1 2 2.5V17c0 2 1 3 3 3M16 4c2 0 3 1 3 3v2.5c0 1.4.8 2.5 2 2.5-1.2 0-2 1.1-2 2.5V17c0 2-1 3-3 3" {...S} /><circle cx="12" cy="12" r="1.6" fill="currentColor" /></>),
  powerbi: (<><rect x="4" y="12" width="4" height="8" rx="1" {...F} /><rect x="10" y="7" width="4" height="13" rx="1" fill="currentColor" /><rect x="16" y="3.5" width="4" height="16.5" rx="1" {...S} /></>),
  doc: (<><path d="M6 3h8l4 4v14H6z" {...S} /><path d="M14 3v4h4M9 11h6M9 14.5h6M9 18h3.5" {...S} /></>),
  stories: (<><rect x="3" y="4" width="8" height="7" rx="1.5" {...S} /><rect x="13" y="4" width="8" height="7" rx="1.5" {...F} /><rect x="3" y="13" width="8" height="7" rx="1.5" {...F} /><rect x="13" y="13" width="8" height="7" rx="1.5" {...S} /></>),
  people: (<><circle cx="8" cy="8" r="3" {...S} /><circle cx="17" cy="9.5" r="2.4" {...S} /><path d="M2.5 20c.6-3.5 2.8-5.5 5.5-5.5s4.9 2 5.5 5.5M14 15.2c.9-.6 1.9-.9 3-.9 2.3 0 4 1.7 4.5 4.7" {...S} /></>),
  flow: (<><rect x="3" y="3.5" width="7" height="5" rx="1" {...S} /><path d="M17.5 9.5l3.5 3.5-3.5 3.5-3.5-3.5z" {...F} /><rect x="3" y="15.5" width="7" height="5" rx="1" {...S} /><path d="M6.5 8.5v7M10 6h4.5v3.5M10 18h4.5v-1.5" {...S} /></>),
  trace: (<><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" {...S} /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" {...S} /></>),
  ab: (<><rect x="2.5" y="5" width="8.5" height="14" rx="1.5" {...S} /><rect x="13" y="5" width="8.5" height="14" rx="1.5" {...F} /><path d="M4.8 15l2-6 2 6M5.4 13.2h2.8M15.6 9h2.2a1.5 1.5 0 0 1 0 3h-2.2zm0 3h2.6a1.5 1.5 0 0 1 0 3h-2.6z" {...S} strokeWidth={1.3} /></>),
  seo: (<><circle cx="10.5" cy="10.5" r="6.5" {...S} /><path d="M15.5 15.5L21 21" {...S} strokeWidth={2.2} /><path d="M7.5 12.5l2-2.5 1.5 1.5 2.5-3" {...S} /></>),
  analytics: (<><path d="M3.5 20.5h17" {...S} /><path d="M4 16l5-5 4 3 7-8" {...S} /><circle cx="9" cy="11" r="1.6" fill="currentColor" /><circle cx="13" cy="14" r="1.6" fill="var(--slate)" /><circle cx="20" cy="6" r="1.6" fill="currentColor" /></>),
  keyword: (<><circle cx="8" cy="12" r="4.5" {...S} /><circle cx="8" cy="12" r="1.5" {...F} /><path d="M12.5 12H21M18 12v3.5M21 12v2.5" {...S} /></>),
};

export function ToolGlyph({ icon }: { icon: ToolIcon }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
      {paths[icon]}
    </svg>
  );
}
