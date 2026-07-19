/* ============================================================
   George Brothers — site.js
   Shared chrome behavior: status ticker, burger menu, and two
   small helpers (gbObserve / gbReducedMotion) used by page JS.
   Plain ES2017, no modules. Loaded with <script defer>.
   ============================================================ */
(function () {
  'use strict';

  // ---- reduced motion helper ----
  function gbReducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }
  window.gbReducedMotion = gbReducedMotion;

  // ---- IntersectionObserver helper (pause/resume scenes & intervals) ----
  function gbObserve(el, onVisible, onHidden) {
    if (!el || typeof onVisible !== 'function') return null;
    if (!('IntersectionObserver' in window)) {
      // No IO support: assume always visible so animations/intervals just run.
      onVisible();
      return null;
    }
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        if (entry.isIntersecting) onVisible(entry);
        else if (typeof onHidden === 'function') onHidden(entry);
      }
    }, { threshold: 0.05 });
    io.observe(el);
    return io;
  }
  window.gbObserve = gbObserve;

  // ---- status ticker ----
  var TICKER_WORDS = [
    'BUILDING',
    'SHIPPING',
    'PLAYING CHESS',
    'STUDYING',
    '学中文',
    'IN THE WOODS',
    'PROTOTYPING WITH AI',
    'AUTOMATING THE BORING PARTS'
  ];

  function initTicker() {
    var el = document.getElementById('ticker-word');
    if (!el) return;

    if (gbReducedMotion()) {
      el.textContent = TICKER_WORDS[0];
      return;
    }

    var i = 0;
    el.textContent = TICKER_WORDS[i];
    // Word swaps while the span is mid-fade (opacity 0), driven by the
    // tickfade keyframe's own iteration boundary — no separate timer to drift.
    el.addEventListener('animationiteration', function () {
      i = (i + 1) % TICKER_WORDS.length;
      el.textContent = TICKER_WORDS[i];
    });
  }

  // ---- burger / mobile menu ----
  function initBurger() {
    var burger = document.querySelector('.nav-burger');
    var menu = document.getElementById('mobile-menu');
    if (!burger || !menu) return;

    var closeBtn = menu.querySelector('.mobile-menu-close');
    var firstLink = menu.querySelector('a');
    var isOpen = false;
    var closeTimer = null;

    function onKeydown(e) {
      if (e.key === 'Escape' || e.key === 'Esc') closeMenu();
    }

    function openMenu() {
      if (isOpen) return;
      isOpen = true;
      if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
      menu.hidden = false;
      // Force layout so the opacity transition actually runs.
      void menu.offsetWidth;
      menu.classList.add('open');
      burger.setAttribute('aria-expanded', 'true');
      if (firstLink) firstLink.focus();
      document.addEventListener('keydown', onKeydown);
    }

    function closeMenu() {
      if (!isOpen) return;
      isOpen = false;
      menu.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.removeEventListener('keydown', onKeydown);
      closeTimer = window.setTimeout(function () {
        if (!isOpen) menu.hidden = true;
      }, 320);
      burger.focus();
    }

    burger.addEventListener('click', function () {
      if (isOpen) closeMenu(); else openMenu();
    });
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  }

  // Script is loaded with `defer`, so the DOM is already parsed here.
  initTicker();
  initBurger();
})();
