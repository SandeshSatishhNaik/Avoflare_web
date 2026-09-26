import { useEffect, useRef, useState } from 'react';
import { AirplaneTilt, CellTower, WifiHigh, WifiSlash } from '@phosphor-icons/react';
import { prefersReducedMotion } from './lib.js';
import '../../styles/islands.css';

// The aircraft keeps running its own chain when the downlink drops, buffering what it would have sent.
export default function LinkLoss({ forcedDown = null, interactive = true, compact = false }) {
  const [manual, setManual] = useState(false);
  const down = forcedDown ?? manual;
  const [buffered, setBuffered] = useState(0);
  const [processed, setProcessed] = useState(0);
  const reduce = useRef(false);
  useEffect(() => { reduce.current = prefersReducedMotion(); }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setProcessed(p => p + 1);
      setBuffered(b => (down ? b + 1 : Math.max(0, b - 3)));
    }, 250);
    return () => clearInterval(id);
  }, [down]);

  const arc = 'M 118 92 C 300 20, 480 60, 600 250';
  return (
    <div className={`linkloss ${down ? 'is-down' : 'is-up'} ${compact ? 'linkloss-compact' : ''}`}>
      <svg viewBox="0 0 720 320" className="linkloss-svg" aria-hidden="true">
        <path d="M0 290 L70 230 L120 262 L190 196 L250 250 L330 170 L400 236 L470 206 L540 262 L620 222 L720 270 L720 320 L0 320 Z" className="ridge" />
        <path d="M0 305 L90 268 L170 292 L260 250 L360 290 L450 262 L560 298 L660 272 L720 290 L720 320 L0 320 Z" className="ridge ridge-near" />
        <path d={arc} id="ll-arc" className={`arc ${down ? 'arc-down' : ''}`} />
        {!down && !reduce.current && [0, 0.33, 0.66].map(d => (
          <circle key={d} r="4" className="packet">
            <animateMotion dur="1.6s" repeatCount="indefinite" begin={`${d * 1.6}s`}>
              <mpath href="#ll-arc" />
            </animateMotion>
          </circle>
        ))}
        {!down && reduce.current && [0.25, 0.5, 0.75].map(p => (
          <circle key={p} r="4" className="packet" cx={118 + p * 482} cy={92 - Math.sin(p * Math.PI) * 30 + p * 150} />
        ))}
      </svg>
      <div className="ll-node ll-aircraft">
        <AirplaneTilt aria-hidden="true" weight="duotone" />
        <div>
          <strong>Aircraft edge</strong>
          <span className="num">ETPR → Edge AI → Safety</span>
          <span className="state state-ok">Running locally · {processed} frames</span>
        </div>
      </div>
      <div className="ll-node ll-ground">
        <CellTower aria-hidden="true" weight="duotone" />
        <div>
          <strong>Ground station</strong>
          <span className={`state ${down ? 'state-watch' : 'state-ok'}`}>{down ? 'Link lost' : 'Receiving'}</span>
          <span className="num">{down ? `${buffered} frames waiting on board` : buffered > 0 ? `Catching up · ${buffered} left` : 'Up to date'}</span>
        </div>
      </div>
      {interactive && (
        <button type="button" className="btn ll-toggle" aria-pressed={down} onClick={() => setManual(m => !m)} disabled={forcedDown != null}>
          {down ? <WifiHigh aria-hidden="true" /> : <WifiSlash aria-hidden="true" />}
          {down ? 'Restore the link' : 'Cut the link'}
        </button>
      )}
      <p className="visually-hidden" aria-live="polite">{down ? 'Link to ground station lost. The aircraft keeps processing and stores data on board.' : 'Link to ground station active.'}</p>
    </div>
  );
}
