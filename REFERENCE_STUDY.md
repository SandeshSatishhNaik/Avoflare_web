# Reference Study

Studied 2026-09-26 for the AVOFLARE website. Each site was opened in a real Chrome window (GPU rendering, 1536×686 viewport), left to finish its loader (15–35 s for the WebGL sites), scrolled top to bottom with screenshots of every section, and inspected with JavaScript for libraries and fonts. Firecrawl was used for page text, links/sub-pages and design tokens (colors, fonts, radii). The Dribbble shot was downloaded as its original GIF (284 frames, 12 s) and cut into a frame sheet.

Limits: the Chrome window could not be narrowed to phone width, so mobile layouts were not checked. Screenshots taken during smooth-scroll transitions sometimes captured blank frames; those sections were re-captured after waiting. The sites' own copy is quoted only in short fragments.

## 1. USAvionix (usavionix.com): jet drone and "Phalanx AI" command layer

**Stack:** Next.js, Lenis smooth scroll, 3 WebGL canvases, custom shaders. Page is ~54,000 px tall: one long pinned scroll story.
**Tokens:** black `#000`, white text, Geist (headings, body) and Geist Mono (all live data). Pill buttons, otherwise sharp. Color is used only as state: amber = survey area, cyan = services on site / secured, red = alert / wildfire.

**Structure, in scroll order:**
1. Loader: a flat drone silhouette with a "slow connection" line; about 20 s before the hero appears.
2. Hero: photoreal 3D drone over mountain terrain, two-line headline top-left, short statement bottom-right, "Scroll to explore" pill.
3. Swarm: three drones with mono ID tags linked by dashed lines, with a four-row spec table (Autonomy, Scalability, Collaboration, Coverage).
4. Sync: dozens of drone glyphs on a dark 3D grid joined by a mesh, with a boot log in the corner ("THERMAL / LIDAR / RGB / IR [ONLINE]").
5. Phalanx AI: a survey polygon drawn on the grid with three pulsing amber markers, plus a corner readout (coordinates, signal intensity, alert).
6. Integrated notifications: the same polygon turns cyan, drones fly in, and the readout changes to "authorities contacted / area status: secured".
7. Coordination: a red alert zone appears and a second drone is dispatched.
8. Missions: three scenario cards (wildfire, border, critical infrastructure).
9. Globe: a 3D globe with mission outcome labels.
10. Request access, then contact.

**Nav:** a centre ruler of ticks that labels the current chapter (SPECS, SWARM, SYNC, PHALANX AI, INT ALERTS, COORDINATION) and doubles as scroll progress.

**What works for AVOFLARE:**
- The whole story is told as **one incident unfolding**: detect, classify, notify, dispatch, secured. That is exactly our fault-response story (EGT divergence, BDI flags it, engineer notified, maintenance advisory).
- **Color means state, never decoration.** Maps directly to normal (steel blue), watch (amber), fault (orange/red).
- The **corner telemetry readout in mono** that updates per chapter is a cheap, strong way to show real CSV values.
- The **chapter-ruler nav** works well for a long single-story page.

**Avoid:** the 20 s loader (evaluators will leave), and a 54,000 px scroll. Our story needs to be far shorter.

## 2. Riotters "Aevion" (drone.riotters.com): LiDAR drone tech demo

**Stack:** stated in its footer: Next.js, Three.js, WebGL, Tailwind, Payload CMS, Vercel. Lenis. 6 canvases and 3 videos. ~14,250 px.
**Tokens:** white `#FFFFFF` and pale ice-grey, slate ink `#24363F`, grey `#737E84`. Switzer (all text) and protoMono (labels). Zero radius, hairline dividers.

**Structure:**
1. A loader counting 0 to 100 in mono.
2. Hero: a giant outlined wordmark behind a hovering 3D drone, with a two-line statement bottom-left and "Scroll down" bottom-right. Header carries the brand, a descriptor, "Tech Demo By Riotters" and a live GMT clock.
3. Payload: the drone rotates in place as you scroll, inside a half-circle instrument dial with tick marks and a `[ TECH ] / [ PRECISION ] / [ RANGE ]` label that changes per step. A three-column spec row sits under the dial.
4. Solutions: huge tab words (Energy, Infrastructure, Industry, Geospatial), each with body copy and a 2×3 spec grid of mono label plus large value.
5. Capabilities: a giant headline with a counter badge ("5"), then Scan / Connection / Compactness steps played on the 3D model.
6. Software: numbered findings cards, e.g. a structural fault zone with a description and "risk level: moderate".
7. Footer with the tech stack listed.

**What works for AVOFLARE:**
- **The 3D product stays fixed while scroll steps change what it shows.** This is our Digital Twin showpiece: the engine stays centred, and each step lights a subsystem or sensor.
- **The half-circle dial with ticks around the model** reads as an instrument, which is ideal for RPM and EGT.
- **Findings cards with a risk level** are almost exactly our fault output: fault name, what was detected, confidence, severity.
- The **spec grid of mono label plus big value** suits the 8 monitored parameters.

**Avoid:** the blank white frames during transitions (the 3D re-renders late), and its all-white palette, which would lose our navy brand.

## 3. Zirka (zrk.technology): Shahed interceptor

**Stack:** Webflow with GSAP and Lenis, 2 canvases and 5 videos. ~27,000 px.
**Tokens:** near-black `#050505` with film grain, signal orange `#FC4F00`, grey text. Inter Display (headings) and Geist Mono (all UI). Zero radius, orange corner-bracket frames on buttons.

**Structure:**
1. Hero video of the interceptor on a launch rail, dramatically lit. A mono log block sits top-left ("TARGET ACQUIRED... SYSTEM RESPONSE... STATUS: NOMINAL").
2. Header: logo, city and live clock, anchor nav (Threat, Features, Effectiveness, System), and a **long barcode strip of vertical ticks that fills orange as you scroll**. The progress bar is the whole header.
3. Pinned spec dials: one huge number in a circular tick gauge (224 km/h, 18 mins, 5700 m), with an orange arc filling and numbers rolling like an odometer. Label on the left, index 001–005 on the right.
4. Target tracking: a radar circle with target boxes and orange lock brackets.
5. Threat: kinetic giant type with an orange reticle symbol.
6. Features: product close-up video, headline revealed by a letter scramble, and an A/B/C feature list in bordered mono boxes.
7. Timeline: big faint "01" numerals, code-comment captions ("// ... ;"), and **orange-duotone news photos** overlaid with HUD crosshairs.

**What works for AVOFLARE:**
- **Pinned dial with a rolling number and filling arc.** This is the best pattern for showing a sensor reading. EGT rising from normal into divergence as the arc turns orange would be very clear.
- **Scroll progress as an instrument tick strip** in the header, instead of a generic bar.
- **Orange only for threat or lock** matches our "orange means fault" rule.
- **Duotone treatment of photos** in one brand color makes any image feel on-brand. We could treat our UAV image or MATLAB graphs in navy/steel duotone.

**Avoid:** heavy grain on scrolling layers (performance), and war photography. Our subject is maintenance, not combat.

## 4. CX2 (cx2.com): RF spectrum warfare

**Stack:** Webflow and GSAP (Webflow IX3), 2 videos, no canvas on home. Short page (~4,000 px). Sub-pages: Vadris, Wraith (products), Company, Newsroom, Careers, Contact.
**Tokens:** off-white `#F6F5F3` alternating with solid black blocks. Eurostile Pro Extended (display, very wide), Genera Grotesk (body), TG Frekuent Mono (nav and labels, letter-spaced). Zero radius; buttons are black blocks.

**Structure:**
- Home: full-bleed photo of an operator with FPV goggles, with an extended wordmark over it and thin geometric construction lines. Then a mission statement, then a white 3D terrain render with RF rings pulsing out of emitters (orange for hostile, blue for friendly). Then product tabs (Vadris white, Wraith black), a black "about" block with topographic contour lines and a coordinate crosshair, and a huge "FIND.FIX.FINISH" footer.
- Wraith product page: sky photo with a giant wordmark, then a product render on grey that, **on scroll, turns into a clean technical line drawing (top view)**. Then a spec sheet in mono (dimensions, sensors, weight, flight time).

**What works for AVOFLARE:**
- **Render to line drawing on scroll.** We can do this with our engine: the shaded 3D model fades into its edge lines (three.js EdgesGeometry). It links the "physical engine" to the "digital twin" in one move, and hides the rough AI-generated surface.
- **Extended display type**, like Eurostile Extended, echoes our logo's wide tracking.
- **Topographic contours and coordinate crosshair** as a section texture fits a Himalayan-altitude UAV.
- **Clean product sub-pages with a mono spec sheet** suit our Digital Twin page.

**Avoid:** Eurostile Pro is a paid font, so we would need a free extended alternative. Also avoid the war tone.

## 5. Pensatori Irrazionali (pensatori-irrazionali.com): Italian creative studio (Awwwards Site of the Day)

**Stack:** Next.js-style build, Lenis, 2 canvases, 10 videos. ~13,450 px.
**Tokens:** light grey `#F5F5F5`, charcoal. Helvetica Now (all text) and Ballet (an elaborate script) for giant section words ("Works", "Disciplines"). Engraved heraldic illustrations (lion, pegasus).

**Structure:** logo loader, one-line manifesto bottom-left, giant script word cut against a grotesk ("Works" / "By Pensatori"), a work index as rows (client, services, year, thumbnail), disciplines with engravings, news list, and footer.

**What works for AVOFLARE:** only craft lessons: generous emptiness, one strong typographic move per section, and a list-row index with hover previews (good for our fault catalogue or mission list).
**Avoid:** the script type and heraldic engravings are off-brand for engineering. The site is also heavy and slow to reveal content.

## 6. 21st.dev "Boden" craftsman template (craftsman-contractor-landing-page-v1.21st.app)

**Stack:** Next.js and Tailwind. Short page.
**Tokens:** dark photo hero, then light sections. Cyan `#00D8F6` accent, navy text `#0F172B`. Space Grotesk (headings), Inter (body), JetBrains Mono (tags). 12 px radius buttons, cards with soft shadows, dark-mode toggle.

**Structure:** photo hero with badge chips, headline, stats row and floating image card; consultation banner; project cards with photo, location/year and **mono spec chips** ("porcelain stoneware 120×120"); a cyan scroll-progress line under the header.

**What works for AVOFLARE:** the **mono spec chips on cards** (for fault and mission cards: "EGT", "CHT", "2 h", "severity 50 %"), a dark/light toggle, and the thin progress line.
**Avoid:** it is a generic SaaS card kit (rounded cards, soft shadows, cyan). It would make AVOFLARE look templated.

## 7. Hirael "Rivr" template (hirael.com/embed/templates/rivr): shadcn/Tailwind DeFi template

**Tokens:** light grey `#F0F0F0`, deep navy `#20355B`, slate text `#5A687C`. Outfit (headings) and Helvetica Neue (body). Large rounded inset frames (~32 px), pill buttons.

**Structure:** hero inside a rounded inset frame on a surreal 3D landscape, with glass stat cards pinned to its corners ("5.2K active"); a bento grid of feature cards; a closing CTA frame showing **molten orange flowing through navy-blue dunes**; footer.

**What works for AVOFLARE:**
- **Palette:** the closing image is almost exactly our brand: navy with a hot orange flow. It shows navy and orange together look premium, not military.
- **Stat cards pinned to the corners of a hero frame** are a clean way to put 2–3 live readings on the hero without clutter.

**Avoid:** the bento feature grid of icon cards is the most templated pattern of the nine.

## 8. Birds (11-76.com/themes/birds): "coming soon" template

**Tokens:** misty mountain photo under a dark overlay, Bebas Neue (huge condensed caps), lime `#A0CC13` accent, Helvetica Neue.
**Structure:** one screen: headline, subtitle, a rule, a newsletter field, and a countdown (days, hours, minutes, seconds).

**What works for AVOFLARE:** the **misty mountain mood** is the same as our Himalayan runway video and image, and confirms that image works as a hero. Big numeric counters echo mission-clock or flight-hour readouts.
**Avoid:** lime accent, social icons, all-caps condensed everything. It is a dated template.

## 9. Air Force homepage animation (Dribbble, Alex Dale for Havas)

**Frames (12 s, 284 frames):**
1. Dark cockpit video with an underlined headline and a play button ("your journey begins here").
2. Cut to white: a ghosted grey jet with a black, underlined, condensed headline.
3. A people carousel: role title and year joined, a quote, a "See my career journey" button, two overlapping photos, and a bottom strip of role thumbnails (Loadmaster, Fast Jet Pilot, Air Traffic Controller, Aviation Medical Officer).

**What works for AVOFLARE:** the **bottom strip of roles that switches the whole panel** is exactly showpiece 5 (the same fault seen by operator, propulsion engineer and maintenance). Also the dark-video-to-light-content cut as one deliberate theme change.
**Avoid:** stock-photo people. We have no team photos yet, and inventing people would be dishonest.

## MotionSites

Searched for "dark aerospace defense landing with 3D product and HUD readouts" and "scroll-driven 3D machine to line drawing". No close match. Nearest free result: "Future Machine" (Robotics). No prompt was opened, so all 3 free prompt views remain. The tool returned this message: "Access ALL prompts for stunning animated websites in one click: https://motionsites.ai/unlimited"

## Cross-site findings

| Pattern | Where | Fit for AVOFLARE |
|---|---|---|
| One incident told as a scroll story (detect, classify, respond, secured) | USAvionix | Very high: fault-response page and home story |
| 3D product fixed in place, scroll steps change what it shows | Riotters, USAvionix | Very high: Digital Twin showpiece |
| Instrument dial with rolling number and filling arc | Zirka, Riotters | Very high: live EGT / CHT / RPM readouts |
| Render turning into a technical line drawing | CX2 Wraith | High: physical engine to digital twin, and it hides mesh artefacts |
| Color used only as state | USAvionix, Zirka, CX2 | Very high: steel blue normal, amber watch, orange fault |
| Mono for data, grotesk for words | USAvionix, Zirka, Riotters, CX2 | High |
| Findings cards with risk level | Riotters | High: fault catalogue and alerts |
| Role strip switching the panel | Air Force | High: showpiece 5 |
| Scroll progress as instrument ticks | Zirka, USAvionix | Medium |
| Navy with orange | Rivr | Confirms our palette |
| Misty mountain photography | Birds, CX2 | Confirms our hero image and video |
| Long loaders (15–35 s) | USAvionix, Riotters, Pensatori | Avoid: evaluators must see content in under 3 s |
| Bento and card kits | Rivr, Boden | Avoid: templated |

Technology note: every 3D site used Three.js/WebGL with Lenis smooth scroll; the Webflow sites use GSAP. Our planned stack (Astro + React Three Fiber islands, GSAP or CSS scroll-driven animation) can reproduce all of the patterns above.
