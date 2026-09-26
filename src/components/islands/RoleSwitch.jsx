import { useRef, useState } from 'react';
import { Gauge, User, Wrench } from '@phosphor-icons/react';
import { mission, SAMPLES, fmt } from './lib.js';
import '../../styles/islands.css';

const peak = Math.max(...SAMPLES.map(s => s.dEgt ?? 0)).toFixed(1);

const ROLES = [
  {
    id: 'operator', label: 'Operator', Icon: Gauge,
    job: 'Flies the mission from the ground station.',
    sees: ['Alert: EGT above the healthy twin, flagged', 'Engine still within operating limits', 'Mission impact: continue, monitor', 'Link state and on-board buffer'],
    does: 'Keeps flying, watches the trend, reports if it accelerates.',
  },
  {
    id: 'engineer', label: 'Propulsion engineer', Icon: User,
    job: 'Owns the engineering decision.',
    sees: [`Observed deviation: EGT up to +${peak} °C after T+${fmt.time(mission.faultStart)}, a trend deviation (BDI)`, 'Candidate causes: compressor wear, intake restriction', 'Evidence for and against each cause', 'Degradation trajectory from Prognostics', 'Decision record with provenance'],
    does: 'Reviews the case, accepts or rejects the proposed action, signs.',
  },
  {
    id: 'maintenance', label: 'Maintenance', Icon: Wrench,
    job: 'Plans and performs the work.',
    sees: ['Proposed action: inspect the turbocharger compressor', 'Proposed window: next scheduled maintenance', 'Parts and procedure references from the ACR', 'Sign-off state'],
    does: 'Schedules the inspection once the engineer approves, then records the outcome back into the aircraft history.',
  },
];

export default function RoleSwitch() {
  const [i, setI] = useState(1);
  const tabs = useRef([]);
  const r = ROLES[i];
  function key(e) {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    const n = (i + d + ROLES.length) % ROLES.length;
    setI(n); tabs.current[n]?.focus();
  }
  return (
    <div className="roleswitch">
      <div className="role-tabs" role="tablist" aria-label="Choose a role" onKeyDown={key}>
        {ROLES.map((x, k) => (
          <button key={x.id} ref={el => (tabs.current[k] = el)} role="tab" id={`tab-${x.id}`} aria-selected={k === i}
            aria-controls={`panel-${x.id}`} tabIndex={k === i ? 0 : -1} className="role-tab" onClick={() => setI(k)} type="button">
            <x.Icon aria-hidden="true" weight={k === i ? 'fill' : 'regular'} />
            <span>{x.label}</span>
          </button>
        ))}
      </div>
      <div className="role-panel" role="tabpanel" id={`panel-${r.id}`} aria-labelledby={`tab-${r.id}`}>
        <p className="role-job">{r.job}</p>
        <div className="role-cols">
          <div>
            <h3>Sees</h3>
            <ul>{r.sees.map(x => <li key={x}>{x}</li>)}</ul>
          </div>
          <div>
            <h3>Does</h3>
            <p>{r.does}</p>
          </div>
        </div>
        <p className="stamp stamp-design">views of the designed ground chain, filled with the simulated run</p>
      </div>
    </div>
  );
}
