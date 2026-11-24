import { useId, type CSSProperties } from 'react';

/**
 * The split "VS" poster at the top of each thesis paper.
 * Each name is a plain typographic wordmark in the site's own type and palette (no logos, no brand colors):
 * the slices differ only by tint, and a big slash sits in the cut between them.
 */

const W = 1000;
const H = 340;
const DX = 64; // horizontal lean of each cut, top to bottom (matches the slash)
const GAP = 44; // paper showing through each cut
const T = 20; // slash thickness
const E = 18; // slash overhang above and below the poster

const fills = ['var(--navy)', 'var(--slate)', 'var(--cream-2)'];
const inks = ['var(--cream)', 'var(--navy)', 'var(--navy)'];
const drift = [-14, 8, 18]; // parallax depth per slice (SVG units)

type Vars = CSSProperties & Record<`--${string}`, string | number>;

export function Poster({ marks, motif }: { marks: { name: string; note?: string }[]; motif?: 'price' }) {
  const id = useId().replace(/:/g, '');
  const n = marks.length;
  const cuts = Array.from({ length: n - 1 }, (_, i) => (W * (i + 1)) / n + DX / 2); // x of each cut at the top
  const edge = (i: number, side: 'l' | 'r') => {
    // [x at top, x at bottom] of slice i's left or right edge
    if (side === 'l') return i === 0 ? [0, 0] : [cuts[i - 1] + GAP / 2, cuts[i - 1] - DX + GAP / 2];
    return i === n - 1 ? [W, W] : [cuts[i] - GAP / 2, cuts[i] - DX - GAP / 2];
  };
  const size = n === 3 ? 56 : 96;

  // hover parallax: one CSS variable on the <svg>, each slice's words drift by their own depth
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--px', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
  };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="poster"
      data-poster
      role="img"
      aria-label={marks.map((m) => m.name).join(' versus ')}
      onPointerMove={onMove}
      onPointerLeave={(e) => e.currentTarget.style.setProperty('--px', '0')}
    >
      <defs>
        {/* the slashes are wiped in from the top: the timeline grows this rect */}
        <clipPath id={`wipe-${id}`} clipPathUnits="userSpaceOnUse">
          <rect data-wipe x={-40} y={-E - 2} width={W + 80} height={H + 2 * E + 4} />
        </clipPath>
        {marks.map((_, i) => {
          const [lt, lb] = edge(i, 'l');
          const [rt, rb] = edge(i, 'r');
          return (
            <clipPath id={`s${i}-${id}`} key={i}>
              <polygon points={`${lt},0 ${rt},0 ${rb},${H} ${lb},${H}`} />
            </clipPath>
          );
        })}
      </defs>

      {marks.map((m, i) => {
        const [lt, lb] = edge(i, 'l');
        const [rt, rb] = edge(i, 'r');
        const cx = (lt + lb + rt + rb) / 4;
        const base = H / 2 + size * 0.34 - (m.note ? 16 : 0);
        return (
          <g key={m.name} clipPath={`url(#s${i}-${id})`}>
            <rect x={0} y={0} width={W} height={H} fill={fills[i]} />
            <g className="slice-ink" style={{ '--d': drift[i] } as Vars} fill={inks[i]}>
              <text x={lt + 26} y={38} className="poster-idx">
                /{String(i + 1).padStart(2, '0')}
              </text>
              <text x={cx} y={base} textAnchor="middle" className="poster-mark" fontSize={size}>
                {m.name}
              </text>
              {m.note && (
                <text x={cx} y={base + 40} textAnchor="middle" className="poster-note">
                  {m.note}
                </text>
              )}
            </g>
          </g>
        );
      })}

      {motif === 'price' && (
        <g className="poster-motif" aria-hidden="true">
          {/* a rising price line and a tag: this poster is about pricing */}
          <polyline
            data-draw
            points="30,318 130,306 215,312 305,290 395,295 480,270 565,276 650,250 735,255 820,228 872,220"
            fill="none"
            stroke="var(--navy)"
            strokeWidth={9}
            strokeLinejoin="round"
            strokeLinecap="round"
            pathLength={1}
          />
          <polyline
            data-draw
            points="30,318 130,306 215,312 305,290 395,295 480,270 565,276 650,250 735,255 820,228 872,220"
            fill="none"
            stroke="var(--cream)"
            strokeWidth={3.5}
            strokeLinejoin="round"
            strokeLinecap="round"
            pathLength={1}
          />
          <g data-tag transform="translate(872 220)">
            <g className="poster-tag">
              <path d="M0 0 L22 -26 H96 V26 H22 Z" fill="var(--cream)" stroke="var(--navy)" strokeWidth={3} strokeLinejoin="round" />
              <circle cx={26} cy={0} r={5} fill="var(--navy)" />
              <text x={62} y={9} textAnchor="middle" className="poster-tagtext" fill="var(--navy)">
                ₹ ↑
              </text>
            </g>
          </g>
        </g>
      )}

      <g clipPath={`url(#wipe-${id})`}>
        {cuts.map((c) => {
          const top = c + (DX * E) / H;
          const bot = c - DX - (DX * E) / H;
          const midX = c - DX / 2;
          return (
            <g key={c}>
              <polygon points={`${top - T / 2},${-E} ${top + T / 2},${-E} ${bot + T / 2},${H + E} ${bot - T / 2},${H + E}`} fill="var(--navy)" />
              <circle cx={midX} cy={H / 2} r={23} fill="var(--cream)" stroke="var(--navy)" strokeWidth={3} />
              <text x={midX} y={H / 2 + 6} textAnchor="middle" className="poster-vs" fill="var(--navy)">
                vs
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
