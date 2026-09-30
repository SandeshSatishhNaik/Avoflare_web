// Hero onboarding: one GSAP timeline that starts as the intro zoom opens the site.
// Tagline letters rise out of a blur, supporting lines and actions follow, a dotted flight trace
// draws from the tagline to the live-twin chip, and the chip replays the simulated run.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = id => document.getElementById(id);
  const S = window.AV.s.slice(0, -1).map(r => ({ t: r[0], d: r[1], alt: r[5] }));
  const fmt = t => `${String(Math.floor(t / 3600)).padStart(2, '0')}:${String(Math.floor(t % 3600 / 60)).padStart(2, '0')}`;

  // Live twin chip: replays the run from late climb to landing on a 24 s loop.
  let chipTimer;
  function startChip() {
    if (chipTimer) return;
    const from = S.findIndex(s => s.t >= 2400);
    let i = from;
    const spark = $('chipSpark'), val = $('chipVal'), state = $('chipState'), tEl = $('chipT'), altEl = $('chipAlt');
    const tick = () => {
      const s = S[i], hot = s.d >= 6, watch = s.d >= 3;
      val.textContent = `+${s.d.toFixed(1)}`;
      state.textContent = hot ? 'FLAGGED' : watch ? 'WATCH' : 'MATCHES';
      state.classList.toggle('hot', watch);
      tEl.textContent = fmt(s.t); altEl.textContent = `${s.alt.toLocaleString('en')} m`;
      const pts = S.slice(from, i + 1).map((q, k, a) => `${(k / Math.max(1, S.length - 1 - from) * 220).toFixed(1)},${(28 - q.d / 11 * 26).toFixed(1)}`).join(' ');
      spark.innerHTML = `<line x1="0" x2="220" y1="28" y2="28" stroke="#4f8ccc" stroke-dasharray="3 3" /><polyline points="${pts}" fill="none" stroke="${hot ? '#e08a1e' : '#1b3556'}" stroke-width="1.8" />`;
      i = i >= S.length - 1 ? from : i + 1;
    };
    tick();
    chipTimer = setInterval(tick, reduce ? 1500 : 24000 / (S.length - from));
  }

  // Dotted trace from the end of the tagline to the chip.
  const traceSvg = $('trace'), tracePath = $('tracePath');
  const dot = document.createElement('i');
  dot.style.cssText = 'position:absolute;z-index:2;width:8px;height:8px;margin:-4px 0 0 -4px;border-radius:50%;background:#fff;box-shadow:0 0 0 4px rgba(207,230,255,.25),0 0 14px rgba(207,230,255,.9);opacity:0;pointer-events:none;left:0;top:0';
  document.querySelector('.hero').appendChild(dot);
  let clipRect;
  // The trace runs from the chip to the aircraft's left engine. ENGINE is its position in the video frame.
  const ENGINE = { x: 0.594, y: 0.383 }, VIDEO_AR = 16 / 9;
  const sensor = $('sensor');
  function enginePoint() {
    const m = $('heroMedia').getBoundingClientRect(), ar = m.width / m.height;
    const w = ar > VIDEO_AR ? m.width : m.height * VIDEO_AR, h = ar > VIDEO_AR ? m.width / VIDEO_AR : m.height;
    return { x: m.left + (m.width - w) / 2 + ENGINE.x * w, y: m.top + (m.height - h) / 2 + ENGINE.y * h };
  }
  function layoutTrace() {
    if (getComputedStyle(traceSvg).display === 'none') return;
    const hero = document.querySelector('.hero').getBoundingClientRect(), chip = $('chip').getBoundingClientRect(), e = enginePoint();
    const vx = x => ((x - hero.left) / hero.width) * 1000, vy = y => ((y - hero.top) / hero.height) * 1000;
    const x1 = vx(chip.right + 10), y1 = vy(chip.top + chip.height * .35), x2 = vx(e.x - 12), y2 = vy(e.y + 10);
    tracePath.setAttribute('d', `M${x1} ${y1} C ${x1 + (x2 - x1) * .5} ${y1}, ${x2 - (x2 - x1) * .25} ${y2 + 60}, ${x2} ${y2}`);
    if (!clipRect) {
      traceSvg.insertAdjacentHTML('afterbegin', '<defs><clipPath id="traceClip"><rect id="traceRect" x="0" y="0" height="1000" width="0" /></clipPath></defs>');
      tracePath.setAttribute('clip-path', 'url(#traceClip)');
      clipRect = $('traceRect');
    }
    clipRect.setAttribute('x', x1 - 2);
    traceSvg.dataset.x1 = x1;
    sensor.style.left = `${e.x - hero.left}px`; sensor.style.top = `${e.y - hero.top}px`;
  }
  // Chip sits in the sky above the headline; on short screens 42% would land on the headline.
  function placeChip() {
    const chip = $('chip');
    if (innerWidth <= 900) { chip.style.top = ''; return; }
    const hero = document.querySelector('.hero').getBoundingClientRect(), h1 = $('h1').getBoundingClientRect(), nav = document.querySelector('.nav').getBoundingClientRect();
    const fit = h1.top - hero.top - chip.offsetHeight - 28;
    chip.style.top = `${Math.max(nav.bottom - hero.top + 16, Math.min(hero.height * .42, fit))}px`;
  }
  placeChip();
  function placeDot(f) {
    if (!clipRect || !tracePath.getAttribute('d')) return; // trace hidden (phones)
    const L = tracePath.getTotalLength(), p = tracePath.getPointAtLength(L * f), hero = document.querySelector('.hero').getBoundingClientRect();
    dot.style.transform = `translate(${(p.x / 1000) * hero.width}px, ${(p.y / 1000) * hero.height}px)`;
    clipRect.setAttribute('width', Math.max(0, p.x - +traceSvg.dataset.x1 + 4));
  }

  if (reduce || !window.gsap) {
    layoutTrace(); if (clipRect) { clipRect.setAttribute('width', 1000); dot.style.opacity = 0; sensor.style.opacity = 1; }
    startChip(); document.documentElement.classList.add('hero-ready');
    return;
  }

  gsap.registerPlugin(SplitText);
  const split = SplitText.create('#h1 .line', { type: 'words,chars', mask: 'words' });
  const intro = ['#heroSub', '#heroBtns > *', '#heroMeta', '#heroCue'];
  gsap.set(split.chars, { yPercent: 118, opacity: 0, filter: 'blur(12px)' });
  gsap.set(intro, { y: 26, autoAlpha: 0 });
  gsap.set('#chip', { autoAlpha: 0, y: 18, scale: .96, clipPath: 'inset(0% 0% 100% 0% round 18px)' });
  gsap.set(['.nav'], { autoAlpha: 0 });
  gsap.set('#heroMedia', { scale: 1.14 });
  document.documentElement.classList.add('hero-ready');

  const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });
  tl.to('#heroMedia', { scale: 1, duration: 3.2, ease: 'power3.out' }, 0)
    .to(split.chars, { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 1.25, stagger: { each: 0.03, from: 'start' } }, 0.2)
    .to('.nav', { autoAlpha: 1, duration: 1 }, 0.6)
    .to('#heroSub', { y: 0, autoAlpha: 1, duration: 1.1 }, 0.85)
    .to('#heroBtns > *', { y: 0, autoAlpha: 1, duration: 1, stagger: 0.09 }, 1.0)
    .to('#heroMeta', { y: 0, autoAlpha: 1, duration: 1 }, 1.2)
    .to('#chip', { autoAlpha: 1, y: 0, scale: 1, clipPath: 'inset(0% 0% 0% 0% round 18px)', duration: 1.1, onStart: startChip }, 1.2)
    .add(() => layoutTrace(), 1.9)
    .to(dot, { opacity: 1, duration: .2 }, 1.95)
    .to({ f: 0 }, { f: 1, duration: 1.1, ease: 'power2.inOut', onUpdate() { placeDot(this.targets()[0].f); } }, 1.95)
    .to(dot, { opacity: 0, duration: .3 }, 3.0)
    .fromTo('#sensor', { opacity: 0, scale: .3 }, { opacity: 1, scale: 1, duration: .8 }, 2.95)
    .to('#heroCue', { y: 0, autoAlpha: 1, duration: 1 }, 2.5);

  // Keep the trace and sensor locked to the engine while the video settles and drifts (only while the hero is on screen).
  let traced = false;
  tl.add(() => { traced = true; }, 1.9);
  gsap.ticker.add(() => {
    if (!traced || scrollY > 2) return; // only at rest on the hero: no layout reads while scrolling
    layoutTrace();
    if (tl.time() >= 3.05 && clipRect) clipRect.setAttribute('width', 1000);
  });
  let started = false;
  const go = () => { if (!started) { started = true; tl.play(); } };
  document.addEventListener('av:open', go, { once: true });
  // No loader on this page load (already seen, or loader missing): start right away.
  if (!document.documentElement.classList.contains('is-loading')) requestAnimationFrame(go);

  // Depth: the flight drifts slightly against the pointer; the chip floats the other way.
  const mx = gsap.quickTo('#heroMedia', 'x', { duration: 1.6, ease: 'power3.out' }), my = gsap.quickTo('#heroMedia', 'y', { duration: 1.6, ease: 'power3.out' });
  const cx = gsap.quickTo('#chip', 'x', { duration: 1.2, ease: 'power3.out' }), cy = gsap.quickTo('#chip', 'y', { duration: 1.2, ease: 'power3.out' });
  addEventListener('pointermove', e => {
    if (scrollY > 2) return; // the hero holds still while the sheet slides over it
    const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
    mx(x * -18); my(y * -12); if (tl.progress() === 1) { cx(x * 10); cy(y * 8); }
  }, { passive: true });

  addEventListener('resize', () => { placeChip(); layoutTrace(); if (clipRect && tl.progress() === 1) clipRect.setAttribute('width', 1000); });
})();
