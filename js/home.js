/* ============================================================
   George Brothers — home.js
   1. Pauses the 4 decorative card scenes (animation-play-state)
      while they're scrolled offscreen, using the shared gbObserve
      helper from site.js. No-op under prefers-reduced-motion (the
      global duration-clamp in site.css already freezes them).
   2. Drives the hero monitor: the Claude Code terminal and the
      LEDGER.XLSX rows composited onto the screen in the portrait.
   ============================================================ */

/* ---- 1. card scenes ---- */
(function () {
  'use strict';

  if (window.gbReducedMotion && window.gbReducedMotion()) return;
  if (!window.gbObserve) return;

  var scenes = document.querySelectorAll('.r-scene');
  for (var i = 0; i < scenes.length; i++) {
    (function (scene) {
      window.gbObserve(scene, function () {
        scene.classList.remove('gb-paused');
      }, function () {
        scene.classList.add('gb-paused');
      });
    })(scenes[i]);
  }
})();

/* ---- 2. hero monitor ---- */
(function () {
  'use strict';

  var monitor = document.querySelector('.hero-monitor');
  if (!monitor) return;
  var lineBox = monitor.querySelector('.hm-lines');
  var rowBox = monitor.querySelector('.hm-rows');
  if (!lineBox || !rowBox) return;

  var DIM = 'rgba(243,234,217,.6)';
  var SCRIPT = [
    { t: '> automate route sheet', c: '#f3ead9' },
    { t: '⏺ Reading vending.csv…', c: DIM },
    { t: '⏺ Wrote restock_plan.py', c: DIM },
    { t: '✓ 14 stops optimized', c: '#93b573' },
    { t: '> reconcile airbnb payouts', c: '#f3ead9' },
    { t: '⏺ Matching 31 deposits…', c: DIM },
    { t: '✓ 0 discrepancies', c: '#93b573' },
    { t: '> forecast q3 rental cash', c: '#f3ead9' },
    { t: '⏺ Building model…', c: DIM },
    { t: '✓ forecast.xlsx ready', c: '#93b573' }
  ];
  var LEDGER = [
    { k: 'RENT', v: 4250 },
    { k: 'VEND', v: 1180 },
    { k: 'BNB', v: 960 },
    { k: 'NET', v: 6390 }
  ];

  // The terminal shows a 5-line window sliding down the script; the ledger walks a
  // "hot" row that wobbles by a few dollars, so the screen never sits perfectly still.
  function render(n) {
    var len = SCRIPT.length, out = '';
    for (var i = 4; i >= 0; i--) {
      var line = SCRIPT[((n - i) % len + len) % len];
      out += '<div class="hm-line" style="color:' + line.c + '">' + line.t + '</div>';
    }
    lineBox.innerHTML = out;

    var hot = n % LEDGER.length;
    out = '';
    for (var j = 0; j < LEDGER.length; j++) {
      var wobble = j === hot ? (n % 2 ? 12 : -8) : 0;
      var color = j === LEDGER.length - 1 ? '#efa85c' : (j === hot ? '#f3ead9' : 'rgba(243,234,217,.65)');
      var bg = j === hot ? 'rgba(150,110,255,.16)' : 'transparent';
      out += '<div class="hm-row" style="color:' + color + ';background:' + bg + '">' +
             '<span>' + LEDGER[j].k + '</span>' +
             '<span>' + (LEDGER[j].v + wobble).toLocaleString() + '</span></div>';
    }
    rowBox.innerHTML = out;
  }

  render(0);
  if (window.gbReducedMotion && window.gbReducedMotion()) return;

  var step = 0, timer = null;
  function start() { if (!timer) timer = setInterval(function () { render(++step); }, 3000); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  if (window.gbObserve) window.gbObserve(monitor, start, stop);
  else start();
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop();
    else if (monitor.getBoundingClientRect().bottom > 0) start();
  });
})();
