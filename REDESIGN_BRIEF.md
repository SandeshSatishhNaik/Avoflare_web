# AVOFLARE redesign brief (draft for discussion)

Status: research and planning only, 2026-09-28. Nothing here is built. We finalise this together before any code changes.

## 1. Decisions already made by the user

- The first build was rejected as poor in assets, aesthetic and ambiance. The redesign has to feel premium and cinematic.
- **Remove the 3D engine from the landing page.** The landing page will be led by video and imagery. Whether the 3D engine stays on the Digital Twin page is still open (§7).
- References to chase: USAvionix, Riotters Aevion, Zirka and the Air Force animation (from the earlier study), plus Airfield La Caminera (new). §2 adds four more.
- The user will generate the images and videos (for example on OpenArt) from the prompts in §5, keeping one consistent look.
- Everything else from `PRODUCT.md` stays: only simulated or documented results, "simulated" and "designed" labels, evaluator-first structure.

## 2. Reference study

### 2.1 Airfield La Caminera (airfieldlacaminera.com), the main new reference

What it is: a luxury private airfield attached to a 5-star hotel in Spain. The site sells a *feeling of arrival*, not features.

Structure (top to bottom):
1. **Full-bleed hero video reel** with slow parallax (`reel5.mp4`, muted autoplay loop). A thin centred logo, a "Menu" button top-left and "Inquiry" top-right.
2. **Hero headline bottom-left**, large and light. It is a serif, and the second half of the sentence is in italic: "The luxury of landing in the heart of nature to reach a place *where time stands still…*". Two square CTAs sit under it (Pilot area / Passenger area).
3. **Bottom-right thumbnail slider**: four small frames with captions ("Freedom to fly, freedom to arrive."). Clicking a frame switches the hero video, and a progress line shows the active slide.
4. **Centred editorial intro** on a light ground, with lots of air, one paragraph and one CTA.
5. **Split 50/50 panels**: a full-bleed photo on one side, a dark earth-toned text panel on the other, alternating (Pilots / Passengers).
6. Gallery ("Images from the sky"), then events, then testimonials in a large dark block.
7. **Contact over a large landscape photo**, then a dark footer with the line-art logo.

Motion stack (read from their bundle):
- GSAP + ScrollTrigger for scroll reveals.
- SplitText for line-by-line headline reveals (`data-split`).
- Lenis smooth scroll.
- Swiper for the hero slider and gallery.
- `data-parallax` on the hero video.
- `data-button-animate-chars`: button labels roll letter by letter on hover.

Visual system:
- Fonts: Ivy Presto (display serif), Spectral (text serif), Forma DJR and Aktiv Grotesk Extended for small caps labels.
- Earthy browns (#7A6955, #403931) with near-black #1A1A1A.
- Square corners (radius 0) and thin 1px frames.

What we take:
- The calm, the huge photography and video, and the slow reveals.
- The hero with a video reel, a bottom-left headline and a bottom-right slider.
- Split panels, and letter-rolling buttons.
- The idea that the site sells a feeling (here: *trust in the engine*) before specifications.

What we leave:
- The earth-tone palette. We keep navy, steel and signal orange.
- Testimonials, events and rates. We have none, and inventing them is forbidden.

### 2.2 Joby Aviation (jobyaviation.com, Awwwards SOTD, agency TinyWins)
- The hero video sits in a **media card with a large rounded bottom edge**, inset from the page. It is a cinematic human point of view: a passenger looks out of the cabin window at a city at dusk.
- One short, huge centred headline ("Skip traffic. Time to fly.") and one line under it.
- A small floating promo card top-right leads to the latest news.
- Take: the human point of view (an engineer or operator looking at the aircraft), and the headline brevity.

### 2.3 Heimdall Power (heimdallpower.com, Awwwards SOTD)
- A sensor company, which makes it the closest in *subject*: sensors on infrastructure, drones and data.
- **Highlight-sweep text reveal**: an orange block slides across a headline and leaves the words behind.
- Mono dates in the news list, and a technical line drawing of a pylon.
- A 3D sensor you drag to rotate. In the social showcase of the site, a 3D drone follows the scroll and drops sensors onto the grid.
- Stats laid out as ruled rows, not cards.
- Take: the highlight sweep in signal orange for key claims, line-art technical drawings, and ruled stat rows.

### 2.4 Prince Aviation (princeaviation.com, Awwwards HM)
- A full-bleed aircraft video with **thin vertical grid lines over it**. The page grid is visible and makes the page feel like a flight instrument.
- The headline types in letter by letter.
- A **bottom tab strip** (Air transport / Maintenance / Training) with a progress bar switches the hero.
- Take: the visible grid lines over the video, and the tab strip as our "mission chapters".

### 2.5 From the earlier study (see `REFERENCE_STUDY.md`)
- **USAvionix:** one incident told as a scroll story (detect → classify → respond → secured).
- **Riotters Aevion:** scroll steps change what a fixed visual shows, plus LiDAR-scan effects.
- **Zirka:** instrument dials with rolling numbers, and colour used only for state.
- **Air Force animation:** a role strip that switches the panel, and bold motion with atmosphere.
- Avoid their 15–35 s loaders. Evaluators must see content within 3 s.

## 3. Proposed direction: "Night flight, told like a film"

One sentence: **La Caminera's calm, editorial luxury, carried out in the navy-and-signal-orange world of a ground station at night, with the precision of defence-tech HUDs only where data appears.**

- **Ambiance:** blue hour and night.
  - Mist over Himalayan terrain, runway lights, the warm glow of an engine, cold ground-station screens.
  - Photography and video do the heavy lifting; UI chrome stays thin (1px lines, square corners, visible grid lines as in Prince Aviation).
- **Palette:**
  - Base colours stay: navy #0A1A36, deep #050D1C, steel #4A78A8 and #6FA0DA, ice #EEF2F5.
  - Signal orange #F2562B for fault and highlight sweeps; amber #E9C24A for watch.
  - A warm engine-glow orange appears only in imagery, echoing the UAV's orange accents.
- **Typography: to decide (§7).**
  - A. Keep Archivo Expanded and add its italic for the second half of headlines. This is La Caminera's move, done within one family.
  - B. Add an editorial display serif for headlines only, as La Caminera does.
  - My recommendation is A. It keeps the engineering voice, stays within one family (which our design rules prefer), and still gets the italic cadence.
- **Motion system:** one authored motion language, used everywhere.
  - Lenis smooth scroll.
  - SplitText line reveals on headlines.
  - Clip-path "shutter" reveals on images and video (they wipe open like an aperture).
  - Slow parallax on hero media.
  - The orange highlight sweep, used only on the key claim of each section.
  - Letter-roll on buttons.
  - Rolling instrument numbers only where there is real data.
  - All of it has a reduced-motion fallback.

## 4. Proposed landing page (draft)

1. **Hero reel.** Full-bleed video with parallax and visible grid lines.
   - The headline sits bottom-left: "Engine health that *survives a lost link.*"
   - Two CTAs sit under it.
   - A bottom-right slider holds 4 clips (Take-off / Above the clouds / The engine / The ground station), each with a caption and a progress line.
   - A small "simulated data · AI-generated imagery" note stays.
2. **Editorial statement.** Centred, lots of air: what AVOFLARE is, in two sentences. One highlight sweep on "keeps working when the link is lost".
3. **Mission film, reimagined.** Chapters become full-screen video or image scenes with the same scroll story (engine → CAN → edge → link loss → base → engineer). A thin HUD layer carries the real simulated values (EGT divergence, CAN bytes). No 3D model.
4. **Split panels, La Caminera style:**
   - "On the aircraft": the edge chain, over an image of the engine bay.
   - "On the ground": GCS AI, over an image of the ground station.
   - "The engineer decides": a human-authority image and the tech-log entry.
5. **Evidence strip.** Ruled stat rows, not cards: 52 fault types, 10 mission profiles, 17 CAN IDs, a 2-hour run. Each links to its proof.
6. **What runs today vs what is designed.** The honesty table, restyled as ruled rows.
7. **Gallery "From the runway to the ground station".** A horizontal drag gallery of the generated imagery, labelled as illustrations.
8. **Closing CTA over a large image:** "Open the replay" and "See requirement coverage". Then a dark footer with the line-art logo.

The inner pages get the same system: a page-head with a video or image band, split panels, ruled rows, and the same motion vocabulary.

## 5. Asset prompt pack (for the user to generate)

### 5.1 Style bible (paste at the end of every prompt)

> cinematic still, shot on ARRI Alexa 35 with a 35mm lens, blue-hour and night palette of deep navy and steel blue, with a single warm signal-orange accent, soft volumetric haze, subtle anamorphic lens flare, fine film grain, photorealistic, high dynamic range, calm and premium, no text, no logos, no watermark, no UI overlay

Negative prompt (where the tool supports it):

> text, letters, watermark, logo, signature, cartoon, illustration, CGI look, oversaturated, lens dirt, fisheye, extra propellers, distorted wings, broken geometry, people looking at camera, military markings, weapons, missiles

The aircraft (keep identical in every prompt, to match `wmremove-transformed.png`):

> a white-grey MALE (medium-altitude long-endurance) reconnaissance UAV with long slender high-aspect-ratio wings, a single piston engine driving a front propeller, fixed landing gear, orange accent stripes on the wing tips and nose, no weapons

Workflow for consistency:
1. Generate each **still** first, at 16:9 (1920×1080 or larger).
2. Use the approved still as the first frame for **image-to-video**. Keep camera moves slow; 5–10 s clips; loopable where noted.
3. Deliver MP4 (H.264) plus the still as the poster.
4. Name files as in the table.

### 5.2 Landing hero reel (4 loops, 8–10 s each, 16:9)

| File | Still prompt | Motion prompt |
|---|---|---|
| `reel-01-takeoff` | [UAV] on a remote high-altitude mountain runway at blue hour, runway edge lights glowing, snow-capped Himalayan peaks behind in mist, low wide angle from the side of the runway, heat shimmer behind the engine | slow dolly forward alongside the runway as the UAV begins its take-off roll, propeller blur, mist drifting, subtle camera shake, seamless loop |
| `reel-02-above-clouds` | [UAV] cruising above a sea of clouds at dawn, sun just below the horizon, rim light on the wing edges, vast empty sky, aircraft small in the right third of the frame | slow tracking shot matching the aircraft's speed, clouds sliding underneath, gentle parallax, sunlight slowly brightening, seamless loop |
| `reel-03-engine` | extreme close-up of the aircraft's piston engine cowling and exhaust in flight at night, faint orange glow from the exhaust stack, cooling fins catching steel-blue light, condensation beads on the metal | very slow push-in, heat haze rippling over the exhaust, glow pulsing gently, tiny water droplets streaming back, seamless loop |
| `reel-04-ground-station` | dark ground control station at night, rows of monitors with soft blue telemetry glow reflecting on a desk, an engineer seen from behind in silhouette watching a large screen, window with distant runway lights | slow lateral slide behind the engineer, screen light flickering softly, faint steam from a coffee cup, seamless loop |

### 5.3 Mission film scenes (one per chapter, 6–8 s, 16:9)

| File | Still prompt | Motion prompt |
|---|---|---|
| `film-01-climb` | [UAV] climbing out of a misty valley at blue hour, mountain ridges layered in haze, aircraft centred and small | slow tilt up following the climb, mist layers parallaxing |
| `film-02-sensors` | macro of a thermocouple probe and wiring on a piston engine exhaust manifold, warm glow on metal, steel-blue background bokeh | slow rack focus from the probe to the harness, light glinting |
| `film-03-can` | macro of an aircraft wiring harness and connector inside an avionics bay, braided cables, tiny status LEDs in steel blue | light pulses travelling along the cables toward the camera, slow dolly |
| `film-04-edge` | a compact rugged edge computer module mounted in an aircraft avionics bay, matte dark aluminium housing, soft blue status light | slow orbit around the module, status light breathing |
| `film-05-link-loss` | [UAV] flying through dark storm clouds at night, lightning far away, aircraft lights blinking, a feeling of isolation | clouds rushing past, lightning flickering, aircraft steady and continuing |
| `film-06-downlink` | ground antenna dish on a mountain ridge at night pointing at the sky, stars, faint aurora-like haze in steel blue | slow push toward the dish, stars drifting, faint beam of haze |
| `film-07-engineer` | engineer's hands on a rugged tablet in a dimly lit hangar, tablet glow on the fingers, the UAV blurred in the background under work lights (no readable text on the screen) | slow push-in on the tablet, a finger hovering, then tapping |

### 5.4 Stills for split panels, gallery and inner pages (16:9 and 4:5 crops)

| File | Prompt |
|---|---|
| `still-hangar-night` | [UAV] parked in a clean hangar at night under cool work lights, reflective epoxy floor, engine cowling open, tool cart nearby |
| `still-engine-bay` | three-quarter view of an open engine bay of a small aircraft piston engine, turbocharger visible, warm and cool light mix |
| `still-runway-dawn` | empty high-altitude runway at dawn, centreline lights receding into mist, mountains, no aircraft |
| `still-terrain-aerial` | top-down aerial of a mountain valley with a river, early light, the tiny shadow of an aircraft on the ground |
| `still-gcs-wide` | wide shot of a modern ground control room, curved screens, blue glow, empty chairs, rain on the windows |
| `still-maintenance-hands` | gloved hands inspecting a turbocharger compressor wheel with a small flashlight, macro, shallow depth of field |
| `still-sky-telemetry` | long exposure of a night sky over mountains, star trails, a single aircraft light trail crossing the frame |
| `still-blueprint` | technical line drawing of a four-cylinder aircraft piston engine, white lines on deep navy, isometric view, blueprint style, clean |

### 5.5 Short UI loops (optional, 3–5 s, square or 4:5)

| File | Prompt |
|---|---|
| `loop-heat-shimmer` | abstract heat haze over dark metal with an orange glow, macro, seamless loop |
| `loop-data-light` | fibre-optic light pulses moving through dark cables in steel blue, seamless loop |
| `loop-clouds-pass` | clouds passing below at night, seen from above, moonlight, seamless loop |

Labelling rule: every generated asset is shown with "AI-generated illustration". Screenshots from the MATLAB dashboard, when supplied, are the only real result images.

## 6. Build notes (for later, not now)

- New dependencies to consider: `lenis`, plus GSAP SplitText (GSAP is already installed; SplitText ships with GSAP 3.13 and later). Confirm licensing and imports through Context7 before use.
- Video delivery:
  - H.264 MP4 at 1080p and a 720p mobile version, each ≤ 4 MB, with a WebP poster.
  - `preload="metadata"`, lazy for non-hero clips, `playsinline muted loop`.
  - Paused under `prefers-reduced-motion`.
- Remove `HeroEngine` from `index.astro`. The `@react-three/drei` and `@react-three/postprocessing` packages installed on 2026-09-28 can be removed if the 3D engine leaves the site.
- Content visible within 3 s. No full-screen loader.

## 7. Open questions for the finalisation session

1. Typography: A (Archivo, with italic cadence) or B (add an editorial serif)?
2. Light sections: La Caminera alternates dark hero and panels with light editorial sections. Do we alternate navy with ice sections, or stay fully dark?
3. Does the 3D engine stay anywhere (Digital Twin page), or leave the site entirely?
4. Hero headline: keep "Engine health that survives a lost link." or write a more atmospheric line?
5. Which image and video tool will you use? Clip length and resolution limits change the reel plan.
6. Gallery section: keep it (only AI illustrations until real photos exist) or drop it?
