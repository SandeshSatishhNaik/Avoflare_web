import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { SAMPLES, T_END, WATCH_AT, FLAG_AT, mission, fmt, stateOf, stateLabel } from './lib.js';
import '../../styles/islands.css';

const Y_MAX = 12;

// EGT divergence from the healthy twin over mission time, with the fault onset marked.
// The viewBox follows the rendered width, so axis text stays at its real size on phones.
// Line form carries state too: dashed = healthy twin, solid = simulated, doubled = past the flag band.
export default function DivergenceChart({ cursor = null, from = 0, to = T_END, compact = false, title = 'EGT above the healthy twin' }) {
  const id = useId();
  const box = useRef();
  const [W, setW] = useState(640);
  const [hover, setHover] = useState(null);
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setW(Math.max(300, Math.round(e.contentRect.width))));
    ro.observe(box.current);
    return () => ro.disconnect();
  }, []);
  const narrow = W < 520;
  const H = narrow ? 260 : compact ? 230 : 260;
  const PAD = { l: 40, r: 14, t: 18, b: 34 };
  const x = t => PAD.l + ((t - from) / (to - from)) * (W - PAD.l - PAD.r);
  const y = v => PAD.t + (1 - Math.max(0, v) / Y_MAX) * (H - PAD.t - PAD.b);
  const pts = useMemo(() => SAMPLES.filter(s => s.t >= from && s.t <= to && s.dEgt != null), [from, to]);
  const upto = cursor == null ? pts : pts.filter(s => s.t <= cursor);
  const line = arr => arr.map((s, i) => `${i ? 'L' : 'M'}${x(s.t).toFixed(1)},${y(s.dEgt).toFixed(1)}`).join('');
  const path = line(upto);
  const flagged = upto.filter(s => s.dEgt >= FLAG_AT);
  const onset = mission.faultStart;
  const step = narrow ? 3600 : 1800;
  const ticks = [];
  for (let t = Math.ceil(from / step) * step; t <= to; t += step) ticks.push(t);

  function move(e) {
    const r = e.currentTarget.getBoundingClientRect();
    const tx = from + ((e.clientX - r.left) / r.width * W - PAD.l) / (W - PAD.l - PAD.r) * (to - from);
    setHover(pts.reduce((a, b) => Math.abs(b.t - tx) < Math.abs(a.t - tx) ? b : a, pts[0]));
  }
  const hv = hover ?? (cursor != null ? upto.at(-1) : null);

  return (
    <figure className={`chart ${compact ? 'chart-compact' : ''}`} aria-labelledby={`${id}-cap`} ref={box}>
      <figcaption id={`${id}-cap`} className="chart-cap">
        <span>{title}</span>
        <span className="chart-unit">°C, simulated</span>
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img"
        aria-label={`${title}. Rises from 0 after the fault starts at ${fmt.time(onset)} to about ${Math.max(...pts.map(p => p.dEgt)).toFixed(1)} °C.`}
        onPointerMove={move} onPointerLeave={() => setHover(null)}>
        <rect x={PAD.l} y={y(Y_MAX)} width={W - PAD.l - PAD.r} height={y(FLAG_AT) - y(Y_MAX)} className="band band-fault" />
        <rect x={PAD.l} y={y(FLAG_AT)} width={W - PAD.l - PAD.r} height={y(WATCH_AT) - y(FLAG_AT)} className="band band-watch" />
        {[0, 3, 6, 9, 12].map(v => (
          <g key={v}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} className="grid" />
            <text x={PAD.l - 8} y={y(v) + 4} className="axis" textAnchor="end">{v}</text>
          </g>
        ))}
        <line x1={PAD.l} x2={W - PAD.r} y1={y(WATCH_AT)} y2={y(WATCH_AT)} className="edge edge-watch" />
        <line x1={PAD.l} x2={W - PAD.r} y1={y(FLAG_AT)} y2={y(FLAG_AT)} className="edge edge-fault" />
        {ticks.map(t => (
          <text key={t} x={x(t)} y={H - 10} className="axis" textAnchor="middle">{fmt.time(t).slice(0, 5)}</text>
        ))}
        {onset >= from && onset <= to && (
          <g>
            <line x1={x(onset)} x2={x(onset)} y1={PAD.t} y2={H - PAD.b} className="onset" />
            <text x={x(onset) + 6} y={PAD.t + 13} className="label onset-label">fault starts</text>
          </g>
        )}
        <text x={W - PAD.r - 4} y={y(FLAG_AT) - 6} className="label band-label band-label-fault" textAnchor="end">flag</text>
        <text x={W - PAD.r - 4} y={y(WATCH_AT) - 6} className="label band-label band-label-watch" textAnchor="end">watch</text>
        <line x1={PAD.l} x2={W - PAD.r} y1={y(0)} y2={y(0)} className="baseline-twin" />
        {!compact && !narrow && <text x={PAD.l + 6} y={y(0) - 7} className="label">healthy twin</text>}
        <path d={path} className="series" />
        {flagged.length > 1 && <path d={line(flagged)} className="series-flag" transform="translate(0 -4)" />}
        {hv && (
          <g>
            <line x1={x(hv.t)} x2={x(hv.t)} y1={PAD.t} y2={H - PAD.b} className="crosshair" />
            <circle cx={x(hv.t)} cy={y(hv.dEgt)} r="5" className={`dot dot-${stateOf(hv.dEgt)}`} />
          </g>
        )}
      </svg>
      {hv && !compact && (
        <p className="chart-readout">
          <span className="num">{fmt.time(hv.t)} · +{fmt.n(hv.dEgt, 1)} °C</span> · <span className={`state-${stateOf(hv.dEgt)}`}>{stateLabel[stateOf(hv.dEgt)]}</span>
        </p>
      )}
    </figure>
  );
}
