/* ============================================================
   George Brothers — about.js
   Work/Elsewhere view toggle, the chess replay engine (ported
   verbatim from About.dc.html's DCLogic class), and ski-scene
   SMIL pausing. Plain ES2017, no modules. Loaded with <script defer>.
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
    if (btnWork) btnWork.classList.toggle('active', isWork);
    if (btnElse) btnElse.classList.toggle('active', !isWork);
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

  /* ================= Ski scene: pause SMIL offscreen / under reduced motion ================= */
  (function () {
    var skiScene = document.getElementById('ski-scene');
    var skiSvg = document.getElementById('ski-svg');
    if (!skiSvg || typeof skiSvg.pauseAnimations !== 'function') return;

    if (window.gbReducedMotion && window.gbReducedMotion()) {
      skiSvg.pauseAnimations();
      return;
    }
    if (skiScene && window.gbObserve) {
      window.gbObserve(skiScene, function () {
        skiSvg.unpauseAnimations();
      }, function () {
        skiSvg.pauseAnimations();
      });
    }
  })();
})();
