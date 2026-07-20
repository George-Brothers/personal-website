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

  /* ---- weld the overlay to the lit panel ----
     The panel in hero-center.v1.webp is a true projective quad: its left edge is
     205px tall and its right edge only 152px, and the edge slopes disagree. No
     combination of rotateY and skew reproduces that, which is why a hand-tuned
     transform never sat flush. Instead we solve the unit-square -> quad homography
     and hand it to matrix3d, which is exact by construction.

     Corners measured off the asset as fractions of the 1122x1402 frame. .hero-stage
     carries the same aspect ratio, so these fractions are stage-relative too. */
  var PANEL = [[0.27986, 0.37803],   // top-left
               [0.43761, 0.36448],   // top-right
               [0.44296, 0.47575],   // bottom-right
               [0.29055, 0.51926]];  // bottom-left
  // .hero-monitor's CSS box == the quad's bounding box. Keep these in sync.
  var BOX_L = 0.27986, BOX_T = 0.36448, BOX_W = 0.16310, BOX_H = 0.15478;

  var stage = document.querySelector('.hero-stage');

  function fit() {
    if (!stage) return;
    var W = stage.clientWidth, H = stage.clientHeight;
    if (!W || !H) return;

    // Target corners in px, relative to the element's own top-left.
    var p = [], i;
    for (i = 0; i < 4; i++) {
      p.push([(PANEL[i][0] - BOX_L) * W, (PANEL[i][1] - BOX_T) * H]);
    }
    var x0 = p[0][0], y0 = p[0][1], x1 = p[1][0], y1 = p[1][1],
        x2 = p[2][0], y2 = p[2][1], x3 = p[3][0], y3 = p[3][1];

    var dx1 = x1 - x2, dx2 = x3 - x2, sx = x0 - x1 + x2 - x3,
        dy1 = y1 - y2, dy2 = y3 - y2, sy = y0 - y1 + y2 - y3;
    var den = dx1 * dy2 - dx2 * dy1;
    if (!den) return;

    // Perspective terms, then the affine part that lands each corner exactly.
    var g = (sx * dy2 - dx2 * sy) / den,
        k = (dx1 * sy - sx * dy1) / den;
    // Divide by the element box so it maps its own coordinate space, not a unit square.
    var w = BOX_W * W, h = BOX_H * H;

    monitor.style.transform = 'matrix3d(' + [
      (x1 - x0 + g * x1) / w, (y1 - y0 + g * y1) / w, 0, g / w,
      (x3 - x0 + k * x3) / h, (y3 - y0 + k * y3) / h, 0, k / h,
      0, 0, 1, 0,
      x0, y0, 0, 1
    ].join(',') + ')';
    monitor.classList.add('is-fitted');
  }

  fit();
  if (window.ResizeObserver) new ResizeObserver(fit).observe(stage);
  else window.addEventListener('resize', fit);

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
