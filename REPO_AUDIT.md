# AVOFLARE_MATLAB Repository Audit

Audited 2026-09-25 from https://github.com/abhishekpj0902-apj/AVOFLARE_MATLAB (single commit "Initial commit", 2026-09-24; 2,998 files, 4.5 GB). Local copy of the repository: `E:\Avoflare_web_Matlab\AVOFLARE_MATLAB` (same commit `5047b2a`, no local changes). Newer V4 runs from Google Drive are covered in section 5.

Purpose: know what the website can honestly show, what is missing, and which images the site needs.

## 1. What is there

### Working simulation code (real, runnable in MATLAB)

| Area | Location | Notes |
|---|---|---|
| Engine physics | `core/tapas_engine_physics_v22.m` ("golden reference"), later versions up to `v26` | ~720 lines per version |
| Fault library | `core/faults/tapas_fault_library_v1.m` | **52 fault types** across intake/turbo, fuel/injection, combustion, mechanical, gearbox, propeller, lubrication, cooling, exhaust, electrical, ECU, sensor faults, vibration. Each fault lists the signals it affects. |
| Fault manager and sensor faults | `core/faults/tapas_fault_manager_v1.m`, `tapas_sensor_fault_model_v1.m` | Fault profiles: wear ramp, drift, intermittent, leak, bias, thermal runaway |
| Mission planners | `core/faults/tapas_mission_planner_final_v1.m` (2 min / 2 h / 4 h / 8 h; phases takeoff, climb, transition, survey, return, shutdown; up to 4,500 m) and `UAV_TAPAS_SIMULATION/mission/mission_planner.m` | **10 named missions**: M01 Training/Acceptance, M02 Persistent ISR, M03 High Altitude ISR, M04 Maritime Surveillance, M05 Communication Relay, M06 ELINT/COMINT Patrol, M07 Post Event Assessment, M08 Cold Environment, M09 Hot Environment, M10 Extended Endurance |
| Dataset generator | `core/run_tapas_UAV_FINAL_v4.m` (2,295 lines) | Runs mission + fault, writes CSV/XLSX/MAT, 11 graphs and a summary report per run, plus a **healthy reference run of the same mission** and delta columns (fault minus healthy) |
| CAN telemetry | `core/TAPAS_CAN_EDGE_V4_PACKAGE/` | CAN encoder, decoder, codec, integration run, validation, and `TAPAS_CAN_EDGE_PROCESSING_CONTRACT_V1.pdf` |
| Subsystem models | `01_Environment_Mission` (ISA atmosphere, mission profiles), `06`–`08` (propulsion integration, aircraft environment, flight control) | Implemented |
| Simulink | `UAV_TAPAS_SIMULATION/TAPAS_Phase3*.slx`, `SIMULINK/tapas_engine_twin.m` | Phase-3 model with a simple "Edge_AI" anomaly-score block (weighted normalized temperature + vibration + oil pressure deviation) |
| MATLAB dashboard | `TAPAS_MATLAB_GUI_Dashboard_v2/tapas_dashboard_app.m` (912 lines) | GUI: pick mission, fault and severity, run pipeline, tabs Dashboard / Telemetry / CAN Frames / Graphs / AI-ML Handover, export CAN XLSX, save snapshot |

### Datasets (simulated)

- `core/TAPAS_FINAL_AI_DATASET_V4/` — latest: runs for AIR_FILTER_CLOG, IGNITION_TIMING_DRIFT, PROPELLER_BLADE_DAMAGE, plus MASTER files (all runs, physics + CAN frames). 150+ columns per row: mission, atmosphere, turbo, fuel, combustion (AFR, lambda, IMEP/BMEP), power, torque, propeller (CT, CP, thrust), CHT, EGT, coolant, oil pressure/temperature, voltage/current, vibration, fault labels, `ref_*` healthy reference, `delta_*` divergence.
- `core/TAPAS_FINAL_AI_DATASET_V2/` — BATTERY_VOLTAGE_LOW, CRANKSHAFT_WEAR, INJECTOR_STICKING, PROPELLER_BEARING_WEAR, RPM_SENSOR_BIAS (2 runs), TURBO_COMPRESSOR_WEAR.
- Older: `TAPAS_FINAL_AI_DATASET`, `TAPAS_AI_DATASET_V1` (bearing friction, compressor wear, filter clog, injector clog, intercooler fouling, ring blowby, normal), `TAPAS_AI_DATASET_V2`.
- `UAV_TAPAS_SIMULATION/results/logs/` — 50 mission runs (M01, M02, M03, M05, M10; normal and faults F01–F06; UAVs 001–005), some with CAN datasets.
- `results/M01_NORMAL.*` — one normal 2-minute run (37 columns including raw CAN frame bytes).

### Documents

- Word/PDF architecture notes for the AE300 subsystems (intake/turbo, fuel/combustion, mechanical, lubrication/cooling, gearbox/propeller, ECU/electrical, full digital twin), fault-tree-to-MRO architecture, VRDE 180 telemetry parameters, CAN configuration, sensor requirements, simulation spec, run-by-run test plan, UAV mission workflow, formulas, Simulink structure. (PDF contents not read yet: no PDF renderer on this machine.)
- `AeroTwin_CAN_Signal_Specification.xlsx`, `parameters.xlsx`, `00_Project/Interfaces/*.csv` signal/interface specifications.

## 2. What is not there

This is the most important finding for the website.

1. **No AI/ML is implemented.** No code for PINN, EKF, K-means, SNN or QR-DQN (0 files), and no trained model of any kind. The Edge AI and GCS AI chains exist only in the two architecture documents. The only "AI" in code is a weighted anomaly score in the Simulink model.
2. **No RUL.** `RUL_s` is deliberately `NaN` in every dataset: "intentionally NaN until a validated lifetime model exists".
3. **No health index or maintenance advisory output**, except one `health_index` inside the air-filter model and an `engine_health_percent` column in the older runs.
4. **No validation.** All 6 files in `00_Project/Validation/` and all 30 files in `00_Project/Documentation/` and 8 in `00_Project/Requirements/` are ~310-byte placeholders ("Architecture document placeholder"). No comparison against VRDE 180 HP or AE300 reference data exists.
5. **Top-level entry points are empty.** All 13 `run_*.m` files and 97 of 337 `.m` files are "ARCHITECTURE SCAFFOLD" placeholders (including most of `02`–`05` and `00_Project`). Real code lives in `core/`, `UAV_TAPAS_SIMULATION/` and the dashboard folder.
6. **No dashboard screenshots, no demo video.** The MATLAB dashboard exists but has never been captured.
7. **Problem-statement parameters not produced as signals:** injection timing (only an ignition-timing-drift fault), battery/alternator health index. Vibration is a single `vibration_g` value, not a signature or spectrum.
8. **No secure telemetry, federated learning, deployment roadmap or test-rig work.**

## 3. Result quality problems (must fix or avoid before showing anything)

- **Healthy reference torque and brake power are zero** (`ref_torque_Nm`, `ref_brake_power_kW`) in the V4 runs, so "normal vs fault" charts for those signals are wrong.
- **Some fault runs do not apply the fault**: e.g. IGNITION_TIMING_DRIFT 2 h — the fault-degradation graph shows severity 0 and "fault active" 0 for the whole run, and the simulated curves match the reference. PROPELLER_BLADE_DAMAGE and BATTERY_VOLTAGE_LOW show zero EGT divergence.
- **Some runs do show a real, small divergence**: AIR_FILTER_CLOG 40 % (max EGT difference 7.7 °C), TURBO_COMPRESSOR_WEAR 10 % (2.1 °C). These are the best candidates for the demo.
- **Values need an engineer's review before publication**: e.g. mass airflow plotted as 0, brake power flat at ~120 kW through the whole mission, torque up to ~1,084 N·m; `UAV_TAPAS_SIMULATION/results/plots` show perfectly flat oil pressure and temperature lines.
- **Graph readability**: MATLAB underscore rendering garbles titles ("IGNITION_TIMING_DRIFT" shows as subscripts), overlapping headers, dense 8-panel figures. Not suitable for the site as images; redraw from CSV as web charts instead.

## 4. Images

### In the repo

| File | Usable on site? | Why |
|---|---|---|
| `Avoflare_Architecture.png` (3088×3838) | As content reference only | "Made with Napkin" watermark, pastel mind-map style that does not match the brand; redraw as an SVG diagram |
| `core/.../GRAPHS/*.png` (98 images, 9 runs × 11 graphs) | No (evidence only) | Readability and correctness problems above; the underlying CSVs are the useful asset |
| `UAV_TAPAS_SIMULATION/results/plots/*.png` (8) | No | Flat placeholder-like curves, dual y-axes |
| `images/csm_AE300*.jpg`, `csm_AE330*`, `csm_DA42*`, `csm_DA62*` | **No** | Austro Engine / Diamond Aircraft marketing photos — third-party copyright |
| `images/Gje98Y_WUAAQCt4.jpg`, `images.jpg`, `images (1).jpg` | **No** | Downloaded web images of unknown source |

Also in the repo and **must not be republished**: `OM-E40101-r11.pdf` (appears to be the Austro Engine operator manual — third-party copyright). The repo is public, so this also affects the team, not only the site.

### In this project folder

- `logo.jpeg` — usable; needs SVG or transparent PNG.
- `wmremove-transformed.png` — usable if OpenArt terms allow; low resolution for a full-width hero.

### Images the site needs (to be created)

| Image | Page | Source / how |
|---|---|---|
| Logo SVG + favicon | All | Trace `logo.jpeg` or get the original |
| Hero visual (high resolution) | Home | Higher-resolution UAV render, or a designed engine/telemetry visual |
| Full system diagram | How it works | Redraw from `Avoflare_Architecture.png` + both architecture docs, as SVG |
| Aircraft-side chain diagram (CAN → ETPR → CanonicalTelemetryState → Edge AI → Safety) | How it works, What's new | ETPR doc, SVG |
| GCS AI chain diagram (Digital Twin → CAM → BDI → … → Engineer) with EIR and Sentinel | How it works | GCS doc, SVG |
| Communication-loss mode illustration (link up vs link down) | What's new | ETPR doc §11, SVG |
| Engine subsystem diagram (intake/turbo, fuel, combustion, mechanical, lubrication, cooling, gearbox/propeller, electrical) with sensor locations | Digital Twin and Simulation, Problem | Original illustration; never trace Austro photos |
| Mission profile charts (altitude vs time for M01–M10) | Digital Twin and Simulation | From mission planner / log CSVs |
| Normal vs fault divergence charts | Fault response, Demo, Validation | Redraw from V4 CSV (`ref_*`, `delta_*`) after the reference bug is fixed |
| CAN frame illustration (bytes → decoded signal → validated value) | How it works | CAN package + ETPR doc |
| Fault-response storyboard (operator / engineer / maintenance view) | Fault response | GCS doc Scenario B |
| MATLAB dashboard screenshots + short screen recording | Demo | Team runs `tapas_dashboard_app.m` and captures |
| Roadmap graphic | Roadmap | Once content is decided |
| Team photos | Team | Team |
| Social share image (1200×630) | All | Designed from logo + hero |

## 5. Drive dataset (newer V4 runs)

Shared from Google Drive and downloaded to `E:\Avoflare_web_Matlab\TAPAS_FINAL_AI_DATASET_V4-20260925T141334Z-1-001\TAPAS_FINAL_AI_DATASET_V4` (302 MB, runs dated 11–24 Sep 2026). It contains more runs than the GitHub V4 folder:

| Run | Mission | Severity | Fault applied? | Max divergence from healthy reference |
|---|---|---|---|---|
| TURBO_COMPRESSOR_WEAR RUN_0001 | 2 h | 10 % | Yes | EGT 2.1 °C, CHT 0.11 °C |
| TURBO_COMPRESSOR_WEAR RUN_0002 | 2 h | 40 % | Yes | EGT 8.5 °C, CHT 0.45 °C |
| **TURBO_COMPRESSOR_WEAR RUN_0002** | **2 h** | **50 %** | **Yes** | **EGT 10.6 °C, CHT 0.56 °C — best demo candidate** |
| TURBO_COMPRESSOR_WEAR RUN_0001 | 2 min | 60 % | Yes | EGT 16.2 °C |
| TURBO_COMPRESSOR_WEAR RUN_0003 | 2 h | ? | — | Graphs and report only, no CSV |
| AIR_FILTER_CLOG RUN_0001–0005 | 2 min | 30 % | Yes | EGT 5.8 °C (all five runs give the same values) |
| IGNITION_TIMING_DRIFT RUN_0001 | 2 h | — | — | Graphs and report only, no CSV |
| MISFIRE RUN_0002 | 2 h | 100 % | Not checked | XLSX only, no CSV (misfire is a Problem Statement requirement C item) |
| MASTER | 2 h | 0 % | **No** | Contains only IGNITION_TIMING_DRIFT with the fault never active |

The turbo compressor wear series (10 → 40 → 50 → 60 %) shows EGT divergence growing with severity, which supports a "degradation trend" chart.

The bugs from section 3 are still present in every Drive run: healthy-reference torque and brake power are 0, mass airflow is 0, and MAP divergence is 0 even for turbo compressor wear (boost pressure should drop when the compressor wears; an engineer should check the intake/turbo coupling).

## 6. What this means for the site

Per page, what the repo can support today:

| Page | Status |
|---|---|
| Problem | Ready: problem statement, 52-fault library, signal list, 10 missions |
| How it works | Ready as **architecture** (documents), not as implemented AI |
| Digital Twin and Simulation | Mostly ready: physics model, 10 missions (high altitude M03, endurance M10, hot M09, cold M08), fault library, CAN pipeline |
| What's new | Ready as **design**; must say the AI chain is designed, not yet implemented |
| Fault response | Possible with AIR_FILTER_CLOG or TURBO_COMPRESSOR_WEAR data, labelled as simulation |
| Demo | Possible with one good run + dashboard screenshots; team must capture screenshots/video |
| Validation and results | **Not ready**: no validation exists. Either the team produces a minimal validation now, or the page becomes "Validation plan" |
| Roadmap | Needs content from the team |

Key decision for the team: the site must clearly separate **implemented** (physics simulation, fault injection, CAN telemetry, dataset generation, MATLAB dashboard) from **designed** (Edge AI chain, GCS AI, RUL, health indices, maintenance advisory). Presenting the designed parts as working results would mislead evaluators.
