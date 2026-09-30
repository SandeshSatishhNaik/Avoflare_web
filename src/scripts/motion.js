// One motion language for the whole site: smooth scroll, line reveals, aperture media reveals,
// highlight sweeps, rolling numbers, in-view video playback. Content is visible without JS;
// with reduced motion only video playback control runs (videos stay on their posters).
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// Videos play only while on screen. The hero reel manages its own clips.
const vio = new IntersectionObserver(entries => {
  for (const { target: v, isIntersecting } of entries) {
    if (isIntersecting && !reduce) {
      if (v.preload === 'none') v.preload = 'auto';
      v.play().catch(() => {});
    } else v.pause();
  }
}, { rootMargin: '120px 0px' });
$$('video[data-auto]').forEach(v => { if (!v.closest('[data-reel]')) vio.observe(v); });

// "Continue" buttons jump to the next chapter.
const scrollToEl = el => (window.__lenis ? window.__lenis.scrollTo(el, { duration: 1.4 }) : el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }));
$$('[data-next]').forEach(b => b.addEventListener('click', () => {
  const el = document.querySelector(b.dataset.next);
  if (el) scrollToEl(el);
}));

// Sweeps and counters also need a final state under reduced motion.
const sio = new IntersectionObserver(entries => entries.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('is-on');
  sio.unobserve(e.target);
}), { threshold: 0.6 });
$$('.sweep').forEach(el => sio.observe(el));

if (!reduce) {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  const lenis = new Lenis({ lerp: 0.09 });
  window.__lenis = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const el = document.querySelector(a.getAttribute('href'));
    if (el) { e.preventDefault(); scrollToEl(el); }
  }));

  document.fonts.ready.then(() => {
    // Headlines: lines rise out of a mask.
    $$('[data-split]').forEach(el => SplitText.create(el, {
      type: 'lines', mask: 'lines', autoSplit: true,
      onSplit: self => gsap.from(self.lines, {
        yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: 0.09,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      }),
    }));
    // Chapter titles: letters arrive one by one.
    $$('[data-letters]').forEach(el => SplitText.create(el, {
      type: 'chars, words', mask: 'words', autoSplit: true,
      onSplit: self => gsap.from(self.chars, {
        yPercent: 105, duration: 0.9, ease: 'expo.out', stagger: 0.022,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      }),
    }));
    ScrollTrigger.refresh();
  });

  // Soft rise for supporting blocks.
  $$('[data-reveal]').forEach(el => gsap.from(el, {
    y: 28, autoAlpha: 0, duration: 1.1, ease: 'expo.out', delay: +(el.dataset.reveal || 0),
    scrollTrigger: { trigger: el, start: 'top 90%', once: true },
  }));

  // Media opens like an aperture.
  $$('[data-aperture]').forEach(el => gsap.fromTo(el,
    { clipPath: 'inset(14% 10% 14% 10%)' },
    { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 35%', scrub: true } }));

  // Background media drifts slower than the page.
  $$('[data-parallax]').forEach(el => gsap.fromTo(el,
    { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));

  // Numbers roll up to their value.
  $$('[data-count]').forEach(el => {
    const end = +el.dataset.count;
    const o = { v: 0 };
    gsap.to(o, {
      v: end, duration: 1.6, ease: 'expo.out',
      onUpdate: () => { el.textContent = Math.round(o.v).toString(); },
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });
}
