/* Motion system — vanilla JS, transform/opacity/stroke only.
   Contract: the page is fully visible without this file. The inline head script adds
   `js-motion` (only when motion is allowed) and removes it again if this file never
   reports ready, so a load failure can never hide content. */
(function () {
  'use strict';

  var root = document.documentElement;
  if (!root.classList.contains('js-motion')) return;          // reduced motion or no opt-in
  root.classList.add('motion-ready');

  var raf = window.requestAnimationFrame.bind(window);

  /* ---------------- Hero intro ---------------- */
  var hero = document.querySelector('.hero');
  var introDone = false;

  function finishIntro() {
    if (introDone) return;
    introDone = true;
    root.classList.add('intro-done');
    window.removeEventListener('keydown', finishIntro);
    window.removeEventListener('pointerdown', finishIntro);
    window.removeEventListener('wheel', finishIntro);
    window.removeEventListener('touchstart', finishIntro);
    countUp(true);
  }

  if (hero) {
    // Prepare the toolpath strokes for drawing.
    hero.querySelectorAll('.toolpath').forEach(function (p) {
      var len = Math.ceil(p.getTotalLength());
      p.style.setProperty('--len', len);
    });

    // Terminal lines: stagger index.
    hero.querySelectorAll('[data-terminal] .ln').forEach(function (ln, i) { ln.style.setProperty('--i', i); });

    raf(function () { raf(function () { root.classList.add('intro-run'); }); });

    // Any input skips straight to the end state.
    window.addEventListener('keydown', finishIntro, { once: true });
    window.addEventListener('pointerdown', finishIntro, { once: true, passive: true });
    window.addEventListener('wheel', finishIntro, { once: true, passive: true });
    window.addEventListener('touchstart', finishIntro, { once: true, passive: true });
    setTimeout(finishIntro, 2400);
    setTimeout(function () { countUp(false); }, 1500);
  }

  /* ---------------- Stat count-up ---------------- */
  var counted = false;
  function countUp(instant) {
    if (counted) return;
    counted = true;
    document.querySelectorAll('[data-count]').forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var decimals = (el.getAttribute('data-count').split('.')[1] || '').length;
      var prefix = el.getAttribute('data-prefix') || '';
      if (instant) { el.textContent = prefix + target.toFixed(decimals); return; }
      var start = performance.now(), dur = 900;
      (function tick(now) {
        var t = Math.min(1, (now - start) / dur);
        var e = 1 - Math.pow(1 - t, 4);
        el.textContent = prefix + (target * e).toFixed(decimals);
        if (t < 1) raf(tick);
      })(start);
    });
  }

  /* ---------------- Scroll reveals ---------------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));

  // Stagger siblings that share a parent (cards in a grid, ops in a timeline).
  var groups = new Map();
  revealEls.forEach(function (el) {
    var p = el.parentElement;
    var n = groups.get(p) || 0;
    el.style.setProperty('--stagger', Math.min(n, 5));
    groups.set(p, n + 1);
  });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------------- Timeline: tool advances with scroll ---------------- */
  var timeline = document.querySelector('[data-timeline]');
  var ops = timeline ? Array.prototype.slice.call(timeline.querySelectorAll('.op')) : [];
  var ticking = false;

  function updateTimeline() {
    ticking = false;
    if (!timeline) return;
    var r = timeline.getBoundingClientRect();
    var vh = window.innerHeight;
    var focus = vh * 0.6;                                   // the "spindle" sits at 60% of viewport
    var progress = (focus - r.top) / r.height;
    progress = Math.max(0, Math.min(1, progress));
    timeline.style.setProperty('--progress', progress.toFixed(4));
    var y = r.top + progress * r.height;
    ops.forEach(function (op) {
      var dot = op.getBoundingClientRect().top + 28;
      op.classList.toggle('is-lit', dot <= y + 1);
    });
  }
  function onScroll() { if (!ticking) { ticking = true; raf(updateTimeline); } }
  if (timeline) {
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateTimeline();
  }

  /* ---------------- Hero toolpath parallax (desktop, subtle) ---------------- */
  var tp = document.querySelector('.hero__toolpath');
  if (tp && window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches) {
    var pTick = false;
    window.addEventListener('scroll', function () {
      if (pTick) return; pTick = true;
      raf(function () {
        pTick = false;
        var y = Math.min(window.scrollY, window.innerHeight);
        tp.style.transform = 'translate3d(0,' + (y * 0.18).toFixed(1) + 'px,0)';
      });
    }, { passive: true });
  }
})();
