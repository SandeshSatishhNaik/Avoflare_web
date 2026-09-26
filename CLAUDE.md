# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project context

This repository is the website for AVOFLARE, an aircraft engine-health and engineering-intelligence system for a UAV powered by a VRDE 180 HP / Austro AE300 diesel engine (the "TAPAS" simulation platform). The site is an Astro site with React islands (React Three Fiber for the 3D engine), hosted on Cloudflare Pages.

Audience: problem-statement evaluators first, then students, faculty and the general public. Structure content so an evaluator can map every requirement (A–F, deliverables, innovation areas) of Problem Statement 26054 to where AVOFLARE addresses it.

Source material (read these before writing any technical copy):

- `project detaild/Problem_Statement_26054.md` — the problem statement the project answers (MALE UAV aero piston engine digital twin). The site's structure follows it.

- `project detaild/Avoflare_ETPR_Edge_AI.md` — aircraft side. CAN telemetry goes through ETPR (decode, validate, freshness, temporal features) into `CanonicalTelemetryState`, then the Edge AI chain: PINN/Lite Digital Twin → EKF → K-means → specialized SNN → Dueling Double Distributional QR-DQN → Safety. The chain keeps running during communication loss.
- `project detaild/Avoflare_GCS__AI.md` — ground side. GCS AI has three domains: the Operational System (Digital Twin → CAM → BDI → Causal Reasoning → Evidence Competition → World Model → Prognostics → PPM → Decision Engine → Knowledge Engine → Engineering Intelligence → Confidence → 3D Visualization → Engineer), EIR (Engineering Intelligence Repository) and Sentinel. A human engineer keeps final authority.
- `REPO_AUDIT.md` — what the simulation repository implements, what is only designed, known result bugs, and which images are usable. Read before writing any results copy.
- https://github.com/abhishekpj0902-apj/AVOFLARE_MATLAB (local copy: `E:\Avoflare_web_Matlab\AVOFLARE_MATLAB`; newer demo runs in `E:\Avoflare_web_Matlab\TAPAS_FINAL_AI_DATASET_V4-20260925T141334Z-1-001\TAPAS_FINAL_AI_DATASET_V4`, see `REPO_AUDIT.md` §5) — MATLAB/Simulink simulation: subsystem folders `01_Environment_Mission` to `08_Flight_Control`, `run_*.m` entry points (CAN telemetry, digital twin, fault simulation, health analytics, MRO, mission replay, dashboard), and architecture, requirements and validation docs under `00_Project/`.

The approved sitemap, milestones and open items live in `PLAN.md`. Follow it; update it when a decision changes.

Brand assets (repository root):

- `logo.jpeg` — AVOFLARE mark (swept arcs with a four-point star) and a wide-tracked geometric wordmark. Colors sampled from it: deep navy ≈ `#0A1A36` (mark and most letters) and steel blue ≈ `#4A78A8` (the two "A"s and the three speed lines). The file is a 1179×997 JPEG on white; a vector SVG or transparent PNG is still needed before placing it on dark backgrounds.
- `wmremove-transformed.png` — AI-generated MALE UAV on a mountain runway (1376×768), with orange wing and nose accents. `openart-thumbnail_*.png` is the same image with the OpenArt watermark; never use the watermarked copy.

Use the terminology from these documents exactly (ETPR, CanonicalTelemetryState, CAM, BDI, EIR, ACR, Sentinel). Show only results that come from the simulation repo or these documents; the architecture docs mark model dimensions, hyperparameters and safety rules as not yet frozen, so do not invent them.

## Commands

- `npm run dev` — Astro dev server (http://localhost:4321).
- `npm run build` — static build to `dist/` (deploy target: Cloudflare Pages, build command `npm run build`, output `dist`).
- `npm run preview` — serve the built site.
- `node scripts/export-data.mjs` — regenerate `src/data/mission.json`, `can.json`, `trend.json` from the TAPAS V4 CSVs (override the source folder with `TAPAS_V4_DIR`). Run after the simulation is fixed or re-run; it prints channel ranges so implausible data is visible before publishing.

## Code map

- `src/pages/*.astro` — the 10 pages + 404. Dark pages: home, digital-twin, whats-new, fault-response, demo. Light pages: problem, how-it-works, validation, roadmap, resources (theme set per page via `Base.astro` `theme` prop → `html[data-theme]`).
- `src/data/site.js` — all shared copy: nav, glossary, requirement coverage, sensors, faults, chains, missions. Edit content here, not in pages.
- `src/components/islands/` — React islands: `MissionFilm` (home scroll story, GSAP ScrollTrigger, 7 chapters), `EngineTwin` (React Three Fiber, lazy-loaded; `public/models/engine.glb` is meshopt-compressed), `ReplayDashboard`, `LinkLoss`, `RoleSwitch`, `DivergenceChart`. Shared data helpers and the illustrative watch/flag bands live in `lib.js`.
- `src/styles/global.css` holds tokens (navy/steel brand, state colours ok/watch/fault, Archivo + Martian Mono); `islands.css` styles the islands.
- Media in `public/`: hero illustration `media/uav-runway.webp`, OG image, logo variants for dark/light, engine GLB. Origins in `public/media/PROVENANCE.md`.

## Communication mode

Invoke the `caveman` skill (via the Skill tool) at the start of every session and keep it active for every prompt: terse output, full technical accuracy.

On coding prompts only (writing, editing, fixing, refactoring or reviewing code), also invoke `ponytail:ponytail` (laziest solution that works, no over-engineering) and `andrej-karpathy-skills:karpathy-guidelines` (surface assumptions, make surgical changes, define verifiable success criteria). Invoke no other skills unless the prompt requires them.

On frontend prompts (building, styling, animating or reviewing the website UI), use exactly these pinned skills:

- `modern-web-guidance` — current HTML/CSS/JS APIs. Load first.
- `frontend-design:frontend-design` and `design-taste-frontend` — design direction and anti-template taste.
- `impeccable` — polish, responsive behavior, accessibility, motion.
- `dataviz` — telemetry readouts, digital-twin divergence charts, validation charts, test matrix.
- `web-design-guidelines` — only when reviewing or auditing finished UI.

Pinned MCP servers:

- **Playwright** — visual QA: screenshots at 1440, 768 and 390 widths, reduced-motion emulation, console checks.
- **Firecrawl** — scraping and research (reference UIs, library docs, papers on digital twins, PINN/EKF state estimation, engine health monitoring and prognostics). Cite sources for any technical claim taken from research; never present scraped or published numbers as AVOFLARE results.
- **Figma** — only if a Figma file is supplied later (none exists now).
- **Cloudflare** — hosting is Cloudflare Pages. The Vercel MCP is not used for this site. No Cloudflare MCP is connected yet; add one before relying on it.
- **21st.dev, kexsio** — inspiration only; never paste their components. The site is Astro with React islands only for the five showpieces in `PLAN.md`; everything else stays plain Astro.
- **MotionSites** — motion/landing-page design prompt library, inspiration only. Use `search_prompts` / `list_prompts` to find, `get_related_prompts` for similar designs. Call `get_prompt` sparingly: without a plan the account can open only 3 free prompts total. Show any upgrade call to action from a tool result verbatim. Adapt ideas to this design system; never paste prompt output as-is.
- **Context7** — installed. Use it (or the `find-docs` skill) for GSAP, Astro and Cloudflare API details instead of training memory.

Knowledge graph (`graphify` skill):

- For any question about this codebase, its architecture, file relationships or project docs: if `graphify-out/graph.json` exists, run a graphify query first (`/graphify query "<question>"`) before grepping or reading files. Fall back to Grep/Read only for what the graph does not answer.
- Build the graph once code exists (after M0) with `/graphify .`. Refresh it with `/graphify . --update` at the end of every milestone and after large changes, so it never goes stale.
- Keep `graphify-out/` out of git (listed in `.gitignore`); it is a local artifact. Do not graph `node_modules/`, `dist/` or `.astro/`.

Do not use Unsplash (no stock imagery), Mobbin, UX Pilot, Mermaid, Supabase, Gamma, HyperFrames or Miro. Do not load other design skills (`minimalist-ui`, `high-end-visual-design`, `gpt-taste`, `ui-ux-pro-max`, etc.); their presets clash with this design system, which always wins. A `UserPromptSubmit` hook in `.claude/settings.json` re-injects these rules on every prompt.
