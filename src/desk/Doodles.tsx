/* Navy "ink" doodles drawn on the cream papers. viewBox 0 0 100 128. */
export type DoodleKind = 'bar' | 'line' | 'table' | 'flow' | 'erd' | 'pie' | 'kanban' | 'funnel' | 'check' | 'text';

const I = { fill: 'none', stroke: 'var(--navy)', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
const A = { fill: 'var(--slate)' } as const;
const N = { fill: 'var(--navy)' } as const;

function Header() {
  return (
    <g>
      <rect x="10" y="10" width="38" height="4" rx="2" {...N} />
      <rect x="10" y="18" width="62" height="2.4" rx="1.2" {...A} opacity=".7" />
      <rect x="10" y="23" width="48" height="2.4" rx="1.2" {...A} opacity=".7" />
    </g>
  );
}

function Lines({ y = 96, n = 3 }: { y?: number; n?: number }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <rect key={i} x="10" y={y + i * 7} width={i === n - 1 ? 46 : 80} height="2.4" rx="1.2" {...A} opacity=".6" />
      ))}
    </g>
  );
}

const body: Record<DoodleKind, React.ReactNode> = {
  bar: (
    <g>
      <path d="M14 86V36M14 86h74" {...I} />
      {[22, 52, 30, 64, 44].map((h, i) => (
        <rect key={i} x={22 + i * 13} y={84 - h} width="8" height={h} rx="1" {...(i === 3 ? N : A)} />
      ))}
      <path d="M22 50 L35 38 L48 44 L61 28 L74 34" {...I} strokeDasharray="2 3" />
      <Lines y={98} n={2} />
    </g>
  ),
  line: (
    <g>
      <path d="M14 86V36M14 86h74" {...I} />
      <path d="M14 76 C26 72 30 54 42 60 S60 40 70 44 S82 30 88 32" {...I} strokeWidth={2} />
      <path d="M14 82 C28 80 36 70 48 74 S70 62 88 64" {...I} stroke="var(--slate)" />
      {[[42, 60], [70, 44], [88, 32]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="2.4" {...N} />)}
      <Lines y={98} n={3} />
    </g>
  ),
  table: (
    <g>
      <rect x="10" y="34" width="80" height="10" {...A} />
      <rect x="10" y="34" width="80" height="60" {...I} />
      {[44, 54, 64, 74, 84].map((y) => <path key={y} d={`M10 ${y}h80`} {...I} strokeWidth={0.9} />)}
      {[34, 58].map((x) => <path key={x} d={`M${x} 34v60`} {...I} strokeWidth={0.9} />)}
      {[48, 58, 68, 78, 88].map((y, i) => <rect key={y} x="62" y={y - 1.5} width={10 + ((i * 7) % 16)} height="2.4" rx="1" {...N} opacity=".75" />)}
      <Lines y={104} n={2} />
    </g>
  ),
  flow: (
    <g>
      <rect x="34" y="32" width="32" height="12" rx="6" {...I} />
      <path d="M50 44v8" {...I} />
      <path d="M50 52 L62 62 L50 72 L38 62 Z" {...I} fill="var(--slate)" fillOpacity=".5" />
      <path d="M38 62H22v14M62 62h16v14" {...I} />
      <rect x="10" y="76" width="24" height="12" rx="2" {...I} />
      <rect x="66" y="76" width="24" height="12" rx="2" {...I} />
      <path d="M22 88v10h56V88" {...I} strokeDasharray="2 3" />
      <Lines y={106} n={2} />
    </g>
  ),
  erd: (
    <g>
      {[[10, 34], [58, 34], [34, 74]].map(([x, y], i) => (
        <g key={i}>
          <rect x={x} y={y} width="32" height="26" rx="2" {...I} />
          <rect x={x} y={y} width="32" height="7" {...(i === 2 ? N : A)} />
          {[12, 17, 22].map((dy) => <rect key={dy} x={x + 4} y={y + dy} width={dy === 12 ? 18 : 22} height="2" rx="1" {...A} />)}
        </g>
      ))}
      <path d="M42 47h16M26 60v14h8M74 60v14h-8" {...I} />
      <path d="M54 43l4 4-4 4M30 70l4 4-4 4" {...I} strokeWidth={1.2} />
      <Lines y={108} n={2} />
    </g>
  ),
  pie: (
    <g>
      <circle cx="40" cy="62" r="24" {...I} />
      <path d="M40 62V38A24 24 0 0 1 62 70Z" {...A} />
      <path d="M40 62L62 70A24 24 0 0 1 48 85Z" {...N} />
      {[48, 58, 68].map((y, i) => (
        <g key={y}><rect x="72" y={y - 3} width="6" height="6" {...(i === 1 ? N : A)} /><rect x="81" y={y - 1.2} width="10" height="2.4" rx="1" {...A} /></g>
      ))}
      <Lines y={98} n={3} />
    </g>
  ),
  kanban: (
    <g>
      {[10, 38, 66].map((x, c) => (
        <g key={x}>
          <rect x={x} y="32" width="24" height="5" rx="1" {...N} opacity={c === 1 ? 1 : 0.8} />
          {Array.from({ length: 3 - c }, (_, r) => (
            <rect key={r} x={x} y={42 + r * 16} width="24" height="12" rx="2" {...I} fill="var(--slate)" fillOpacity={0.25} />
          ))}
        </g>
      ))}
      <Lines y={100} n={3} />
    </g>
  ),
  funnel: (
    <g>
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${12 + i * 9} ${34 + i * 14}h${76 - i * 18}l-4 11H${16 + i * 9}Z`} {...(i === 3 ? N : A)} opacity={1 - i * 0.12} />
      ))}
      <path d="M50 94v6" {...I} />
      <Lines y={106} n={2} />
    </g>
  ),
  check: (
    <g>
      {[36, 50, 64, 78].map((y, i) => (
        <g key={y}>
          <rect x="12" y={y} width="9" height="9" rx="1.5" {...I} />
          {i < 3 && <path d={`M14 ${y + 4.5}l2.4 2.6 4-5.4`} {...I} strokeWidth={1.8} />}
          <rect x="28" y={y + 3.3} width={i % 2 ? 40 : 56} height="2.4" rx="1.2" {...A} />
        </g>
      ))}
      <Lines y={100} n={3} />
    </g>
  ),
  text: (
    <g>
      {Array.from({ length: 11 }, (_, i) => (
        <rect key={i} x="10" y={34 + i * 7} width={[80, 74, 80, 60, 0, 80, 70, 78, 40, 0, 66][i]} height="2.4" rx="1.2" {...A} opacity=".7" />
      ))}
      <path d="M62 104c6-6 12 4 18-2" {...I} />
    </g>
  ),
};

export function Doodle({ kind }: { kind: DoodleKind }) {
  return (
    <svg viewBox="0 0 100 128" aria-hidden="true" focusable="false">
      <Header />
      {body[kind]}
    </svg>
  );
}
