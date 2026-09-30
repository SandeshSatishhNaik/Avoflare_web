// Export the "What we built" data from the TAPAS_UAV_DIGITAL_TWIN runs into src/data/built.json.
// Only numbers that are safe to publish (REPO_AUDIT.md §5b): mission profile, weather, CAN frames.
// Override the results folder with TAPAS_DT_RESULTS.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const R = process.env.TAPAS_DT_RESULTS || 'E:/Avoflare_web_Matlab/TAPAS_UAV_DIGITAL_TWIN/experiment_manager/TAPAS_RESULTS';
const V46 = join(R, '2026-09-16_15-28-43_SURVEILLANCE_2H_V46_ENVIRONMENT_MISSION');
const V51 = join(R, '2026-09-16_16-17-21_V51_CAN_PACKETIZATION_EDGE_PIPELINE');

const csv = f => { const [h, ...rows] = readFileSync(f, 'utf8').trim().split(/\r?\n/); const k = h.split(','); return rows.map(r => Object.fromEntries(r.split(',').map((v, i) => [k[i], v]))); };

const mission = csv(join(V46, 'mission_data/V46_mission_data.csv'));
const env = csv(join(V46, 'environment_data/V46_environment_data.csv'));
const STEP = 600; // 0.05 s samples -> one point every 30 s
const profile = [];
for (let i = 0; i < mission.length; i += STEP) {
  const m = mission[i], e = env[i];
  profile.push([+m.Time_s, Math.round(+e.Altitude_m), +(+m.AirspeedCommand_m_s).toFixed(1), +(+e.WindSpeed_m_s).toFixed(1), +e.RainFlag]);
}
const phases = [];
for (const m of mission) { const p = phases.at(-1); if (!p || p.name !== m.MissionPhase) phases.push({ name: m.MissionPhase, from: +m.Time_s, to: +m.Time_s }); else p.to = +m.Time_s; }

// 8 consecutive samples (48 frames) from mid-cruise
const can = csv(join(V51, 'can_data/V51_CAN_packetized_data.csv'));
const start = can.findIndex(f => +f.Time_s >= 3000);
const frames = can.slice(start, start + 48).map(f => [+f.Time_s, +f.CAN_ID, f.MessageName, [1, 2, 3, 4, 5, 6, 7, 8].map(n => +f[`Data${n}`])]);

const out = {
  source: 'TAPAS_UAV_DIGITAL_TWIN runs V46 (mission, environment) and V51 (CAN). Simulated.',
  profile: { columns: ['t_s', 'altitude_m', 'airspeed_cmd_m_s', 'wind_m_s', 'rain'], rows: profile },
  phases,
  distance_km: +(mission.reduce((a, m) => Math.max(a, +m.DistanceTravelled_m), 0) / 1000).toFixed(1),
  can: { total_frames: can.length, frames },
};
writeFileSync('src/data/built.json', JSON.stringify(out));
console.log(`profile ${profile.length} pts, phases ${phases.map(p => p.name).join('>')}, distance ${out.distance_km} km, CAN ${can.length} frames`);
console.log('altitude', Math.min(...profile.map(r => r[1])), '-', Math.max(...profile.map(r => r[1])), 'm; airspeed max', Math.max(...profile.map(r => r[2])), 'm/s; wind max', Math.max(...profile.map(r => r[3])));
