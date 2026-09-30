# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project context

This repository is the website for AVOFLARE, an aircraft engine-health and engineering-intelligence system for a UAV powered by a VRDE 180 HP / Austro AE300 diesel engine (the "TAPAS" simulation platform). The site is a React-only app (Vite + React 19) at the repository root, ported from the approved demo `demos/home.html` (user decision 2026-09-30: React only; the old Astro code was removed). Hosting: Cloudflare Pages. Motion: GSAP ScrollTrigger + SplitText and Lenis smooth scroll. There is no 3D model on the site.

Audience: problem-statement evaluators first, then students, faculty and the general public. Structure content so an evaluator can map every requirement (A–F, deliverables, innovation areas) of Problem Statement 26054 to where AVOFLARE addresses it.

Source material (read these before writing any technical copy):

- `project detaild/Problem_Statement_26054.md` — the problem statement the project answers (MALE UAV aero piston engine digital twin). The site's structure follows it.

- `project detaild/Avoflare_ETPR_Edge_AI.md` — aircraft side. CAN telemetry goes through ETPR (decode, validate, freshness, temporal features) into `CanonicalTelemetryState`, then the Edge AI chain: PINN/Lite Digital Twin → EKF → K-means → specialized SNN → Dueling Double Distributional QR-DQN → Safety. The chain keeps running during communication loss.
- `project detaild/Avoflare_GCS__AI.md` — ground side. GCS AI has three domains: the Operational System (Digital Twin → CAM → BDI → Causal Reasoning → Evidence Competition → World Model → Prognostics → PPM → Decision Engine → Knowledge Engine → Engineering Intelligence → Confidence → 3D Visualization → Engineer), EIR (Engineering Intelligence Repository) and Sentinel. A human engineer keeps final authority.
- `REPO_AUDIT.md` — what the simulation repository implements, what is only designed, known result bugs, and which images are usable. Read before writing any results copy.
- https://github.com/abhishekpj0902-apj/AVOFLARE_MATLAB (local copy: `E:\Avoflare_web_Matlab\AVOFLARE_MATLAB`; newer demo runs in `E:\Avoflare_web_Matlab\TAPAS_FINAL_AI_DATASET_V4-20260925T141334Z-1-001\TAPAS_FINAL_AI_DATASET_V4`, see `REPO_AUDIT.md` §5) — MATLAB/Simulink simulation: subsystem folders `01_Environment_Mission` to `08_Flight_Control`, `run_*.m` entry points (CAN telemetry, digital twin, fault simulation, health analytics, MRO, mission replay, dashboard), and architecture, requirements and validation docs under `00_Project/`.
- https://github.com/abhishekpj0902-apj/TAPAS_UAV_DIGITAL_TWIN (local copy: `E:\Avoflare_web_Matlab\TAPAS_UAV_DIGITAL_TWIN`) — second, newer MATLAB project (runs V45–V58.1 in `experiment_manager/TAPAS_RESULTS/`: mission, integrated physics, CAN packetisation, health thresholds, fault schedule). Its AI/MRO files are empty and its final run is not physically valid; read `REPO_AUDIT.md` §5b before using any number.

The approved sitemap, milestones and open items live in `PLAN.md`. Follow it; update it when a decision changes.

Brand assets (repository root):

- `logo.jpeg` — AVOFLARE mark (swept arcs with a four-point star) and a wide-tracked geometric wordmark. Colors sampled from it: deep navy ≈ `#0A1A36` (mark and most letters) and steel blue ≈ `#4A78A8` (the two "A"s and the three speed lines). The file is a 1179×997 JPEG on white; a vector SVG or transparent PNG is still needed before placing it on dark backgrounds.
- `wmremove-transformed.png` — AI-generated MALE UAV on a mountain runway (1376×768), with orange wing and nose accents. `openart-thumbnail_*.png` is the same image with the OpenArt watermark; never use the watermarked copy.

Use the terminology from these documents exactly (ETPR, CanonicalTelemetryState, CAM, BDI, EIR, ACR, Sentinel). Show only results that come from the simulation repo or these documents; the architecture docs mark model dimensions, hyperparameters and safety rules as not yet frozen, so do not invent them.

## Commands

- `npm run dev` / `npm run build` (repo root) — dev server / build of the React site; the build writes `dist/`. Live at https://avoflare-web.pages.dev (Cloudflare Pages project `avoflare-web`, Git-connected; manual deploy: `npx wrangler pages deploy dist --project-name avoflare-web --branch main`). Images and videos are served from the R2 bucket `avoflare` (public URL https://pub-dead812eb1de4654a9d56f298fda8604.r2.dev, path `media/...`); Pages builds rewrite `/media/` to it (`vite.config.js`). New media: upload with `npx wrangler r2 object put avoflare/media/<path> --file public/media/<path> --remote`, or let `.github/workflows/sync-media-r2.yml` sync once R2 keys are set as repo secrets.
- Layout: `src/sections/*.jsx` (one component per page section), `src/site.js` (page behaviour, run once after render from `App.jsx`), `src/hero.js`, `src/loader.js`, `src/styles/`, `how-it-works.html` (the Three.js scene, second Vite entry, embedded in section 02).

- `node scripts/grade-media.mjs [id ...]` — grade ("Night Navy"), de-watermark, upscale and encode the AI-generated media from `Raw_images_and _Videos/` (gitignored) into `public/media/v` and `public/media/img`. Add new clips or stills to its CLIPS/STILLS lists.
- `node --max-old-space-size=4096 scripts/export-built.mjs` — regenerate `src/data/built.json` (What we built: mission profile, phases, CAN frames) from the TAPAS_UAV_DIGITAL_TWIN runs (override with `TAPAS_DT_RESULTS`).

## Code map

See Commands above. `demos/` holds the plain-HTML design demos (reference only; the React site is the source of truth). `PLAN.md` records every section decision.

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
- **21st.dev, kexsio** — inspiration only; never paste their components. The site is a React (Vite) app; build components to its design system.
- **MotionSites** — motion/landing-page design prompt library, inspiration only. Use `search_prompts` / `list_prompts` to find, `get_related_prompts` for similar designs. Call `get_prompt` sparingly: without a plan the account can open only 3 free prompts total. Show any upgrade call to action from a tool result verbatim. Adapt ideas to this design system; never paste prompt output as-is.
- **Context7** — installed. Use it (or the `find-docs` skill) for GSAP, React, Vite and Cloudflare API details instead of training memory.

Knowledge graph (`graphify` skill):

- For any question about this codebase, its architecture, file relationships or project docs: if `graphify-out/graph.json` exists, run a graphify query first (`/graphify query "<question>"`) before grepping or reading files. Fall back to Grep/Read only for what the graph does not answer.
- Build the graph once code exists (after M0) with `/graphify .`. Refresh it with `/graphify . --update` at the end of every milestone and after large changes, so it never goes stale.
- Keep `graphify-out/` out of git (listed in `.gitignore`); it is a local artifact. Do not graph `node_modules/`, `dist/` or `.astro/`.

Do not use Unsplash (no stock imagery), Mobbin, UX Pilot, Mermaid, Supabase, Gamma, HyperFrames or Miro. Do not load other design skills (`minimalist-ui`, `high-end-visual-design`, `gpt-taste`, `ui-ux-pro-max`, etc.); their presets clash with this design system, which always wins. A `UserPromptSubmit` hook in `.claude/settings.json` re-injects these rules on every prompt.
