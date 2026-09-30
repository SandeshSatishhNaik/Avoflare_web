# AVOFLARE image and video prompts

Copy-paste ready. Each block is a complete prompt: subject + aircraft description + shared style. You generate, I place.

> **Update 2026-09-28:** use the twin-engine aircraft sentence from `SITE_PLAN.md` §1 in every remaining prompt, and drop "two engines" from the negative prompt.

## How to use

1. **Make the still first.** Paste the *Image prompt* into your image generator (for example OpenArt).
   - Aspect ratio 16:9, the highest resolution your plan allows (at least 1920×1080).
   - Paste the *Negative prompt* into the negative field if the tool has one.
2. **Pick the best image of each set.** Check it against §3 below before moving on.
3. **Animate it.** In an image-to-video tool, upload that still as the **first frame**, then paste the *Motion prompt*.
   - Choose the longest duration the tool allows up to 10 s.
   - Pick "slow" or "low motion" if there is such a setting.
4. **Name the files** exactly as the ID (for example `reel-01-takeoff.png` and `reel-01-takeoff.mp4`).
5. **Drop them into** `E:\Avoflare_web\assets-incoming\`. Don't worry about size or format; I compress and convert everything.
6. **Start with the hero reel (R1–R4).** It matters most. Then do the mission film scenes (F1–F7), then the stills (S1–S8). The loops (L1–L3) are optional.

## Negative prompt (use for every image and video)

```
text, letters, numbers, watermark, logo, signature, UI overlay, cartoon, illustration, 3D render look, oversaturated colours, fisheye, extra propellers, two engines, distorted wings, broken geometry, melted metal, people looking at the camera, faces in close-up, military markings, weapons, missiles, bombs
```

---

## R. Landing hero reel (4 clips, most important)

### R1 · `reel-01-takeoff`
**Image prompt**
```
A white-grey medium-altitude long-endurance reconnaissance UAV with long slender high-aspect-ratio wings, a single piston engine driving a front propeller, fixed landing gear and orange accent stripes on the wing tips and nose, no weapons, lined up on a remote high-altitude mountain runway at blue hour, runway edge lights glowing, snow-capped Himalayan peaks behind in drifting mist, low wide angle from beside the runway, faint heat shimmer behind the engine. Cinematic still, shot on ARRI Alexa 35 with a 35mm lens, deep navy and steel-blue blue-hour palette with a single warm orange accent, soft volumetric haze, subtle anamorphic flare, fine film grain, photorealistic, high dynamic range, calm and premium, no text, no logos
```
**Motion prompt**
```
Slow dolly forward alongside the runway as the UAV begins its take-off roll, propeller spinning into a blur, mist drifting across the peaks, very subtle camera shake, calm cinematic pace, loopable
```

### R2 · `reel-02-above-clouds`
**Image prompt**
```
A white-grey medium-altitude long-endurance reconnaissance UAV with long slender high-aspect-ratio wings, a single piston engine driving a front propeller and orange accent stripes on the wing tips and nose, no weapons, cruising above a vast sea of clouds at dawn, sun just below the horizon, rim light along the wing edges, the aircraft small in the right third of the frame, lots of empty sky. Cinematic still, shot on ARRI Alexa 35, deep navy and steel-blue palette warming to a thin orange horizon, soft volumetric haze, fine film grain, photorealistic, high dynamic range, calm and premium, no text, no logos
```
**Motion prompt**
```
Slow tracking shot matching the aircraft's speed, clouds sliding past underneath, gentle parallax between cloud layers, light slowly brightening on the horizon, calm cinematic pace, loopable
```

### R3 · `reel-03-engine`
**Image prompt**
```
Extreme close-up of a small aircraft's piston engine cowling and exhaust stack in flight at night, faint orange glow from the exhaust, metal cooling fins catching cold steel-blue light, fine condensation beads on the painted white-grey cowling with an orange stripe, dark sky behind. Cinematic still, macro lens, deep navy and steel-blue palette with a warm orange glow as the only warm colour, shallow depth of field, fine film grain, photorealistic, premium, no text, no logos
```
**Motion prompt**
```
Very slow push-in toward the exhaust, heat haze rippling in the air, the orange glow pulsing gently, water droplets streaming backward over the cowling, calm cinematic pace, loopable
```

### R4 · `reel-04-ground-station`
**Image prompt**
```
A dark ground control station at night, a row of monitors with soft blue telemetry glow reflecting on a matte desk, an engineer seen from behind in silhouette watching a large screen, a window showing distant runway lights and mountains, nothing readable on the screens. Cinematic still, shot on ARRI Alexa 35, deep navy and steel-blue palette with one small warm orange desk lamp, soft haze, fine film grain, photorealistic, calm and premium, no text, no logos
```
**Motion prompt**
```
Slow lateral slide behind the engineer from left to right, screen light flickering softly, faint steam rising from a coffee cup, runway lights twinkling in the window, calm cinematic pace, loopable
```

---

## F. Mission film scenes (7 clips, one per chapter of the scroll story)

### F1 · `film-01-climb`
**Image prompt**
```
A white-grey medium-altitude long-endurance reconnaissance UAV with long slender wings, a single front propeller and orange wing-tip and nose stripes, no weapons, climbing out of a misty mountain valley at blue hour, ridges layered in haze, the aircraft small and centred. Cinematic still, deep navy and steel-blue palette, soft volumetric haze, fine film grain, photorealistic, premium, no text, no logos
```
**Motion prompt**
```
Slow tilt up following the aircraft as it climbs, mist layers moving at different speeds, calm cinematic pace
```

### F2 · `film-02-sensors`
**Image prompt**
```
Macro photograph of a temperature probe and braided sensor wires fixed to a piston engine exhaust manifold, warm orange glow on the metal, steel-blue bokeh in the background. Cinematic still, macro lens, shallow depth of field, deep navy and steel-blue palette with a warm orange highlight, fine film grain, photorealistic, premium, no text, no logos
```
**Motion prompt**
```
Slow rack focus from the probe tip back along the wires, light glinting on the metal, faint heat haze, calm pace
```

### F3 · `film-03-can`
**Image prompt**
```
Macro photograph of an aircraft wiring harness and a round connector inside a dark avionics bay, braided cables, tiny steel-blue status LEDs, precise and clean. Cinematic still, macro lens, shallow depth of field, deep navy and steel-blue palette, fine film grain, photorealistic, premium, no text, no logos
```
**Motion prompt**
```
Small pulses of blue light travelling along the cables toward the camera, slow dolly forward, calm pace
```

### F4 · `film-04-edge`
**Image prompt**
```
A compact rugged edge computer module mounted inside an aircraft avionics bay, matte dark anodised aluminium housing with cooling fins, a single soft steel-blue status light, cables neatly routed, no labels or text. Cinematic still, product-photography lighting, deep navy and steel-blue palette, fine film grain, photorealistic, premium, no text, no logos
```
**Motion prompt**
```
Slow orbit around the module, the status light breathing gently, reflections sliding across the metal, calm pace
```

### F5 · `film-05-link-loss`
**Image prompt**
```
A white-grey medium-altitude long-endurance reconnaissance UAV with long slender wings, a single front propeller and orange wing-tip stripes, flying steadily through dark storm clouds at night, distant lightning, the aircraft's navigation lights on, a feeling of isolation. Cinematic still, deep navy and steel-blue palette, volumetric cloud, fine film grain, photorealistic, premium, no text, no logos
```
**Motion prompt**
```
Clouds rushing past the aircraft, distant lightning flickering, the aircraft holding steady and flying on, navigation lights blinking, tense but calm pace
```

### F6 · `film-06-downlink`
**Image prompt**
```
A ground antenna dish on a mountain ridge at night pointing at the sky, a clear starry sky, a faint steel-blue haze in the air, a small equipment shelter with one warm orange light. Cinematic still, deep navy and steel-blue palette, fine film grain, photorealistic, premium, no text, no logos
```
**Motion prompt**
```
Slow push toward the dish, stars drifting slightly, haze moving across the ridge, calm pace
```

### F7 · `film-07-engineer`
**Image prompt**
```
An engineer's hands holding a rugged tablet in a dimly lit hangar, the tablet glow lighting the fingers, nothing readable on the screen, a white-grey UAV with orange stripes blurred in the background under cool work lights. Cinematic still, shallow depth of field, deep navy and steel-blue palette with warm work-light accents, fine film grain, photorealistic, premium, no text, no logos
```
**Motion prompt**
```
Slow push-in on the tablet, a finger hovers and then taps once, background lights softly flickering, calm pace
```

---

## S. Stills (8 images; no video needed)

### S1 · `still-hangar-night`
```
A white-grey medium-altitude long-endurance reconnaissance UAV with long slender wings, a single front propeller and orange wing-tip and nose stripes, parked in a clean hangar at night under cool work lights, reflective epoxy floor, engine cowling open, a tool cart beside it. Cinematic still, deep navy and steel-blue palette with warm work-light accents, fine film grain, photorealistic, premium, no text, no logos
```
### S2 · `still-engine-bay`
```
Three-quarter view of the open engine bay of a small aircraft with a four-cylinder piston engine and a turbocharger visible, mixed warm and cool light, clean and well maintained. Cinematic still, deep navy and steel-blue palette with warm highlights, fine film grain, photorealistic, premium, no text, no logos
```
### S3 · `still-runway-dawn`
```
An empty high-altitude mountain runway at dawn, centreline lights receding into mist, snow-capped mountains, no aircraft. Cinematic still, deep navy and steel-blue palette with a thin orange horizon, soft haze, fine film grain, photorealistic, premium, no text, no logos
```
### S4 · `still-terrain-aerial`
```
Top-down aerial photograph of a mountain valley with a winding river in early light, the small shadow of an aircraft crossing the ground. Cinematic still, deep navy and steel-blue palette, soft haze, fine film grain, photorealistic, premium, no text, no logos
```
### S5 · `still-gcs-wide`
```
Wide shot of a modern ground control room at night, curved screens with soft blue glow, empty chairs, rain on large windows, nothing readable on the screens. Cinematic still, deep navy and steel-blue palette, fine film grain, photorealistic, premium, no text, no logos
```
### S6 · `still-maintenance-hands`
```
Macro of gloved hands inspecting a turbocharger compressor wheel with a small flashlight, shallow depth of field, cool workshop light with a warm flashlight beam. Cinematic still, deep navy and steel-blue palette, fine film grain, photorealistic, premium, no text, no logos
```
### S7 · `still-sky-telemetry`
```
Long-exposure photograph of the night sky over dark mountains, star trails, a single aircraft light trail crossing the frame diagonally. Cinematic still, deep navy and steel-blue palette, fine film grain, photorealistic, premium, no text, no logos
```
### S8 · `still-blueprint`
```
Technical line drawing of a four-cylinder horizontally opposed aircraft piston engine with a turbocharger, thin white lines on a deep navy background, isometric view, blueprint style, clean and precise, no labels, no text
```

---

## L. Optional short loops (3–5 s, square)

### L1 · `loop-heat-shimmer`
Image: `Abstract heat haze over dark metal with a warm orange glow, macro, deep navy background, fine film grain, no text`
Motion: `Heat haze rippling gently, seamless loop`

### L2 · `loop-data-light`
Image: `Fibre-optic light pulses in steel blue running through dark cables, macro, deep navy background, fine film grain, no text`
Motion: `Pulses flowing steadily along the fibres, seamless loop`

### L3 · `loop-clouds-pass`
Image: `Clouds seen from above at night under moonlight, deep navy and steel blue, fine film grain, no text`
Motion: `Clouds passing slowly below, seamless loop`

---

## 3. What I need back (checklist)

| Item | Requirement |
|---|---|
| Stills | PNG or JPG, 16:9, ≥ 1920×1080 (S8 can be any ratio) |
| Videos | MP4, 16:9, ≥ 1280×720 (1080p preferred), 5–10 s, no audio needed |
| Poster | The still you animated, same file name as the video |
| Names | Exactly the IDs above (e.g. `reel-01-takeoff.mp4` + `reel-01-takeoff.png`) |
| Folder | `E:\Avoflare_web\assets-incoming\` |
| Must have | Same aircraft look in every shot (white-grey, slender wings, one front propeller, orange stripes); night/blue-hour navy palette; slow camera |
| Must not have | Any text or numbers, watermarks (including the OpenArt one), logos, weapons, two engines, warped wings or propellers, readable screens |
| Minimum set to start building | R1–R4, plus F2, F5 and F7 |
| Nice to have | The rest of F, all S, and L |

If a clip comes out warped, or the aircraft changes shape mid-clip, regenerate it. Short and clean beats long and broken; I can slow a 5 s clip down or loop it.
