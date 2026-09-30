import { useEffect, useRef, useState } from 'react';
import '../styles/security.css';

// 06 · Security. Content from the team's security design specification (security_plan.zip):
// seven-layer architecture, the trust state engine rules, and link / bus / firmware protection.
// All of it is designed, not built; the simulator is illustrative and follows the spec's rule code.

const LAYERS = [
  { n: 1, name: 'Hardware root of trust', role: 'A TPM 2.0 chip measures every boot. Firmware must carry two valid signatures, and older versions cannot be rolled back.', chips: ['TPM 2.0', 'Measured boot', 'Anti-rollback'] },
  { n: 2, name: 'Sensor health', role: 'Independent sensors are cross-checked, and any reading that drifts or jumps faster than physics allows is flagged.', chips: ['Kalman filter bank', 'Change-point detection', 'Authenticated GNSS'] },
  { n: 3, name: 'Edge AI and physics twin', role: 'A flight-physics model predicts where the aircraft should be from its controls and air pressure, not GPS. The gap exposes spoofing.', chips: ['6-DOF physics', 'Bounded AI models'] },
  { n: 4, name: 'Secure radio link', role: 'Every command and telemetry packet is encrypted, authenticated and checked for replay.', chips: ['AES-256-GCM-SIV', 'X25519 + ML-KEM-768', 'Anti-replay window'] },
  { n: 5, name: 'Evidence bus and trust engine', role: 'Each layer reports typed evidence. A fixed state machine decides how far the aircraft trusts itself, ten times a second.', chips: ['Typed evidence', 'Rust no_std', '10 Hz'] },
  { n: 6, name: 'Command check', role: 'Every ground command is checked against a whitelist and the aircraft’s flight envelope before it can run.', chips: ['Command whitelist', 'Flight envelope limits'] },
  { n: 7, name: 'Flight safety', role: 'Flight control runs in the highest-integrity partition, watched by an independent hardware watchdog that can bring the aircraft home.', chips: ['DO-178C DAL-A/B target', 'Hardware watchdog', 'Return to base'] },
];

const STATES = [
  { key: 'TRUSTED', say: 'Full command authority. The mission continues.' },
  { key: 'DEGRADED', say: 'Pilot alerted. Only non-critical commands are accepted.' },
  { key: 'RESTRICTED', say: 'Non-safety commands blocked. The aircraft holds and loiters.' },
  { key: 'SAFE STATE', say: 'Emergency failsafe. The aircraft returns to base on its own.' },
];

const NOMINAL = { platform: true, replayClear: true, authValid: true, residual: 0 };
// The trust engine's rules, in the order the specification evaluates them.
function evaluate(e) {
  if (!e.platform) return 3;
  if (!e.authValid || !e.replayClear) return 2;
  if (e.residual > 50) return 2;
  if (e.residual > 15) return 1;
  return 0;
}

const SCENARIOS = [
  { id: 'spoof', label: 'GPS spoofing', note: 'GPS still looks healthy. The physics twin disagrees, and the gap keeps growing.' },
  { id: 'replay', label: 'Replayed command', note: 'An old, genuine command is sent again. Its counter has already been used, so it is refused.' },
  { id: 'firmware', label: 'Tampered firmware', note: 'The boot image fails its signature check. Nothing on it is trusted.' },
];

function useReduced() {
  const [r] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  return r;
}

function Stack() {
  const reduce = useReduced();
  const wrap = useRef(null);
  const [assembled, setAssembled] = useState(reduce ? 1 : 0);
  const [active, setActive] = useState(0);
  const [pinnedPick, setPinnedPick] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const onScroll = () => {
      const el = wrap.current; if (!el) return;
      const r = el.getBoundingClientRect(), span = Math.max(1, r.height - innerHeight);
      const p = Math.min(1, Math.max(0, -r.top / span));
      setAssembled(Math.min(1, p / 0.28));
      if (!pinnedPick) setActive(Math.min(6, Math.max(0, Math.floor((p - 0.28) / 0.72 * 7))));
    };
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
    return () => removeEventListener('scroll', onScroll);
  }, [reduce, pinnedPick]);

  const pick = i => { setActive(i); setPinnedPick(true); };
  const L = LAYERS[active];
  return (
    <div className="sec-stack" ref={wrap}>
      <div className="sec-stage">
        <div className="sec-iso" style={{ '--a': assembled }} aria-hidden="true">
          {LAYERS.map((l, i) => (
            <button type="button" tabIndex={-1} key={l.n} className={`plate${i === active ? ' on' : ''}${i < active ? ' below' : ''}${i > active ? ' above' : ''}`} style={{ '--i': i, zIndex: i + 1 }} onClick={() => pick(i)}>
              <span className="pl-n">{String(l.n).padStart(2, '0')}</span><span className="pl-t">{l.name}</span>
            </button>
          ))}
        </div>
        <div className="sec-detail">
          <ol className="sec-list" aria-label="Seven security layers, from the hardware up">
            {[...LAYERS].reverse().map(l => {
              const i = l.n - 1;
              return (
                <li key={l.n}>
                  <button type="button" className={i === active ? 'on' : ''} aria-pressed={i === active} onClick={() => pick(i)}>
                    <span className="n">{String(l.n).padStart(2, '0')}</span>{l.name}
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="sec-card" key={L.n}>
            <p className="bt-k">LAYER {String(L.n).padStart(2, '0')}</p>
            <h4>{L.name}</h4>
            <p>{L.role}</p>
            <div className="chips">{L.chips.map(c => <span key={c}>{c}</span>)}</div>
          </div>
          <p className="sec-part">Each layer runs in its own partition, with fixed memory and a fixed time slot, so a fault in one cannot spill into another.</p>
        </div>
      </div>
    </div>
  );
}

function Simulator() {
  const reduce = useReduced();
  const [ev, setEv] = useState(NOMINAL);
  const [scen, setScen] = useState(null);
  const timers = useRef([]);
  const box = useRef(null);
  const played = useRef(false);

  const clear = () => { timers.current.forEach(t => { clearTimeout(t); cancelAnimationFrame(t); }); timers.current = []; };
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  const run = id => {
    clear(); setEv(NOMINAL); setScen(id);
    if (id === 'spoof') {
      if (reduce) { setEv({ ...NOMINAL, residual: 62 }); return; }
      const t0 = performance.now(), dur = 6500;
      const step = n => { const f = Math.min(1, (n - t0) / dur); setEv({ ...NOMINAL, residual: 62 * f * f * (3 - 2 * f) }); if (f < 1) timers.current.push(requestAnimationFrame(step)); };
      later(() => timers.current.push(requestAnimationFrame(step)), 500);
    }
    if (id === 'replay') later(() => setEv({ ...NOMINAL, replayClear: false }), 900);
    if (id === 'firmware') later(() => setEv({ ...NOMINAL, platform: false }), 900);
  };
  const reset = () => { clear(); setEv(NOMINAL); setScen(null); };
  useEffect(() => clear, []);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !played.current) { played.current = true; run('spoof'); } }, { threshold: 0.45 });
    io.observe(box.current); return () => io.disconnect();
  }, []);

  const st = evaluate(ev), S = STATES[st], res = ev.residual;
  const lights = [
    { k: 'Platform', ok: ev.platform, v: ev.platform ? 'Boot measured · signatures valid' : 'Signature mismatch' },
    { k: 'Sensors', ok: true, v: 'GPS and inertial readings look normal' },
    { k: 'Physics twin', ok: res <= 15, warn: res > 15 && res <= 50, v: `Gap ${res.toFixed(1)} m between sensed and predicted altitude` },
    { k: 'Radio link', ok: ev.replayClear && ev.authValid, v: ev.replayClear ? 'Authenticated · no replay' : 'Replay detected · counter already used' },
  ];
  const note = SCENARIOS.find(s => s.id === scen)?.note ?? 'Pick a threat to see how the aircraft responds.';
  return (
    <div className="tsim" ref={box}>
      <div className="sim-copy">
        <p className="bt-k">THE TRUST ENGINE, LIVE</p>
        <h3 className="bt-title">One question, ten times a second: <em>how far can the aircraft trust itself?</em></h3>
        <div className="sim-btns" role="group" aria-label="Threat scenarios">
          {SCENARIOS.map(s => <button type="button" key={s.id} aria-pressed={scen === s.id} onClick={() => run(s.id)}>{s.label}</button>)}
          <button type="button" className="ghost" onClick={reset}>Reset</button>
        </div>
        <p className="sim-note" aria-live="polite">{note}</p>
      </div>
      <div className={`sim-panel s${st}`}>
        <span className="wn-ill">ILLUSTRATIVE · RULES FROM THE DESIGN SPEC</span>
        <ul className="sim-lights">
          {lights.map(l => <li key={l.k} className={l.ok ? 'ok' : l.warn ? 'warn' : 'bad'}><i /><b>{l.k}</b><span>{l.v}</span></li>)}
        </ul>
        <div className="sim-meter" aria-hidden="true">
          <div className="bar"><i style={{ width: `${Math.min(100, res / 70 * 100)}%` }} /><em style={{ left: `${15 / 70 * 100}%` }}>15 m</em><em style={{ left: `${50 / 70 * 100}%` }}>50 m</em></div>
        </div>
        <ol className="sim-track" style={{ '--s': st }} aria-label="Trust state">
          {STATES.map((s, i) => <li key={s.key} className={i === st ? 'on' : ''} aria-current={i === st}>{s.key}</li>)}
          <i className="sim-mark" aria-hidden="true" />
        </ol>
        <div className="sim-out">
          <svg viewBox="0 0 220 90" className={`sim-fly f${st}`} aria-hidden="true">
            <path className="route" d={st === 2 ? 'M110 45 m-34 0 a34 24 0 1 0 68 0 a34 24 0 1 0 -68 0' : st === 3 ? 'M20 60 C 90 60, 150 60, 175 42 C 196 26, 170 12, 140 20 C 100 30, 60 30, 30 26' : 'M10 45 L 210 45'} />
            {st === 3 && <g className="base"><rect x="14" y="16" width="30" height="18" rx="4" /><text x="29" y="28.5" textAnchor="middle">BASE</text></g>}
            <g className="ac"><path transform="scale(1.7)" d="M9 0 L-5 -1.7 L-6.5 -6 L-8.5 -6 L-7.5 -1.4 L-9 -.8 L-9 .8 L-7.5 1.4 L-8.5 6 L-6.5 6 L-5 1.7 Z" /></g>
          </svg>
          <p><b>{S.key}</b>{S.say}</p>
        </div>
      </div>
    </div>
  );
}

const HOPS = [
  { t: 'Every engine message is sealed', d: 'Each CAN frame from the engine carries a freshness counter and a 64-bit tag. A forged or replayed frame is dropped.', chips: ['AUTOSAR SecOC', '64-bit CMAC'], k: 'frame' },
  { t: 'Every link starts with a fresh key', d: 'Aircraft and ground agree a session key with a hybrid handshake that stays safe even against future quantum computers.', chips: ['X25519 + ML-KEM-768', 'AES-256-GCM-SIV'], k: 'shake' },
  { t: 'Every boot is checked twice', d: 'Firmware loads only if two independent signatures check out against keys held in the hardware.', chips: ['Ed25519 + ML-DSA-44', 'TPM 2.0'], k: 'boot' },
];
function HopArt({ k }) {
  if (k === 'frame') return (
    <svg viewBox="0 0 240 70" aria-hidden="true"><rect className="f-data" x="10" y="24" width="120" height="22" rx="5" /><text x="70" y="39" textAnchor="middle">engine data</text>
      <rect className="f-fr" x="134" y="24" width="36" height="22" rx="5" /><text x="152" y="39" textAnchor="middle">#n</text><rect className="f-tag" x="174" y="24" width="56" height="22" rx="5" /><text x="202" y="39" textAnchor="middle" className="w">tag</text></svg>);
  if (k === 'shake') return (
    <svg viewBox="0 0 240 70" aria-hidden="true"><text x="18" y="18">UAV</text><text x="222" y="18" textAnchor="end">GROUND</text><line x1="28" y1="26" x2="28" y2="64" /><line x1="212" y1="26" x2="212" y2="64" />
      <path className="h1" d="M32 34 H208" /><path className="h2" d="M208 50 H32" /><g className="key"><circle cx="120" cy="60" r="6" /></g></svg>);
  return (
    <svg viewBox="0 0 240 70" aria-hidden="true"><rect className="img" x="70" y="8" width="100" height="56" rx="6" /><line x1="80" y1="22" x2="160" y2="22" /><line x1="80" y1="31" x2="140" y2="31" />
      <circle className="s1" cx="96" cy="50" r="8" /><circle className="s2" cx="144" cy="50" r="8" /><path className="c1" d="M92 50 l3 3 l6 -6" /><path className="c2" d="M140 50 l3 3 l6 -6" /></svg>);
}

export default function Security() {
  return (
    <section className="sec" id="security" data-t="6100" aria-labelledby="h-sec">
      <div className="wrap">
        <div className="sec-head">
          <div><p className="bt-eyebrow rv">06 · SECURITY</p><h2 id="h-sec" className="rv">Trusted <em>when it counts.</em></h2></div>
          <div className="rv" style={{ '--i': 1 }}>
            <p>Built so that a spoofed sensor, a replayed command or tampered firmware cannot take the aircraft with it.</p>
            <p className="sec-flag"><i />DESIGN SPECIFICATION · NOT YET IMPLEMENTED</p>
          </div>
        </div>
        <Stack />
        <Simulator />
        <div className="hops">
          <p className="bt-k">SEALED AT EVERY HOP</p>
          <ul>
            {HOPS.map((h, i) => (
              <li key={h.k} style={{ '--n': i }} className={`hop ${h.k}`}>
                <HopArt k={h.k} />
                <h4>{h.t}</h4><p>{h.d}</p>
                <div className="chips">{h.chips.map(c => <span key={c}>{c}</span>)}</div>
              </li>
            ))}
          </ul>
          <p className="sec-close">AI advises. <em>It never flies:</em> every command passes a fixed, fully tested check first.</p>
          <p className="sec-src">Standards named here are design targets from the team’s security specification, not certifications.</p>
        </div>
      </div>
    </section>
  );
}
