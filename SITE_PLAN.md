# AVOFLARE full site plan (draft for discussion)

Status: planning only, 2026-09-28. Nothing here is built. It builds on `REDESIGN_BRIEF.md` (references and direction) and `PROMPTS.md` (asset prompts). We finalise it together, then build.

---

## 1. Audit of the assets you supplied (`Raw_images_and _Videos/`)

All the videos carry a small **✦ sparkle watermark** in the bottom-right corner (the video generator's mark). It must be removed, and the tested method removes it cleanly (§2). Every AI asset stays labelled "AI-generated illustration" on the site.

### Videos

| File | Shows | Specs | Verdict | Use |
|---|---|---|---|---|
| `Camera_slow_steady_dolly_for.mp4` | Twin-engine UAV on a wet runway at blue hour, Himalayan peaks, prop wash | 1280×720, 10 s, 24 fps | **Keep: best clip.** Pink sky needs taming. | **R1**, hero clip 1 |
| `Camera_slow_tracking_shot_tha.mp4` | UAV above clouds at sunset | 720p, 10 s | **Keep** | **R2**, hero clip 2 |
| `Camera_slow_lateral_slide_beh.mp4` | Engineer in silhouette, blue waveform screens, runway through the window | 720p, 10 s | **Keep.** Nothing on the screens is readable. | **R4**, hero clip 4, and the "Ground" panel |
| `UAV_taking_off_from_runway_20260928161158.mp4` | Take-off at dusk | 1920×1080, 10 s | **Reject.** The aircraft changes shape and flips direction between shots. | none |
| `…161424.mp4` and `…161441.mp4` | Same clip as above, at 720p | 720p, 10 s | **Reject.** The two files are byte-identical duplicates of the rejected clip. | none |
| zip: `UAV_taking_off_…161533_2.mp4` | Head-on take-off, the aircraft lifts toward the camera | 720p, 10 s | **Partial.** The first ~6 s are good. After that the engines show jet flames, which are wrong for a piston engine. | Trim to 0–6 s → **F1** (climb) or the "Take-off" chapter |
| `tapas_uav_cinematic_loop.mp4` | UAV above clouds, orange wings | 720p, 8 s, very low bitrate (0.34 Mb/s), ends on a black frame | **Backup only.** Soft and blocky, and the livery differs (whole wings orange). | Spare for R2 |

### Stills (all 1672×941, need upscaling)

| File | Shows | Use |
|---|---|---|
| `ChatGPT Image …04_21_19 PM.png` | UAV on the runway, blue hour, peaks | Poster for R1; "On the aircraft" panel |
| `sean_1_img.png` | Wide runway, night, lights receding | Section band; 404 page; closing CTA background |
| `UAV_Flying.png` | UAV above clouds, sunset | Poster for R2; gallery |
| `ChatGPT Image …05_44_10 PM.png` | Close-up of the engine nacelle (cowling open), moon, clouds | **R3 still.** Animate it to get the missing engine clip. |
| `Engine.png` | Engine close-up, other side, exhaust glow | Fault-response page; "sensors" chapter (F2 stand-in) |
| `Base.png` | Ground station at night, engineer silhouette | Poster for R4; "On the ground" panel |
| zip: `image.png…jpg` | News graphic of the real TAPAS (with text) | **Reference only. Never publish** (third-party, with text). It confirms the real TAPAS is twin-engine with an orange nose. |

### Consistency note: update the aircraft description

Every asset you made shows a **twin-engine** UAV, and so does the real TAPAS: orange nose cone, T-tail, orange leading edges. My prompt said "single engine"; your images are right. For all remaining prompts, replace the aircraft sentence with:

```
A white-grey medium-altitude long-endurance reconnaissance UAV with long slender high-aspect-ratio wings, two wing-mounted piston engines with three-blade propellers, a T-tail, an orange nose cone, orange leading edges on the wings and tailplane, fixed tricycle landing gear, no weapons
```

and remove "two engines" from the negative prompt.

### Still missing

| Need | Priority | Note |
|---|---|---|
| **R3 engine clip** | High | Animate `ChatGPT Image …05_44_10 PM.png` with the R3 motion prompt |
| F2 sensors, F3 CAN, F4 edge computer (videos) | High | Mission-film chapters. `Engine.png` can stand in for F2. |
| F5 storm / link loss | High | The key "lost link" moment |
| F6 antenna at night, F7 engineer with tablet | Medium | |
| S1 hangar, S2 engine bay, S6 turbo inspection, S8 blueprint | Medium | Inner pages and fault response |

---

## 2. Colour grade, upscale and delivery pipeline

A test on the R1 frame is in `assets-incoming/grade-test-before-after.jpg` (left: original, right: graded, upscaled and watermark removed).

**The look, "Night Navy":** shadows sink into brand navy, highlights stay clean, the orange accents keep their punch, and pink or magenta skies are pulled toward steel blue.

| Step | Tool | Setting (tested) |
|---|---|---|
| 1. Remove the watermark | ffmpeg `delogo` | 60×62 px box at x 1130, y 566 (720p clips). Re-measured per clip. |
| 2. Upscale 720p → 1080p | ffmpeg Lanczos + light unsharp (default). **Optional:** Real-ESRGAN (free, `realesrgan-ncnn-vulkan`) for the hero clips and all stills, if this PC's GPU and memory allow. | `scale=1920:1080:flags=lanczos,unsharp=5:5:0.45` |
| 3. Tame magenta | `huesaturation` | hue −12, saturation −35 % on magentas |
| 4. Split tone | `colorbalance` | shadows toward blue (+0.07), highlights slightly warm (+0.03 red) |
| 5. Contrast curve | `curves` | gentle S-curve, blacks lifted to navy (0 → 0.035) |
| 6. Finish | `eq`, `vignette`, `noise` | saturation 0.92, soft vignette, fine temporal grain 5 |
| 7. Loop | ffmpeg `xfade` | 0.8 s crossfade from the tail into the head, for seamless loops |
| 8. Encode | ffmpeg x264 | 1920×1080, CRF ~23, `-movflags +faststart`, no audio, ≤ 4 MB per 10 s; plus a 1280×720 mobile version ≤ 2 MB; WebP/AVIF poster from frame 0 |
| 9. Stills | same grade + Real-ESRGAN ×2 | Export AVIF + WebP at 2560 / 1600 / 960 wide |

I keep the originals untouched in `Raw_images_and _Videos/`. Graded masters go to `public/media/`. The steps become one script (`scripts/grade-media.mjs`), so new clips get the identical look.

---

## 3. What the new reference adds: Rainforest Foods (Immersive Garden)

`rainforest.imm-g-prod.com`, built by Immersive Garden, an award-winning studio.

- **Chapters, not a scroll.** The site is a sequence of full-screen scenes, and "continue" moves to the next. Each scene has one message.
- **Multi-plane depth.** Foreground (a mossy branch), midground (forest) and background (sky with sun and haze) move at different speeds with the mouse, and birds fly through. It feels like looking *into* the image.
- **Huge, bold, all-caps headlines** (RETURN TO NATURE). Letters animate in one by one, and short sentences reveal line by line with a thin drawn line.
- Minimal chrome: a small circular "Menu" button, the logo centred at the bottom, a dot for sound.
- A percentage loader. We skip this: evaluators must see content in under 3 s.

How AVOFLARE uses it:

1. **Depth parallax on our stills.**
   - Generate a depth map for each hero still offline with Depth Anything V2. It's free: use a Hugging Face Space, or the MIT-licensed Tiefling approach.
   - Render the still with a tiny WebGL shader, so the aircraft, runway and mountains separate as the mouse moves or the phone tilts.
   - This is a flat photo with depth, not a 3D model. If WebGL is unavailable it falls back to the plain image.
2. **Chapter structure for the mission film.** Seven full-screen scenes (flight → sensors → CAN → edge → link lost → base → engineer). Each has a big headline, 2–3 revealed lines, and "continue" (scroll, or a click) to the next.
3. **Letter-by-letter headline reveals** for chapter titles only (not for body text).

---

## 4. Design system (proposed, to confirm)

| Area | Decision |
|---|---|
| Mood | Night flight, told like a film. Calm, premium, precise. |
| Colour | Navy #0A1A36, deep #050D1C, steel #4A78A8 / #6FA0DA, ice #EEF2F5. Signal orange #F2562B only for fault state and highlight sweeps. Amber #E9C24A only for watch state. |
| Type | Headlines in Archivo Expanded (bold caps for chapter titles, as in Rainforest). Italic for the second half of hero lines, as in La Caminera. Body in Archivo. Martian Mono only for live values and CAN bytes. |
| Layout | Full-bleed media. Thin visible grid lines over the hero (Prince Aviation). Square corners, 1px frames, corner brackets on media. Split 50/50 panels (La Caminera). Ruled rows for data (Heimdall). No cards. |
| Motion | Lenis smooth scroll; GSAP ScrollTrigger. SplitText line and letter reveals. Clip-path "aperture" reveals on media. Slow parallax, and depth parallax on stills. The orange highlight sweep on one key phrase per section. Letter-roll buttons. Crossfading hero reel with a progress line. All of it has a reduced-motion fallback. |
| Sound | None by default. An optional ambient engine-hum toggle, off by default, is a nice extra: say if you want it. |
| Labels | "AI-generated illustration" on imagery, "Simulated" on data, "Designed architecture" on AI steps. Small and consistent, never hidden. |

---

## 5. Page-by-page plan (all 10 pages + 404)

Every page shares:
- The new header (logo left; menu with a circular "Menu" button that opens a full-screen overlay nav over a dimmed video).
- A cinematic page head (full-bleed image band with depth parallax, a big title, one line).
- The motion vocabulary from §4.
- A dark footer with the line-art logo and a large closing image.

### 5.1 Home (`/`)
1. **Hero reel**
   - R1 → R2 → R3 → R4 crossfade every ~8 s, with slow parallax and thin grid lines.
   - Headline bottom-left: "Engine health that *survives a lost link.*"
   - CTAs: "Watch the mission" and "Open the replay".
   - Bottom-right slider with 4 thumbnails, captions and a progress line: Take-off / Above the clouds / The engine / The ground station.
   - Tiny note: "AI-generated imagery · simulated data".
2. **Statement**
   - Centred, lots of air.
   - Two sentences on what AVOFLARE is, with an orange sweep on "keeps working when the link is lost".
3. **Mission film: 7 chapters (Rainforest-style)**
   - Each chapter is a full-screen F-clip plus a bold caps title, 2–3 revealed lines, and one real data element: the EGT divergence readout, CAN bytes, the edge chain, the link-lost counter, the GCS chain, the tech-log entry.
   - Replaces the 3D engine entirely.
4. **Split panels**
   - "On the aircraft": ETPR + Edge AI.
   - "On the ground": GCS AI, EIR, Sentinel.
   - "The engineer decides": human authority.
   - Image one side, text the other, alternating.
5. **Evidence rows:** 52 fault types · 10 mission profiles · 17 CAN IDs · a 2-hour run. Rolling numbers, each linking to its proof.
6. **Built today vs designed:** ruled rows with status labels.
7. **Gallery:** horizontal drag strip of stills, labelled as illustrations.
8. **Closing:** a big runway-at-night image with "Open the replay" and "See requirement coverage". Then the footer.

### 5.2 Problem (`/problem/`)
- **Head:** `sean_1_img` runway band. "The problem we answer."
- **Requirement map A–F:** ruled rows (requirement → where AVOFLARE covers it → status), each linking to its page.
- **Deliverables and innovation areas:** the same row style.
- **Mood:** reading page. Light ice sections between dark bands (open question, §8).

### 5.3 How it works (`/how-it-works/`)
- **Head:** S2 engine bay (or `Engine.png`).
- **Two chains as horizontal scroll-pinned tracks:**
  - Aircraft: CAN → ETPR → CanonicalTelemetryState → PINN → EKF → K-means → SNN → QR-DQN → Safety.
  - Ground: the GCS chain.
  - Each stage has a one-line plain-language explanation and a "designed" label where it applies.
- **Close-ups:** F3 (CAN) and F4 (edge) clips as small looping insets.

### 5.4 Digital twin (`/digital-twin/`)
- **Head:** `UAV_Flying` with depth parallax.
- **Content:**
  - Subsystem folders 01–08 as a ruled list.
  - The 10 mission profiles as an image-led selector.
  - The degradation trend chart (10 / 40 / 50 % → EGT +2.1 / +8.5 / +10.6 °C), restyled.
- **3D engine:** whether it stays here or leaves the site is open (§8).

### 5.5 What's new (`/whats-new/`)
- **Head:** F5 storm clip.
- **Showpiece:** the link-loss demo, restyled. The downlink arc sits over the storm video, with a big "LINK LOST" state and the edge counter still running.

### 5.6 Fault response (`/fault-response/`)
- **Head:** `Engine.png` with the exhaust glow.
- **The single incident told as a scroll story:** detect → flag → reason → recommend → sign-off (USAvionix pattern).
- **Role switch:** operator, engineer, maintenance, each with its own image (R4 / F7 / S6).

### 5.7 Demo (`/demo/`)
- **Head:** a slim band.
- **Replay dashboard:** full width in a "ground station" frame; the R4 clip dimmed behind it.
- **Divergence chart:** kept, with the current dataviz rules.

### 5.8 Validation (`/validation/`)
- **Head:** S8 blueprint.
- **Content:** ruled rows for what is checked, what is not, known data bugs, and the plan. Honesty first; no invented numbers.

### 5.9 Roadmap (`/roadmap/`)
- **Head:** S3 runway at dawn ("the road ahead").
- **Content:** a phase timeline as a horizontal line with 7 stops, and future work as rows.

### 5.10 Resources (`/resources/`)
- **Content:** documents, repository and team (placeholders until you supply the details).
- **Head:** S1 hangar.

### 5.11 404
- **Content:** `sean_1_img` at night, with "Lost the link? The aircraft didn't." and a way home.

---

## 6. Technical plan

- **Stack:** Astro + small React islands, only where interactive (replay, link loss, role switch, charts, depth parallax).
- **To add:**
  - `lenis`, with GSAP ScrollTrigger and SplitText (GSAP is already installed).
  - A ~2 KB depth-parallax shader in plain WebGL or OGL, instead of three.js on the home page.
  - Exact APIs checked through Context7 before use.
- **To remove from the home page:** `EngineTwin` and the three.js bundle (~1 MB). The engine chapter becomes video.
- **Video component:**
  - `<video muted playsinline loop preload="metadata" poster>` with a 1080p source and a 720p source for phones.
  - Plays only while in view; paused under reduced motion.
- **Performance budget:**
  - Home under 3 s to first content.
  - Hero clip ≤ 4 MB.
  - Lazy-load everything below the fold.
  - No loader screen.
- **Accessibility:**
  - Captions or text equivalents for every chapter.
  - Keyboard access to "continue", the slider and the menu.
  - Contrast AA over video, via a scrim.

## 7. Build order (after sign-off)

1. Media pipeline script, then grade and encode the 3 hero clips and 6 stills. **→ You approve the look.**
2. Design tokens, header, menu overlay, footer, video component, motion utilities.
3. Home hero reel. **→ Screenshots to you.**
4. Home mission film (7 chapters), panels, evidence rows, closing section.
5. Inner pages, in this order: Fault response, What's new, How it works, Digital twin, Demo, Problem, Validation, Roadmap, Resources, 404.
6. QA at 1440 / 768 / 390, reduced motion and console checks. Then the review pass, then commit.

## 8. Decisions needed from you

1. **Typography:** Archivo, with bold caps and italic cadence (recommended), or add an editorial serif?
2. **Reading pages:** alternate navy and light ice sections, or stay fully dark?
3. **3D engine:** keep it on the Digital Twin page, or remove it from the site?
4. **Depth parallax on stills** (Rainforest effect): yes or no?
5. **Mission film:** Rainforest-style chapters with "continue" (recommended), or a continuous scroll?
6. **Ambient sound toggle:** yes or no?
7. **Upscaling:** plain ffmpeg (fast, safe on this PC's memory), or Real-ESRGAN (sharper, heavier)? I can test Real-ESRGAN on one still first.
8. **Missing clips:** will you generate R3 and F2–F7 with the updated twin-engine aircraft sentence, or should I plan around stills for some chapters?
