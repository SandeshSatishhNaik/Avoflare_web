import { useEffect, useMemo, useRef, useState } from 'react';
import { Play, Pause, ArrowCounterClockwise, WarningOctagon, Warning, CheckCircle, Info } from '@phosphor-icons/react';
import DivergenceChart from './DivergenceChart.jsx';
import { mission, SAMPLES, T_END, WATCH_AT, FLAG_AT, sampleAt, stateOf, stateLabel, fmt, SIM_NOTE, prefersReducedMotion } from './lib.js';
import '../../styles/islands.css';

const firstCross = lim => SAMPLES.find(s => (s.dEgt ?? 0) >= lim)?.t ?? null;
const EVENTS = [
  { t: 0, kind: 'ok', text: 'Takeoff. All channels within the healthy twin.' },
  { t: mission.faultStart, kind: 'info', text: 'Simulation injects turbocharger compressor wear (ground truth, not a detection).' },
  { t: firstCross(WATCH_AT), kind: 'watch', text: `EGT ${WATCH_AT} °C above the twin: watch.` },
  { t: firstCross(FLAG_AT), kind: 'fault', text: `EGT ${FLAG_AT} °C above the twin: flagged for the ground chain.` },
].filter(e => e.t != null);

const SPEEDS = [60, 120, 300];

function Tag({ s }) {
  const I = s === 'fault' ? WarningOctagon : s === 'watch' ? Warning : s === 'info' ? Info : CheckCircle;
  const label = s === 'info' ? 'Event' : stateLabel[s];
  return <span className={`state state-${s === 'info' ? 'ok' : s}`}><I aria-hidden="true" weight="bold" />{label}</span>;
}

export default function ReplayDashboard() {
  const [t, setT] = useState(3000);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(120);
  const last = useRef(0);

  useEffect(() => {
    if (!playing) return;
    let raf;
    const tick = now => {
      if (last.current) {
        const dt = (now - last.current) / 1000;
        setT(v => {
          const n = v + dt * speed;
          if (n >= T_END) { setPlaying(false); return T_END; }
          return n;
        });
      }
      last.current = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); last.current = 0; };
  }, [playing, speed]);

  const s = sampleAt(t);
  const st = stateOf(s.dEgt ?? 0);
  const past = EVENTS.filter(e => e.t <= t);
  const flagged = t >= (firstCross(FLAG_AT) ?? Infinity);
  const table = useMemo(() => SAMPLES.filter(x => x.t % 600 === 0), []);

  return (
    <div className="replay">
      <div className="replay-bar" role="group" aria-label="Replay controls">
        <button type="button" className="btn btn-primary" onClick={() => { if (t >= T_END) setT(0); setPlaying(p => !p); }} aria-pressed={playing}>
          {playing ? <Pause aria-hidden="true" weight="fill" /> : <Play aria-hidden="true" weight="fill" />}{playing ? 'Pause' : 'Play'}
        </button>
        <button type="button" className="btn" onClick={() => { setPlaying(false); setT(0); }}>
          <ArrowCounterClockwise aria-hidden="true" />Restart
        </button>
        <label className="replay-scrub">
          <span className="visually-hidden">Mission time</span>
          <input type="range" min="0" max={T_END} step={mission.step} value={Math.round(t / mission.step) * mission.step}
            onChange={e => { setPlaying(false); setT(Number(e.target.value)); }} aria-valuetext={`T+${fmt.time(t)}`} />
        </label>
        <span className="num replay-time">T+{fmt.time(t)}</span>
        <label className="replay-speed">
          <span>Speed</span>
          <select value={speed} onChange={e => setSpeed(Number(e.target.value))}>
            {SPEEDS.map(x => <option key={x} value={x}>{x}×</option>)}
          </select>
        </label>
      </div>

      <div className="replay-grid">
        <section className="panel panel-state" aria-label="Engine health">
          <h3>Engine health</h3>
          <p className="replay-state"><Tag s={st} /></p>
          <p className="muted">EGT is <b className="num">+{fmt.n(s.dEgt, 1)} °C</b> against the healthy twin at the same mission point.</p>
          <dl className="readout-grid">
            <div><dt>Phase</dt><dd>{fmt.phase(s.phase)}</dd></div>
            <div><dt>Altitude</dt><dd className="num">{fmt.n(s.alt)} m</dd></div>
            <div><dt>Engine speed</dt><dd className="num">{fmt.n(s.rpm)} rpm</dd></div>
            <div><dt>Throttle</dt><dd className="num">{fmt.n(s.thr * 100)} %</dd></div>
            <div><dt>EGT</dt><dd className="num">{fmt.n(s.egt)} °C</dd></div>
            <div><dt>CHT</dt><dd className="num">{fmt.n(s.cht, 1)} °C</dd></div>
            <div><dt>Oil temperature</dt><dd className="num">{fmt.n(s.oilT)} °C</dd></div>
            <div><dt>Fuel flow</dt><dd className="num">{fmt.n(s.fuel, 1)} kg/h</dd></div>
            <div><dt>Outside air</dt><dd className="num">{fmt.n(s.amb, 1)} °C</dd></div>
          </dl>
        </section>

        <section className="panel panel-chart" aria-label="Divergence">
          <DivergenceChart cursor={t} />
        </section>

        <section className="panel panel-log" aria-label="Event log">
          <h3>Event log</h3>
          <ol className="log" aria-live="polite">
            {past.slice().reverse().map(e => (
              <li key={e.t + e.kind}><span className="num">T+{fmt.time(e.t)}</span><Tag s={e.kind} /><span>{e.text}</span></li>
            ))}
          </ol>
        </section>

        <section className={`panel panel-advice ${flagged ? 'is-live' : ''}`} aria-label="Maintenance advisory">
          <h3>Maintenance advisory</h3>
          {flagged ? (
            <>
              <p>Turbocharger compressor: EGT trend deviation after T+{fmt.time(mission.faultStart)}. Proposed: inspect the compressor at the next maintenance window.</p>
              <p className="state state-watch"><Warning aria-hidden="true" weight="bold" />Waiting for engineer sign-off</p>
              <p className="stamp stamp-design">example output of the designed decision chain</p>
            </>
          ) : <p className="muted">Nothing proposed. The advisory appears once the divergence is flagged.</p>}
        </section>
      </div>

      <p className="sim-label">{SIM_NOTE}. Watch and flag bands ({WATCH_AT} °C, {FLAG_AT} °C) are illustrative, not validated limits.</p>

      <details className="replay-table">
        <summary>Show the data as a table</summary>
        <div className="table-scroll">
          <table className="data-table num">
            <thead><tr><th>Time</th><th>Phase</th><th>Altitude m</th><th>RPM</th><th>EGT °C</th><th>vs twin °C</th><th>CHT °C</th><th>State</th></tr></thead>
            <tbody>
              {table.map(r => (
                <tr key={r.t}><td>{fmt.time(r.t)}</td><td>{fmt.phase(r.phase)}</td><td>{fmt.n(r.alt)}</td><td>{fmt.n(r.rpm)}</td><td>{fmt.n(r.egt)}</td><td>{fmt.n(r.dEgt, 1)}</td><td>{fmt.n(r.cht, 1)}</td><td>{stateLabel[stateOf(r.dEgt ?? 0)]}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
