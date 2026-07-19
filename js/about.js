/* ============================================================
   George Brothers — about.js
   Work/Elsewhere view toggle, the chess replay engine (ported
   verbatim from About.dc.html's DCLogic class), and the "Last Chair"
   top-down resort scene (rAF-driven, runs only while its <dialog> is
   open). Plain ES2017, no modules. Loaded with <script defer>.
   ============================================================ */
(function () {
  'use strict';

  /* ================= Work / Elsewhere toggle ================= */
  var btnWork = document.getElementById('btn-work');
  var btnElse = document.getElementById('btn-else');
  var barWork = document.getElementById('bar-work');
  var barElse = document.getElementById('bar-else');
  var viewWork = document.getElementById('view-work');
  var viewElse = document.getElementById('view-else');
  var accentDot = document.getElementById('about-accent');

  function setView(view) {
    var isWork = view === 'work';
    if (viewWork) viewWork.hidden = !isWork;
    if (viewElse) viewElse.hidden = isWork;
    if (btnWork) {
      btnWork.classList.toggle('active', isWork);
      btnWork.setAttribute('aria-selected', isWork ? 'true' : 'false');
    }
    if (btnElse) {
      btnElse.classList.toggle('active', !isWork);
      btnElse.setAttribute('aria-selected', !isWork ? 'true' : 'false');
    }
    if (barWork) barWork.classList.toggle('on', isWork);
    if (barElse) barElse.classList.toggle('on', !isWork);
    if (accentDot) accentDot.style.color = isWork ? '#efa85c' : '#b48fd9';
  }
  if (btnWork) btnWork.addEventListener('click', function () { setView('work'); });
  if (btnElse) btnElse.addEventListener('click', function () { setView('else'); });

  /* ================= Chess engine (ported verbatim from About.dc.html) =================
     Source: About.dc.html DCLogic class, _lines()/_position()/_startChess(), lines ~694-793. */
  var chessLines = (function () {
    // Tal vs Hecht, Varna Olympiad 1962 — complete game, 1-0 after 49.Rg5
    var tal = [
      ['d2','d4','1. d4'],['g8','f6','Nf6'],['c2','c4','2. c4'],['e7','e6','e6'],
      ['g1','f3','3. Nf3'],['b7','b6','b6'],['b1','c3','4. Nc3'],['f8','b4','Bb4'],
      ['c1','g5','5. Bg5'],['c8','b7','Bb7'],['e2','e3','6. e3'],['h7','h6','h6'],
      ['g5','h4','7. Bh4'],['b4','c3','Bxc3+'],['b2','c3','8. bxc3'],['d7','d6','d6'],
      ['f3','d2','9. Nd2'],['e6','e5','e5'],['f2','f3','10. f3'],['d8','e7','Qe7'],
      ['e3','e4','11. e4'],['b8','d7','Nbd7'],['f1','d3','12. Bd3'],['d7','f8','Nf8'],
      ['c4','c5','13. c5'],['d6','c5','dxc5'],['d4','e5','14. dxe5'],['e7','e5','Qxe5'],
      ['d1','a4','15. Qa4+'],['c7','c6','c6'],['e1','g1','16. O-O','h1','f1'],['f8','g6','Ng6'],
      ['d2','c4','17. Nc4'],['e5','e6','Qe6'],['e4','e5','18. e5'],['b6','b5','b5'],
      ['e5','f6','19. exf6!'],['b5','a4','bxa4'],['f6','g7','20. fxg7'],['h8','g8','Rg8'],
      ['d3','f5','21. Bf5!!'],['g6','h4','Nxh4'],['f5','e6','22. Bxe6'],['b7','a6','Ba6'],
      ['c4','d6','23. Nd6+'],['e8','e7','Ke7'],['e6','c4','24. Bc4'],['g8','g7','Rxg7'],
      ['g2','g3','25. g3'],['e7','d6','Kxd6'],['c4','a6','26. Bxa6'],['h4','f5','Nf5'],
      ['a1','b1','27. Rab1'],['f7','f6','f6'],['f1','d1','28. Rfd1+'],['d6','e7','Ke7'],
      ['d1','e1','29. Re1+'],['e7','d6','Kd6'],['g1','f2','30. Kf2'],['c5','c4','c4'],
      ['g3','g4','31. g4'],['f5','e7','Ne7'],['b1','b7','32. Rb7'],['a8','g8','Rag8'],
      ['a6','c4','33. Bxc4'],['e7','d5','Nd5'],['c4','d5','34. Bxd5'],['c6','d5','cxd5'],
      ['b7','b4','35. Rb4'],['g8','c8','Rc8'],['b4','a4','36. Rxa4'],['c8','c3','Rxc3'],
      ['a4','a6','37. Ra6+'],['d6','c5','Kc5'],['a6','f6','38. Rxf6'],['h6','h5','h5'],
      ['h2','h3','39. h3'],['h5','g4','hxg4'],['h3','g4','40. hxg4'],['g7','h7','Rh7'],
      ['g4','g5','41. g5'],['h7','h5','Rh5'],['f6','f5','42. Rf5'],['c3','c2','Rc2+'],
      ['f2','g3','43. Kg3'],['c5','c4','Kc4'],['e1','e5','44. Ree5'],['d5','d4','d4'],
      ['g5','g6','45. g6'],['h5','h1','Rh1'],['e5','c5','46. Rc5+'],['c4','d3','Kd3'],
      ['c5','c2','47. Rxc2'],['d3','c2','Kxc2'],['g3','f4','48. Kf4'],['h1','g1','Rg1'],
      ['f5','g5','49. Rg5']
    ];
    var italian = [
      ['e2','e4','1. e4'],['e7','e5','e5'],['g1','f3','2. Nf3'],['b8','c6','Nc6'],
      ['f1','c4','3. Bc4'],['f8','c5','Bc5'],['c2','c3','4. c3'],['g8','f6','Nf6'],
      ['d2','d3','5. d3'],['d7','d6','d6'],['e1','g1','6. O-O','h1','f1'],['a7','a6','a6'],
      ['a2','a4','7. a4'],['e8','g8','O-O','h8','f8']
    ];
    var scotch = [
      ['e2','e4','1. e4'],['e7','e5','e5'],['g1','f3','2. Nf3'],['b8','c6','Nc6'],
      ['d2','d4','3. d4'],['e5','d4','exd4'],['f3','d4','4. Nxd4'],['g8','f6','Nf6'],
      ['d4','c6','5. Nxc6'],['b7','c6','bxc6'],['e4','e5','6. e5'],['d8','e7','Qe7'],
      ['d1','e2','7. Qe2'],['f6','d5','Nd5'],['c2','c4','8. c4']
    ];
    var caro = [
      ['e2','e4','1. e4'],['c7','c6','c6'],['d2','d4','2. d4'],['d7','d5','d5'],
      ['e4','e5','3. e5'],['c8','f5','Bf5'],['g1','f3','4. Nf3'],['e7','e6','e6'],
      ['f1','e2','5. Be2'],['c6','c5','c5'],['c1','e3','6. Be3'],['g8','e7','Ne7']
    ];
    // easter egg: white tries Scholar's Mate, black defends and punishes — wins the rook, king stuck on d1
    var scholar = [
      ['e2','e4','1. e4'],['e7','e5','e5'],['f1','c4','2. Bc4'],['b8','c6','Nc6'],
      ['d1','h5','3. Qh5','','','!?'],['g7','g6','g6'],['h5','f3','4. Qf3'],['g8','f6','Nf6'],
      ['f3','b3','5. Qb3'],['c6','d4','Nd4!'],['c4','f7','6. Bxf7+'],['e8','e7','Ke7'],
      ['b3','c4','7. Qc4'],['d4','c2','Nxc2+'],['e1','d1','8. Kd1'],['c2','a1','Nxa1']
    ];
    return {
      tal:     { caption: 'TAL v. HECHT — VARNA 1962', end: '1–0', moves: tal },
      italian: { caption: 'THE ITALIAN — GIUOCO PIANO', end: '…', moves: italian },
      scotch:  { caption: 'THE SCOTCH — MIESES LINE', end: '…', moves: scotch },
      caro:    { caption: 'THE CARO-KANN — ADVANCE', end: '…', moves: caro },
      scholar: { caption: 'SCHOLAR’S MATE, PUNISHED', end: '0–1', moves: scholar }
    };
  })();

  function chessPosition(moves, ply) {
    var files = 'abcdefgh';
    var pieces = [];
    var at = {};
    function add(sq, glyph, white, id) {
      var p = { id: id, glyph: glyph, white: white, sq: sq, captured: false };
      pieces.push(p);
      at[sq] = p;
    }
    var backW = ['♖','♘','♗','♕','♔','♗','♘','♖'];
    var backB = ['♜','♞','♝','♛','♚','♝','♞','♜'];
    for (var i = 0; i < 8; i++) {
      add(files[i] + '1', backW[i], true, 'w' + i);
      add(files[i] + '2', '♙', true, 'wp' + i);
      add(files[i] + '7', '♟', false, 'bp' + i);
      add(files[i] + '8', backB[i], false, 'b' + i);
    }
    var n = Math.min(ply, moves.length);
    for (var m = 0; m < n; m++) {
      var mv = moves[m];
      var pc = at[mv[0]];
      if (!pc || pc.captured) continue;
      var tgt = at[mv[1]];
      if (tgt && !tgt.captured && tgt !== pc) tgt.captured = true;
      delete at[mv[0]];
      pc.sq = mv[1];
      at[mv[1]] = pc;
      if (mv[3]) { // castling rook
        var rk = at[mv[3]];
        if (rk && !rk.captured) {
          delete at[mv[3]];
          rk.sq = mv[4];
          at[mv[4]] = rk;
        }
      }
    }
    return pieces;
  }

  /* ================= Chess board driver ================= */
  var boardEl = document.getElementById('chess-board');
  var captionEl = document.getElementById('chess-caption');
  var moveEl = document.getElementById('chess-move');
  var backTalBtn = document.getElementById('chess-back-tal');
  var lineButtons = Array.prototype.slice.call(document.querySelectorAll('[data-line]'));

  if (boardEl) {
    var SQ = 33; // 264 / 8
    var files = 'abcdefgh';
    var chessState = { line: 'tal', ply: 0 };
    var pieceEls = {};
    var chessTimer = null;
    var reduced = window.gbReducedMotion && window.gbReducedMotion();

    (function buildBoard() {
      var pieces = chessPosition(chessLines.tal.moves, 0);
      pieces.forEach(function (p) {
        var el = document.createElement('div');
        el.className = 'chess-piece';
        el.textContent = p.glyph;
        el.style.width = SQ + 'px';
        el.style.height = SQ + 'px';
        el.style.color = p.white ? '#f3ead9' : '#9268c4';
        el.style.textShadow = p.white ? '0 1px 2px rgba(0,0,0,.7)' : '0 1px 2px rgba(0,0,0,.9)';
        boardEl.appendChild(el);
        pieceEls[p.id] = el;
      });
    })();

    function renderChess() {
      var line = chessLines[chessState.line];
      var moves = line.moves;
      var ply = Math.min(chessState.ply, moves.length);
      var pieces = chessPosition(moves, ply);

      pieces.forEach(function (p) {
        var el = pieceEls[p.id];
        if (!el) return;
        var x = files.indexOf(p.sq[0]);
        var y = 8 - parseInt(p.sq[1], 10);
        var base = 'translate(' + (x * SQ) + 'px,' + (y * SQ) + 'px)';
        if (p.captured) {
          el.style.transform = base + ' scale(.3)';
          el.style.opacity = '0';
        } else {
          el.style.transform = base;
          el.style.opacity = '1';
        }
      });

      var lastSan = ply > 0 ? moves[ply - 1][2] : '…';
      if (captionEl) captionEl.textContent = line.caption;
      if (moveEl) moveEl.textContent = ply >= moves.length ? line.end : lastSan;
      if (backTalBtn) backTalBtn.hidden = chessState.line === 'tal';

      lineButtons.forEach(function (btn) {
        var name = btn.getAttribute('data-line');
        if (name === 'tal' || name === 'scholar') return;
        btn.classList.toggle('active', chessState.line === name);
      });
    }

    function tick() {
      var total = chessLines[chessState.line].moves.length;
      // hold on the final position for 3 extra ticks, then reset
      if (chessState.ply >= total + 3) chessState.ply = 0;
      else chessState.ply += 1;
      renderChess();
    }

    function startChessInterval() {
      stopChessInterval();
      chessTimer = setInterval(tick, 1600);
    }
    function stopChessInterval() {
      if (chessTimer) { clearInterval(chessTimer); chessTimer = null; }
    }

    function setLine(name) {
      if (!chessLines[name] || chessState.line === name) return;
      chessState.line = name;
      chessState.ply = 0;
      renderChess();
      if (!reduced) startChessInterval();
    }

    renderChess();

    lineButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        setLine(btn.getAttribute('data-line'));
      });
    });

    if (!reduced) {
      startChessInterval();
      if (window.gbObserve) {
        window.gbObserve(boardEl, startChessInterval, stopChessInterval);
      }
    }
  }

  /* ================= "Last Chair" top-down resort scene =================
     A calm top-down miniature ski resort that lives inside a native
     <dialog> modal (id ski-dialog). Skiers, chairs, a night groomer, drifting
     snow, chimney smoke, and a slow dusk breathing (vignette + alpenglow +
     window twinkle) are all rAF-driven; skiers/chairs/groomer follow predefined
     SVG paths (getPointAtLength). The loop runs ONLY while the modal is open;
     under prefers-reduced-motion the scene renders one calm static frame and
     never animates. All motion is JS (no SMIL), so the site.css reduced-motion
     duration clamp does not touch it. Element counts are capped for perf. */
  (function () {
    var dialog = document.getElementById('ski-dialog');
    var trigger = document.getElementById('lastchair-open');
    var card = document.getElementById('lc-card');
    var closeBtn = document.getElementById('lc-close');
    var svg = document.getElementById('ski-svg');
    if (!dialog || !trigger || !svg || typeof dialog.showModal !== 'function') return;

    var NS = 'http://www.w3.org/2000/svg';
    function el(name, attrs) {
      var e = document.createElementNS(NS, name);
      if (attrs) { for (var k in attrs) e.setAttribute(k, attrs[k]); }
      return e;
    }
    function rnd(a, b) { return a + Math.random() * (b - a); }
    function pick(arr) { return arr[(Math.random() * arr.length) | 0]; }
    function reduced() { return !!(window.gbReducedMotion && window.gbReducedMotion()); }

    var layers = {
      terrain: document.getElementById('ski-terrain'),
      trees: document.getElementById('ski-trees'),
      cat: document.getElementById('ski-cat'),
      trails: document.getElementById('ski-trails'),
      chairs: document.getElementById('ski-chairs'),
      skiers: document.getElementById('ski-skiers'),
      fx: document.getElementById('ski-fx'),
      snow: document.getElementById('ski-snow')
    };
    // atmosphere elements (soft dusk breathing; all driven from the rAF loop)
    var vignetteEl = document.getElementById('lc-vignette');
    var alpenEl = document.getElementById('lc-alpen');
    var windowEls = [];

    // Art-directed conifer clusters (ring the footprint, dot the gaps).
    var TREES = [
      { x: 196, y: 470, s: 1.05 }, { x: 178, y: 428, s: .85 }, { x: 216, y: 502, s: 1.15 },
      { x: 234, y: 440, s: .8 }, { x: 200, y: 392, s: .95 }, { x: 182, y: 350, s: .85 },
      { x: 228, y: 360, s: .8 }, { x: 210, y: 300, s: .95 }, { x: 242, y: 262, s: .8 },
      { x: 198, y: 250, s: .85 },
      { x: 300, y: 132, s: .8 }, { x: 348, y: 108, s: .72 }, { x: 410, y: 96, s: .7 },
      { x: 472, y: 92, s: .7 }, { x: 300, y: 190, s: .82 }, { x: 540, y: 98, s: .7 },
      { x: 792, y: 300, s: 1 }, { x: 818, y: 352, s: 1.1 }, { x: 772, y: 262, s: .85 },
      { x: 806, y: 410, s: 1.12 }, { x: 834, y: 452, s: .9 }, { x: 786, y: 470, s: 1 },
      { x: 762, y: 230, s: .8 }, { x: 814, y: 500, s: .95 }, { x: 780, y: 520, s: .9 },
      { x: 432, y: 210, s: .7 }, { x: 592, y: 220, s: .72 }, { x: 452, y: 430, s: .78 },
      { x: 636, y: 262, s: .72 }, { x: 430, y: 470, s: .82 }, { x: 600, y: 468, s: .8 },
      { x: 360, y: 540, s: .9 }, { x: 392, y: 566, s: .82 }, { x: 672, y: 560, s: .9 },
      { x: 700, y: 536, s: .82 }, { x: 632, y: 588, s: .78 }, { x: 342, y: 500, s: .8 }
    ];

    var SKIER_COLORS = ['#efa85c', '#b48fd9', '#7fb0d9', '#f0a0b8', '#9be0b0', '#f3ead9', '#e0d5ee'];
    // 13 skiers (capped for perf); three take the terrain park, some ski fast,
    // a couple cruise slow for varied tempo.
    var SKIER_DEFS = [
      { path: 'pRunL', fast: false }, { path: 'pRunC', fast: true }, { path: 'pRunR', fast: false },
      { path: 'pRunL', fast: false, cruise: true }, { path: 'pRunC', fast: false }, { path: 'pRunR', fast: true },
      { path: 'pRunC', fast: false }, { path: 'pPark', park: true, fast: false },
      { path: 'pPark', park: true, fast: true }, { path: 'pRunL', fast: true },
      { path: 'pPark', park: true, fast: false }, { path: 'pRunR', fast: false, cruise: true },
      { path: 'pRunC', fast: true }
    ];
    // Terrain-park trick window (fraction of pPark length, over the tabletop jump).
    var J0 = 0.5, J1 = 0.66;

    var built = false, running = false, raf = null, last = 0;
    var CABLE = null, CAT = null;
    var chairs = [], skiers = [], flakes = [];
    var groomer = null;      // the night snowcat + its corduroy swath
    var sceneT = 0;          // scene clock (s) for slow atmospheric breathing
    var smokeTimer = 1.2;    // countdown to next chimney puff

    function pathInfo(id) {
      var p = document.getElementById(id);
      return { el: p, len: p.getTotalLength() };
    }

    function makeTree(t) {
      var g = el('g', { transform: 'translate(' + t.x + ',' + t.y + ') scale(' + t.s + ')' });
      // long soft dusk shadow, cast down-right (light from the upper-left)
      g.appendChild(el('ellipse', { cx: 4.4, cy: 4.8, rx: 10, ry: 4.2, fill: '#100a1a', 'fill-opacity': .17, transform: 'rotate(30 4.4 4.8)' }));
      g.appendChild(el('circle', { r: 8.4, fill: '#20302a' }));
      g.appendChild(el('path', { fill: '#2c4238', d: 'M0,-8 L2.3,-2.3 L8,0 L2.3,2.3 L0,8 L-2.3,2.3 L-8,0 L-2.3,-2.3 Z' }));
      // a few of the fuller conifers wear a snow cap
      if (t.s >= 1) {
        g.appendChild(el('path', { fill: '#f4eefb', 'fill-opacity': .9, d: 'M0,-7.4 L1.7,-3.4 L0,-2.2 L-1.7,-3.4 Z' }));
        g.appendChild(el('circle', { cx: 0, cy: -1, r: 1.7, fill: '#e7ddf5', 'fill-opacity': .55 }));
      }
      g.appendChild(el('circle', { r: 1.5, fill: '#12211b' }));
      return g;
    }

    function makeSkier(color) {
      var g = el('g');
      g.appendChild(el('line', { x1: -4.6, y1: -1.7, x2: 4.8, y2: -1.7, stroke: '#eef2fb', 'stroke-width': 1.4, 'stroke-linecap': 'round' }));
      g.appendChild(el('line', { x1: -4.6, y1: 1.7, x2: 4.8, y2: 1.7, stroke: '#dfe4f2', 'stroke-width': 1.4, 'stroke-linecap': 'round' }));
      g.appendChild(el('ellipse', { cx: 0, cy: 0, rx: 2.9, ry: 2.4, fill: color }));
      g.appendChild(el('circle', { cx: 2.2, cy: 0, r: 1.5, fill: '#f3ead9' }));
      return g;
    }

    function makeChair() {
      var g = el('g');
      g.appendChild(el('line', { x1: 0, y1: -4, x2: 0, y2: 0, stroke: '#1c1526', 'stroke-width': 1 }));
      g.appendChild(el('rect', { x: -4, y: 0, width: 8, height: 4.2, rx: 1.4, fill: '#2a1f3d', stroke: '#cdbfe6', 'stroke-width': .7 }));
      if (Math.random() < 0.5) g.appendChild(el('circle', { cx: 0, cy: 2, r: 1.3, fill: pick(SKIER_COLORS) }));
      return g;
    }

    // Night groomer: a small snowcat, headlight pooling ahead, working the pitch.
    function makeSnowcat() {
      var g = el('g');
      // warm headlight cast ahead of the blade
      g.appendChild(el('ellipse', { cx: 15, cy: 0, rx: 15, ry: 7, fill: '#f6d29a', 'fill-opacity': .22 }));
      // tracks
      g.appendChild(el('rect', { x: -9, y: -6.4, width: 17, height: 2.8, rx: 1.2, fill: '#1c1526' }));
      g.appendChild(el('rect', { x: -9, y: 3.6, width: 17, height: 2.8, rx: 1.2, fill: '#1c1526' }));
      // body + cab
      g.appendChild(el('rect', { x: -8, y: -4.4, width: 15, height: 8.8, rx: 2, fill: '#3a2d52', stroke: '#cdbfe6', 'stroke-width': .7 }));
      g.appendChild(el('rect', { x: -4, y: -2.8, width: 6, height: 5.6, rx: 1.2, fill: '#241a30' }));
      // blade + a warm cab lamp
      g.appendChild(el('rect', { x: 8, y: -6, width: 2.6, height: 12, rx: 1, fill: '#e7ddf5' }));
      g.appendChild(el('circle', { cx: 6.5, cy: 0, r: 1.2, fill: '#f6d29a' }));
      return g;
    }

    function skierSpeed(s) {
      if (s.fast) return rnd(78, 96);
      if (s.cruise) return rnd(24, 34);
      return rnd(34, 52);
    }

    function heading(path, dist, len) {
      var ahead = Math.min(dist + 3, len);
      var a = path.getPointAtLength(Math.max(0, ahead - 3));
      var b = path.getPointAtLength(ahead);
      return Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
    }

    function puff(x, y) {
      var g = el('g', { transform: 'translate(' + x + ',' + y + ')' });
      for (var i = 0; i < 5; i++) {
        g.appendChild(el('circle', {
          cx: rnd(-3, 3), cy: rnd(-3, 3), r: rnd(1.4, 2.6),
          fill: '#f6f0fd', 'fill-opacity': rnd(.5, .8)
        }));
      }
      layers.fx.appendChild(g);
      var born = last, life = 620;
      (function grow(ts) {
        var t = Math.min(1, ((ts || born) - born) / life);
        g.setAttribute('transform', 'translate(' + x + ',' + y + ') scale(' + (1 + t * 1.6) + ')');
        g.setAttribute('opacity', String(1 - t));
        if (t < 1 && running) requestAnimationFrame(grow);
        else if (g.parentNode) g.parentNode.removeChild(g);
      })(last);
    }

    // Mogul field: a tidy grid of soft bumps on the upper pitch, each with a
    // bright uphill lip and a downhill shadow so the slope reads as steep.
    function buildMoguls() {
      var COLS = 5, ROWS = 4, x0 = 396, y0 = 200, dx = 17, dy = 18;
      for (var r = 0; r < ROWS; r++) {
        for (var c = 0; c < COLS; c++) {
          var cx = x0 + c * dx + (r % 2 ? dx / 2 : 0) + rnd(-1.6, 1.6);
          var cy = y0 + r * dy + rnd(-1.4, 1.4);
          var g = el('g', { transform: 'translate(' + cx.toFixed(1) + ',' + cy.toFixed(1) + ')' });
          g.appendChild(el('ellipse', { cx: 1.4, cy: 2.6, rx: 6.2, ry: 3.2, fill: '#7c6ba0', 'fill-opacity': .3 }));
          g.appendChild(el('ellipse', { cx: 0, cy: 0, rx: 6, ry: 3.4, fill: '#efe7fa', 'fill-opacity': .5 }));
          g.appendChild(el('ellipse', { cx: -1.2, cy: -1, rx: 3, ry: 1.5, fill: '#ffffff', 'fill-opacity': .5 }));
          layers.terrain.appendChild(g);
        }
      }
    }

    // Drifting snow: two parallax depths of soft flakes over the whole scene.
    function buildSnow() {
      var N = 26;
      for (var i = 0; i < N; i++) {
        var near = i % 2 === 0;
        var f = {
          x: rnd(0, 1000), y: rnd(0, 620),
          r: near ? rnd(1.5, 2.4) : rnd(.8, 1.4),
          vy: near ? rnd(11, 17) : rnd(6, 10),
          sway: rnd(5, 12), swaySpd: rnd(.5, 1.1), phase: rnd(0, 6.28),
          base: near ? rnd(.55, .85) : rnd(.22, .42),
          tw: rnd(.6, 1.3)
        };
        f.el = el('circle', { r: f.r.toFixed(2), fill: '#f7f2fe', 'fill-opacity': f.base.toFixed(2) });
        layers.snow.appendChild(f.el);
        flakes.push(f);
      }
    }

    function build() {
      CABLE = pathInfo('pCable');
      CAT = pathInfo('pCat');
      var runCache = {};
      function run(id) { return runCache[id] || (runCache[id] = pathInfo(id)); }

      buildMoguls();
      TREES.forEach(function (t) { layers.trees.appendChild(makeTree(t)); });
      buildSnow();
      windowEls = Array.prototype.slice.call(document.querySelectorAll('#ski-svg .lc-win')).map(function (w, i) {
        return { el: w, base: 1, phase: i * 1.7 + 0.4, spd: rnd(.5, .9) };
      });

      // night groomer: corduroy swath (fades) + the snowcat riding the cat-track
      var corduroy = el('polyline', { fill: 'none', stroke: '#f4eefb', 'stroke-opacity': .2, 'stroke-width': 11, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
      layers.cat.appendChild(corduroy);
      var catG = makeSnowcat();
      layers.cat.appendChild(catG);
      groomer = { el: catG, swath: corduroy, dist: CAT.len * 0.5, speed: 17, pts: [] };

      var CN = 9;
      for (var i = 0; i < CN; i++) {
        var cg = makeChair();
        layers.chairs.appendChild(cg);
        chairs.push({ el: cg, dist: (i / CN) * CABLE.len + rnd(-6, 6), speed: rnd(23, 29) });
      }

      SKIER_DEFS.forEach(function (d) {
        var info = run(d.path);
        var color = pick(SKIER_COLORS);
        var g = makeSkier(color);
        layers.skiers.appendChild(g);
        var trail = el('polyline', { fill: 'none', stroke: '#cdbfe6', 'stroke-opacity': .16, 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
        layers.trails.appendChild(trail);
        var s = {
          el: g, trail: trail, path: info.el, len: info.len,
          dist: rnd(0, info.len), fast: d.fast, cruise: !!d.cruise, park: !!d.park,
          wait: 0, tricked: false, spinDeg: pick([180, 360]), pts: []
        };
        s.speed = skierSpeed(s);
        skiers.push(s);
      });
    }

    function renderChair(c) {
      var p = CABLE.el.getPointAtLength(c.dist % CABLE.len);
      var ang = heading(CABLE.el, c.dist % CABLE.len, CABLE.len);
      c.el.setAttribute('transform', 'translate(' + p.x.toFixed(1) + ',' + p.y.toFixed(1) + ') rotate(' + ang.toFixed(1) + ')');
    }

    function renderSkier(s) {
      var dist = s.dist, len = s.len;
      var p = s.path.getPointAtLength(dist);
      var ang = heading(s.path, dist, len);
      var scale = 1, spin = 0, airborne = false;
      if (s.park) {
        var u = dist / len;
        if (u > J0 && u < J1) {
          var w = (u - J0) / (J1 - J0);
          scale = 1 + 0.55 * Math.sin(Math.PI * w);
          spin = s.spinDeg * w;
          airborne = scale > 1.06;
        }
      }
      var op = Math.min(Math.min(dist / 26, 1), Math.min((len - dist) / 30, 1));
      op = Math.max(0, Math.min(1, op));
      s.el.setAttribute('opacity', op.toFixed(2));
      s.el.setAttribute('transform', 'translate(' + p.x.toFixed(1) + ',' + p.y.toFixed(1) + ') rotate(' + (ang + spin).toFixed(1) + ') scale(' + scale.toFixed(2) + ')');
      // carve trail (skip while airborne — no snow contact)
      if (!airborne) {
        s.pts.push(p.x.toFixed(1) + ',' + p.y.toFixed(1));
        if (s.pts.length > 12) s.pts.shift();
        s.trail.setAttribute('points', s.pts.join(' '));
        s.trail.setAttribute('stroke-opacity', String(0.16 * op));
      }
    }

    function respawn(s) {
      s.dist = 0;
      s.speed = skierSpeed(s);
      s.tricked = false;
      s.spinDeg = pick([180, 360]);
      s.pts = [];
      if (s.trail) s.trail.setAttribute('points', '');
    }

    function renderGroomer() {
      var g = groomer, d = g.dist % CAT.len;
      var p = CAT.el.getPointAtLength(d);
      var ang = heading(CAT.el, d, CAT.len);
      g.el.setAttribute('transform', 'translate(' + p.x.toFixed(1) + ',' + p.y.toFixed(1) + ') rotate(' + ang.toFixed(1) + ') scale(.92)');
    }

    function renderFlake(f) {
      f.el.setAttribute('cx', f.x.toFixed(1));
      f.el.setAttribute('cy', f.y.toFixed(1));
    }

    // Warm chimney smoke: a small cluster that rises, drifts, and fades.
    function smokePuff() {
      var x0 = 489, y0 = 528;
      var g = el('g');
      var parts = [];
      for (var i = 0; i < 4; i++) {
        var c = el('circle', { cx: rnd(-2, 2), cy: rnd(-1, 1), r: rnd(2, 3.4), fill: '#d7cee2' });
        g.appendChild(c); parts.push(c);
      }
      layers.fx.appendChild(g);
      var born = last, life = rnd(2400, 3200), drift = rnd(6, 14);
      (function rise(ts) {
        var t = Math.min(1, ((ts || born) - born) / life);
        var y = y0 - t * 34, x = x0 + drift * t;
        g.setAttribute('transform', 'translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ') scale(' + (0.5 + t * 1.4).toFixed(2) + ')');
        g.setAttribute('opacity', (0.5 * (1 - t)).toFixed(2));
        if (t < 1 && running) requestAnimationFrame(rise);
        else if (g.parentNode) g.parentNode.removeChild(g);
      })(last);
    }

    // Slow dusk breathing: vignette + alpenglow ease in and out; windows twinkle.
    function renderAtmosphere() {
      if (vignetteEl) vignetteEl.setAttribute('opacity', (0.9 + 0.1 * Math.sin(sceneT * 0.34)).toFixed(3));
      if (alpenEl) alpenEl.setAttribute('opacity', (0.72 + 0.22 * Math.sin(sceneT * 0.26 + 1.1)).toFixed(3));
      for (var i = 0; i < windowEls.length; i++) {
        var w = windowEls[i];
        w.el.setAttribute('opacity', (0.72 + 0.28 * (0.5 + 0.5 * Math.sin(sceneT * w.spd + w.phase))).toFixed(3));
      }
    }

    function step(dt) {
      var i;
      sceneT += dt;
      renderAtmosphere();

      // drifting snow (parallax + sway + twinkle), wraps around the frame
      for (i = 0; i < flakes.length; i++) {
        var f = flakes[i];
        f.y += f.vy * dt;
        f.x += Math.sin(sceneT * f.swaySpd + f.phase) * f.sway * dt;
        if (f.y > 626) { f.y = -6; f.x = rnd(0, 1000); }
        if (f.x < -8) f.x += 1016; else if (f.x > 1008) f.x -= 1016;
        f.el.setAttribute('fill-opacity', (f.base * (0.7 + 0.3 * Math.sin(sceneT * f.tw + f.phase))).toFixed(2));
        renderFlake(f);
      }

      // night groomer laying a fading corduroy swath along the cat-track
      if (groomer) {
        groomer.dist += groomer.speed * dt;
        var gp = CAT.el.getPointAtLength(groomer.dist % CAT.len);
        groomer.pts.push(gp.x.toFixed(1) + ',' + gp.y.toFixed(1));
        if (groomer.pts.length > 30) groomer.pts.shift();
        groomer.swath.setAttribute('points', groomer.pts.join(' '));
        renderGroomer();
      }

      // chimney smoke on a gentle cadence
      smokeTimer -= dt;
      if (smokeTimer <= 0) { smokePuff(); smokeTimer = rnd(1.6, 2.6); }

      for (i = 0; i < chairs.length; i++) {
        chairs[i].dist += chairs[i].speed * dt;
        renderChair(chairs[i]);
      }
      for (i = 0; i < skiers.length; i++) {
        var s = skiers[i];
        if (s.wait > 0) {
          s.wait -= dt;
          s.el.setAttribute('opacity', '0');
          if (s.wait <= 0) respawn(s);
          continue;
        }
        s.dist += s.speed * dt;
        // emit landing puff once, just past the jump
        if (s.park && !s.tricked && s.dist / s.len >= J1) {
          var lp = s.path.getPointAtLength(s.dist);
          puff(lp.x, lp.y);
          s.tricked = true;
        }
        if (s.dist >= s.len) {
          s.wait = rnd(0.4, 2.8);
          s.el.setAttribute('opacity', '0');
          s.pts = [];
          if (s.trail) s.trail.setAttribute('points', '');
          continue;
        }
        renderSkier(s);
      }
    }

    function frame(ts) {
      if (!running) return;
      var dt = last ? Math.min((ts - last) / 1000, 0.05) : 0;
      last = ts;
      step(dt);
      raf = requestAnimationFrame(frame);
    }
    function start() {
      if (running) return;
      running = true; last = 0;
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      last = 0;
    }

    // One calm frame, no motion (reduced-motion path).
    function renderStatic() {
      var i;
      sceneT = 0;
      renderAtmosphere();
      for (i = 0; i < flakes.length; i++) renderFlake(flakes[i]);
      if (groomer) {
        // a short settled corduroy stretch behind a parked snowcat
        var d0 = groomer.dist % CAT.len;
        groomer.pts = [];
        for (i = 8; i >= 0; i--) {
          var q = CAT.el.getPointAtLength(Math.max(0, d0 - i * 6));
          groomer.pts.push(q.x.toFixed(1) + ',' + q.y.toFixed(1));
        }
        groomer.swath.setAttribute('points', groomer.pts.join(' '));
        renderGroomer();
      }
      for (i = 0; i < chairs.length; i++) renderChair(chairs[i]);
      for (i = 0; i < skiers.length; i++) renderSkier(skiers[i]);
    }

    var lastFocus = null;
    function openScene() {
      lastFocus = document.activeElement;
      dialog.showModal();
      if (!built) { build(); built = true; }
      card.classList.remove('on');
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { card.classList.add('on'); });
      });
      if (closeBtn) closeBtn.focus();
      if (reduced()) renderStatic(); else start();
    }
    function closeScene() {
      stop();
      card.classList.remove('on');
      var finish = function () {
        if (dialog.open) dialog.close();
        var t = (lastFocus && document.contains(lastFocus)) ? lastFocus : trigger;
        if (t && t.focus) t.focus();
      };
      if (reduced()) finish(); else setTimeout(finish, 360);
    }

    trigger.addEventListener('click', openScene);
    if (closeBtn) closeBtn.addEventListener('click', closeScene);
    dialog.addEventListener('click', function (e) { if (e.target === dialog) closeScene(); });
    dialog.addEventListener('cancel', function (e) { e.preventDefault(); closeScene(); });
    document.addEventListener('visibilitychange', function () {
      if (!dialog.open) return;
      if (document.hidden) stop();
      else if (!reduced()) start();
    });
  })();
})();
