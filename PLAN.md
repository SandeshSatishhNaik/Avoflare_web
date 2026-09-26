# AVOFLARE Website Plan

Status: sitemap approved 2026-09-25; stack, showpieces, design direction and the Home Mission Film decided 2026-09-26. User said start on 2026-09-26. Built the same day: all 10 pages + 404, Mission Film, 3D engine twin, replay dashboard, link-loss switch, role switch, data export script. Not done: Cloudflare deploy (no account/MCP yet), team details, MATLAB dashboard screenshots, PDF downloads of the docs.

## Goal and audience

A public website for the AVOFLARE answer to Problem Statement 26054 (AI-enabled real-time digital twin for aero piston engines in MALE UAVs).

- Primary audience: problem-statement evaluators. They must be able to find where each requirement (A–F, deliverables, innovation areas) is addressed, and see evidence, quickly.
- Secondary audience: students, faculty and the general public. Every page opens with a 2–3 sentence plain-language summary before the engineering detail.

## Approved sitemap (10 pages)

1. **Home** — the Mission Film (see below), followed by one teaser per page and key numbers.
2. **Problem** — Problem Statement 26054 summary; requirement coverage table (every requirement A–F and each deliverable, where AVOFLARE covers it, link to the page); sensor table (the 8 monitored parameters in requirement B: sensor, CAN signal, normal range, from `CAN_Signal_Specification.csv`); fault table (the 8 faults in requirement C: detecting signals, method, lead time, from the fault tree doc).
3. **How it works** — architecture. Aircraft side: sensors/ECU → CAN → ETPR → CanonicalTelemetryState → Edge AI chain → Safety. Ground side: GCS AI Operational System, EIR, Sentinel.
4. **Digital Twin and Simulation** — engine subsystem models from repo folders `01`–`08`; the four mission cases from requirement E (high altitude, endurance, hot weather, rapid throttle transitions).
5. **What's new** — communication-loss mode (onboard AI keeps running without the GCS link) first; then physics-informed AI, explainable AI (evidence competition and confidence), human engineering authority. Each point is tied to an innovation area named in the problem statement.
6. **Fault response** — one fault followed end to end as a story (based on GCS AI Scenario B, temperature divergence): what the operator, the propulsion engineer and the maintenance team each see and do.
7. **Demo** — in-browser mission replay player using simulation data exported from MATLAB (static JSON/CSV, no server); fault injection and alerts; video of the MATLAB dashboard as a fallback.
8. **Validation and results** — simulation vs reference data (VRDE 180 HP, AE300), fault-detection results, from `00_Project/Validation/`; limitations and assumptions (from `26_Assumptions_and_Data_Sources.md`).
9. **Roadmap** — simulation (done) → hardware-in-loop → engine test rig → GCS integration → fleet monitoring; future work.
10. **Resources and Team** — architecture docs (PDF), GitHub repository, one-page PDF summary for evaluators, demo video, logo kit, glossary, team (names, roles, institute, mentor), contact.

## Tech stack (decided 2026-09-26)

Astro for pages and layout, with React components ("islands") for the interactive showpieces. Static output to Cloudflare Pages. Chart data comes from JSON files generated from the MATLAB CSV runs by one export script, so fixed simulation data can be dropped in later without code changes.

## Showpieces (all five approved 2026-09-26)

1. Live Digital Twin view — 3D engine (React Three Fiber) with sensor hotspots that change colour as the fault grows, driven by the mission timeline.
2. Ground-station replay dashboard — plays TURBO_COMPRESSOR_WEAR 2 h 50 % (Drive V4 RUN_0002): gauges, EGT/CHT vs healthy reference, fault alert, maintenance advisory.
3. Scroll-driven data-flow story — sensor → CAN frame (real bytes) → ETPR → Edge AI → GCS → engineer.
4. Link-loss switch — visitor cuts the GCS link; the aircraft-side chain keeps running.
5. Role switch — the same fault seen by operator, propulsion engineer and maintenance team.

Build order if time runs short: 2, 4, 3, 5, 1. (Superseded by the Mission Film decision below: showpiece 3 becomes the Mission Film.)

## Design direction (decided 2026-09-26, architect decision)

Hybrid of the two directions in `REFERENCE_STUDY.md`:

- Dark navy for the story and the showpieces (Home Mission Film, replay dashboard, link-loss, fault response): the aircraft is in the sky and the ground station is an operations room.
- Light ice-grey for the reading pages (Problem, How it works detail, Validation, Roadmap, Resources): evaluators read tables and requirements there. Digital Twin is dark: it hosts the 3D engine, and the lit sensor states read best on navy.
- Colour is only ever state: steel blue `#4A78A8` normal, amber watch, signal orange fault. Navy `#0A1A36` is the base.
- Monospace only for live data and CAN bytes; a grotesk for all other text; an extended display face for the few large headings (echoes the logo's wide tracking).
- Any page must show readable content within 3 seconds. 3D and video load behind a poster; no blocking loaders.

## Mission Film (home page, decided 2026-09-26)

The home page is a scroll-driven story of one mission, told with the real TURBO_COMPRESSOR_WEAR 2 h 50 % run (Drive V4 RUN_0002). It replaces showpiece 3 and contains a first look at showpieces 1 and 4.

Build approach (scoped to the deadline): one pinned stage scrubbed by scroll (GSAP ScrollTrigger), mixing media per chapter instead of one full 3D world. Full camera fly-through 3D worlds take professional teams weeks (see `REFERENCE_STUDY.md` sources); this approach gets the same story in about a day.

| # | Chapter | What the visitor sees | Media | Data |
|---|---|---|---|---|
| 0 | Takeoff | Runway video, AVOFLARE headline, one-line claim, PS 26054 | Re-encoded runway video with poster | none |
| 1 | Climb | The UAV rises over layered ridgelines; altitude and outside-air readouts count up | SVG UAV side profile + SVG ridgelines, parallax | Mission profile of the run (altitude, ambient temperature) |
| 2 | Inside the engine | The view moves into the nacelle; the engine appears and sensor points light up one by one (RPM, CHT, EGT, oil pressure and temperature, fuel flow, vibration, voltage) | React Three Fiber, decimated engine GLB, render-to-line-drawing transition | Live values at the current mission time |
| 3 | On the CAN bus | Sensor values become real CAN frames (hex bytes) that slide along a bus line | SVG + monospace text | Real bytes from the run's CAN frame file |
| 4 | The edge decides | ETPR decodes frames into CanonicalTelemetryState; the Edge AI chain lights up; EGT drifts away from the healthy twin; the fault is flagged amber, then orange | SVG pipeline + divergence chart | EGT and CHT vs `ref_` values; fault onset and severity |
| 5 | Downlink | Packets arc from the UAV over the ridgeline to the ground-station antenna. The link drops for a moment: packets stop, the edge keeps working and buffers; the link returns and the buffer flushes. A "cut the link" control lets the visitor trigger it (first look at showpiece 4) | SVG arcs + particles | Same run, time-shifted |
| 6 | At the base | The GCS AI chain lights up in order (Digital Twin, CAM, BDI, Causal Reasoning, Evidence Competition, World Model, Prognostics, PPM, Decision Engine, Engineer); three role cards receive their view (operator, propulsion engineer, maintenance) | SVG chain + role cards | Divergence summary |
| 7 | Outcome | Maintenance advisory card; links to the replay dashboard (Demo) and to Fault response | HTML | Advisory text written from the docs, marked as designed |

Honesty rules for the film:

- A persistent small label: "Simulated data: TAPAS V4, turbo compressor wear, 50 %, 2 h".
- Chapters 4 and 6 show the designed AI chain; the label says "designed architecture" wherever the step is not implemented (see `REPO_AUDIT.md`). Only EGT/CHT divergence, fault onset and severity come from data.
- The UAV is a generic MALE silhouette, not a specific aircraft.

Fallbacks:

- `prefers-reduced-motion`, no WebGL, or small phones: the same 8 chapters as a normal vertical page of still frames with their captions; no pinning, no scrubbing.
- The 3D engine in chapter 2 loads only when that chapter approaches; until then a still render is shown.

Ideas adapted from free MotionSites prompts (opened: "Data Signal", "Future Machine"; 1 free prompt left): one orchestrated line-by-line headline reveal on load; parts assembling into place (used for the engine sensors seating in chapter 2); aspect-ratio-based breakpoints for full-screen stages.

### 3D engine model

`eaadb3d2-…_white_mesh (1).glb` in the repository root: a similar inline piston engine, not the TAPAS/VRDE engine. Findings:

- AI-generated mesh (trimesh export, "white_mesh" naming typical of image-to-3D tools): one single mesh, 1.2 M triangles, 18.6 MB, no normals, no UV coordinates, no materials or textures.
- Recognisable engine silhouette (block, intake plenum, pipes, pulley cover), but surfaces are blobby and small details are melted; it does not hold up to close-up photoreal viewing.
- Web preparation needed: decimate to roughly 100–150 k triangles and compress (meshopt/Draco) to reach ~1–3 MB; compute normals.
- Look: a stylised "digital twin" rendering (dark metal shading, rim light, optional wireframe/scan-line overlay) instead of photoreal textures — no UVs are needed for that, and it hides the mesh artefacts.
- Because it is one mesh, subsystems cannot be highlighted separately. Use sensor hotspot markers placed at 3D positions (turbo, exhaust/EGT, cylinder head/CHT, oil, fuel) instead of splitting the mesh.
- The site must label it "representative engine model", not the actual TAPAS engine.

### Video

`tapas_himalayan_runway_cinematic.mp4` in the repository root: 1920×1080, 8 s, 24 fps, 2.2 MB, codec MPEG-4 Part 2, which Chrome and most browsers do not play. Re-encode to H.264 MP4 (and optionally WebM/AV1) before use as a hero background loop, with the still image as poster and a reduced-motion fallback.

## Site-wide requirements

- Glossary: hover definitions for ETPR, CAM, BDI, EIR, ACR, RUL, PINN, EKF, QR-DQN and similar terms, plus a glossary section in Resources.
- Social share image (Open Graph), custom 404 page.
- Only show results that come from the simulation repo or the architecture documents.

## Deadline

No fixed date, but earlier is much better: finishing today (2026-09-25) is best, tomorrow is acceptable, the day after is too late. Every milestone is time-boxed and ordered so that a complete, deployable site exists as early as possible; later milestones only improve it.

## Milestones

Day 1 (today) — a complete site that could be submitted:

- M0 — Astro scaffold, git repository, build passes.
- M1 — Design system (tokens from the logo colors, typography, layout, motion rules), shared layout, navigation, all 10 page shells.
- M2 — Content for all 10 pages from the docs and repo. Demo page v1 = static charts and screenshots of the MATLAB dashboard (no replay player yet). Placeholders are clearly marked where team data or exported demo data is missing.
- M3 — QA (Playwright at 1440, 768 and 390 widths, reduced motion, accessibility), deploy to Cloudflare Pages.

Day 2 (only if time allows) — improvements, each shippable on its own:

- M4 — Demo v2: in-browser mission replay player with fault injection, once demo data is exported.
- M5 — Motion polish, glossary hover definitions, one-page PDF summary, share image refinements.

## Open items

See `REPO_AUDIT.md` for what the simulation repository contains, what is missing, result-quality problems and the image list. Decisions it raises:

- How to present implemented work (physics simulation, fault injection, CAN telemetry, datasets, MATLAB dashboard) versus designed-only work (Edge AI chain, GCS AI, RUL, health indices, maintenance advisory).
- Whether the team fixes the healthy-reference bug (zero reference torque/brake power) and the runs where the fault is not applied, before any chart is published.
- Whether the Validation page shows a minimal validation the team produces now, or becomes a "Validation plan" page.
- Which run is the demo run (candidates: AIR_FILTER_CLOG 40 %, TURBO_COMPRESSOR_WEAR 10 %).
- Remove third-party files from the public repo (`OM-E40101-r11.pdf`, `images/` photos).

- Deadline (hackathon round or demo date).
- Demo data: export at least one mission run with an injected fault from MATLAB as CSV, or confirm the repo `results/` folder holds usable data.
- Team details: names, roles, institute, mentor.
- Innovation areas not covered by the current docs — secure telemetry, federated learning, deployment roadmap / test rig: write short design sections, or list them as future work on the Roadmap page.
- Logo as SVG or transparent PNG (current file is a JPEG on white).
- Higher-resolution UAV hero image (current one is 1376×768), and confirmation that OpenArt terms allow public use of the image.
- Cloudflare account, domain, and a Cloudflare MCP connection.
