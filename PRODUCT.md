# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro (static output) with React islands for the interactive showpieces (React Three Fiber for 3D, GSAP ScrollTrigger for scroll-driven story), hosted on Cloudflare Pages. Decided with the user on 2026-09-26 (see `PLAN.md`).

## Users

- Primary: evaluators of Problem Statement 26054 (AI-enabled real-time digital twin for aero piston engines in MALE UAVs). They score the submission against the statement's requirements A–F, deliverables and innovation areas, often quickly and sometimes on a phone.
- Secondary: students, faculty and the general public, who need a plain-language understanding of what the system does.

## Product Purpose

AVOFLARE is an engine-health and engineering-intelligence system for a MALE UAV's aero piston engine (VRDE 180 HP / Austro AE300 class, the "TAPAS" simulation platform). The website explains the system, demonstrates it with the team's own simulation data, and lets an evaluator map every requirement of Problem Statement 26054 to where AVOFLARE addresses it. Success: an evaluator understands the architecture, sees evidence, and finds each requirement's coverage without hunting.

## Positioning

- The aircraft-side chain (CAN → ETPR → CanonicalTelemetryState → Edge AI → Safety) keeps working when the link to the ground station is lost; external communication adds capability but is not a dependency.
- The ground side (GCS AI: Operational System, EIR, Sentinel) builds an auditable engineering case (divergence from a baseline, competing causes, evidence, prognosis, decision) with a human engineer keeping final authority, instead of a black-box failure predictor.

## Operating Context

Evaluation of a hackathon/problem-statement submission: evaluators open the site from a link, skim the home page, check requirement coverage, and look for proof (simulation results, demo). Students and faculty read it as a technical explainer.

## Capabilities and Constraints

- Implemented (MATLAB/Simulink, repo `AVOFLARE_MATLAB`): engine physics simulation, a 52-type fault library, 10 mission profiles (including high altitude, hot, cold, endurance), CAN encoding/decoding package, dataset generator with a healthy reference run and divergence columns, a MATLAB dashboard app.
- Designed but not implemented: the Edge AI chain (PINN/Lite Digital Twin, EKF, K-means, SNN, QR-DQN, Safety), GCS AI, RUL estimation, health indices, maintenance advisory. The site must label these "designed".
- Known data bugs (healthy-reference torque and brake power are zero, mass airflow zero, boost unchanged under compressor wear): only EGT/CHT divergence, fault onset and severity are shown until fixed. Data is loaded from JSON so fixed runs can replace it without code changes.
- Terminology to use exactly: ETPR, CanonicalTelemetryState, CAM, BDI, EIR, ACR, Sentinel, PPM, RUL.

## Brand Commitments

- Name AVOFLARE; logo `logo.jpeg` (swept-arc mark with a four-point star, wide-tracked geometric wordmark), navy ≈ `#0A1A36` and steel blue ≈ `#4A78A8`.
- User-provided imagery: `wmremove-transformed.png` (AI-generated MALE UAV on a Himalayan runway, orange accents) and `tapas_himalayan_runway_cinematic.mp4` (8 s runway clip).
- A representative engine model `eaadb3d2-…_white_mesh (1).glb`, labelled "representative engine model", not the TAPAS engine.

## Evidence on Hand

- Simulation runs: `E:\Avoflare_web_Matlab\TAPAS_FINAL_AI_DATASET_V4-20260925T141334Z-1-001\TAPAS_FINAL_AI_DATASET_V4` (turbo compressor wear 10/40/50/60 %, air filter clog 30 %), repo datasets V1/V2 (see `REPO_AUDIT.md`).
- Architecture documents in `project detaild/` (ETPR & Edge AI, GCS AI, Problem Statement 26054).
- Absent and never to be fabricated: validation results against reference engines, RUL values, customer or deployment claims, team photos, testimonials, scores.

## Product Principles

1. Every requirement of PS 26054 is traceable to a page and a piece of evidence.
2. Show only what the simulation or the documents support; label designed work as designed and simulated data as simulated.
3. Communication-loss resilience and human engineering authority are the two ideas the site must make unmistakable.
4. Plain language first, engineering detail second, on every page.

## Accessibility & Inclusion

WCAG 2.1 AA contrast, keyboard access to every interactive showpiece, `prefers-reduced-motion` honoured (the scroll story degrades to a static sequence), usable on phones.
