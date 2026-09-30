# AVOFLARE Website Plan

Status: sitemap approved 2026-09-25; stack, showpieces, design direction and the Home Mission Film decided 2026-09-26. User said start on 2026-09-26. Built the same day: all 10 pages + 404, Mission Film, 3D engine twin, replay dashboard, link-loss switch, role switch, data export script. Not done: Cloudflare deploy (no account/MCP yet), team details, MATLAB dashboard screenshots, PDF downloads of the docs.

> Direction chosen (2026-09-28): Sky Atlas · Altitude Column v2 (`demos/altitude-column.html`) is the reference design for the React rebuild. Waiting for the user's decisions on animations, motion graphics, 3D, landing videos, colour, backgrounds, transparency, behaviours, buttons, UI template and icons before any build work.
>
> Home structure (2026-09-29, hybrid): Home is one long landing page with one section per main page, in page order, each linking to its full page: hero → 1 Problem → 2 How it works → 3 What we built → then the remaining sections (Digital twin, What's new, Fault response, Demo, Validation, Roadmap, Resources; order and merges still open, see "Section 3 · What we built") → footer. No Features page or section (user decision 2026-09-29). Built page by page as demos in `demos/home.html`: loader, hero, and section 1 (Problem: A–F coverage rows on a glass sheet over an ocean-blue wash of the runway image, `public/media/img/runway-wash-*.webp`) are done. Section 2 (How it works) is built as a compact 16:9 video player on Home that embeds `demos/how-it-works.html?embed` (a 40 s interactive Three.js sequence on the shared wireframe model `demos/kit/tapas-model.js`: fault signal, on-board AI, link lost and restored, ground station, engineer decision; AI shown only as plain stages, no internal module names). The section pins: the live scene holds while the flowchart waits as a small live "Next · 02" card (on its mountain-runway background) in the scene's right column, with a scroll-progress line; scrolling slides the scene left and grows that card to full screen (corners flatten; clicking the card glides there). Scrolling back mirrors it: on the flowchart the scene waits as a "Previous · 01" card in the left column (the scene lies to the left of the flowchart); scrolling up slides the flowchart right and grows the scene from that card. The direction is chosen at rest on either screen, so reversing mid-way just rewinds. Then one compact SVG flowchart (Before | During | After columns, a ground-link lane solid/dotted for connected/lost, an aircraft main line) is played by a single scroll-driven beam that lights each node and draws its branches. References: Vercel Fluid Compute diagrams (thin lines, mono labels, solid vs dotted), the animated-beam component pattern, scrollytelling practice. Phones get the diagram in a horizontal scroller, fully drawn. The older Runway/Climb/Fault/Deck/Base sections are placeholders to be folded into sections 2–5.
>
> Redesign built (2026-09-28) per `SITE_PLAN.md` with its recommended options: Archivo caps + italic cadence, dark cinematic heads with light reading sections, 3D engine removed from the site, chapter-style mission film, no sound, ffmpeg upscaling, stills for missing clips. It supersedes the design direction below. Still open: remaining AI clips (R3, F2–F7), team details, MATLAB screenshots, deploy.

## Section 3 · What we built (approved and built in `demos/home.html`, 2026-09-29)

Purpose: the proof section. After How it works (the idea), a visitor or evaluator sees in about 20 seconds what exists and runs today. Each exhibit is tagged with the Problem Statement 26054 deliverable it covers and a status: Built, Partly or Designed. Home carries a short version; the full page `/built` has one chapter per exhibit.

Decisions (2026-09-29): no Features section. What's new and Fault response stay as later sections. Assumed until the user says otherwise: the planned Demo page merges into What we built (the GCS dashboard already has Mission Replay), and Digital twin folds into it too (the dashboard's Engine Digital Twin view). No screen recording exists; screenshots only.

### Assets received (`Raw_images_and _Videos/`, gitignored)

- `Dashboard1 (1)–(4).png` (1920 px): the AVOFLARE GCS web dashboard. Four screens: Operator Dashboard (mission and engine overview, 3D engine digital twin), Live Mission (flight display, gauges, temperature-deviation alert), Engine Live Monitor (3D engine, health index, components needing attention), Mission Planner (mission cards with predicted risk, waypoint map). This is the "data website"; there is no public link.
- `Matlab_dashboard.jpeg`, `Matlab_dashboard1.jpeg`: the early MATLAB App ("TAPAS UAV Digital Twin, Engine & Propulsion"): mission control, aircraft status, engine monitoring, fault monitoring, system status, an RPM/EGT trend plot.

### Exhibits

| # | Exhibit | What the visitor sees | Deliverable covered | Status and label |
|---|---|---|---|---|
| 1 | AVOFLARE GCS dashboard (lead exhibit) | The four screens in a browser frame, switchable | Visualization dashboard; Functional prototype/software demonstrator | Built · "interface prototype, demo data" |
| 2 | MATLAB engine and mission simulation | The 2-hour surveillance mission redrawn as a web chart (altitude, airspeed, phases, wind/rain) | Engine simulation model; Demonstration using simulated datasets | Built · "simulated" |
| 3 | MATLAB app | The two app screenshots, smaller, as the first prototype | Visualization dashboard | Built · "early prototype" |
| 4 | CAN telemetry | Frame ticker from real run frames: 6 message IDs, 8-byte frames | Functional prototype | Built · "software CAN, not hardware" |
| 5 | Fault injection runs | Timeline of the 7 injected faults, 12-minute windows, warning/critical logic in words | Demonstration using simulated datasets | Built · "simulated" |
| 6 | Not built yet | One line: AI anomaly detection and remaining-life estimate are designed, not yet running | AI/ML anomaly detection module | Designed |

Numbers in our own copy: only mission profile, CAN facts, fault list and sample counts (see `REPO_AUDIT.md` §5b). The dashboard screenshots show demo values (health 95.5 %, RUL 255 h, 5,148 rpm, EGT 728 °C); they stay only inside the screenshots under the "demo data" label and are never repeated in site copy.

### Screenshot handling

- Encode to `public/media/built/*.webp` at 1920 and 960 px. No colour grading: they are evidence.
- Crop the browser chrome and the scrollbar. Hide the operator name "Capt. Arjun Menon" (replace with "GCS Operator") unless the user confirms it is a fictional persona. Hide "Sentinel v4.1" (internal module name, per `hide-ai-internals`).
- MATLAB app screenshots: keep as they are (typos included, since they are real evidence); show them smaller and clearly marked as the first prototype.

Layout revised 2026-09-29 after review: dashboard screens now show whole (no cropping) as a deck of windows peeking out above the front one; the mission chart is redrawn at its real pixel size (no stretched text, rain dropped); MATLAB app pane has a copy column; CAN pane has a 6-ID grid and one big number; the fault timeline fills the pane with numbered columns; status labels sit in a reserved strip so nothing overlaps; phones use a stacked fault list and per-pane stage heights. Second review 2026-09-29 (controls were too far from the content): the five-tab bar now sits directly above the stage and sticks under the header while the section is on screen; the stage height fits the viewport (100svh minus header and bar), so tabs and content are visible together even in a 686 px-tall window. Tabs: dot, number and short name; Home/End keys; GCS auto-rotation pauses on hover or focus; the screen switcher is a button group (aria-pressed), not a second tablist; small text darkened for contrast; static fallback numbers if the data file fails to load. Motion and design pass 2026-09-29: a white pill slides between tabs; exhibits slide in from the side you are moving towards and their contents settle one after another; the stage glow changes hue per exhibit (green built, blue simulated, amber prototype, red faults); the dashboard has a one-line caption per screen; the mission chart has a read-out cursor (hover, touch or arrow keys) that flies the mission once when it first draws; CAN message types are buttons that isolate their frames in the log and the frame total counts up; the fault timeline has a playhead that runs the two hours (hover to scrub) and highlights the active fault; the MATLAB inset floats gently. Reduced motion turns all of it off. Clean-up pass 2026-09-29: the tick rail is hidden below 1360 px so it no longer touches the content column; the tab bar is opaque and follows the header (drops to the top edge when the header hides); the playhead label stays inside the pane; fault cards are white with a red or green top edge instead of pink gradients; the CAN log uses brand navy; fault labels use a darker red for contrast; tab meta is upper-case like the other mono labels; chart text is 11 px; figures use tabular numerals. Entrance pass 2026-09-29: the four dashboard windows start as one stack and fan out to their places the first time the stage is seen; the mission numbers count up when the Simulation tab opens; the status dots breathe (off with reduced motion). Creative pass 2026-09-29: numbered pins on each dashboard screen, with one label shown at a time (hover a pin to read it); the MATLAB pane became a then-and-now slider (drag between the first MATLAB app and today's GCS dashboard; it sweeps once on first view); a small aircraft rides the mission-chart cursor, tilting with the climb, and the flight phase under it lights up. The not-built line and the built/designed tally were removed at the user's request. Deferred to the main-site port (user decision 2026-09-30): phone (390 px), tablet (768 px) and reduced-motion checks of the pins, the then-and-now slider, the chart aircraft and the sticky tab bar. Built as planned, except: no scroll tilt on the stage (dropped: scaling the whole stage broke image rendering in testing), and no "Open what we built" link until the `/built` page exists. Data: `scripts/export-built.mjs` writes `src/data/built.json` (mission profile every 30 s, phases, 48 CAN frames, frame total). Screenshots: `public/media/built/`.

### Layout and behaviour (decided: tabs, no second pin)

- The section scrolls normally, without pinning. How it works is already long and pinned, so a second pin in a row would feel heavy, and screenshots are for looking at your own pace.
- Heading "What we built, *and what runs today.*" plus one line.
- Stage: exhibit 1 is open by default. The GCS dashboard sits in a large glass browser frame, with its four screens fanned slightly behind like a stack. A small screen switcher (Operator · Live mission · Engine · Planner) shuffles the stack: the chosen screen glides to the front.
- Exhibit rail under the stage: the 5 exhibits with number, name and status chip. Click, arrow keys or swipe change the stage with a cross-fade and a small lift. The stage frame tilts a few degrees with scroll for depth.
- Ledger line: "5 built · 1 designed" and "Open what we built →".
- Phones: stage full width, rail becomes a horizontal scroller, no tilt.
- Reduced motion: no tilt or stack animation; plain swaps.

### Full page `/built`

One chapter per exhibit: what it is, screenshots or chart, what it proves, its limits, links (GitHub repos). Then a run table (V46–V58.1: name, what it tested, status) and a "What is not built yet" block.

### Open questions

1. Confirm: Demo and Digital twin merge into What we built?
2. Is "Capt. Arjun Menon" a fictional persona (keep) or a real person (hide)?
3. The dashboard's 3D engine is labelled a boxer ("AF-B4 Boxer"), while the project engine is the AE300 inline-four diesel. Keep the screenshots as they are with the "demo" label, or ask the team for an updated model first?

## Section 4 · What's new (approved and built in `demos/home.html`, 2026-09-30)

Purpose: show what is new about AVOFLARE against the innovation areas in Problem Statement 26054, without repeating How it works (the lost-link story is left out). Every idea carries a status tag; nothing is presented as a result.

Decisions: new layout (not tabs); the "keeps working with no link" idea is dropped because How it works covers it; secure telemetry and shared learning are shown, tagged PLANNED.

### Layout: sticky-graphic scrollytelling (The Pudding's "sticky graphic + steps" pattern)
- Left column: short text steps that scroll normally. Right: one sticky instrument panel that changes as each step reaches the middle of the screen. Scrolling back reverses it.
- Different from What we built (tabs) and How it works (horizontal pin); no pinning of the whole section.
- Phones: each step shows its own visual above its text; no sticky panel.

### Steps (one visual each, drawn in SVG, labelled "illustrative")
1. **Physics and data check each other** (physics-informed AI, hybrid models) · DESIGNED. A physics prediction line and a measured line run together; the measured line drifts, the gap between them fills, and a flag appears when the gap leaves the allowed band.
2. **Every alert explains itself** (explainable AI) · DESIGNED. An alert card opens into its "because" list: which reading moved, how far from the twin, how many sensors agree, and a confidence bar.
3. **The engineer decides** (autonomous maintenance advisory, human authority) · DESIGNED. A recommendation with Approve and Defer buttons that the visitor can press; the panel shows that nothing is actioned without the engineer.
4. **Coming next** · PLANNED. Two smaller cards side by side: secure telemetry (a packet that is signed and checked on arrival) and shared learning (several aircraft improve one model without sending their raw data).

Copy: plain words, no internal module names. Numbers in the visuals are illustrative and say so.

Built as planned: section id `whatsnew` (menu, ticks and header label now point here; the old `#deck` placeholder is unlinked). A rail of four dots under the panel jumps to each step. Panel visuals replay each time their step returns. Phone and reduced-motion checks are deferred to the main-site port.

## Section 5 · Demo (approved and built in `demos/home.html`, 2026-09-30)

Purpose: one place where a visitor or evaluator watches the whole system run end to end. The real demo video does not exist yet, so the section ships with a placeholder video that is clearly marked as a placeholder and can be swapped in one line later.

### Placeholder video
- No stock or third-party footage. Build a ~48 s placeholder reel from the site's own graded clips (`public/media/v/`): runway (9 s) → takeoff (5 s) → cruise (7 s) → clouds (9 s) → ground station (9 s) → night landing (9 s), joined with short cross-fades by ffmpeg into `public/media/v/demo-placeholder.mp4` (+ 720p version and a poster). No sound.
- A permanent tag on the player: "PLACEHOLDER · the recorded demo replaces this video". Chapter titles describe what the real demo will show, not what the placeholder shows.
- Swap later: the player reads one object `{ src, poster, chapters, captions }`; replacing the file and the chapter times is the whole job.

### Player (custom, not the browser's default controls)
- A large 16:9 cinema frame, centred, with a poster and one big play button.
- Chapter list beside the video (below it on phones): 01 Mission set-up · 02 Take-off and live telemetry · 03 A fault begins · 04 The link drops, the aircraft keeps deciding · 05 The ground station explains it · 06 The engineer decides. Clicking a chapter jumps there; the current chapter lights up while playing.
- Custom control bar: play/pause, a progress bar with chapter ticks and hover preview of the chapter name, time, mute toggle (for the real video), fullscreen, captions toggle (a WebVTT file ready for the real voice-over).
- Keyboard: Space/K play-pause, arrow keys ±5 s, F fullscreen, M mute. Plays inline, never autoplays with sound.

### Motion and ambience
- "Lights down": pressing play dims the page around the section and lifts the frame slightly, like a cinema; pausing brings the lights back. Scrolling away pauses the video.
- The chapter list reveals one line at a time when the section enters; the progress bar fills smoothly; chapter changes slide the highlight.
- Reduced motion: no dimming animation or lift; the video still plays when asked.

### Copy (short)
- Eyebrow "05 · DEMO", heading "Watch it *fly.*", one line: "The full loop, from mission set-up to the engineer's decision." Plus the placeholder tag.

### Order on Home
- hero → 01 Problem → 02 How it works → 03 What we built → 04 What's new → **05 Demo** → 06 Fault response → 07 Validation → 08 Roadmap → 09 Resources. Menu, ticks and header label renumbered to match.

### Built
- Placeholder: `public/media/v/demo-placeholder.mp4` (1080p, 8 MB), `-720.mp4` (phones) and `.webp` poster; 46 s, six clips with 0.6 s cross-fades. Chapter starts: 0, 8.65, 13.3, 19.45, 28.05, 36.7 s (the clip joins).
- To use the real demo: replace the file (or change `DEMO.src` in the Demo script) and set each chapter button's `data-t` to its start time.
- Captions button left out until a caption file exists. The local Python server does not let the browser seek video; seeking works on Cloudflare Pages (tested here with an in-memory copy).
- Nav renumbered: 05 Demo, 06 Fault response, 07 Validation, 08 Roadmap, 09 Resources.

### Open questions (answered "go": recommendations taken)
1. Placeholder: the stitched reel of our own clips (recommended), or one single clip on loop?
2. Are the six chapter names right for the demo you plan to record?
3. Keep Demo at 05 and move Fault response to 06?

## Section 8 · Roadmap (built in `demos/home.html`, 2026-09-30; design left to Claude)

Source check: the PPT has no roadmap slide (slide 6 only lists a "Roadmap" link). Content comes from the problem statement (deployment roadmap; defence-grade GCS, engine test rigs, fleet monitoring), PPT slides 2, 4 and 6, and `REPO_AUDIT.md`. Placed right after Demo, numbered 08; phase 2 set to In progress (user, 2026-09-30).

Design: a climb profile. Altitude stands for maturity: ground roll (Prototype), climb (Edge and AI), step climb (Test rig and ground station), cruise (Fleet). The flown part is a solid navy line with a soft fill; the rest is dashed. A small aircraft marks "WE ARE HERE" half way through phase 2. Four cards sit under their stretch of the profile (phase number, status chip, one-line intent, items). Status wording follows the now/next/later roadmap convention, with no dates.
- Phases and items: Prototype · Completed (simulation, fault injection runs, software CAN, dashboard on demo data, first MATLAB app); Edge and AI · In progress (Raspberry Pi 5 + CAN, physics-vs-measured check, explained alerts, remaining-life estimate, dashboard on live simulated data); Test rig and ground station · Next (test rig with real ECU/FADEC and CAN, twin checked against real engine data, defence-grade GCS, secure telemetry); Fleet · Later (fleet dashboard, shared learning without raw data, twin adaptable to other engines, MRO integration). Footer: "The twin keeps learning: every flight improves the models and adds to the knowledge base."
- Motion: on first view the line draws from the left while the aircraft flies it and parks with a pulse and the "WE ARE HERE" label; the future stretch fades in dashed; cards rise one after another and their items stagger in. Hover or focus a card to light its stretch of the profile and its node. Reduced motion shows the final state.

## Section 9 · Why AVOFLARE (built in `demos/home.html`, 2026-09-30)

Purpose: the persuasion section. Convince an evaluator, a defence programme and a maintenance organisation why AVOFLARE should be adopted. Built as five short beats that move from the stakes to the ask.

Sources (all from the team's own PPT, plus verification before build):
- PPT slide 4 "Supporting facts": 51 % of in-flight failures in a piston-engine UAV came from the powerplant, MTBF 28.6 h (MDPI Drones, 2018); predictive maintenance cuts maintenance cost 10-40 % and downtime up to 50 % (McKinsey); NASA C-MAPSS is the standard engine-RUL benchmark (Saxena et al., 2008); market: DRDO sharing TAPAS/MALE UAV technology with industry ahead of a Rs 25,000 crore tri-services MALE UAV tender.
- PPT slide 4 "Challenges -> Overcome" and "Implementation viability"; slide 5 "Benefits" per role and "Impacts"; slide 6 "Comparison with existing".
- Rule: every outside number is re-checked against its original source (Firecrawl) before it goes on the page, shown with a source chip and a link, and labelled "industry research", never as an AVOFLARE result. The slide 5 bar chart (22 % -> 6 %, 65 % -> 92 %, 18 h -> 7 h, 120 -> 30 min) is "synthesized" and stays off the site.

### The five beats
1. **The stakes.** Big animated figures: "51 %" of in-flight failures came from the engine; "28.6 h" mean time between failures (source chip: MDPI Drones, 2018). Graphic: one horizontal bar that fills to 51 % in fault red; the rest stays grey, unlabelled.
2. **The cost of finding out late.** An illustrative timeline: a threshold alarm fires at the moment of failure; AVOFLARE's trend warning fires earlier; the gap between them lights up as "lead time to act". Drawn as you scroll past it. Beside it: "Predictive maintenance cuts cost 10-40 % and downtime up to 50 %" (source chip: McKinsey, industry research).
3. **Why it fits defence.** Six reason tiles, each with a small icon that animates on hover: keeps working when the link drops; every alert explains itself; the engineer keeps final authority; secure telemetry (planned); plugs into the existing GCS, ECU/FADEC and CAN, so low switching cost; built in India (Atmanirbhar Bharat). Status chips where the item is designed or planned.
4. **Who gains.** A role switcher: Maintenance technician, Propulsion engineer, UAV operator, Mission planner, Fleet manager, MRO and OEMs. Pick a role, a card flips to what that person gets (wording from slide 5, cleaned up; "edge RL agent acts in milliseconds" softened to "on-board AI keeps watching the engine").
5. **Why now.** One line on the MALE UAV programme and the tri-services tender (source chip), then the close: heading "The engine should warn you *before it fails.*" and two buttons: "Watch the demo" (to 05 Demo) and "See the roadmap" (to 08 Roadmap).

Optional (ask first, since the What's new comparison lines were undone): the slide 6 "Comparison with existing" table as a two-column flip list (threshold-based vs AVOFLARE) inside beat 2.

### Look and motion
- Light pages as elsewhere, with one deep-navy band for beat 1 only (the stakes), so the figures hit hard; no neon.
- Figures count up once when seen; the 51 % bar fills with them. Beat 2's timeline is scroll-linked and reversible. Tiles rise in a stagger; the role card flips (3D rotate) with the role chips as a sliding segmented control. The closing heading reveals word by word.
- Reduced motion: final states, no flips.
- Phones: one column; the timeline stays horizontal and scales down.

### Built (defaults taken: after Roadmap as 09, Resources becomes 10; no comparison table; verified figures with source links)
- Figures verified 2026-09-30 against the originals:
  - 51 % / 28.6 h: Piancastelli, "Powerplant Reliability Issues and Wear Monitoring in Aircraft Piston Engines. Part II", Drones 2018, 2(1):10, doi 10.3390/drones2010010: "The UAV showed a MTBF of 28.6 h, with 51 % of the failure due to the powerplant" (one popular piston-engine UAV, citing ref. 8). Site wording says "one widely used piston-engine UAV", not UAVs in general.
  - The PPT's "McKinsey 10-40 % cost, 50 % downtime" could not be found in a McKinsey primary source (only in third-party blogs). The McKinsey article "Establishing the right analytics-based maintenance strategy" (2021) states an 18-25 % reduction in maintenance costs for one analytics-driven programme; the site uses that figure instead. Tell the team to update the PPT.
  - Tender: Raksha Anirveda, 6 May 2026: DRDO transferring TAPAS (TAPAS-BH-201, formerly Rustom-II) technologies to private industry ahead of a tender for 87 MALE drones, estimated at over Rs 25,000 crore.
- Beats as planned; the stakes band is the only dark block. Timeline is scroll-linked; role card flips with the Web Animations API; closing line reveals word by word.

### Questions (answered)
1. Placement: after 08 Roadmap as 09 "Why AVOFLARE" (Resources becomes 10), or somewhere else (for example right after 01 Problem)?
2. Include the slide 6 comparison table (threshold-based vs AVOFLARE), or leave comparisons out?
3. OK to show the outside research figures (MDPI, McKinsey, tender) with source chips after I verify them?

## Final structure (2026-09-30, user: "wind up the website")

Home demo is complete: hero -> 01 The problem -> 02 How it works -> 03 What we built -> 04 What's new -> 05 Demo -> 06 Roadmap -> 07 Why AVOFLARE -> closing band and footer. Fault response, Validation and Resources are dropped; the old placeholder sections (runway, climb, fault, deck, base, evidence, landing) and their scripts are removed. Menu, tick rail and header label list the seven sections; Roadmap and Why were renumbered 06 and 07. The sky tint still follows the simulated mission, now keyed to the seven real sections (`section[data-t]`).

Closing: a full-bleed night-runway image with a slow scroll push-in, the line "Intelligence in every flight." revealed word by word, "Watch the demo" and "Back to the start", and a large outlined AVOFLARE wordmark rising behind; then a navy footer with the logo, a one-line description, Explore (seven sections), Project (SIH 2026, PS 26054, theme, team ID 164112), Code (the two GitHub repositories) and the honesty note.

## React site (2026-09-30)

User decision: the real website is React only (no Astro). Built in `site/` with Vite 8 + React 19 as a faithful port of the approved Home demo: the markup was converted section by section into components in `site/src/sections/`, the page behaviour (Lenis, GSAP hero, header and menu, How it works pin, What we built, What's new, Demo player, Roadmap, Why AVOFLARE, closing band) runs once from `site/src/site.js`, and the Three.js scene is `site/how-it-works.html`. Next: refine per section in React (move each section's behaviour into its own component), then the checks deferred from the demos (phones, tablet, reduced motion), then deploy.

## Section 6 · Security (built in the React site, `site/src/sections/Security.jsx` + `styles/security.css`, 2026-09-30)

Source: `security_plan.zip` (repo root; unpacked to `E:\Avoflare_web_Matlab\security_plan\docs`): ARCHITECTURE_OVERVIEW.md (seven-layer architecture, ARINC 653 partitions, "AI never gets command authority"), TSEB_AND_TSE_ENGINE.md (typed evidence bus, trust state machine TRUSTED / DEGRADED / RESTRICTED / SAFE_STATE, flight-dynamics twin as a spoofing check), BUS_PROTECTION_PROTOCOLS.md (MIL-STD-1553B HMAC tags, CAN-FD SecOC with 64-bit CMAC, ARINC 429 plausibility gate), CRYPTO_SECURITY_SPEC.md (AES-256-GCM-SIV, hybrid X25519 + ML-KEM-768 key exchange, Ed25519 + ML-DSA-44 dual-signed firmware, TPM 2.0 measured boot, eMRAM nonce counter). All of it is a design specification: tagged DESIGNED, no claims of certification or test results.

Placement: new section 06 "Security", between 05 Demo and Roadmap (Roadmap becomes 07, Why AVOFLARE 08). The Why tile "Secure telemetry" and the Roadmap item "Secure telemetry" link to it.

Heading: "Trusted *when it counts.*" Line: "Built so that a spoofed sensor, a replayed command or tampered firmware cannot take the aircraft with it."

Three parts (new patterns, not used elsewhere on the page):
1. Defence in depth: an isometric stack of seven glass plates (1 Hardware root of trust, 2 Sensor health, 3 Edge AI and physics twin, 4 Secure radio link, 5 Evidence bus and trust engine, 6 Command check, 7 Flight safety). Scroll-linked: the plates start apart (exploded) and settle into one stack; the plate nearest the reading line lifts and glows, with its one-line role on a leader line. Click a plate for its detail and standard chips. Phones: flat list. Reduced motion: assembled, static.
2. The trust engine, live: an interactive simulator built on the spec's state-machine rules. Four evidence lights (Platform, Sensors, Physics twin, Radio link), a residual meter (metres between sensed and predicted altitude) and a four-stop state track TRUSTED -> DEGRADED -> RESTRICTED -> SAFE STATE with a sliding marker. Scenario buttons: GPS spoofing (residual climbs past 15 m -> degraded, past 50 m -> restricted), Replayed command (restricted), Tampered firmware (safe state), Reset. The aircraft's response is written out per state (continue / alert the pilot / hold and loiter / return to base). Plays GPS spoofing once on first view. Labelled "Illustrative, from the design specification".
3. Sealed at every hop: three small looping diagrams: an engine CAN frame gains a freshness counter and a 64-bit tag; the aircraft and ground station agree a key with a hybrid post-quantum handshake; firmware boots only if both signatures check. Standard chips under each (AUTOSAR SecOC, AES-256-GCM-SIV, X25519 + ML-KEM-768, Ed25519 + ML-DSA-44, TPM 2.0). Closing line: "AI advises. It never flies: every command passes a fixed, fully tested check first."

Built as planned, React only (the plain-HTML demo is no longer updated; the React site is now the source of truth). Numbering: 06 Security, 07 Roadmap, 08 Why AVOFLARE, in the menu, ticks, header label and footer. The Why tile "Secure telemetry" and the Roadmap bullet link to #security. The simulator is React state, not the shared site.js; the stack opens above the active layer so its label is visible.

Things to confirm with the team (found while reading):
- Threshold conflict: the text says a twin residual over 15 m means RESTRICTED; the rule code says over 15 m DEGRADED and over 50 m RESTRICTED. Plan uses the code.
- Standards (DO-178C, DO-326A, ARINC 653) are design targets; the site says "designed to align with", never "certified".
- The spec calls the physics twin "un-spoofable" and names it JSBSim (a flight-dynamics model), which is a second twin next to the engine twin elsewhere on the site. Site wording: "hard to fool: it works from control commands and air pressure, not GPS".
- The AES-GCM-SIV key-derivation formulas in the crypto spec do not match RFC 8452; the site shows no formulas.

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
