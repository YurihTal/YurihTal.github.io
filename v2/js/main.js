/* Yuri Hlebanja — site behaviour. Vanilla JS, no dependencies.
   Everything here is progressive enhancement: the page is complete without it. */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode etc. */ } }
  };

  /* ---------------- Theme ---------------- */
  var THEME_COLORS = { dark: '#0B0D10', light: '#F4F5F2' };

  function currentTheme() { return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark'; }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) { m.setAttribute('content', THEME_COLORS[theme]); });
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    });
  }

  function toggleTheme(evt) {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    store.set('theme', next);

    // Circular "spindle" reveal from the button, where supported and motion allowed.
    if (!document.startViewTransition || reduceMotion.matches) { applyTheme(next); return; }

    var btn = evt && evt.currentTarget;
    var r = btn ? btn.getBoundingClientRect() : null;
    var x = r ? r.left + r.width / 2 : window.innerWidth - 40;
    var y = r ? r.top + r.height / 2 : 32;
    var radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    var vt = document.startViewTransition(function () { applyTheme(next); });
    vt.ready.then(function () {
      root.animate(
        { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + radius + 'px at ' + x + 'px ' + y + 'px)'] },
        { duration: 560, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' }
      );
    }).catch(function () {});
  }

  applyTheme(currentTheme());
  document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) { btn.addEventListener('click', toggleTheme); });

  // Follow OS changes only if the visitor never chose explicitly.
  var osLight = window.matchMedia('(prefers-color-scheme: light)');
  var onOs = function (e) { if (!store.get('theme')) applyTheme(e.matches ? 'light' : 'dark'); };
  if (osLight.addEventListener) osLight.addEventListener('change', onOs);

  /* ---------------- Nav: scrolled state ---------------- */
  var nav = document.querySelector('.nav');
  var onScroll = function () { if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- Mobile menu ---------------- */
  var menuBtn = document.querySelector('[data-menu-toggle]');
  var sheet = document.getElementById('sheet');
  function setMenu(open) {
    if (!menuBtn || !sheet) return;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    sheet.hidden = !open;
    sheet.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) { var first = sheet.querySelector('a'); if (first) first.focus(); }
  }
  if (menuBtn && sheet) {
    menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') { setMenu(false); menuBtn.focus(); }
    });
    window.matchMedia('(min-width: 900px)').addEventListener('change', function (e) { if (e.matches) setMenu(false); });
  }

  /* ---------------- Scroll-spy ---------------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav__links a[href^="#"]'));
  var targets = links.map(function (a) { return document.querySelector(a.getAttribute('href')); }).filter(Boolean);
  if ('IntersectionObserver' in window && targets.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) {
          if (a.getAttribute('href') === '#' + en.target.id) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    targets.forEach(function (t) { spy.observe(t); });
  }

  /* ---------------- Copy email ---------------- */
  var toastEl = document.querySelector('[data-toast]');
  var toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-visible'); }, 2200);
  }
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var done = function () { toast('Email copied to clipboard'); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { window.location.href = 'mailto:' + text; });
      } else { window.location.href = 'mailto:' + text; }
    });
  });

  /* ---------------- Footer year ---------------- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
})();
