// Page behaviour, ported from demos/home.html. Runs once after the page has rendered (see App.jsx).
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { AV } from './data/av.js';
import { initHero } from './hero.js';
import builtData from './data/built.json';

export function initSite() {
window.AV = AV; window.gsap = gsap; window.SplitText = SplitText; window.Lenis = Lenis;

const S = window.AV.s.slice(0, -1).map(r => ({ t: r[0], d: r[1], egt: r[2], cht: r[3], rpm: r[4], alt: r[5], ph: r[6] }));
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fmt = t => `${String(Math.floor(t / 3600)).padStart(2, '0')}:${String(Math.floor(t % 3600 / 60)).padStart(2, '0')}`;
const at = t => S.reduce((a, b) => Math.abs(b.t - t) < Math.abs(a.t - t) ? b : a);
const root = document.documentElement, heroEl = document.getElementById('hero'), skyEl = document.querySelector('.sky'), hdr = document.getElementById('hdr'), ticksEl = document.getElementById('ticks');
// Smooth scroll (off for reduced motion). Held while the intro plays.
if (!reduce) {
  const lenis = new Lenis({ autoRaf: true, anchors: { offset: -90 }, lerp: 0.09 });
  window.__lenis = lenis;
  if (root.classList.contains('is-loading')) { lenis.stop(); document.addEventListener('av:open', () => lenis.start(), { once: true }); }
}

// Clouds in two depths
const cloudHTML = (n, top, big) => Array.from({ length: n }, () => `<i style="top:${top[0] + Math.random() * (top[1] - top[0])}%;width:${(big ? 38 : 22) + Math.random() * 26}vw;height:${(big ? 12 : 7) + Math.random() * 7}vw;animation-duration:${(big ? 45 : 90) + Math.random() * 60}s;animation-delay:-${Math.random() * 140}s;opacity:${.45 + Math.random() * .4}"></i>`).join('');
far.innerHTML = cloudHTML(9, [5, 85], false); near.innerHTML = cloudHTML(4, [55, 95], true);
if (!reduce) addEventListener('pointermove', e => { const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5; far.style.transform = `translate(${x * -18}px, ${y * -10}px)`; near.style.transform = `translate(${x * -56}px, ${y * -26}px)`; }, { passive: true });

// Scroll maps onto mission time between sections; altitude comes from the simulated profile.
const secs = [...document.querySelectorAll('section[data-t]')];
let tops = [], maxScroll = 1, ticking = false;
// ---- How it works: scene holds, slides away, then one beam travels the flowchart from Before to After
const how = document.getElementById('how'), howTrack = document.getElementById('howTrack'), howFlow = document.getElementById('howFlow');
const fsvg = document.getElementById('flowSvg'), beam = document.getElementById('beam'), laneReveal = document.getElementById('laneReveal');
const fNodes = [...fsvg.querySelectorAll('.nd[data-x]')].filter(n => !n.closest('.chips')).map(n => ({ n, x: +n.dataset.x }));
const fBranches = [...fsvg.querySelectorAll('.br')], fItems = [...fsvg.querySelectorAll('.it')], fChips = fsvg.querySelector('.chips');
const GATE = [242, 746, 933], X0 = 150, X1 = 1090; const trail = document.getElementById('trail'); // where each stage's branch leaves the main line
const pinned = () => matchMedia('(min-width: 900px)').matches && !reduce;
let H = { travel: 0, dwellA: 0, run: 0, top: 0 };
// one number drives the whole diagram: bx = the beam's x on the main line
function flowAt(bx) {
  beam.setAttribute('transform', `translate(${bx} 153)`);
  beam.style.opacity = bx <= X0 + 1 || bx >= X1 - 1 ? 0 : 1;
  laneReveal.setAttribute('width', Math.max(0, bx + 30));
  trail.style.strokeDashoffset = (1 - (bx - X0) / (X1 - X0)).toFixed(4);
  fNodes.forEach(({ n, x }) => n.classList.toggle('on', bx >= x - 4));
  fBranches.forEach(b => { const g = +b.dataset.g, k = Math.min(1, Math.max(0, (bx - GATE[g]) / 90)); b.style.strokeDashoffset = (1 - k).toFixed(3); });
  fItems.forEach(t => { const g = +t.dataset.g, k = +t.dataset.k; t.classList.toggle('on', bx >= GATE[g] + 26 + k * 12); });
  fChips.classList.toggle('on', bx >= 560);
}
const howScene = how.querySelector('.how-scene'), howNext = document.getElementById('howNext'), howPrev = document.getElementById('howPrev');
const glide = y => window.__lenis ? window.__lenis.scrollTo(y, { duration: 1.6 }) : scrollTo({ top: y, behavior: 'smooth' });
howNext.addEventListener('click', () => glide(H.top + H.dwellA + H.travel + 4));
howPrev.addEventListener('click', () => glide(H.top + 2));
function howMeasure() {
  if (!pinned()) { how.style.height = ''; howTrack.style.transform = ''; flowAt(X1); return; }
  const vw = innerWidth, vh = innerHeight;
  // travel = scroll spent on the hand-over (card leaves, flowchart arrives, background fades in)
  H.travel = vh * 1.1; H.dwellA = vh * .7; H.run = vh * 1.6;
  // the next-chapter card: fills the scene's right column, clear of the tick rail
  const col = Math.max(250, (vw - 1200) / 2 + 180), w = col - 92;
  H.s0 = w / vw; H.x0 = vw - 72 - w; H.y0 = (vh - H.s0 * vh) / 2 - 36;
  H.xL = 72; // the scene lies to the left of the flowchart, so its card waits on the left
  [[howNext, H.x0], [howPrev, H.xL]].forEach(([b, x]) => { Object.assign(b.style, { left: `${x}px`, top: `${H.y0}px`, width: `${w}px` }); b.querySelector('.frame').style.height = `${H.s0 * vh}px`; });
  how.style.height = `${vh + H.dwellA + H.travel + H.run + vh * .3}px`;
  H.top = how.offsetTop;
}
// Two directions, one gesture. Leaving the scene (fwd): the scene slides left and the flowchart grows from its Next card.
// Leaving the flowchart (back): the flowchart slides right and the scene grows from its Previous card on the left.
// The direction is chosen only at rest on either screen, so a reversal mid-way simply rewinds.
let howMode = null;
const grow = (el, t, x) => { const sc = H.s0 + (1 - H.s0) * t;
  el.style.transform = `translate3d(${((1 - t) * x).toFixed(1)}px, ${((1 - t) * H.y0).toFixed(1)}px, 0) scale(${sc.toFixed(4)})`;
  el.style.setProperty('--r', `${(16 * (1 - t) / sc).toFixed(1)}px`); el.style.opacity = 1; };
const slide = (el, t, dir) => { el.style.transform = `translate3d(${(dir * t * 105).toFixed(2)}vw, 0, 0)`; el.style.setProperty('--r', '0px'); el.style.opacity = (1 - t * .5).toFixed(3); };
const card = (b, v) => { b.style.opacity = v.toFixed(3); b.style.visibility = v > 0 ? '' : 'hidden'; };
function setHowMode(m) {
  if (m === howMode) return; const first = howMode === null; howMode = m;
  howScene.style.zIndex = m === 'back' ? 2 : 1; howFlow.style.zIndex = m === 'back' ? 1 : 2;
  // the waiting card for the other screen fades in once you are at rest
  if (!first && !reduce) [m === 'fwd' ? howFlow : howScene, m === 'fwd' ? howNext : howPrev].forEach(el => el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600, easing: 'ease-out' }));
}
function howUpdate() {
  if (!pinned()) return;
  const y = scrollY - H.top, raw = Math.min(1, Math.max(0, (y - H.dwellA) / H.travel)), k = raw < .5 ? 4 * raw ** 3 : 1 - Math.pow(-2 * raw + 2, 3) / 2;
  if (raw <= 0) setHowMode('fwd'); else if (raw >= 1) setHowMode('back'); else if (!howMode) setHowMode(raw < .5 ? 'fwd' : 'back');
  if (howMode === 'fwd') {
    slide(howScene, k, -1); grow(howFlow, k, H.x0);
    card(howNext, Math.max(0, 1 - k * 6)); card(howPrev, 0);
    howNext.style.setProperty('--f', Math.min(1, Math.max(0, y / H.dwellA)).toFixed(3));
  } else {
    const b = 1 - k; slide(howFlow, b, 1); grow(howScene, b, H.xL);
    card(howPrev, Math.max(0, 1 - b * 6)); card(howNext, 0);
    // fills as you scroll back up towards the scene
    howPrev.style.setProperty('--f', Math.min(1, Math.max(0, 1 - (y - H.dwellA - H.travel) / H.run)).toFixed(3));
  }
  howFlow.style.setProperty('--k', howMode === 'fwd' ? k.toFixed(3) : 1);
  howFlow.classList.toggle('live', k > .95);
  const p = Math.min(1, Math.max(0, (y - H.dwellA - H.travel * .8) / H.run));
  flowAt(X0 + (X1 - X0) * p);
}
document.fonts?.ready.then(() => { measure(); onScroll(); });
function measure() {
  howMeasure(); tops = secs.map(s => s.offsetTop + s.offsetHeight * .5); maxScroll = Math.max(1, document.documentElement.scrollHeight - innerHeight); }
let menuOpen = false;
function update() {
  ticking = false;
  howUpdate();
  const y = scrollY + innerHeight * .5;
  let t = 0;
  if (y <= tops[0]) t = 0; else if (y >= tops.at(-1)) t = +secs.at(-1).dataset.t;
  else for (let i = 0; i < tops.length - 1; i++) if (y >= tops[i] && y < tops[i + 1]) { const f = (y - tops[i]) / (tops[i + 1] - tops[i]); t = +secs[i].dataset.t + f * (secs[i + 1].dataset.t - secs[i].dataset.t); }
  const s = at(t);
  const p = Math.min(1, scrollY / maxScroll).toFixed(4);
  hdr.style.setProperty('--p', p);
  skyEl.style.setProperty('--alt', (s.alt / 4000).toFixed(3));
  // Hero hand-off progress: 0 at the top, 1 once the runway sheet covers the screen.
  const f = Math.min(1, scrollY / innerHeight), gone = f >= 1;
  heroDim.style.opacity = (f * .5).toFixed(3);
  hdr.classList.toggle('clear', f < .85); ticksEl.classList.toggle('hide', f < .85);
  // the header steps aside while reading down, and returns on the way back up
  const dy = scrollY - (update.lastY ?? scrollY); update.lastY = scrollY;
  if (!menuOpen) { if (scrollY > innerHeight * 1.1 && dy > 4) hdr.classList.add('away'); else if (dy < -4 || scrollY < innerHeight) hdr.classList.remove('away'); }
  root.classList.toggle('hdr-away', hdr.classList.contains('away'));
  if (gone !== heroEl.classList.contains('gone')) { heroEl.classList.toggle('gone', gone); gone ? heroVideo.pause() : heroVideo.play().catch(() => {}); }
}
const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
measure();
addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', () => { measure(); onScroll(); }); addEventListener('load', () => { measure(); onScroll(); }); update();

// ---- Navigation A: current section in the header (rolling label), tick rail, full-screen index
const NOW = { hero: 'Intelligence in every flight', problem: "<b>01</b>The problem", how: "<b>02</b>How it works", built: "<b>03</b>What we built", whatsnew: "<b>04</b>What's new", demo: "<b>05</b>Demo", security: "<b>06</b>Security", roadmap: "<b>07</b>Roadmap", why: "<b>08</b>Why AVOFLARE", close: 'Intelligence in every flight' };
const nowText = document.getElementById('nowText'); let nowKey = 'hero';
function setNow(key) {
  if (!NOW[key] || key === nowKey) return; nowKey = key;
  if (reduce || !nowText.animate) { nowText.innerHTML = NOW[key]; return; }
  nowText.animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-100%)', opacity: 0 }], { duration: 220, easing: 'cubic-bezier(.5,0,.75,0)' }).finished.then(() => {
    nowText.innerHTML = NOW[nowKey]; nowText.animate([{ transform: 'translateY(100%)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }], { duration: 420, easing: 'cubic-bezier(.16,1,.3,1)' }); });
}
const links = [...document.querySelectorAll('#ticks a')];
const secIO = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; setNow(e.target.id); links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === `#${e.target.id}`)); }), { rootMargin: '-45% 0px -50% 0px' });
secIO.observe(heroEl);
// index overlay
const menu = document.getElementById('menu'), menuBtn = document.getElementById('menuBtn'), menuImgs = [...menu.querySelectorAll('.menu-media img')], menuCap = document.getElementById('menuCap');

function openMenu() {
  const r = menuBtn.getBoundingClientRect(); menu.style.setProperty('--mx', `${r.left + r.width / 2}px`); menu.style.setProperty('--my', `${r.top + r.height / 2}px`);
  menuOpen = true; menu.inert = false; menu.classList.add('open'); menuBtn.setAttribute('aria-expanded', 'true'); hdr.classList.remove('away'); window.__lenis?.stop();
  menu.querySelectorAll('.menu-list a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === `#${nowKey}`));
  setTimeout(() => (menu.querySelector('.menu-list a.on') || menu.querySelector('.menu-list a')).focus({ preventScroll: true }), 420);
}
function closeMenu(then) {
  menuOpen = false; menu.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); window.__lenis?.start();
  setTimeout(() => { menu.inert = true; then ? then() : menuBtn.focus({ preventScroll: true }); }, reduce ? 0 : 520);
}
menuBtn.addEventListener('click', openMenu);
document.getElementById('menuClose').addEventListener('click', () => closeMenu());
addEventListener('keydown', e => { if (e.key === 'Escape' && menuOpen) closeMenu(); });
menu.addEventListener('keydown', e => { if (e.key !== 'Tab') return; const f = [...menu.querySelectorAll('a, button')], a = f[0], z = f.at(-1);
  if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } });
menu.querySelectorAll('[data-img]').forEach(el => { const show = () => { menuImgs.forEach((m, i) => m.classList.toggle('on', i === +el.dataset.img)); menuCap.textContent = el.querySelector('.d').textContent; };
  el.addEventListener('pointerenter', show); el.addEventListener('focus', show); });
menu.addEventListener('click', e => { const a = e.target.closest('a[href^="#"]'); if (!a) return; e.preventDefault();
  const target = document.querySelector(a.getAttribute('href')); closeMenu(() => { window.__lenis ? window.__lenis.scrollTo(target, { offset: 0 }) : target.scrollIntoView({ behavior: 'smooth' }); target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); }); });
[document.getElementById('problem'), document.getElementById('how'), document.getElementById('built'), document.getElementById('whatsnew'), document.getElementById('demo'), document.getElementById('security'), document.getElementById('roadmap'), document.getElementById('why')].forEach(s => secIO.observe(s)); secIO.observe(document.getElementById('close'));
// wheel over the embedded player scrolls this page
addEventListener('message', e => { if (e.origin === location.origin && e.data?.av === 'wheel') window.__lenis ? window.__lenis.scrollTo(window.__lenis.targetScroll + e.data.dy) : scrollBy(0, e.data.dy); });
// the embedded sequence plays only while it is on screen
{ const reel = document.getElementById('howReel'), send = on => reel.contentWindow?.postMessage({ av: 'view', on }, location.origin);
  let vis = false; new IntersectionObserver(([e]) => { vis = e.isIntersecting; send(vis); }, { threshold: .45 }).observe(reel);
  reel.addEventListener('load', () => send(vis)); }

// Reveal in sequence
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .15 });
document.querySelectorAll('.rv').forEach(el => io.observe(el));
// ---- 9 · Why AVOFLARE
(() => {
  const fmt = (v, dec) => v.toLocaleString('en', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  // 1 · the stakes count up once; the 51 % bar fills with them
  const stakes = document.getElementById('whyStakes'), bar = stakes.querySelector('.ws-bar');
  const count = (el, f) => { const to = +el.dataset.to, dec = +(el.dataset.dec || 0), suf = el.dataset.suf || ''; el.textContent = fmt(to * f, dec) + suf; };
  const figs = [...stakes.querySelectorAll('b[data-to]')];
  new IntersectionObserver(([e], o) => { if (!e.isIntersecting) return; o.disconnect();
    if (reduce) { figs.forEach(b => count(b, 1)); bar.style.setProperty('--f', 1); return; }
    const t0 = performance.now(); const step = n => { const f = Math.min(1, (n - t0) / 1800), k = 1 - Math.pow(1 - f, 4); figs.forEach(b => count(b, k)); bar.style.setProperty('--f', k.toFixed(3)); if (f < 1) requestAnimationFrame(step); }; requestAnimationFrame(step);
  }, { threshold: .4 }).observe(stakes);
  // 2 · the timeline draws with the scroll and rewinds when you scroll back
  const late = document.getElementById('whyLate'), svg = document.getElementById('wlSvg'), gap = document.getElementById('wlGap'), early = document.getElementById('wlEarly'), lateMk = document.getElementById('wlLate');
  const E = 250, Lx = 440;
  const draw = () => { const r = late.getBoundingClientRect(), p = reduce ? 1 : Math.min(1, Math.max(0, (innerHeight * .85 - r.top) / (r.height * .9)));
    svg.style.setProperty('--wp', p.toFixed(3)); const x = 30 + 480 * p;
    early.classList.toggle('on', x >= E); lateMk.classList.toggle('on', x >= Lx); gap.setAttribute('width', Math.max(0, Math.min(x, Lx) - E)); svg.classList.toggle('g', x >= Lx); };
  addEventListener('scroll', draw, { passive: true }); addEventListener('resize', draw); draw();
  // 3 · tiles rise when the grid is seen
  const fit = document.querySelector('.why-fit'); new IntersectionObserver(([e], o) => { if (e.isIntersecting) { fit.classList.add('in'); o.disconnect(); } }, { threshold: .2 }).observe(fit);
  // 4 · role switcher: sliding pill, card flips to the new role
  const tabs = [...document.querySelectorAll('#wrTabs button')], ind = document.getElementById('wrInd'), card = document.getElementById('wrCard');
  const roles = card.dataset.roles.split('|').map(x => x.split('~')), roleEl = document.getElementById('wrRole'), textEl = document.getElementById('wrText');
  let cur = 0;
  const pill = () => { const b = tabs[cur]; ind.style.setProperty('--ix', `${b.offsetLeft}px`); ind.style.setProperty('--iy', `${b.offsetTop}px`); ind.style.setProperty('--iw', `${b.offsetWidth}px`); ind.style.setProperty('--ih', `${b.offsetHeight}px`); };
  const pick = k => { if (k === cur) return; const dir = k > cur ? 1 : -1; cur = k;
    tabs.forEach((b, i) => { b.setAttribute('aria-selected', i === k); b.tabIndex = i === k ? 0 : -1; }); pill();
    const swap = () => { roleEl.textContent = roles[k][0]; textEl.textContent = roles[k][1]; };
    if (reduce) return swap();
    card.animate([{ transform: 'rotateY(0)', opacity: 1 }, { transform: `rotateY(${dir * -90}deg)`, opacity: .3 }], { duration: 260, easing: 'cubic-bezier(.5,0,.75,0)' }).finished.then(() => { swap();
      card.animate([{ transform: `rotateY(${dir * 90}deg)`, opacity: .3 }, { transform: 'rotateY(0)', opacity: 1 }], { duration: 420, easing: 'cubic-bezier(.16,1,.3,1)' }); });
  };
  tabs.forEach((b, i) => b.addEventListener('click', () => pick(i)));
  document.getElementById('wrTabs').addEventListener('keydown', e => { const to = { ArrowRight: (cur + 1) % tabs.length, ArrowLeft: (cur + tabs.length - 1) % tabs.length }[e.key]; if (to === undefined) return; e.preventDefault(); pick(to); tabs[to].focus(); });
  new ResizeObserver(pill).observe(document.getElementById('wrTabs')); document.fonts?.ready.then(pill);
  // 5 · the closing line arrives word by word
  const close = document.getElementById('wnClose');
  close.innerHTML = close.textContent.split(' ').map((w, i, a) => `<span class="w${i >= a.length - 2 ? ' hi' : ''}" style="--n:${i}">${w}</span>`).join(' ');
  new IntersectionObserver(([e], o) => { if (e.isIntersecting) { close.classList.add('go'); o.disconnect(); } }, { threshold: .6 }).observe(close);
})();

// ---- 8 · Roadmap: the climb profile draws to "we are here", nodes light as the aircraft passes, then the cards rise
(() => {
  const body = document.getElementById('rmBody'), svg = document.getElementById('rmSvg'), ac = document.getElementById('rmAc');
  const W = 1200, H = 210, NOW = 535; // x of "we are here": about half way through phase 2 (300-600)
  // altitude = maturity: ground roll, climb, step climb, cruise
  const d = 'M0 188 C 120 188, 200 186, 300 158 C 390 132, 510 110, 600 92 C 700 74, 800 64, 900 52 C 1000 42, 1100 38, 1200 36';
  ['rmPastP', 'rmFut'].forEach(id => document.getElementById(id).setAttribute('d', d));
  document.getElementById('rmArea').setAttribute('d', `${d} L1200 190 L0 190 Z`);
  const path = document.getElementById('rmPastP'), L = path.getTotalLength();
  const atX = x => { let lo = 0, hi = L; for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; path.getPointAtLength(m).x < x ? lo = m : hi = m; } return lo; };
  const lNow = atX(NOW), nodes = [...body.querySelectorAll('.rm-node')], xs = [0, 300, 600, 900].map(x => x + 150);
  const pastR = document.getElementById('rmPastR'), futR = document.getElementById('rmFutR');
  futR.setAttribute('x', NOW); futR.setAttribute('width', W - NOW);
  nodes.forEach((n, k) => { const p = path.getPointAtLength(atX(xs[k])); n.style.setProperty('--x', `${p.x / W * 100}%`); n.style.setProperty('--y', `${p.y / H * 100}%`); });
  const place = l => {
    const p = path.getPointAtLength(l), q = path.getPointAtLength(Math.min(L, l + 6)), r = body.querySelector('.rm-prof').getBoundingClientRect();
    const ang = Math.atan2((q.y - p.y) * r.height / H, (q.x - p.x) * r.width / W) * 180 / Math.PI;
    ac.style.setProperty('--ax', `${p.x / W * 100}%`); ac.style.setProperty('--ay', `${p.y / H * 100}%`); ac.style.setProperty('--ar', `${ang.toFixed(1)}deg`);
    pastR.setAttribute('width', p.x);
    nodes.forEach((n, k) => { n.classList.toggle('lit', p.x >= xs[k] - 2 && k === 0); n.classList.toggle('cur', k === 1 && p.x >= xs[1] - 60); });
  };
  const run = () => {
    body.classList.add('go');
    if (reduce) { place(lNow); body.classList.add('parked'); return; }
    const t0 = performance.now(), dur = 1700;
    const step = n => { const f = Math.min(1, (n - t0) / dur), e = 1 - Math.pow(1 - f, 3); place(lNow * e); if (f < 1) requestAnimationFrame(step); else body.classList.add('parked'); };
    requestAnimationFrame(step);
  };
  place(0);
  new IntersectionObserver(([e], o) => { if (e.isIntersecting) { o.disconnect(); run(); } }, { threshold: .3 }).observe(body);
  addEventListener('resize', () => { if (body.classList.contains('parked')) place(lNow); });
  // hover or focus a card: its stretch of the profile lights up
  const bands = [...svg.querySelectorAll('.rm-hl rect')];
  body.querySelectorAll('.rm-card').forEach((c, k) => {
    const on = v => { bands[k].classList.toggle('on', v); nodes[k].classList.toggle('on', v); };
    c.addEventListener('pointerenter', () => on(true)); c.addEventListener('pointerleave', () => on(false));
    c.addEventListener('focus', () => on(true)); c.addEventListener('blur', () => on(false));
  });
})();

// ---- 5 · Demo player. To use the real video, change DEMO below: file, poster and chapter start times (seconds).
(() => {
  const DEMO = { src: innerWidth < 900 ? '/media/v/demo-placeholder-720.mp4' : '/media/v/demo-placeholder.mp4',
    chapters: [...document.querySelectorAll('#dpList button')].map(b => ({ t: +b.dataset.t, title: b.querySelector('.ct').textContent })) };
  const $ = id => document.getElementById(id), dp = $('dp'), v = $('dpVideo'), fill = $('dpFill'), track = $('dpTrack'), time = $('dpTime'), chapEl = $('dpChap'), hover = $('dpHover');
  const items = [...document.querySelectorAll('#dpList li')], root = document.documentElement, fmt = t => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
  let loaded = false, idleT, curCh = -1;
  const load = () => { if (loaded) return; loaded = true; v.src = DEMO.src; };
  const chapterAt = t => { let k = 0; DEMO.chapters.forEach((c, i) => { if (t >= c.t) k = i; }); return k; };
  const dur = () => v.duration || 46;
  function paint() {
    const t = v.currentTime, d = dur(), k = chapterAt(t);
    fill.style.setProperty('--p', `${(t / d) * 100}%`); time.textContent = `${fmt(t)} / ${fmt(d)}`; track.setAttribute('aria-valuenow', Math.round(t));
    items.forEach((li, i) => { const a = DEMO.chapters[i].t, b = DEMO.chapters[i + 1]?.t ?? d; li.querySelector('.cf').style.setProperty('--cp', Math.min(1, Math.max(0, (t - a) / (b - a))).toFixed(3)); });
    if (k !== curCh) { curCh = k; items.forEach((li, i) => li.classList.toggle('on', i === k)); chapEl.innerHTML = `<small>CHAPTER ${String(k + 1).padStart(2, '0')}</small>${DEMO.chapters[k].title}`;
      if (!reduce) chapEl.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 600, easing: 'cubic-bezier(.16,1,.3,1)' }); }
  }
  const ticks = () => { $('dpTicks').innerHTML = DEMO.chapters.slice(1).map(c => `<i style="left:${(c.t / dur()) * 100}%"></i>`).join(''); };
  const play = () => { load(); v.play().catch(() => {}); };
  const toggle = () => v.paused ? play() : v.pause();
  const seek = t => { load(); v.currentTime = Math.max(0, Math.min(dur() - .05, t)); paint(); };
  const wake = () => { dp.classList.remove('idle'); clearTimeout(idleT); if (!v.paused) idleT = setTimeout(() => dp.classList.add('idle'), 2600); };
  v.addEventListener('play', () => { dp.classList.add('playing'); root.classList.add('lights-down'); $('dpPlay').setAttribute('aria-label', 'Pause'); wake(); });
  v.addEventListener('pause', () => { dp.classList.remove('playing', 'idle'); root.classList.remove('lights-down'); $('dpPlay').setAttribute('aria-label', 'Play'); });
  v.addEventListener('ended', () => { v.currentTime = 0; paint(); });
  v.addEventListener('timeupdate', paint); v.addEventListener('loadedmetadata', () => { ticks(); paint(); });
  v.addEventListener('progress', () => { if (v.buffered.length) track.style.setProperty('--buf', `${(v.buffered.end(v.buffered.length - 1) / dur()) * 100}%`); });
  $('dpBig').addEventListener('click', play); $('dpPlay').addEventListener('click', toggle);
  v.addEventListener('click', toggle);
  $('dpMute').addEventListener('click', e => { v.muted = !v.muted; e.currentTarget.setAttribute('aria-pressed', v.muted); e.currentTarget.setAttribute('aria-label', v.muted ? 'Unmute' : 'Mute'); });
  $('dpFull').addEventListener('click', () => document.fullscreenElement ? document.exitFullscreen() : dp.requestFullscreen?.());
  // seek: click or drag on the bar, arrows when focused; hover shows the chapter under the pointer
  const tAt = e => { const r = track.getBoundingClientRect(); return Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * dur(); };
  let drag = false;
  track.addEventListener('pointerdown', e => { drag = true; track.setPointerCapture(e.pointerId); seek(tAt(e)); });
  track.addEventListener('pointermove', e => { const t = tAt(e), r = track.getBoundingClientRect(); hover.style.setProperty('--hx', `${e.clientX - r.left}px`); hover.innerHTML = `<b>${fmt(t)}</b>${DEMO.chapters[chapterAt(t)].title}`; if (drag) seek(t); });
  track.addEventListener('pointerup', () => { drag = false; });
  dp.addEventListener('keydown', e => {
    const k = e.key.toLowerCase(), m = { ' ': toggle, k: toggle, arrowright: () => seek(v.currentTime + 5), arrowleft: () => seek(v.currentTime - 5), f: () => $('dpFull').click(), m: () => $('dpMute').click() }[k];
    if (!m || (e.target.tagName === 'BUTTON' && (k === ' ' || k === 'enter'))) return; e.preventDefault(); m(); wake();
  });
  dp.addEventListener('pointermove', wake);
  items.forEach((li, i) => li.querySelector('button').addEventListener('click', () => { seek(DEMO.chapters[i].t); play(); }));
  // load the file only when the section is near; pause (and lights up) when it leaves the screen
  new IntersectionObserver(([e]) => { if (e.isIntersecting) load(); }, { rootMargin: '400px 0px' }).observe(dp);
  new IntersectionObserver(([e]) => { if (!e.isIntersecting && !v.paused) v.pause(); }, { threshold: .25 }).observe(dp);
  ticks(); paint();
})();

// ---- 4 · What's new: the step in the middle of the screen drives the sticky panel
(() => {
  const steps = [...document.querySelectorAll('.wn-step')], panel = document.getElementById('wnPanel'), vis = [...panel.querySelectorAll('.wn-vis')];
  const rail = [...panel.querySelectorAll('.wn-rail button')], title = document.getElementById('wnTitle');
  const TITLES = ['Physics vs measured', 'An alert and its reasons', 'Recommendation', 'Planned'];
  let cur = -1;
  const set = k => {
    if (k === cur) return; cur = k; panel.dataset.k = k; title.textContent = TITLES[k];
    steps.forEach((s, i) => s.classList.toggle('on', i === k));
    vis.forEach((v, i) => v.classList.toggle('on', i === k)); // leaving resets the animation, so it replays on return
    rail.forEach((b, i) => b.setAttribute('aria-current', i === k));
  };
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) set(+e.target.dataset.k); }), { rootMargin: '-45% 0px -45% 0px' });
  steps.forEach(s => io.observe(s));
  rail.forEach((b, i) => b.addEventListener('click', () => { const y = steps[i].getBoundingClientRect().top + scrollY + steps[i].offsetHeight / 2 - innerHeight / 2; window.__lenis ? window.__lenis.scrollTo(y, { duration: 1.2 }) : scrollTo({ top: y, behavior: 'smooth' }); }));
  set(0);

  // 1 · physics vs measured: one illustrative curve pair
  const X0 = 36, X1 = 500, N = 60, px = i => X0 + (X1 - X0) * i / N;
  const phys = i => 236 - 120 * (1 - Math.exp(-i / 11)) + 5 * Math.sin(i / 3.2);
  const drift = i => i < 34 ? 0 : Math.pow(i - 34, 1.35) * .85;
  const meas = i => phys(i) - drift(i) + Math.sin(i * 1.7) * 2.2 + Math.sin(i * 4.1) * 1.3;
  const B = 13, P = [...Array(N + 1).keys()];
  const line = f => P.map(i => `${i ? 'L' : 'M'}${px(i).toFixed(1)} ${f(i).toFixed(1)}`).join(' ');
  document.getElementById('pvmPhys').setAttribute('d', line(phys));
  document.getElementById('pvmMeas').setAttribute('d', line(meas));
  document.getElementById('pvmBand').setAttribute('d', `${P.map(i => `${i ? 'L' : 'M'}${px(i).toFixed(1)} ${(phys(i) - B).toFixed(1)}`).join(' ')} ${[...P].reverse().map(i => `L${px(i).toFixed(1)} ${(phys(i) + B).toFixed(1)}`).join(' ')} Z`);
  const g0 = P.find(i => phys(i) - B - meas(i) > 0) ?? 40, G = P.filter(i => i >= g0);
  document.getElementById('pvmGap').setAttribute('d', `${G.map((i, n) => `${n ? 'L' : 'M'}${px(i).toFixed(1)} ${Math.min(meas(i), phys(i) - B).toFixed(1)}`).join(' ')} ${[...G].reverse().map(i => `L${px(i).toFixed(1)} ${(phys(i) - B).toFixed(1)}`).join(' ')} Z`);
  const fl = document.getElementById('pvmFlag'), fi = N - 4; fl.style.setProperty('--fx', `${px(fi).toFixed(1)}px`); fl.style.setProperty('--fy', `${meas(fi).toFixed(1)}px`);

  // 3 · the engineer decides
  const rec = document.getElementById('rec'), recText = document.getElementById('recText'), reset = document.getElementById('recReset');
  const MSG = { ok: 'Approved by the engineer. Added to the maintenance plan.', later: 'Deferred by the engineer. The engine stays under watch.', wait: 'Waiting for the engineer' };
  const decide = v => { rec.dataset.state = v; recText.textContent = MSG[v]; reset.hidden = v === 'wait'; };
  rec.querySelectorAll('.rec-btns button').forEach(b => b.addEventListener('click', () => decide(b.dataset.v)));
  reset.addEventListener('click', () => { decide('wait'); rec.querySelector('.rec-btns .ok').focus(); });
})();

// ---- 3 · What we built: tabs switch the stage; one loop drives the rotating dashboard, the CAN log and the fault playhead
(() => {
  const $ = id => document.getElementById(id), clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v)), fmt = n => n.toLocaleString('en');
  const rail = $('btRail'), tabs = [...rail.querySelectorAll('.bt-tab')], panes = tabs.map(t => $(t.getAttribute('aria-controls')));
  const stage = $('btStage'), TONE = ['ok', 'sim', 'proto', 'sim', 'fault'];
  const frames = [...document.querySelectorAll('#gcsStack .bf')], sw = [...document.querySelectorAll('.gcs-switch button')], cap = $('gcsCap');
  const CAPS = ['Mission and engine overview, with the 3D engine twin.', 'Flight display, engine gauges and a live alert.', 'The engine twin, its health index and the parts that need attention.', 'Plan a mission, check the predicted risk and replay past flights.'];
  let cur = 0, shot = 0, auto = !reduce, seen = false, held = false, D, simKey = '', t0 = null;

  // ---- tabs
  const place = () => { const t = tabs[cur]; rail.style.setProperty('--ix', `${t.offsetLeft}px`); rail.style.setProperty('--iw', `${t.offsetWidth}px`); };
  new ResizeObserver(place).observe(rail); document.fonts?.ready.then(place);
  const show = k => {
    if (k === cur) return;
    stage.style.setProperty('--dir', k > cur ? 1 : -1);
    panes.forEach(p => { p.hidden = false; p.classList.remove('was'); }); stage.offsetWidth;
    panes[cur].classList.add('was');
    cur = k; stage.dataset.tone = TONE[k];
    tabs.forEach((t, i) => { const on = i === k; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; panes[i].classList.toggle('on', on); });
    place(); tabs[k].scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduce ? 'auto' : 'smooth' });
    setTimeout(() => panes.forEach((p, i) => { if (i !== cur) p.hidden = true; }), 700);
    if (k === 1) { simKey = ''; drawSim(); factsCount(); } if (k === 3) countUp(); if (k === 2) cmpIntro();
  };
  const stop = () => { auto = false; tabs[0].style.setProperty('--prog', 0); };
  tabs.forEach((t, i) => t.addEventListener('click', () => { stop(); show(i); }));
  rail.addEventListener('keydown', e => { const to = { ArrowRight: (cur + 1) % tabs.length, ArrowLeft: (cur + tabs.length - 1) % tabs.length, Home: 0, End: tabs.length - 1 }[e.key]; if (to === undefined) return; e.preventDefault(); stop(); show(to); tabs[to].focus(); });

  // ---- 1 · dashboard deck
  const pick = k => {
    shot = k; pinK = -1; pinT = 1000; const n = frames.length; frames.forEach((f, i) => { f.style.setProperty('--d', (i - k + n) % n); f.classList.toggle('front', i === k); }); sw.forEach((b, i) => b.setAttribute('aria-pressed', i === k));
    if (cap.textContent !== CAPS[k]) { cap.textContent = CAPS[k]; if (!reduce) cap.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 500, easing: 'cubic-bezier(.16,1,.3,1)' }); }
  };
  sw.forEach((b, i) => b.addEventListener('click', () => { stop(); pick(i); }));
  frames.forEach((f, i) => f.addEventListener('click', () => { if (i !== shot) { stop(); pick(i); } }));
  stage.addEventListener('pointerenter', () => held = true); stage.addEventListener('pointerleave', () => held = false);
  stage.addEventListener('focusin', () => held = true); stage.addEventListener('focusout', () => held = false);
  let fanned = false;
  new IntersectionObserver(([e]) => { seen = e.isIntersecting; if (seen && !fanned && cur === 0) { fanned = true; fan(); } }, { threshold: .35 }).observe(stage);
  // the four windows start as one stack and fan out to their places
  function fan() {
    if (reduce) return;
    frames.forEach((f, i) => { const to = getComputedStyle(f).transform; f.animate([{ transform: 'translateY(0) scale(1)' }, { transform: to }], { duration: 1000, delay: 150 + (frames.length - 1 - i) * 90, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' }); });
  }

  // ---- data from the MATLAB runs (scripts/export-built.mjs)
  Promise.resolve(builtData).then(d => { D = d; facts(); canLog(); if (cur === 1) drawSim(); });
  function facts() {
    const rows = D.profile.rows, maxAlt = Math.max(...rows.map(r => r[1])), maxSpd = Math.max(...rows.map(r => r[2]));
    $('simFacts').innerHTML = [['2 h', 'mission length'], [`${fmt(Math.round(D.distance_km))} km`, 'flown'], [`${fmt(maxAlt)} m`, 'highest altitude'], [`${maxSpd} m/s`, 'top airspeed'], ['144,001', 'samples, one every 0.05 s']].map(([b, s]) => `<div><b>${b}</b><span>${s}</span></div>`).join('');
  }

  function factsCount() {
    if (reduce) return;
    $('simFacts').querySelectorAll('b').forEach((b, i) => {
      b.dataset.end ||= b.textContent; const m = b.dataset.end.match(/^([\d,.]+)(.*)$/); if (!m) return;
      const end = parseFloat(m[1].replace(/,/g, '')), dec = (m[1].split('.')[1] || '').length, suf = m[2], t0 = performance.now() + 250 + i * 90;
      const step = n => { const f = clamp((n - t0) / 1300, 0, 1); b.textContent = (end * (1 - Math.pow(1 - f, 4))).toLocaleString('en', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf; if (f < 1) requestAnimationFrame(step); };
      b.textContent = `0${suf}`; requestAnimationFrame(step);
    });
  }
  // ---- 2 · mission chart with a read-out cursor
  const wrap = $('simWrap'), svg = $('simSvg'), tip = $('simTip'); let geo = null, ct = 3600, sweepId = 0;
  const rowsAt = t => { const r = D.profile.rows, i = Math.min(r.length - 2, Math.floor(t / 30)), f = (t - r[i][0]) / 30, a = r[i], b = r[i + 1]; return [a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f]; };
  const phaseAt = t => (D.phases.find(p => t >= p.from && t <= p.to + .06) || { name: 'SURVEILLANCE' }).name;
  function setCur(t) {
    if (!geo || !D) return; ct = t = clamp(t, 0, 7200); const [alt, spd] = rowsAt(t), X = geo.x(t), YA = geo.ya(alt), YS = geo.ys(spd);
    geo.line.setAttribute('x1', X); geo.line.setAttribute('x2', X); geo.c1.setAttribute('cx', X); geo.c1.setAttribute('cy', YA); geo.c2.setAttribute('cx', X); geo.c2.setAttribute('cy', YS);
    const [a2] = rowsAt(Math.min(7200, t + 60)), ang = Math.atan2(-(geo.ya(a2) - YA), geo.x(Math.min(7200, t + 60)) - X) * -180 / Math.PI;
    geo.plane.setAttribute('transform', `translate(${X} ${YA - 16}) rotate(${clamp(ang, -35, 35).toFixed(1)})`);
    const ph = phaseAt(t); geo.bands.forEach((b, i) => b.classList.toggle('hot', D.phases[i].name === ph));
    const m = Math.round(t / 60);
    tip.innerHTML = `<b>MINUTE ${m} · ${phaseAt(t)}</b>Altitude <strong>${fmt(Math.round(alt))} m</strong><br>Airspeed command <strong>${Math.round(spd)} m/s</strong>`;
    const tw = tip.offsetWidth || 170, left = X + 16 + tw > geo.W ? X - 16 - tw : X + 16;
    tip.style.transform = `translate(${left}px, ${clamp(Math.min(YA, YS) - 18, 8, geo.H - 90)}px)`;
    wrap.classList.add('cur');
  }
  const hideCur = () => { wrap.classList.remove('cur'); geo?.bands.forEach(b => b.classList.remove('hot')); };
  const cancelSweep = () => { sweepId++; };
  const at = e => { const r = wrap.getBoundingClientRect(); return ((e.clientX - r.left - geo.L) / (geo.R - geo.L)) * 7200; };
  wrap.addEventListener('pointermove', e => { if (!geo) return; cancelSweep(); setCur(at(e)); });
  wrap.addEventListener('pointerleave', () => { cancelSweep(); hideCur(); });
  wrap.addEventListener('focus', () => { cancelSweep(); setCur(ct); }); wrap.addEventListener('blur', hideCur);
  wrap.addEventListener('keydown', e => { const d = { ArrowRight: 300, ArrowLeft: -300, Home: -7200, End: 7200 }[e.key]; if (!d) return; e.preventDefault(); cancelSweep(); setCur(Math.abs(d) === 7200 ? (d < 0 ? 0 : 7200) : ct + d); });
  function sweep() { // once, right after the chart draws: the read-out flies the mission so the cursor is discovered
    if (reduce) return; const id = ++sweepId, t0 = performance.now(), dur = 5200;
    const step = n => { if (id !== sweepId) return; const f = Math.min(1, (n - t0) / dur), e = f < .5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2; setCur(e * 7200); if (f < 1) requestAnimationFrame(step); else setTimeout(() => { if (id === sweepId) hideCur(); }, 900); };
    setTimeout(() => { if (id === sweepId) requestAnimationFrame(step); }, 2200);
  }
  function drawSim() {
    if (!D) return;
    const W = wrap.clientWidth, H = wrap.clientHeight;
    if (!W || !H || simKey === `${W}x${H}`) return;
    const first = !simKey; simKey = `${W}x${H}`;
    const T = 7200, L = 46, R = W - 52, top = 30, bot = H - 26;
    const x = t => L + (R - L) * t / T, ya = a => bot - (bot - top) * a / 1800, ys = v => bot - (bot - top) * v / 60;
    const rows = D.profile.rows;
    let h = '<defs><linearGradient id="altFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4f8ccc" stop-opacity=".32"/><stop offset="1" stop-color="#4f8ccc" stop-opacity="0"/></linearGradient></defs>';
    D.phases.forEach((p, i) => { const x0 = x(p.from), x1 = x(p.to); h += `<rect class="band${i % 2 ? ' alt' : ''}" x="${x0}" y="0" width="${x1 - x0}" height="${bot}"/>`; if (x1 - x0 > 70) h += `<text class="ph" x="${x0 + 10}" y="18">${p.name}</text>`; });
    h += '<g class="grid">' + [0, 500, 1000, 1500].map(a => `<line x1="${L}" x2="${R}" y1="${ya(a)}" y2="${ya(a)}"/><text class="l" x="${L - 8}" y="${ya(a) + 3.5}" text-anchor="end">${fmt(a)}</text>`).join('')
      + [0, 15, 30, 45].map(v => `<text class="r" x="${R + 8}" y="${ys(v) + 3.5}">${v}</text>`).join('')
      + (W < 520 ? [0, 60, 120] : [0, 30, 60, 90, 120]).map(m => `<text x="${x(m * 60)}" y="${bot + 18}" text-anchor="${m === 0 ? 'start' : m === 120 ? 'end' : 'middle'}">${m} min</text>`).join('') + '</g>';
    h += `<text class="ttl l" x="${L - 8}" y="${top - 14}" text-anchor="end">m</text><text class="ttl r" x="${R + 8}" y="${top - 14}">m/s</text>`;
    const pts = rows.map(r => `${x(r[0]).toFixed(1)},${ya(r[1]).toFixed(1)}`).join(' ');
    h += `<polygon class="alt-area" points="${x(0)},${bot} ${pts} ${x(rows.at(-1)[0])},${bot}"/><polyline class="alt-line draw" pathLength="1" points="${pts}"/>`;
    h += `<polyline class="spd draw" pathLength="1" points="${rows.map(r => `${x(r[0]).toFixed(1)},${ys(r[2]).toFixed(1)}`).join(' ')}"/>`;
    h += `<g class="cur"><line y1="${top - 4}" y2="${bot}"/><circle class="c2" r="4.5"/><circle class="c1" r="5.5"/><g class="plane"><path d="M13 0 L-7 -2.4 L-9 -8 L-11.5 -8 L-10.5 -2 L-12 -1 L-12 1 L-10.5 2 L-11.5 8 L-9 8 L-7 2.4 Z"/></g></g>`;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.classList.remove('go'); svg.classList.toggle('still', !first); svg.innerHTML = h;
    geo = { x, ya, ys, L, R, W, H, line: svg.querySelector('.cur line'), c1: svg.querySelector('.cur .c1'), c2: svg.querySelector('.cur .c2'), plane: svg.querySelector('.cur .plane'), bands: [...svg.querySelectorAll('.band')] };
    svg.getBoundingClientRect(); requestAnimationFrame(() => svg.classList.add('go'));
    if (first) sweep();
  }
  new ResizeObserver(() => drawSim()).observe(wrap);

  // ---- 3 · then and now
  const cmp = $('cmp'), range = $('cmpRange'); let cmpDone = false, cmpId = 0;
  const setCut = v => { cmp.style.setProperty('--cut', `${v}%`); cmp.dataset.edge = v < 8 ? 'new' : v > 92 ? 'old' : ''; range.value = v; };
  range.addEventListener('input', () => { cmpId++; setCut(+range.value); });
  function cmpIntro() { // once: the divider sweeps across so people see there are two screens
    if (cmpDone || reduce) return; cmpDone = true; const id = ++cmpId, t0 = performance.now() + 700, keys = [[0, 50], [.3, 80], [.65, 22], [1, 50]];
    const step = n => { if (id !== cmpId) return; const f = clamp((n - t0) / 2600, 0, 1); let k = 1; while (keys[k][0] < f) k++; const [f0, v0] = keys[k - 1], [f1, v1] = keys[k], e = (f - f0) / (f1 - f0), s2 = e < .5 ? 2 * e * e : 1 - Math.pow(-2 * e + 2, 2) / 2; setCut(v0 + (v1 - v0) * s2); if (f < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
  // ---- 4 · CAN log: scrolls by itself; pick a message type to isolate it
  const ol = $('canLog'); let rows4 = [], filter = null, cy = 0;
  function canLog() {
    const hex = n => n.toString(16).toUpperCase().padStart(2, '0'), F = D.can.frames;
    const row = f => `<li data-id="${f[1].toString(16).toUpperCase()}"><span class="t">${f[0].toFixed(2)}</span><span class="id">0x${f[1].toString(16).toUpperCase()}</span><span class="nm">${f[2]}</span><span class="by">${f[3].map(hex).join(' ')}</span></li>`;
    ol.innerHTML = F.concat(F).map(row).join(''); rows4 = [...ol.children]; setFilter(filter);
  }
  function setFilter(id) { filter = id; ol.classList.toggle('filtering', !!id); rows4.forEach(r => r.classList.toggle('m', r.dataset.id === id)); }
  const ids = [...document.querySelectorAll('.can-ids button')];
  ids.forEach(b => {
    b.addEventListener('click', () => { const on = b.getAttribute('aria-pressed') !== 'true'; ids.forEach(o => o.setAttribute('aria-pressed', o === b && on)); setFilter(on ? b.dataset.id : null); });
    b.addEventListener('pointerenter', () => { if (!ids.some(o => o.getAttribute('aria-pressed') === 'true')) setFilter(b.dataset.id); });
    b.addEventListener('pointerleave', () => { if (!ids.some(o => o.getAttribute('aria-pressed') === 'true')) setFilter(null); });
  });
  function countUp() {
    const el = $('canTotal'), end = D ? D.can.total_frames : 864006; if (reduce) { el.textContent = fmt(end); return; }
    const t0 = performance.now(), step = n => { const f = Math.min(1, (n - t0) / 1500); el.textContent = fmt(Math.round(end * (1 - Math.pow(1 - f, 4)))); if (f < 1) requestAnimationFrame(step); }; requestAnimationFrame(step);
  }

  // ---- 5 · fault playhead: runs the two hours, hover scrubs
  const fline = document.querySelector('.flt-line'), fcols = [...fline.children].filter(c => c.tagName === 'DIV'), ph = $('playhead'), chip = $('phChip');
  const fnames = fcols.map(c => c.querySelector('b').childNodes[0].textContent.trim()); let pos = 0, scrub = false;
  const colAt = m => m < 24 ? 0 : m < 108 ? 1 + Math.floor((m - 24) / 12) : 8;
  function setPlayhead(p) {
    const m = p * 120, k = colAt(m); ph.style.setProperty('--ph', p.toFixed(4)); chip.textContent = `${Math.floor(m)} min · ${fnames[k]}`;
    const W = fline.clientWidth, cw = chip.offsetWidth, left = p * W - cw / 2; ph.style.setProperty('--cs', `${clamp(left, -6, W - cw + 6) - left}px`);
    fcols.forEach((c, i) => c.classList.toggle('hot', i === k));
  }
  fline.addEventListener('pointermove', e => { const r = fline.getBoundingClientRect(); scrub = true; pos = clamp((e.clientX - r.left) / r.width, 0, 1); setPlayhead(pos); });
  fline.addEventListener('pointerleave', () => { scrub = false; });
  setPlayhead(0);

  // ---- one loop
  let last = 0, pinT = 1200, pinK = -1;
  const loop = n => {
    const dt = Math.min(60, n - (last || n)); last = n;
    if (seen) {
      if (cur === 0) { pinT += dt; if (pinT > 1900) { pinT = 0; const ps = [...frames[shot].querySelectorAll('.pin')]; pinK = (pinK + 1) % ps.length; frames.forEach(f => f.querySelectorAll('.pin').forEach(x => x.classList.remove('on'))); ps[pinK]?.classList.add('on'); } }
      if (cur === 0 && auto && !held) { t0 ??= n; const f = (n - t0) / 5000; tabs[0].style.setProperty('--prog', Math.min(1, f).toFixed(3)); if (f >= 1) { t0 = n; pick((shot + 1) % frames.length); } } else t0 = null;
      if (cur === 3 && !reduce && rows4.length && !ol.classList.contains('filtering')) { cy += dt * .022; const hh = ol.scrollHeight / 2; if (cy >= hh) cy -= hh; ol.style.transform = `translateY(${-cy}px)`; }
      if (cur === 4 && !reduce && !scrub) { pos += dt / 14000; if (pos > 1.14) pos = 0; setPlayhead(Math.min(1, pos)); }
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
})();



// ---- closing band: slow push-in on the runway, brand line word by word
(() => {
  const fin = document.getElementById('close'), band = fin.querySelector('.fin-band'), line = fin.querySelector('.fin-line');
  let n = 0; line.querySelectorAll(':scope > *, :scope').forEach(() => {});
  const words = []; line.childNodes.forEach(nd => { if (nd.nodeType === 3) nd.textContent.split(/(\s+)/).forEach(w => w.trim() ? words.push(`<span class="w" style="--n:${n++}">${w}</span>`) : words.push(w)); else { nd.innerHTML = nd.textContent.split(' ').map(w => `<span class="w" style="--n:${n++}">${w}</span>`).join(' '); words.push(nd.outerHTML); } });
  line.innerHTML = words.join('');
  new IntersectionObserver(([e], o) => { if (e.isIntersecting) { fin.classList.add('go'); o.disconnect(); } }, { threshold: .35 }).observe(band);
  if (reduce) return;
  const move = () => { const r = band.getBoundingClientRect(), p = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height * .6))); band.style.setProperty('--fp', p.toFixed(3)); };
  addEventListener('scroll', move, { passive: true }); move();
})();

initHero();
}
