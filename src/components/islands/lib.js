import mission from '../../data/mission.json';
import can from '../../data/can.json';
import trend from '../../data/trend.json';

export { mission, can, trend };

export const SAMPLES = mission.samples;
export const T_END = SAMPLES[SAMPLES.length - 1].t;

// Divergence bands used on this site to colour state. Illustrative, not a validated alarm limit.
export const WATCH_AT = 3; // °C of EGT above the healthy twin
export const FLAG_AT = 6;

export function stateOf(dEgt) {
  if (dEgt >= FLAG_AT) return 'fault';
  if (dEgt >= WATCH_AT) return 'watch';
  return 'ok';
}
export const stateLabel = { ok: 'Normal', watch: 'Watch', fault: 'Flagged' };

// Nearest sample at or before mission time t (seconds).
export function sampleAt(t) {
  const i = Math.max(0, Math.min(SAMPLES.length - 1, Math.round(t / mission.step)));
  return SAMPLES[i];
}

export const fmt = {
  time(t) {
    const h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), s = Math.floor(t % 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  },
  n(v, d = 0) { return v == null ? '–' : Number(v).toFixed(d); },
  phase(p) { return (p ?? '').replaceAll('_', ' ').toLowerCase(); },
};

export const clamp01 = v => Math.max(0, Math.min(1, v));
export const lerp = (a, b, p) => a + (b - a) * p;

export const SIM_NOTE = `Simulated: ${mission.source.dataset}, ${mission.source.fault.replaceAll('_', ' ').toLowerCase()} ${Math.round(mission.source.maxSeverity * 100)} %, ${mission.source.mission} mission, ${mission.source.uav}`;

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
