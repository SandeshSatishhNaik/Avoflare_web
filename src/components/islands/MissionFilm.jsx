import { lazy, Suspense, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WarningOctagon, Warning, CheckCircle, User, Wrench, Gauge } from '@phosphor-icons/react';
import { SENSORS } from './sensors.js';
const EngineTwin = lazy(() => import('./EngineTwin.jsx'));
import LinkLoss from './LinkLoss.jsx';
import DivergenceChart from './DivergenceChart.jsx';
import { mission, can, sampleAt, stateOf, stateLabel, fmt, clamp01, lerp, SAMPLES, SIM_NOTE, prefersReducedMotion } from './lib.js';
import '../../styles/islands.css';

const peak = Math.max(...SAMPLES.map(s => s.dEgt ?? 0));
const chtMin = Math.min(...SAMPLES.map(s => s.dCht ?? 0));

const CHAPTERS = [
  { id: 'climb', title: 'Climb', body: 'The UAV leaves the runway and climbs to 4,000 m. Outside air cools from 15 °C to below −10 °C and thins; the engine works harder to hold power.' },
  { id: 'engine', title: 'Inside the engine', body: 'Eight kinds of sensors watch the engine: speed, cylinder head and exhaust temperature, oil, fuel, vibration, the alternator and the turbocharger. The model is representative, not the TAPAS engine itself.' },
  { id: 'can', title: 'On the CAN bus', body: 'Every reading leaves the engine control unit as an 8-byte CAN frame. These are the frames the simulation produced: 17 message IDs, 0x100 to 0x110.' },
  { id: 'edge', title: 'The edge decides', body: 'On board, ETPR decodes and checks each frame and builds one CanonicalTelemetryState. The Edge AI compares the engine with its healthy twin. One hour in, exhaust gas starts running hotter than the twin says it should.' },
  { id: 'downlink', title: 'Downlink', body: 'The state streams to the ground station. When the link drops, nothing on board stops: the edge keeps deciding and stores the data, then sends it when the link returns.' },
  { id: 'base', title: 'At the base', body: 'The ground chain asks what changed, why, and what happens next: divergence, candidate causes, evidence, prognosis, a proposed action. Each role sees the part it needs.' },
  { id: 'outcome', title: 'The engineer decides', body: 'The case ends as a maintenance log entry with its evidence attached. The system proposes; the engineer signs.' },
];

// Mission time shown in each chapter, as a function of that chapter's scroll progress.
const TIME = {
  climb: p => lerp(0, 2400, p),
  engine: p => lerp(2400, 3500, p),
  can: p => (p < 0.34 ? 60 : p < 0.67 ? 3000 : 5400),
  edge: p => lerp(3000, 6200, p),
  downlink: p => lerp(6200, 6900, p),
  base: () => 7000,
  outcome: () => 7100,
};

function StateTag({ s }) {
  const Icon = s === 'fault' ? WarningOctagon : s === 'watch' ? Warning : CheckCircle;
  return <span className={`state state-${s}`}><Icon aria-hidden="true" weight="bold" />{stateLabel[s]}</span>;
}

function Readout({ label, value, unit, state }) {
  return (
    <div className={`readout ${state ? `readout-${state}` : ''}`}>
      <span className="readout-label">{label}</span>
      <span className="readout-value num">{value}<small>{unit}</small></span>
    </div>
  );
}

function UavPlanform() {
  // Generic MALE UAV planform: long straight wing, slim fuselage, V-tail, pusher propeller.
  return (
    <g className="uav">
      <path d="M-6 -46 C 3 -46 6 -30 6 -10 L 6 44 C 6 52 3 58 0 60 C -3 58 -6 52 -6 44 L -6 -10 C -6 -30 -3 -46 -6 -46 Z" transform="translate(0 0)" />
      <path d="M-4 -46 C 0 -58 4 -58 8 -46 Z" transform="translate(-2 0)" />
      <path d="M-122 -6 L 122 -6 L 126 2 L -126 2 Z" />
      <path d="M0 42 L -30 60 L -28 64 L 0 52 L 28 64 L 30 60 Z" />
      <rect x="-12" y="61" width="24" height="2.5" rx="1.2" className="prop" />
    </g>
  );
}

function Climb({ p, t }) {
  const s = sampleAt(t);
  return (
    <div className="ch ch-climb">
      <svg viewBox="0 0 800 600" className="sky" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
        <g style={{ transform: `translateY(${p * 90}px)` }}>
          <path d="M0 470 L90 400 L150 430 L240 350 L310 410 L400 320 L470 380 L560 340 L640 400 L720 360 L800 390 L800 600 L0 600Z" className="ridge ridge-far" />
        </g>
        <g style={{ transform: `translateY(${p * 160}px)` }}>
          <path d="M0 540 L110 470 L200 510 L300 440 L420 500 L520 450 L610 505 L700 470 L800 500 L800 600 L0 600Z" className="ridge ridge-near" />
        </g>
        <g style={{ transform: `translate(${lerp(170, 470, p)}px, ${lerp(430, 170, p)}px) rotate(${lerp(-38, -12, p)}deg) scale(${lerp(0.7, 1.1, p)})` }}>
          <UavPlanform />
        </g>
        <path d={`M 140 470 Q ${lerp(250, 360, p)} ${lerp(420, 260, p)} ${lerp(170, 470, p)} ${lerp(430, 170, p)}`} className="trail" />
      </svg>
      <div className="readouts readouts-float">
        <Readout label="Altitude" value={fmt.n(s.alt)} unit=" m" />
        <Readout label="Outside air" value={fmt.n(s.amb, 1)} unit=" °C" />
        <Readout label="Airspeed" value={fmt.n(s.tas)} unit=" m/s" />
        <Readout label="Phase" value={fmt.phase(s.phase)} unit="" />
      </div>
    </div>
  );
}

function Engine({ p, t }) {
  const lit = Math.min(SENSORS.length, Math.ceil(p * 1.25 * SENSORS.length));
  const s = sampleAt(t);
  const vals = { egt: [fmt.n(s.egt), '°C'], turbo: [fmt.n((s.sev ?? 0) * 100), '% wear (sim)'], cht: [fmt.n(s.cht), '°C'], rpm: [fmt.n(s.rpm), 'rpm'], oil: [fmt.n(s.oilT), '°C'], fuel: [fmt.n(s.fuel, 1), 'kg/h'], vib: [fmt.n(s.vib, 1), 'g'], elec: [fmt.n(s.volt), 'V'] };
  return (
    <div className="ch ch-engine">
      <Suspense fallback={<div className="twin"><div className="twin-poster" /></div>}><EngineTwin lineMix={0.2 + clamp01((p - 0.6) / 0.4) * 0.5} spin={p} lit={lit} t={t} /></Suspense>
      <ol className="sensor-list">
        {SENSORS.map((x, i) => (
          <li key={x.id} className={i < lit ? 'on' : ''}>
            <span className="num sensor-tag">{x.label}</span>
            <span className="sensor-name">{x.name}</span>
            <span className="num sensor-val">{vals[x.id][0]} <small>{vals[x.id][1]}</small></span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Can({ p }) {
  const moment = can[p < 0.34 ? 0 : p < 0.67 ? 1 : 2];
  const rows = moment.frames.filter(f => parseInt(f.id, 16) <= 0x10b);
  return (
    <div className="ch ch-can">
      <p className="can-head num">T+{fmt.time(moment.t)} · {rows.length} of 17 frames</p>
      <table className="can-table">
        <thead><tr><th>ID</th><th>Message</th><th>Data (8 bytes)</th></tr></thead>
        <tbody>
          {rows.map((f, r) => (
            <tr key={f.id} className={f.name.includes('FAULT') || f.name.includes('DEVIATION') ? 'can-diag' : ''}>
              <td className="num">{f.id}</td>
              <td className="can-name">{f.name.replaceAll('_', ' ').toLowerCase()}</td>
              <td className="can-bytes num">
                {f.bytes.map((b, i) => (
                  <span key={`${moment.t}-${i}`} className="byte" style={{ '--d': `${(r * 8 + i) * 12}ms` }}>{b}</span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="can-decode num">{moment.frames[1].name}: {moment.frames[1].signals.replaceAll(',', ' · ')}</p>
    </div>
  );
}

const ETPR_SHORT = ['acquire', 'validate', 'decode', 'convert', 'fault check', 'range check', 'freshness', 'features', 'canonical state'];
const EDGE_SHORT = ['PINN twin', 'EKF', 'K-means', 'SNN', 'QR-DQN', 'Safety'];

function Edge({ p, t }) {
  const s = sampleAt(t);
  const st = stateOf(s.dEgt ?? 0);
  const litE = Math.ceil(clamp01(p * 3) * ETPR_SHORT.length);
  const litA = Math.ceil(clamp01(p * 3 - 1) * EDGE_SHORT.length);
  return (
    <div className="ch ch-edge">
      <div className="pipe">
        <p className="pipe-label">ETPR <span className="stamp stamp-design">designed</span></p>
        <ol className="pipe-row">{ETPR_SHORT.map((x, i) => <li key={x} className={i < litE ? 'on' : ''}>{x}</li>)}</ol>
        <p className="pipe-label">Edge AI <span className="stamp stamp-design">designed</span></p>
        <ol className="pipe-row">{EDGE_SHORT.map((x, i) => <li key={x} className={i < litA ? 'on' : ''}>{x}</li>)}</ol>
      </div>
      <DivergenceChart cursor={t} from={2400} to={7200} compact title="EGT above the healthy twin" />
      <div className="edge-status">
        <Readout label="EGT" value={fmt.n(s.egt)} unit=" °C" />
        <Readout label="vs twin" value={`+${fmt.n(s.dEgt, 1)}`} unit=" °C" state={st} />
        <div className="readout"><span className="readout-label">Edge state</span><StateTag s={st} /></div>
      </div>
    </div>
  );
}

function Base({ p }) {
  const nodes = ['Digital Thread', 'Digital Twin', 'CAM', 'BDI', 'Causal Reasoning', 'Evidence Competition', 'World Model', 'Prognostics', 'PPM', 'Decision Engine', 'Engineer'];
  const lit = Math.ceil(clamp01(p * 1.3) * nodes.length);
  return (
    <div className="ch ch-base">
      <ol className="gcs-chain">{nodes.map((n, i) => <li key={n} className={i < lit ? 'on' : ''}><span>{n}</span></li>)}</ol>
      <div className="roles">
        <div className="role"><Gauge aria-hidden="true" /><strong>Operator</strong><span>EGT flagged, engine still within limits, mission can continue.</span></div>
        <div className="role"><User aria-hidden="true" /><strong>Propulsion engineer</strong><span>Trend deviation from the twin; candidate causes and their evidence.</span></div>
        <div className="role"><Wrench aria-hidden="true" /><strong>Maintenance</strong><span>Proposed inspection and window, waiting for engineer approval.</span></div>
      </div>
      <p className="stamp stamp-design">ground chain: designed architecture</p>
    </div>
  );
}

function Outcome() {
  return (
    <div className="ch ch-outcome">
      <article className="techlog" aria-label="Example maintenance log entry">
        <header><span>Tech log, example output</span><span className="num">{mission.source.uav} (simulated)</span></header>
        <dl>
          <dt>Mission time</dt><dd className="num">T+{fmt.time(mission.faultStart)} onwards</dd>
          <dt>Component</dt><dd>Turbocharger compressor</dd>
          <dt>Finding</dt><dd>EGT up to <b className="num">+{peak.toFixed(1)} °C</b> above the healthy twin and CHT <span className="num">{chtMin.toFixed(1)} °C</span>, sustained after onset: a trend deviation.</dd>
          <dt>Candidate causes</dt><dd>Compressor wear; intake restriction. Ranked by evidence in the designed chain.</dd>
          <dt>Proposed action</dt><dd>Inspect the turbocharger compressor at the next maintenance window.</dd>
          <dt>Sign-off</dt><dd><span className="state state-watch"><Warning aria-hidden="true" weight="bold" />Pending engineer approval</span></dd>
        </dl>
      </article>
      <div className="film-cta">
        <a className="btn btn-primary" href="/demo/">Replay this mission</a>
        <a className="btn" href="/fault-response/">Follow the fault response</a>
      </div>
    </div>
  );
}

const VIEWS = { climb: Climb, engine: Engine, can: Can, edge: Edge, base: Base, outcome: Outcome };

// Plain function (not a component) so the stage keeps its children mounted between scroll updates.
function renderView(id, p) {
  if (id === 'downlink') return <div className="ch ch-downlink"><LinkLoss forcedDown={p > 0.3 && p < 0.7 ? true : null} /></div>;
  const V = VIEWS[id];
  return <V p={p} t={TIME[id](p)} />;
}

export default function MissionFilm() {
  const root = useRef();
  const [active, setActive] = useState(0);
  const [prog, setProg] = useState(() => CHAPTERS.map(() => 0));
  const [static_, setStatic] = useState(false);

  useLayoutEffect(() => {
    // Phones and reduced-motion users get the chapters as a plain sequence of still panels.
    if (prefersReducedMotion() || window.matchMedia('(max-width: 999px)').matches) { setStatic(true); return; }
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.film-step').forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 65%',
          end: 'bottom 45%',
          onToggle: self => { if (self.isActive) setActive(i); },
          onUpdate: self => setProg(p => { if (Math.abs(p[i] - self.progress) < 0.004) return p; const n = p.slice(); n[i] = self.progress; return n; }),
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const ch = CHAPTERS[active];
  const p = prog[active];
  const t = TIME[ch.id](p);

  return (
    <section className={`film ${static_ ? "is-static" : ""}`} id="film" ref={root} aria-labelledby="film-title">
      <h2 id="film-title" className="visually-hidden">One mission, from sensor to engineer</h2>
      <div className="film-grid">
        <ol className="film-steps">
          {CHAPTERS.map((c, i) => (
            <li key={c.id} className={`film-step ${i === active ? 'is-active' : ''}`}>
              <span className="film-index">{String(i + 1).padStart(2, '0')} / {String(CHAPTERS.length).padStart(2, '0')}</span>
              <h3 className="display">{c.title}</h3>
              <p>{c.body}</p>
              {static_ && <div className="film-static">{renderView(c.id, c.id === 'downlink' ? 0.5 : c.id === 'can' ? 0.9 : 1)}</div>}
            </li>
          ))}
        </ol>
        {!static_ && (
          <div className="film-stage">
            <div className="stage-frame" data-ch={ch.id}>
              <div className="stage-top">
                <span>{ch.title}</span>
                <span className="num">T+{fmt.time(t)}</span>
              </div>
              <div className="stage-body" key={ch.id}>
                {renderView(ch.id, p)}
              </div>
              <p className="sim-label stage-note">{SIM_NOTE}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
