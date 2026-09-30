// Grades, cleans and encodes the AI-generated source media into public/media/.
// Look: "Night Navy" (see SITE_PLAN.md §2). Originals in Raw_images_and _Videos/ are never modified.
// Usage: node scripts/grade-media.mjs [id ...]   (no ids = everything)
import { execFileSync } from 'node:child_process';
import { mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const RAW = process.env.RAW_DIR ?? 'Raw_images_and _Videos';
const OUT_V = 'public/media/v';
const OUT_I = 'public/media/img';
mkdirSync(OUT_V, { recursive: true });
mkdirSync(OUT_I, { recursive: true });

// Generator watermark (✦) sits at the same spot on every 1280×720 clip.
const DELOGO = 'delogo=x=1130:y=566:w=60:h=62';
const GRADE = [
  'huesaturation=hue=-12:saturation=-0.35:colors=m',
  'huesaturation=saturation=-0.12:colors=b+c',
  'colorbalance=rs=-0.05:bs=0.07:gs=-0.01:rm=-0.02:bm=0.03:rh=0.03:bh=-0.02',
  "curves=m='0/0.035 0.25/0.21 0.6/0.62 1/0.96'",
  'eq=saturation=0.92',
  'vignette=angle=0.45',
].join(',');
const NIGHT = 'eq=brightness=-0.07:saturation=0.62:contrast=1.05,colorbalance=bs=0.08:bm=0.05';
const UP = 'scale=1920:1080:flags=lanczos,unsharp=5:5:0.45:5:5:0';
const GRAIN = 'noise=alls=5:allf=t';

// id, source, trim [start, end] seconds, watermark?, extra grade
const CLIPS = [
  ['reel-runway', 'Camera_slow_steady_dolly_for.mp4', [0, 10], true],
  ['reel-clouds', 'Camera_slow_tracking_shot_tha.mp4', [0, 10], true],
  ['reel-station', 'Camera_slow_lateral_slide_beh.mp4', [0, 10], true],
  ['film-takeoff', 'zip_takeoff_headon.mp4', [0, 6], true],          // later frames show jet flames: cut
  ['film-night', 'Camera_slow_tracking_shot_tha.mp4', [0, 10], true, NIGHT],
  ['film-cruise', 'tapas_uav_cinematic_loop.mp4', [0, 7.5], false], // ends on black after ~7.8 s
];

// id, source
const STILLS = [
  ['runway-blue', 'ChatGPT Image Sep 28, 2026, 04_21_19 PM.png'],
  ['runway-night', 'sean_1_img.png'],
  ['clouds-sunset', 'UAV_Flying.png'],
  ['nacelle', 'ChatGPT Image Sep 28, 2026, 05_44_10 PM.png'],
  ['engine', 'Engine.png'],
  ['station', 'Base.png'],
];

const XF = 0.8; // loop crossfade seconds
const ff = args => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...args], { stdio: 'inherit' });
const want = process.argv.slice(2);
const pick = id => !want.length || want.includes(id);

for (const [id, src, [a, b], wm, extra] of CLIPS) {
  if (!pick(id)) continue;
  const inp = join(RAW, src);
  if (!existsSync(inp)) { console.warn(`skip ${id}: ${inp} missing`); continue; }
  const pre = [wm && DELOGO, UP, GRADE, extra].filter(Boolean).join(',');
  const d = b - a;
  // Seamless loop: play [a+XF, b] and crossfade its tail into [a, a+XF].
  const graph = `[0:v]${pre},split[s1][s2];` +
    `[s1]trim=${a + XF}:${b},setpts=PTS-STARTPTS[body];` +
    `[s2]trim=${a}:${a + XF},setpts=PTS-STARTPTS[head];` +
    `[body][head]xfade=transition=fade:duration=${XF}:offset=${(d - 2 * XF).toFixed(2)},${GRAIN},format=yuv420p[v]`;
  const hd = join(OUT_V, `${id}.mp4`);
  ff(['-i', inp, '-filter_complex', graph, '-map', '[v]', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '23', '-profile:v', 'high', '-movflags', '+faststart', hd]);
  ff(['-i', hd, '-vf', 'scale=1280:-2:flags=lanczos', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '26', '-movflags', '+faststart', join(OUT_V, `${id}-720.mp4`)]);
  ff(['-i', hd, '-frames:v', '1', '-c:v', 'libwebp', '-quality', '78', join(OUT_V, `${id}.webp`)]);
  console.log('clip', id);
}

for (const [id, src] of STILLS) {
  if (!pick(id)) continue;
  const inp = join(RAW, src);
  if (!existsSync(inp)) { console.warn(`skip ${id}: ${inp} missing`); continue; }
  const master = `scale=2400:-2:flags=lanczos,unsharp=5:5:0.5:5:5:0,${GRADE},noise=alls=4`;
  ff(['-i', inp, '-vf', master, '-c:v', 'libwebp', '-quality', '80', join(OUT_I, `${id}-2400.webp`)]);
  ff(['-i', join(OUT_I, `${id}-2400.webp`), '-vf', 'scale=1200:-2:flags=lanczos', '-c:v', 'libwebp', '-quality', '78', join(OUT_I, `${id}-1200.webp`)]);
  console.log('still', id);
}
