// Converts TAPAS MATLAB simulation CSVs into small JSON files for the site.
// Re-run after the simulation is fixed or re-run: `node scripts/export-data.mjs`.
// Source folder can be overridden with TAPAS_V4_DIR.
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const V4 = process.env.TAPAS_V4_DIR ??
  'E:/Avoflare_web_Matlab/TAPAS_FINAL_AI_DATASET_V4-20260925T141334Z-1-001/TAPAS_FINAL_AI_DATASET_V4';
const OUT = new URL('../src/data/', import.meta.url);
mkdirSync(OUT, { recursive: true });

// Minimal CSV parser: handles quoted fields containing commas.
function parseCsv(text) {
  const rows = [];
  for (const line of text.split(/\r?\n/)) {
    if (!line) continue;
    const cells = [];
    let cur = '', q = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') q = !q;
      else if (c === ',' && !q) { cells.push(cur); cur = ''; }
      else cur += c;
    }
    cells.push(cur);
    rows.push(cells);
  }
  const [head, ...body] = rows;
  return body.map(r => Object.fromEntries(head.map((h, i) => [h, r[i]])));
}

const load = p => parseCsv(readFileSync(p, 'utf8'));
const num = v => (v === undefined || v === '' || v === 'NaN' ? null : Number(v));
const r1 = v => (v == null ? null : Math.round(v * 10) / 10);
const r3 = v => (v == null ? null : Math.round(v * 1000) / 1000);

function findRun(fault, runDir, pattern) {
  const dir = join(V4, fault, runDir);
  const f = readdirSync(dir).find(n => n.includes(pattern) && n.endsWith('HEALTHY_REFERENCE.csv'));
  if (!f) throw new Error(`No CSV for ${fault}/${runDir}/${pattern}`);
  return join(dir, f);
}

// ---- Main demo run: turbo compressor wear, 2 h, 50 % ----
const mainCsv = findRun('TURBO_COMPRESSOR_WEAR', 'RUN_0002', '2H_FAULT_TURBO_COMPRESSOR_WEAR_SEVERITY_050pct');
const rows = load(mainCsv);
const STEP = 20; // seconds between exported samples
const samples = rows.filter(r => Number(r.time_s) % STEP === 0).map(r => ({
  t: num(r.time_s),
  phase: r.mission_phase,
  alt: r1(num(r.altitude_m)),
  tas: r1(num(r.airspeed_ms)),
  thr: r3(num(r.throttle)),
  rpm: Math.round(num(r.engine_rpm)),
  egt: r1(num(r.egt_C)),
  cht: r1(num(r.cht_C)),
  dEgt: r1(num(r.delta_egt_C)),
  dCht: r3(num(r.delta_cht_C)),
  oilT: r1(num(r.oil_temp_C)),
  oilP: r1(num(r.oil_pressure_Pa) / 1000), // kPa
  fuel: r1(num(r.fuel_flow_kg_h)),
  vib: r3(num(r.vibration_g)),
  volt: r1(num(r.voltage_V)),
  amb: r1(num(r.ambient_temperature_K) - 273.15),
  sev: r3(num(r.fault_severity)),
  active: num(r.fault_active) === 1,
  health: r.health_label,
}));

const first = rows[0];
const onset = rows.find(r => num(r.fault_active) === 1);
const mission = {
  source: {
    dataset: 'TAPAS_FINAL_AI_DATASET_V4',
    run: `RUN_${String(first.run_id).padStart(4, '0')}`,
    uav: first.uav_id,
    model: first.model_ver,
    fault: first.fault_type,
    faultCategory: first.fault_category,
    mission: first.mission_type,
    maxSeverity: num(first.fault_max_severity),
    file: mainCsv.split(/[\\/]/).pop(),
  },
  faultStart: num(first.fault_start_time_s),
  firstActive: onset ? num(onset.time_s) : null,
  step: STEP,
  samples,
};
writeFileSync(new URL('mission.json', OUT), JSON.stringify(mission));

// ---- Real CAN frames at a few moments of the same run ----
const canCsv = mainCsv.replace('HEALTHY_REFERENCE.csv', 'HEALTHY_REFERENCE_CAN_FRAMES.csv');
const can = load(canCsv);
const pick = [60, 3000, 5400];
const frames = pick.map(t => {
  const at = can.filter(f => Math.abs(num(f.time_s) - t) < 0.5);
  return {
    t,
    frames: at.map(f => ({
      id: f.can_id_hex,
      name: f.message_name,
      prio: num(f.priority_rank),
      bytes: [0, 1, 2, 3, 4, 5, 6, 7].map(i => Number(f[`data_b${i}`]).toString(16).toUpperCase().padStart(2, '0')),
      crc: f.crc15_sim_hex,
      signals: f.signal_values,
    })),
  };
});
writeFileSync(new URL('can.json', OUT), JSON.stringify(frames));

// ---- Degradation trend across severities (2 h runs) ----
const series = [
  { sev: 10, run: 'RUN_0001', pat: '2H_FAULT_TURBO_COMPRESSOR_WEAR_SEVERITY_010pct' },
  { sev: 40, run: 'RUN_0002', pat: '2H_FAULT_TURBO_COMPRESSOR_WEAR_SEVERITY_040pct' },
  { sev: 50, run: 'RUN_0002', pat: '2H_FAULT_TURBO_COMPRESSOR_WEAR_SEVERITY_050pct' },
].map(({ sev, run, pat }) => {
  const rs = load(findRun('TURBO_COMPRESSOR_WEAR', run, pat));
  const pts = rs.filter(r => Number(r.time_s) % 60 === 0).map(r => [num(r.time_s), r1(num(r.delta_egt_C))]);
  const maxAbs = Math.max(...rs.map(r => Math.abs(num(r.delta_egt_C) ?? 0)));
  const maxCht = Math.max(...rs.map(r => Math.abs(num(r.delta_cht_C) ?? 0)));
  return { severity: sev, maxDeltaEgt: r1(maxAbs), maxDeltaCht: r3(maxCht), uav: rs[0].uav_id, points: pts };
});
writeFileSync(new URL('trend.json', OUT), JSON.stringify(series));

// ---- Report ranges so implausible channels are visible before publishing ----
const cols = ['alt', 'rpm', 'egt', 'cht', 'dEgt', 'dCht', 'oilT', 'oilP', 'fuel', 'vib', 'volt', 'amb', 'sev'];
for (const c of cols) {
  const v = samples.map(s => s[c]).filter(x => x != null);
  console.log(c.padEnd(5), 'min', Math.min(...v), 'max', Math.max(...v));
}
console.log('onset', mission.faultStart, 'first active', mission.firstActive, 'samples', samples.length);
console.log('can moments', frames.map(f => `${f.t}s:${f.frames.length}`).join(' '));
console.log('trend', series.map(s => `${s.severity}%:${s.maxDeltaEgt}`).join(' '));
