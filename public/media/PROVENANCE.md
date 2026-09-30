# Media provenance

Every photographic scene on the site is an AI-generated illustration made by the AVOFLARE team, and is labelled as such on the page. Originals live outside git in `Raw_images_and _Videos/`; `scripts/grade-media.mjs` grades them ("Night Navy"), removes the generator's corner mark, upscales 720p to 1080p and encodes them here.

| Published file | Source (team-generated) |
|---|---|
| v/reel-runway.* | Camera_slow_steady_dolly_for.mp4 |
| v/reel-clouds.*, v/film-night.* | Camera_slow_tracking_shot_tha.mp4 (film-night is a darker grade) |
| v/reel-station.* | Camera_slow_lateral_slide_beh.mp4 |
| v/film-takeoff.* | UAV_taking_off_from_runway_20260928161533_2.mp4 (from the zip), first 6 s only |
| v/film-cruise.* | tapas_uav_cinematic_loop.mp4, first 7.5 s |
| img/runway-blue-* | ChatGPT Image Sep 28, 2026, 04_21_19 PM.png |
| img/runway-night-* | sean_1_img.png |
| img/clouds-sunset-* | UAV_Flying.png |
| img/nacelle-* | ChatGPT Image Sep 28, 2026, 05_44_10 PM.png |
| img/engine-* | Engine.png |
| img/station-* | Base.png |
| og.jpg | Crop of img/runway-blue-2400.webp |
| brand/*.png | Derived from the team's `logo.jpeg` |

Never published: the third-party TAPAS news graphic in the zip, and any watermarked file.

## built/ (What we built, 2026-09-29)

- `gcs-operator`, `gcs-live`, `gcs-engine`, `gcs-planner` (`-1920/-960.webp`): screenshots of the team's AVOFLARE GCS web dashboard, from `Raw_images_and _Videos/Dashboard1 (1)–(4).png`. Cropped to remove the scrollbar; on `gcs-engine` the internal module label "Sentinel v4.1" is painted out. The values shown are demo data. The operator name is a fictional persona.
- `matlab-app`, `matlab-app-2`: screenshots of the team's first MATLAB app, from `Matlab_dashboard1.jpeg` and `Matlab_dashboard.jpeg`, unedited apart from re-encoding.

## v/demo-placeholder (2026-09-30)

- `demo-placeholder.mp4`, `-720.mp4`, `.webp`: placeholder for the Demo section, joined by ffmpeg from the site's own graded clips in this order: reel-runway, film-takeoff, film-cruise, reel-clouds-hd, reel-station, film-night (0.6 s cross-fades, no audio). Poster frame at 20 s. Replace with the recorded demo.
- `brand/creator.png`: GitHub avatar of the site's creator (github.com/SandeshSatishhNaik), used in the footer credit.
