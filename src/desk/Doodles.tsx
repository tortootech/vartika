import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';

/* Realistic analyst documents printed on the cream sheets. viewBox 0 0 100 128.
   Only real project numbers appear (AOV ~159 BRL, ~3.1% repeat rate, Nov spike, 92% site health);
   everything else is axes, labels and structure. */
export type DoodleKind =
  | 'dashboard' | 'trend' | 'table' | 'sql'
  | 'erd' | 'process' | 'brd' | 'matrix'
  | 'stakeholder' | 'audit';

const NAVY = 'var(--navy)';
const SLATE = 'var(--slate)';
const SOFT = 'var(--ink-soft)';
const MONO = { fontFamily: 'var(--font-mono)' };
const SANS = { fontFamily: 'var(--font-body)' };
const hair = { stroke: NAVY, strokeWidth: 0.3, fill: 'none' } as const;
const grid = { stroke: SLATE, strokeWidth: 0.25, opacity: 0.6 } as const;

function T({ x, y, s = 2.4, w = 400, c = SOFT, mono = true, a, children }: { x: number; y: number; s?: number; w?: number; c?: string; mono?: boolean; a?: 'start' | 'middle' | 'end'; children: React.ReactNode }) {
  return (
    <text x={x} y={y} fontSize={s} fontWeight={w} fill={c} textAnchor={a} style={mono ? MONO : SANS}>
      {children}
    </text>
  );
}

function Header({ id, title, page = '1/2' }: { id: string; title: string; page?: string }) {
  return (
    <g>
      <T x={8} y={9.5} s={2.2}>{id}</T>
      <T x={92} y={9.5} s={2.2} a="end">p. {page}</T>
      <T x={8} y={16.5} s={4.3} w={600} c={NAVY} mono={false}>{title}</T>
      <line x1={8} x2={92} y1={20} y2={20} {...hair} />
    </g>
  );
}

/** Grey lines standing in for body text. */
function TextLines({ y, n, w = 84, gap = 3.6 }: { y: number; n: number; w?: number; gap?: number }) {
  const widths = [1, 0.94, 0.98, 0.7, 0.96, 0.88, 0.62];
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <rect key={i} x={8} y={y + i * gap} width={w * (i === n - 1 ? 0.55 : widths[i % widths.length])} height={1.1} fill={SLATE} opacity={0.55} />
      ))}
    </g>
  );
}

const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const BARS = [38, 44, 47, 46, 52, 50, 55, 58, 54, 57, 86, 62]; // relative heights, November spike

const docs: Record<DoodleKind, React.ReactNode> = {
  dashboard: (
    <g>
      <Header id="NC-DASH-01" title="NovaCart · Sales overview" page="1/1" />
      {[
        ['TOTAL REVENUE', null],
        ['AOV', '~159 BRL'],
        ['REPEAT RATE', '~3.1%'],
      ].map(([label, value], i) => (
        <g key={label} transform={`translate(${8 + i * 28.7} 23.5)`}>
          <rect width={26.5} height={14} {...hair} stroke={SLATE} />
          <T x={2} y={4} s={1.9}>{label}</T>
          {value ? (
            <T x={2} y={10.8} s={4.4} w={600} c={NAVY} mono={false}>{value}</T>
          ) : (
            <polyline points="2,11 6,9.5 9,10 13,8 16,8.6 19,6.2 22,7 24.5,4.6" fill="none" stroke={NAVY} strokeWidth={0.6} />
          )}
        </g>
      ))}
      <T x={8} y={44} s={2.4} w={600} c={NAVY} mono={false}>Revenue by month</T>
      {[0, 1, 2, 3].map((i) => <line key={i} x1={14} x2={92} y1={50 + i * 9} y2={50 + i * 9} {...grid} />)}
      <line x1={14} x2={92} y1={86} y2={86} {...hair} />
      {BARS.map((h, i) => (
        <rect key={i} x={15.5 + i * 6.4} y={86 - h * 0.4} width={4.2} height={h * 0.4} fill={i === 10 ? NAVY : SLATE} />
      ))}
      {MONTHS.map((m, i) => <T key={i} x={17.6 + i * 6.4} y={90} s={1.8} a="middle">{m}</T>)}
      <T x={86} y={47.5} s={1.9} a="end" c={NAVY}>Nov peak</T>
      <line x1={8} x2={92} y1={96} y2={96} {...hair} />
      <T x={8} y={100.5} s={2} c={NAVY}>CATEGORY</T>
      <T x={92} y={100.5} s={2} a="end" c={NAVY}>SHARE</T>
      {[0.82, 0.64, 0.5, 0.36].map((w, i) => (
        <g key={i}>
          <rect x={8} y={103.5 + i * 5} width={30} height={1.1} fill={SLATE} opacity={0.55} />
          <rect x={52} y={103 + i * 5} width={40 * w} height={2} fill={i ? SLATE : NAVY} opacity={i ? 0.7 : 1} />
        </g>
      ))}
    </g>
  ),
  trend: (
    <g>
      <Header id="NC-ANL-03" title="Monthly order trend" />
      <g>
        <rect x={8} y={24} width={3} height={1.2} fill={NAVY} />
        <T x={12.5} y={25.2} s={2}>Orders</T>
        <rect x={28} y={24} width={3} height={1.2} fill={SLATE} />
        <T x={32.5} y={25.2} s={2}>3-mo avg</T>
      </g>
      {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={12} x2={92} y1={32 + i * 11} y2={32 + i * 11} {...grid} />)}
      <line x1={12} x2={92} y1={76} y2={76} {...hair} />
      <polyline
        points="12,66 19,63 26,61 33,62 40,57 47,58 54,54 61,52 68,55 75,52 82,36 89,49"
        fill="none" stroke={NAVY} strokeWidth={0.8} strokeLinejoin="round"
      />
      <polyline points="12,66 19,64.5 26,63 33,62 40,60 47,59 54,56.5 61,54.5 68,53.5 75,53 82,48 89,46" fill="none" stroke={SLATE} strokeWidth={0.7} strokeDasharray="1.4 1" />
      <circle cx={82} cy={36} r={1.1} fill={NAVY} />
      <line x1={82} x2={82} y1={37.5} y2={76} stroke={NAVY} strokeWidth={0.25} strokeDasharray="0.8 0.8" />
      <T x={80} y={34} s={1.9} a="end" c={NAVY}>Nov spike</T>
      {MONTHS.map((m, i) => <T key={i} x={12 + i * 7} y={80} s={1.8} a="middle">{m}</T>)}
      <T x={8} y={89} s={2.4} w={600} c={NAVY} mono={false}>Notes</T>
      <TextLines y={92} n={6} />
    </g>
  ),
  table: (
    <g>
      <Header id="SQL-OUT-07" title="orders · sample rows" />
      <rect x={8} y={23} width={84} height={5} fill={SLATE} opacity={0.35} />
      {['order_id', 'customer', 'status', 'price'].map((h, i) => (
        <T key={h} x={[9.5, 33, 56, 90.5][i]} y={26.6} s={2} c={NAVY} a={i === 3 ? 'end' : 'start'}>{h}</T>
      ))}
      {[
        ['e481f51c…', '9ef432eb…', 'delivered', '29.99'],
        ['53cdb2fc…', 'b0830fb4…', 'delivered', '118.70'],
        ['47770eb9…', '41ce2a54…', 'delivered', '159.90'],
        ['949d5b44…', 'f88197465…', 'shipped', '45.00'],
        ['ad21c59c…', '8ab97904…', 'delivered', '19.90'],
        ['a4591c26…', '503740e9…', 'delivered', '147.90'],
        ['136cce7f…', 'ed0271e0…', 'invoiced', '49.90'],
        ['6514b8ad…', '9bdf08b4…', 'delivered', '59.99'],
        ['76c6e866…', 'f54a9f0e…', 'delivered', '19.90'],
        ['e69bfb5e…', '31ad1d1b…', 'canceled', '12.99'],
        ['e6ce16cb…', '494dded5…', 'delivered', '99.00'],
        ['34513ce0…', '7711cf62…', 'delivered', '25.30'],
      ].map((r, i) => (
        <g key={i}>
          <line x1={8} x2={92} y1={33 + i * 5.6} y2={33 + i * 5.6} {...grid} />
          {r.map((c, j) => (
            <T key={j} x={[9.5, 33, 56, 90.5][j]} y={31.8 + i * 5.6} s={1.95} c={j === 2 && c !== 'delivered' ? NAVY : SOFT} a={j === 3 ? 'end' : 'start'}>{c}</T>
          ))}
        </g>
      ))}
      <T x={8} y={106} s={2}>12 of 99,441 rows · Olist public dataset</T>
      <TextLines y={110} n={3} />
    </g>
  ),
  sql: (
    <g>
      <Header id="aov_by_month.sql" title="AOV by month" page="1/1" />
      {[
        ['SELECT', ''],
        ['  DATE_TRUNC(', "'month', o.purchased_at) AS month,"],
        ['  ROUND(SUM(p.value)', ''],
        ['    / COUNT(DISTINCT o.order_id), 2)', ''],
        ['    AS aov', ''],
        ['FROM', ' orders o'],
        ['JOIN', ' payments p USING (order_id)'],
        ['WHERE', " o.status = 'delivered'"],
        ['GROUP BY', ' 1'],
        ['ORDER BY', ' 1;'],
      ].map(([kw, rest], i) => (
        <g key={i}>
          <T x={10.5} y={27 + i * 4.4} s={2} a="end" c={SLATE}>{i + 1}</T>
          <text x={13} y={27 + i * 4.4} fontSize={2.3} style={MONO}>
            <tspan fill={NAVY} fontWeight={500}>{kw}</tspan>
            <tspan fill={SOFT}>{rest}</tspan>
          </text>
        </g>
      ))}
      <line x1={8} x2={92} y1={75} y2={75} {...hair} />
      <T x={8} y={80} s={2} c={NAVY}>RESULT</T>
      <rect x={8} y={82} width={84} height={4.6} fill={SLATE} opacity={0.35} />
      <T x={10} y={85.3} s={2} c={NAVY}>month</T>
      <T x={90} y={85.3} s={2} c={NAVY} a="end">aov</T>
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <rect x={10} y={89 + i * 5} width={16} height={1.1} fill={SLATE} opacity={0.55} />
          <rect x={78} y={89 + i * 5} width={12} height={1.1} fill={SLATE} opacity={0.55} />
          <line x1={8} x2={92} y1={91.6 + i * 5} y2={91.6 + i * 5} {...grid} />
        </g>
      ))}
    </g>
  ),
  erd: (
    <g>
      <Header id="SS-DATA-02" title="ShopSphere · ER diagram" />
      {[
        { x: 8, y: 25, n: 'customers', f: ['customer_id PK', 'city', 'segment'] },
        { x: 56, y: 25, n: 'orders', f: ['order_id PK', 'customer_id FK', 'order_date'] },
        { x: 8, y: 60, n: 'products', f: ['product_id PK', 'category', 'price'] },
        { x: 56, y: 60, n: 'order_items', f: ['order_id FK', 'product_id FK', 'qty'] },
        { x: 8, y: 95, n: 'payments', f: ['payment_id PK', 'order_id FK', 'method'] },
        { x: 56, y: 95, n: 'reviews', f: ['review_id PK', 'order_id FK', 'score'] },
      ].map((e) => (
        <g key={e.n}>
          <rect x={e.x} y={e.y} width={36} height={22} fill="var(--cream)" stroke={NAVY} strokeWidth={0.35} />
          <rect x={e.x} y={e.y} width={36} height={5} fill={NAVY} />
          <T x={e.x + 2} y={e.y + 3.7} s={2.2} c="var(--cream)">{e.n}</T>
          {e.f.map((f, i) => (
            <T key={f} x={e.x + 2} y={e.y + 9.6 + i * 4.3} s={1.9} c={i === 0 ? NAVY : SOFT}>{f}</T>
          ))}
        </g>
      ))}
      {/* relationships */}
      <path d="M44 36h12M74 47v13M56 76H44M68 82v13M80 82v13M30 82v13" {...hair} strokeWidth={0.4} />
      <path d="M53 34l3 2-3 2M72 57l2 3 2-3M47 74l-3 2 3 2M66 92l2 3 2-3M78 92l2 3 2-3M28 92l2 3 2-3" {...hair} strokeWidth={0.4} />
    </g>
  ),
  process: (
    <g>
      <Header id="SS-PRC-04" title="Order-to-delivery process" />
      {['Customer', 'Platform', 'Seller'].map((l, i) => (
        <g key={l}>
          <rect x={8} y={24 + i * 22} width={84} height={22} fill="none" stroke={SLATE} strokeWidth={0.3} />
          <rect x={8} y={24 + i * 22} width={6} height={22} fill={SLATE} opacity={0.3} />
          <T x={11.8} y={35 + i * 22} s={2} c={NAVY} a="middle">
            <tspan>{l.slice(0, 4)}</tspan>
          </T>
        </g>
      ))}
      <circle cx={20} cy={35} r={2.2} {...hair} strokeWidth={0.5} />
      <rect x={27} y={31} width={16} height={8} rx={1} {...hair} strokeWidth={0.4} />
      <T x={35} y={35.8} s={1.8} a="middle" c={NAVY}>Place order</T>
      <rect x={27} y={53} width={16} height={8} rx={1} {...hair} strokeWidth={0.4} />
      <T x={35} y={57.8} s={1.8} a="middle" c={NAVY}>Validate</T>
      <path d="M55 51l6 6-6 6-6-6z" fill="var(--cream)" stroke={NAVY} strokeWidth={0.4} />
      <T x={55} y={57.7} s={1.6} a="middle" c={NAVY}>Paid?</T>
      <rect x={67} y={75} width={16} height={8} rx={1} {...hair} strokeWidth={0.4} />
      <T x={75} y={79.8} s={1.8} a="middle" c={NAVY}>Ship</T>
      <rect x={67} y={31} width={16} height={8} rx={1} {...hair} strokeWidth={0.4} />
      <T x={75} y={35.8} s={1.8} a="middle" c={NAVY}>Track</T>
      <path d="M22.2 35H27M35 39v14M43 57h6M61 57h14v18M75 75V39" {...hair} strokeWidth={0.35} />
      <path d="M25.6 34l1.4 1-1.4 1M34 51.6l1 1.4 1-1.4M47.6 56l1.4 1-1.4 1M74 73.6l1 1.4 1-1.4M74 40.4l1-1.4 1 1.4" {...hair} strokeWidth={0.35} />
      <T x={64} y={55.6} s={1.6}>yes</T>
      <T x={8} y={95} s={2.4} w={600} c={NAVY} mono={false}>Exceptions</T>
      <TextLines y={98} n={6} />
    </g>
  ),
  brd: (
    <g>
      <Header id="NC-BRD-v1.2" title="Business Requirements" page="3/21" />
      <T x={8} y={26} s={2.6} w={600} c={NAVY} mono={false}>2. Scope</T>
      <TextLines y={29} n={4} />
      <T x={8} y={47} s={2.6} w={600} c={NAVY} mono={false}>3. Success metrics</T>
      {['Repeat purchase rate', 'Average order value', 'Recommendation CTR'].map((m, i) => (
        <g key={m}>
          <T x={8} y={52.5 + i * 4.4} s={2} c={NAVY}>{`KPI-0${i + 1}`}</T>
          <T x={22} y={52.5 + i * 4.4} s={2}>{m}</T>
        </g>
      ))}
      <T x={8} y={70} s={2.6} w={600} c={NAVY} mono={false}>4. Requirements</T>
      <rect x={8} y={73} width={84} height={4.6} fill={SLATE} opacity={0.35} />
      {['ID', 'Requirement', 'Priority'].map((h, i) => (
        <T key={h} x={[10, 22, 90][i]} y={76.3} s={2} c={NAVY} a={i === 2 ? 'end' : 'start'}>{h}</T>
      ))}
      {['Must', 'Must', 'Should', 'Should', 'Could', 'Must'].map((p, i) => (
        <g key={i}>
          <T x={10} y={81.6 + i * 5} s={1.95} c={NAVY}>{`BR-0${i + 1}`}</T>
          <rect x={22} y={80.5 + i * 5} width={[46, 52, 40, 48, 36, 44][i]} height={1.1} fill={SLATE} opacity={0.55} />
          <T x={90} y={81.6 + i * 5} s={1.95} a="end">{p}</T>
          <line x1={8} x2={92} y1={83.4 + i * 5} y2={83.4 + i * 5} {...grid} />
        </g>
      ))}
      <TextLines y={115} n={2} />
    </g>
  ),
  matrix: (
    <g>
      <Header id="SS-RTM-01" title="Traceability matrix" />
      {Array.from({ length: 6 }, (_, j) => (
        <T key={j} x={33 + j * 10} y={27} s={1.9} c={NAVY} a="middle">{`FR-0${j + 1}`}</T>
      ))}
      {Array.from({ length: 10 }, (_, i) => (
        <g key={i}>
          <T x={8} y={34 + i * 6} s={1.95} c={NAVY}>{`BR-${String(i + 1).padStart(2, '0')}`}</T>
          <line x1={8} x2={92} y1={35.8 + i * 6} y2={35.8 + i * 6} {...grid} />
          {Array.from({ length: 6 }, (_, j) =>
            (i * 7 + j * 3) % 5 === 0 || (i + j) % 6 === 0 ? <circle key={j} cx={33 + j * 10} cy={33.2 + i * 6} r={1.1} fill={NAVY} /> : null,
          )}
        </g>
      ))}
      {Array.from({ length: 7 }, (_, j) => (
        <line key={j} x1={28 + j * 10} x2={28 + j * 10} y1={29.5} y2={95.8} {...grid} />
      ))}
      <T x={8} y={103} s={2}>● covered · 15 BR → 20 FR</T>
      <TextLines y={107} n={4} />
    </g>
  ),
  stakeholder: (
    <g>
      <Header id="NC-STK-01" title="Stakeholder map" />
      <rect x={16} y={26} width={76} height={64} fill="none" stroke={NAVY} strokeWidth={0.35} />
      <line x1={54} x2={54} y1={26} y2={90} {...hair} strokeDasharray="1 1" />
      <line x1={16} x2={92} y1={58} y2={58} {...hair} strokeDasharray="1 1" />
      <rect x={54} y={26} width={38} height={32} fill={SLATE} opacity={0.18} />
      {[
        ['Keep satisfied', 18, 30],
        ['Manage closely', 56, 30],
        ['Monitor', 18, 62],
        ['Keep informed', 56, 62],
      ].map(([l, x, y]) => <T key={l as string} x={x as number} y={y as number} s={1.9}>{l}</T>)}
      {[
        ['CFO', 34, 38], ['Head of Product', 74, 37], ['Marketing', 66, 48], ['Data Eng.', 78, 52],
        ['Legal (DPDP)', 30, 50], ['Support', 70, 74], ['Sellers', 82, 80], ['Finance ops', 28, 78],
      ].map(([l, x, y]) => (
        <g key={l as string}>
          <circle cx={x as number} cy={y as number} r={1.3} fill={NAVY} />
          <T x={(x as number) + 2} y={(y as number) + 0.8} s={1.8} c={NAVY}>{l}</T>
        </g>
      ))}
      <T x={54} y={95} s={2} a="middle">Interest →</T>
      <text x={11} y={58} fontSize={2} fill={SOFT} style={MONO} transform="rotate(-90 11 58)" textAnchor="middle">Power →</text>
      <TextLines y={101} n={5} />
    </g>
  ),
  audit: (
    <g>
      <Header id="TTO-SEO-01" title="SEO audit · The Timeless Oven" />
      <circle cx={26} cy={42} r={12} fill="none" stroke={SLATE} strokeWidth={2.4} opacity={0.4} />
      <circle
        cx={26} cy={42} r={12} fill="none" stroke={NAVY} strokeWidth={2.4}
        strokeDasharray={`${2 * Math.PI * 12 * 0.92} ${2 * Math.PI * 12}`} transform="rotate(-90 26 42)"
      />
      <T x={26} y={43.6} s={4.6} w={600} c={NAVY} a="middle" mono={false}>92%</T>
      <T x={26} y={59} s={2} a="middle">SITE HEALTH</T>
      {['Crawlability', 'HTTPS', 'Core Web Vitals', 'Internal linking', 'Markup'].map((l, i) => (
        <g key={l}>
          <T x={46} y={32 + i * 5.6} s={2}>{l}</T>
          <rect x={46} y={33.4 + i * 5.6} width={46} height={1.3} fill={SLATE} opacity={0.35} />
          <rect x={46} y={33.4 + i * 5.6} width={46 * [0.96, 1, 0.78, 0.86, 0.9][i]} height={1.3} fill={NAVY} />
        </g>
      ))}
      <line x1={8} x2={92} y1={66} y2={66} {...hair} />
      <T x={8} y={72} s={2.6} w={600} c={NAVY} mono={false}>Fix first</T>
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <rect x={8} y={75.5 + i * 5} width={2.4} height={2.4} fill="none" stroke={NAVY} strokeWidth={0.35} />
          {i < 2 && <path d={`M8.5 ${76.8 + i * 5}l.8.8 1.4-1.6`} fill="none" stroke={NAVY} strokeWidth={0.4} />}
          <rect x={13} y={76.2 + i * 5} width={[60, 48, 66, 40, 54][i]} height={1.1} fill={SLATE} opacity={0.55} />
        </g>
      ))}
      <TextLines y={104} n={4} />
    </g>
  ),
};

/* ---------------------------------------------------------------------------
   Each sheet is rendered once, at startup, into a static SVG image. On screen it is then a single
   <img> instead of hundreds of tiny text nodes, which keeps layout cheap while the desk animates.
   Images can't see CSS variables or web fonts, so the palette and font stacks are inlined. */
const INLINE: [RegExp, string][] = [
  [/var\(--navy\)/g, '#142841'],
  [/var\(--slate\)/g, '#798da6'],
  [/var\(--cream\)/g, '#e5ded2'],
  [/var\(--ink-soft\)/g, '#4f5b6a'], // navy 72% + cream, same as --ink-soft
  [/var\(--font-mono\)/g, "'JetBrains Mono',ui-monospace,Menlo,Consolas,monospace"],
  [/var\(--font-body\)/g, "Inter,system-ui,'Segoe UI',Arial,sans-serif"],
];

function toDataUrl(kind: DoodleKind) {
  const host = document.createElement('div');
  const root = createRoot(host);
  flushSync(() =>
    root.render(
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 128" width="400" height="512">
        {docs[kind]}
      </svg>,
    ),
  );
  let svg = host.innerHTML;
  root.unmount();
  for (const [re, v] of INLINE) svg = svg.replace(re, v);
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const urls = new Map<DoodleKind, string>();
if (typeof document !== 'undefined') (Object.keys(docs) as DoodleKind[]).forEach((k) => urls.set(k, toDataUrl(k)));

export function Doodle({ kind }: { kind: DoodleKind }) {
  return <img className="doc-img" src={urls.get(kind)} alt="" draggable={false} decoding="async" />;
}
