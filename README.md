# AVOFLARE website

Website for AVOFLARE, a real-time engine digital twin for the aero piston engine of a MALE UAV
(Smart India Hackathon 2026, Problem Statement 26054, Team Avoflare).

Live: https://avoflare-web.pages.dev

## Stack

React 19 + Vite 8, GSAP and Lenis for motion, Three.js for the "How it works" scene.
Hosted on Cloudflare Pages; images and videos are served from a Cloudflare R2 bucket.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static build in dist/
```

## Layout

- `src/sections/` — one React component per page section
- `src/site.js` — page behaviour (smooth scroll, header, section motion), run once after render
- `src/styles/` — site, loader and Security styles
- `how-it-works.html` — the Three.js scene embedded in section 02
- `public/` — brand files and media (media are also published to R2)
- `demos/` — the plain-HTML design demos the site was built from
- `scripts/` — media grading and the "What we built" data export

All engine and mission data shown on the site is simulated; steps marked designed or planned are not yet running.
