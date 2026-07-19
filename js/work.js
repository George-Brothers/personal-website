/* ============================================================
   George Brothers — work.js
   Selected Work page: card scenes (pause offscreen), and the
   case-study dialog (native <dialog>) with a FLIP zoom-from-card
   open/close animation. PROJECTS is the verbatim content source
   ported from Work.dc.html's DCLogic._projects().
   Plain ES2017, no modules. Loaded with <script defer>.
   ============================================================ */
(function () {
  'use strict';

  // github fields emptied 2026-07: repos are private/404. Restore URLs when public.
  var PROJECTS = [
    {
      num: '01 · 语言花园', name: 'Chief of Learning', status: 'BUILDING', statusBg: '#efa85c',
      bg: '#1d2415', border: 'rgba(147,181,115,.5)', type: 'ai system', dateRank: 2, updated: 'MAY 2026', statusRank: 1,
      blurb: 'An AI chief of staff for learning Mandarin. It plans the sessions, runs the drills, and keeps the receipts, so the only job left is showing up.',
      story: 'Language apps kept me streaking, not speaking. Nothing knew what I studied yesterday or heard what I butchered today, so every session started from zero. I got tired of being the student and the teacher at the same time and built a staff member instead of another flashcard deck.',
      who: 'Anyone self-studying a language who wants a system with memory. If you can keep a folder of notes and an API key, you can run this.',
      steps: [
        { n: '01', t: 'Ask me for the repo, then drop in your API key.' },
        { n: '02', t: 'Tell it your level, your goals, and how many minutes you can give it. Be honest, it will find out anyway.' },
        { n: '03', t: 'Do the daily session it hands you. Speak out loud. It is listening.' },
        { n: '04', t: 'Let it re-plan each week around what stuck and what did not.' }
      ],
      stack: ['Claude API', 'agent skills', 'spaced repetition', 'speech'],
      github: '', cta: 'Reach out'
    },
    {
      num: '03 · LIVING DASHBOARD', name: 'Dashboard Pro Max', status: 'DRAFT', statusBg: '#7d8ca0',
      bg: '#26190b', border: 'rgba(239,168,92,.5)', type: 'ai system', dateRank: 1, updated: 'JUN 2026', statusRank: 2,
      blurb: 'A dashboard with opinions. AI watches what your week actually looks like and rearranges the tiles to match, before you think to ask.',
      story: 'Every dashboard I built went stale in two weeks because my life changed and the widgets did not. This one treats layout as a living thing. Exam week? Study stats move front and center. Slow Sunday? It gets out of the way. I’m betting the best interface is the one you never have to configure.',
      who: 'People who love dashboards and abandon all of them. Also anyone curious what happens when the AI owns the layout and the human just lives.',
      steps: [
        { n: '01', t: 'Ask me for the repo, then connect the sources you care about: calendar, tasks, whatever your week runs on.' },
        { n: '02', t: 'Use it normally for a few days. It is quietly taking notes.' },
        { n: '03', t: 'Watch it start moving furniture. Veto anything you hate, it learns from that too.' }
      ],
      stack: ['AI layout engine', 'context tracking', 'React', 'in progress'],
      github: '', cta: 'Reach out'
    },
    {
      num: '05 · THIS SITE', name: 'This site', status: 'SHIPPED', statusBg: '#8fbf7f',
      bg: '#181d2c', border: 'rgba(125,140,160,.6)', type: 'site', dateRank: 3, updated: 'APR 2026', statusRank: 0,
      blurb: 'The site you are standing in. Built with AI as the junior dev and me as the extremely picky client.',
      story: 'I wanted a home on the internet that felt like me: warm, a little playful, allergic to templates. Building it became its own case study in directing AI tools, when to trust the first draft, when to say no five times in a row, and how taste survives the process.',
      who: 'Anyone building a personal site with AI tools who wants proof it does not have to look like everyone else’s. Steal the approach, not the palette.',
      steps: [
        { n: '01', t: 'Start with one true sentence about yourself. Mine is in the hero.' },
        { n: '02', t: 'Pick three fonts and two colors, then refuse to add more. Constraints are the style.' },
        { n: '03', t: 'Make the AI justify every design choice. Keep the ones that survive.' }
      ],
      stack: ['HTML/CSS', 'Claude', 'hand-tuned animations', 'stubbornness'],
      github: '', cta: 'Ask me how'
    },
    {
      num: '06 · SOON™', name: 'The next one', status: 'OPEN SLOT', statusBg: '#78beb4',
      bg: '#12211f', border: 'rgba(120,190,180,.55)', type: 'open slot', dateRank: 4, updated: 'ALWAYS', statusRank: 4,
      blurb: 'This square is empty on purpose. Something is always cooking in the lab, and sometimes the best ideas walk in from outside.',
      story: 'The projects above all started the same way: a problem annoyed me enough to build around it. If you have one of those, an ugly workflow, a decision you keep fumbling, a thing that should exist and does not, I want to hear it. Worst case we trade notes. Best case it ends up in this grid with your name in the story.',
      who: 'Anyone with a real problem and no time to build the fix. Students, operators, people mid-career-pivot. If it involves AI doing useful work, even better.',
      steps: [
        { n: '01', t: 'Hit connect and describe the problem in plain words. No pitch deck required.' },
        { n: '02', t: 'I will ask annoying questions until we both understand it.' },
        { n: '03', t: 'If it is buildable, we build. If not, you leave with a sharper problem statement. Fair trade.' }
      ],
      stack: ['your problem', 'my curiosity'],
      github: '', cta: 'Pitch it'
    },
    {
      num: '04 · THE GUIDEBOOK', name: 'AI for Beginners', status: 'WRITING', statusBg: '#b48fd9',
      bg: '#281d26', border: 'rgba(180,143,217,.55)', type: 'guide', dateRank: 0, updated: 'JUL 2026', statusRank: 3,
      blurb: 'A guidebook for people who keep hearing about AI and quietly have no idea where to start. Written in plain English.',
      story: 'Half the people I talk to think AI is either magic or a scam, and both camps are stuck at the same spot: they never got a calm first hour with it. Every guide online assumes you already know what a prompt is or wants to sell you a course. This is the missing first chapter. What it is, what it is good at, where it lies to you, and ten things to try tonight.',
      who: 'Your parents. Your boss. That friend who says they will get into AI eventually. Anyone smart but starting from zero who deserves better than hype threads.',
      steps: [
        { n: '01', t: 'Ask me for the current draft. It is a living document and I want margin notes.' },
        { n: '02', t: 'Read chapter one with an AI chat open in the next tab. It is written to be tried, not skimmed.' },
        { n: '03', t: 'Send me the part that confused you. That is the part I rewrite next.' }
      ],
      stack: ['plain English', 'real examples', 'field tested on my family'],
      github: '', cta: 'Ask for a copy'
    },
    {
      num: '02 · CONTEXT ENGINE', name: 'Context Engine', status: 'PROTOTYPE', statusBg: '#8fc4d9',
      bg: '#221609', border: 'rgba(239,168,92,.5)', type: 'ai system', dateRank: 5, updated: 'JUN 2026', statusRank: 5,
      blurb: 'A private librarian for everything you have ever saved. Ask a real question and it pulls the right notes, files, and half-finished thoughts off the shelf, receipts included.',
      story: 'My notes were write-only. Years of documents, highlights, and screenshots going in, nothing coming back out when I needed it. Search finds words; it does not find ideas. So I started building a shelf that reads everything once and hands me the right three things when I ask.',
      who: 'Anyone with years of notes and no way back into them. Students, researchers, chronic note-hoarders. If your second brain has become a storage unit, this is the key.',
      steps: [
        { n: '01', t: 'Point it at your folders: notes, PDFs, whatever the pile is.' },
        { n: '02', t: 'Let it read. It builds a map of what you know, not just what you wrote.' },
        { n: '03', t: 'Ask questions like you would ask a person. It answers with sources pulled from your own shelf.' }
      ],
      stack: ['Claude API', 'embeddings', 'local-first', 'in progress'],
      github: '', cta: 'Reach out'
    }
  ];

  var dialog = document.getElementById('case-dialog');
  var card = document.getElementById('m-card');
  var grid = document.getElementById('w-grid');
  if (!dialog || !card || !grid) return;

  var isOpen = false;
  var closeTimer = null;
  var lastClosedT = null;

  function fw() {
    return Math.min(700, window.innerWidth * 0.92);
  }

  function reducedMotion() {
    return !!(window.gbReducedMotion && window.gbReducedMotion());
  }

  function updateMotion() {
    grid.dataset.motion = (isOpen || reducedMotion()) ? 'calm' : 'full';
  }

  function fillModal(p) {
    document.getElementById('m-num').textContent = p.num;
    document.getElementById('m-name').textContent = p.name;

    var statusEl = document.getElementById('m-status');
    statusEl.textContent = p.status;
    statusEl.style.background = p.statusBg;

    document.getElementById('m-blurb').textContent = p.blurb;
    document.getElementById('m-story').textContent = p.story;
    document.getElementById('m-who').textContent = p.who;

    var stepsEl = document.getElementById('m-steps');
    stepsEl.textContent = '';
    p.steps.forEach(function (st) {
      var row = document.createElement('div');
      row.className = 'm-step';
      var n = document.createElement('span');
      n.className = 'm-step-n';
      n.textContent = st.n;
      var t = document.createElement('span');
      t.className = 'm-step-t';
      t.textContent = st.t;
      row.appendChild(n);
      row.appendChild(t);
      stepsEl.appendChild(row);
    });

    var stackEl = document.getElementById('m-stack');
    stackEl.textContent = '';
    p.stack.forEach(function (tk) {
      var s = document.createElement('span');
      s.className = 'm-tok';
      s.textContent = tk;
      stackEl.appendChild(s);
    });

    var ghBtn = document.getElementById('m-github');
    if (p.github) {
      ghBtn.href = p.github;
      ghBtn.hidden = false;
    } else {
      ghBtn.removeAttribute('href');
      ghBtn.hidden = true;
    }

    document.getElementById('m-repo-label').textContent = p.github
      ? p.github.replace('https://github.com/', 'github.com/')
      : 'NO REPO · ASK ME';
    document.getElementById('m-updated').textContent = p.updated;

    var ctaEl = document.getElementById('m-cta');
    ctaEl.textContent = p.cta;

    card.style.background = p.bg;
    card.style.borderColor = p.border;
  }

  function computeClosedT(rect) {
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;
    var dx = Math.round(cx - vw / 2);
    var dy = Math.round(cy - vh / 2);
    var s = Math.max(0.08, rect.width / fw());
    return 'translate(' + dx + 'px,' + dy + 'px) scale(' + s.toFixed(3) + ')';
  }

  function openCard(idx, triggerEl) {
    var p = PROJECTS[idx];
    if (!p) return;
    fillModal(p);

    var rect = triggerEl.getBoundingClientRect();
    lastClosedT = computeClosedT(rect);

    card.classList.remove('on');
    card.style.transform = lastClosedT;

    document.body.style.overflow = 'hidden';
    dialog.showModal();

    // Force a reflow so the browser paints the closed (translated/scaled)
    // state before we animate to the open state.
    // eslint-disable-next-line no-unused-expressions
    card.offsetWidth;

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        card.style.transform = '';
        card.classList.add('on');
      });
    });

    isOpen = true;
    updateMotion();
  }

  function closeAnimated() {
    if (!isOpen) return;
    isOpen = false;
    updateMotion();

    card.classList.remove('on');
    if (lastClosedT) card.style.transform = lastClosedT;
    document.body.style.overflow = '';

    clearTimeout(closeTimer);
    closeTimer = setTimeout(function () {
      if (dialog.open) dialog.close();
    }, 480);
  }

  // ---- card open triggers ----
  var cardButtons = grid.querySelectorAll('.wcard[data-idx]');
  cardButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var idx = parseInt(btn.getAttribute('data-idx'), 10);
      openCard(idx, btn);
    });
  });

  // ---- deep link: /work#case-N (homepage cards) opens that case study ----
  (function openFromHash() {
    var m = /^#case-(\d+)$/.exec(window.location.hash || '');
    if (!m) return;
    var idx = parseInt(m[1], 10);
    var target = grid.querySelector('.wcard[data-idx="' + idx + '"]');
    if (!target) return;
    target.scrollIntoView({ block: 'center' });
    openCard(idx, target);
  })();

  // ---- close triggers ----
  var closeBtn = document.getElementById('m-close');
  if (closeBtn) closeBtn.addEventListener('click', closeAnimated);

  // Click on ::backdrop lands with e.target === dialog itself.
  dialog.addEventListener('click', function (e) {
    if (e.target === dialog) closeAnimated();
  });

  // Escape fires 'cancel' on <dialog>; intercept so we get the reverse
  // FLIP animation instead of an instant close.
  dialog.addEventListener('cancel', function (e) {
    e.preventDefault();
    closeAnimated();
  });

  // ---- scene pausing (offscreen cards) ----
  var allCards = grid.querySelectorAll('.wcard');
  allCards.forEach(function (c) {
    if (window.gbObserve) {
      window.gbObserve(
        c,
        function () { c.classList.remove('scn-paused'); },
        function () { c.classList.add('scn-paused'); }
      );
    }
  });

  // ---- reduced motion: permanent calm ----
  updateMotion();
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.addEventListener) mq.addEventListener('change', updateMotion);
    else if (mq.addListener) mq.addListener(updateMotion);
  }
})();

/* ============================================================
   Idea Wall — separate feature, runs independently of the grid.
   Posts to Formspree with a hidden topic so George can filter,
   then appends a sticky-note as sent confirmation (visual only).
   ============================================================ */
(function () {
  'use strict';

  var form = document.getElementById('idea-form');
  var input = document.getElementById('idea-input');
  var statusEl = document.getElementById('idea-status');
  var cardsEl = document.getElementById('idea-cards');
  var btn = document.getElementById('idea-submit');
  if (!form || !input || !statusEl || !cardsEl) return;

  var ENDPOINT = 'https://formspree.io/f/mqerzlen';

  function showStatus(msg) {
    statusEl.textContent = msg;
    statusEl.hidden = false;
  }

  function stamp() {
    var d = new Date();
    var mon = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    return 'SENT TO GEORGE · ' + mon[d.getMonth()] + ' ' + d.getDate();
  }

  function pinNote(text) {
    var noteCard = document.createElement('div');
    noteCard.className = 'idea-card';

    var pin = document.createElement('span');
    pin.className = 'idea-pin';
    pin.setAttribute('aria-hidden', 'true');

    var p = document.createElement('p');
    p.className = 'idea-note-text';
    p.textContent = text;

    var when = document.createElement('span');
    when.className = 'idea-when';
    when.textContent = stamp();

    noteCard.appendChild(pin);
    noteCard.appendChild(p);
    noteCard.appendChild(when);
    cardsEl.appendChild(noteCard);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var idea = (input.value || '').trim();
    if (!idea) {
      showStatus('Add a line first.');
      input.focus();
      return;
    }

    if (btn) btn.disabled = true;
    showStatus('Sending…');

    fetch(ENDPOINT, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    }).then(function (res) {
      if (res.ok) {
        showStatus('Pinned. It’s on its way to me.');
        pinNote(idea);
        form.reset();
      } else {
        showStatus('Something went wrong. Try again, or use the Connect page.');
      }
    }).catch(function () {
      showStatus('Something went wrong. Try again, or use the Connect page.');
    }).then(function () {
      if (btn) btn.disabled = false;
    });
  });
})();
