/* ============================================================
   George Brothers — work.js
   Selected Work page: card scenes (pause offscreen), and the
   case-study dialog (native <dialog>) with a FLIP zoom-from-card
   open/close animation. PROJECTS is the content source; each
   project renders its own ordered `sections` array into the modal
   (text / points / steps / stack), so a build-log project and an
   engineering case study can share one modal.
   Plain ES2017, no modules. Loaded with <script defer>.
   ============================================================ */
(function () {
  'use strict';

  // github fields emptied 2026-07: repos are private. Restore URLs when public.
  var PROJECTS = [
    {
      num: '01 · 语言花园', name: 'Chief of Learning', status: 'BUILDING', statusBg: '#b48fd9',
      bg: '#1d2415', border: 'rgba(147,181,115,.5)', type: 'ai system', dateRank: 2, updated: 'MAY 2026', statusRank: 1,
      blurb: 'An AI chief of staff for learning Mandarin. It plans the sessions, runs the drills, and keeps the receipts, so the only job left is showing up.',
      sections: [
        { label: '01 · THE PROBLEM', type: 'text',
          text: 'Language apps kept me on a streak, not in a conversation. None of them remembered what I studied yesterday or heard what I got wrong today, so every session started from zero and I was quietly doing two jobs: the student and the teacher. I wanted to keep the student job and hand the rest to something with a memory.' },
        { label: '02 · HOW IT WORKS', type: 'text',
          text: 'It is one study coach you reach three ways: a Telegram chat, a morning brief, and a private dashboard. All three run the same pipeline, so the coach behaves the same wherever you talk to it. Notion is its memory. Every lesson, correction, and plan lives in plain Notion documents I can read and edit by hand, and the code treats those as the source of truth. A separate program on my own machine records lessons, transcribes them locally, and files the notes back.' },
        { label: '03 · ENGINEERING DECISIONS', type: 'points', points: [
          { k: 'Model routing by role', t: 'Every task picks its own model by role: quick chat, heavier reasoning, classification, long context, and vision. Each role has a fallback, and the image reader falls back to a model that can actually see, so a text-only model never guesses at a photo. If no vision model is wired up, the bot says it could not read the image instead of failing.' },
          { k: 'A search index that fails open', t: 'On top of Notion I keep a derived semantic index in Postgres with pgvector. It is built to fail open: if the index is missing or the database is unreachable, the coach falls back to Notion and answers anyway. Ranking is unit tested against an in-memory copy of the index, so the math is proven without a live database.' },
          { k: 'Idempotent ingest, nothing dropped', t: 'Every transcript is identified by a hash of its contents, so the same lesson never lands twice. A push that fails is parked in a dead-letter folder and replayed later. A lesson is never dropped silently, which matters for a personal system with no backups.' },
          { k: 'Audio stays local', t: 'Lesson audio never leaves my machine. It is transcribed locally and only the text is sent up. A recording is quarantined on failure, never deleted, because it is the only copy.' }
        ]},
        { label: '04 · WHERE IT STANDS', type: 'text',
          text: 'It runs as a working template for a single user, me, not a public product. There is no growth chart here, and that is the point. The hardest part of teaching yourself a language is building the plan and grading yourself every day, and that part now happens without me. The codebase carries 273 tests across 41 files, because a personal system with no backups has to be something you trust.' },
        { label: '05 · STACK', type: 'stack',
          stack: ['Next.js on Vercel', 'Notion', 'Telegram', 'Postgres + pgvector', 'role-based LLM routing', 'local transcription (whisper.cpp)', 'TypeScript'] }
      ],
      github: '', cta: 'Ask for a walkthrough'
    },
    {
      num: '03 · ATLAS', name: 'atlas', status: 'BUILD-READY', statusBg: '#b48fd9',
      bg: '#26190b', border: 'rgba(239,168,92,.5)', type: 'ai system', dateRank: 1, updated: 'JUL 2026', statusRank: 2,
      blurb: 'A learning platform that will not pass you until you have earned it. Strict grading, real mastery gates, and a tutor that only teaches what it was actually taught.',
      sections: [
        { label: '01 · THE PROBLEM', type: 'text',
          text: 'Most self-teaching tools reward motion. You watch, you click next, you feel productive, and nothing checks whether the idea actually stuck. I wanted the opposite: a loop that will not let me move on until I can prove I learned the thing, and a tutor that will not bluff an answer it was never taught.' },
        { label: '02 · HOW IT WORKS', type: 'text',
          text: 'atlas runs a fixed loop: intake, lesson, quiz, strict grade, mastery gate, and only then the next lesson opens. The lessons are hand-authored and sit behind a prerequisite map, so topics open in an order that makes sense. A language model reads your quiz answers and scores them against a rubric, but it never decides whether you passed. That decision is plain code doing arithmetic against a fixed bar, so the standard cannot drift lenient to be nice.' },
        { label: '03 · ENGINEERING DECISIONS', type: 'points', points: [
          { k: 'An identity-blind grader', t: 'The grader sees the question, the rubric, and your answer, and nothing about who you are, your streak, or your history. It cannot soften to protect your feelings because it never learns whose feelings they are. Its scores are clamped in code as a second line of defense against over-crediting.' },
          { k: 'The grader is tested like code', t: 'It is held to a golden set of eleven hand-labeled answers, from clearly correct to vague traps to plainly wrong. The eval fails if the model gives credit to any answer that should have been denied. Strictness is tested, not hoped for.' },
          { k: 'A tutor that can say “not covered”', t: 'The tutor answers only from lesson chunks pulled out of a pgvector search. When nothing relevant comes back it returns a plain “the course does not cover that” without ever calling the model, so an empty shelf can never turn into a confident guess.' },
          { k: 'Spaced repetition built in', t: 'Passing a quiz schedules the material for review using FSRS-5, the spaced-repetition algorithm, so what you learn comes back on the day you are about to forget it.' }
        ]},
        { label: '04 · WHERE IT STANDS', type: 'text',
          text: 'The platform is built and ready to deploy, running on Next.js 16 with Postgres behind it, and wired for a single user by design. The point was never a user count. It was proving that a learning tool can hold a hard line: grade honestly, teach only what it knows, and open the next lesson on real mastery instead of good intentions.' },
        { label: '05 · STACK', type: 'stack',
          stack: ['Next.js 16', 'Postgres + pgvector', 'Drizzle ORM', 'FSRS-5 spaced repetition', 'RAG grounded tutor', 'LLM grader + golden-set eval', 'TypeScript'] }
      ],
      github: '', cta: 'Ask for a walkthrough'
    },
    {
      num: '05 · THIS SITE', name: 'This site', status: 'SHIPPED', statusBg: '#efa85c',
      bg: '#181d2c', border: 'rgba(125,140,160,.6)', type: 'site', dateRank: 3, updated: 'APR 2026', statusRank: 0,
      blurb: 'The site you are standing in. Built with AI as the junior dev and me as the extremely picky client.',
      sections: [
        { label: '01 · WHY IT EXISTS', type: 'text',
          text: 'I wanted a home on the internet that felt like me: warm, a little playful, allergic to templates. Building it became its own case study in directing AI tools, when to trust the first draft, when to say no five times in a row, and how taste survives the process.' },
        { label: '02 · WHO IT’S FOR', type: 'text',
          text: 'Anyone building a personal site with AI tools who wants proof it does not have to look like everyone else’s. Steal the approach, not the palette.' },
        { label: '03 · RUN IT YOURSELF', type: 'steps', steps: [
          { n: '01', t: 'Start with one true sentence about yourself. Mine is in the hero.' },
          { n: '02', t: 'Pick three fonts and two colors, then refuse to add more. Constraints are the style.' },
          { n: '03', t: 'Make the AI justify every design choice. Keep the ones that survive.' }
        ]},
        { label: '04 · STACK', type: 'stack',
          stack: ['HTML/CSS', 'Claude', 'hand-tuned animations', 'stubbornness'] }
      ],
      github: '', cta: 'Ask me how'
    },
    {
      num: '06 · SOON™', name: 'The next one', status: 'OPEN SLOT', statusBg: '#78beb4', statusOutline: true,
      bg: '#12211f', border: 'rgba(120,190,180,.55)', type: 'open slot', dateRank: 4, updated: 'ALWAYS', statusRank: 4,
      blurb: 'This square is empty on purpose. Something is always cooking in the lab, and sometimes the best ideas walk in from outside.',
      sections: [
        { label: '01 · WHY IT EXISTS', type: 'text',
          text: 'The projects above all started the same way: a problem annoyed me enough to build around it. If you have one of those, an ugly workflow, a decision you keep fumbling, a thing that should exist and does not, I want to hear it. Worst case we trade notes. Best case it ends up in this grid with your name in the story.' },
        { label: '02 · WHO IT’S FOR', type: 'text',
          text: 'Anyone with a real problem and no time to build the fix. Students, operators, people mid-career-pivot. If it involves AI doing useful work, even better.' },
        { label: '03 · HOW IT STARTS', type: 'steps', steps: [
          { n: '01', t: 'Hit connect and describe the problem in plain words. No pitch deck required.' },
          { n: '02', t: 'I will ask annoying questions until we both understand it.' },
          { n: '03', t: 'If it is buildable, we build. If not, you leave with a sharper problem statement. Fair trade.' }
        ]},
        { label: '04 · STACK', type: 'stack',
          stack: ['your problem', 'my curiosity'] }
      ],
      github: '', cta: 'Pitch it'
    },
    {
      num: '04 · THE GUIDEBOOK', name: 'AI for Beginners', status: 'WRITING', statusBg: '#b48fd9',
      bg: '#281d26', border: 'rgba(180,143,217,.55)', type: 'guide', dateRank: 0, updated: 'JUL 2026', statusRank: 3,
      blurb: 'A guidebook for people who keep hearing about AI and quietly have no idea where to start. Written in plain English.',
      sections: [
        { label: '01 · WHY IT EXISTS', type: 'text',
          text: 'Half the people I talk to think AI is either magic or a scam, and both camps are stuck at the same spot: they never got a calm first hour with it. Every guide online assumes you already know what a prompt is or wants to sell you a course. This is the missing first chapter. What it is, what it is good at, where it lies to you, and ten things to try tonight.' },
        { label: '02 · WHO IT’S FOR', type: 'text',
          text: 'Your parents. Your boss. That friend who says they will get into AI eventually. Anyone smart but starting from zero who deserves better than hype threads.' },
        { label: '03 · HOW TO USE IT', type: 'steps', steps: [
          { n: '01', t: 'Ask me for the current draft. It is a living document and I want margin notes.' },
          { n: '02', t: 'Read chapter one with an AI chat open in the next tab. It is written to be tried, not skimmed.' },
          { n: '03', t: 'Send me the part that confused you. That is the part I rewrite next.' }
        ]},
        { label: '04 · STACK', type: 'stack',
          stack: ['plain English', 'real examples', 'field tested on my family'] }
      ],
      github: '', cta: 'Ask for a copy'
    },
    {
      num: '02 · CONTEXT ENGINE', name: 'Context Engine', status: 'PROTOTYPE', statusBg: '#b48fd9',
      bg: '#221609', border: 'rgba(239,168,92,.5)', type: 'ai system', dateRank: 5, updated: 'JUN 2026', statusRank: 5,
      blurb: 'Gives an AI tool the right few pages from your notes, and only those. Ranked by relevance, kept to a token budget, private pages held back.',
      sections: [
        { label: '01 · THE PROBLEM', type: 'text',
          text: 'AI tools are only as good as the context you hand them, and handing them everything is slow, expensive, and unsafe. Pasting the same notes into every tool by hand got old fast. I wanted one broker any AI front end could ask for the right few pages, on a budget, without ever exposing the private ones.' },
        { label: '02 · HOW IT WORKS', type: 'text',
          text: 'It speaks MCP, the protocol AI tools use to reach outside data, and serves a curated vault of pages. A tool asks for context on a task; the broker ranks the vault, packs what fits a token budget, and returns those pages plus a manifest of what it held back and why. The whole thing is plain Python with no third-party dependencies, which keeps it small enough to read end to end and audit.' },
        { label: '03 · ENGINEERING DECISIONS', type: 'points', points: [
          { k: 'Hybrid ranking, three signals fused', t: 'Ranking blends dense embeddings for meaning, BM25 for exact words, and the curated load order I already keep for each task, fused with reciprocal rank fusion. If the embedder is offline it drops to keyword ranking and still answers.' },
          { k: 'Retrieval that is measured, not asserted', t: 'An eval scores precision, recall, and MRR against a gold set drawn from my own curation. Moving to the hybrid ranker took precision-at-5 from 0.24 to 0.85 and cleared the target I set of 0.80. On a curated vault this size that is a tuning result, not a benchmark claim, and the eval says so plainly.' },
          { k: 'Fail-closed, local embeddings', t: 'The server refuses to start exposed to the network without auth. Private pages are withheld unless a request is explicitly cleared for them, and every embedding is computed locally, so nothing about the vault leaves the machine to be indexed elsewhere.' },
          { k: 'OAuth 2.1 for the connector', t: 'The claude.ai connector uses full OAuth 2.1 with PKCE and a password-gated consent screen, tested end to end from discovery through token exchange.' }
        ]},
        { label: '04 · WHERE IT STANDS', type: 'text',
          text: 'The server is built and tested across four phases, with the claude.ai connector verified end to end. It runs privately for me, as infrastructure for my own tools rather than a product with users, small and auditable on purpose. The result I care about is the retrieval jump, and the fact that a private page has to be asked for by name before it will ever surface.' },
        { label: '05 · STACK', type: 'stack',
          stack: ['Python (stdlib only)', 'MCP over JSON-RPC 2.0', 'SQLite vector store', 'local embeddings (Ollama)', 'BM25 + RRF ranking', 'OAuth 2.1 / PKCE'] }
      ],
      github: '', cta: 'Ask for a walkthrough'
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

  // ---- section renderers: build the modal body from p.sections ----
  function renderText(sec) {
    var p = document.createElement('p');
    p.className = 'm-text';
    p.textContent = sec.text;
    return p;
  }

  function renderSteps(sec) {
    var wrap = document.createElement('div');
    wrap.className = 'm-steps';
    (sec.steps || []).forEach(function (st) {
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
      wrap.appendChild(row);
    });
    return wrap;
  }

  function renderPoints(sec) {
    var wrap = document.createElement('div');
    wrap.className = 'm-points';
    (sec.points || []).forEach(function (pt) {
      var row = document.createElement('div');
      row.className = 'm-point';
      var k = document.createElement('span');
      k.className = 'm-point-k';
      k.textContent = pt.k;
      var t = document.createElement('p');
      t.className = 'm-point-t';
      t.textContent = pt.t;
      row.appendChild(k);
      row.appendChild(t);
      wrap.appendChild(row);
    });
    return wrap;
  }

  function renderStack(sec) {
    var wrap = document.createElement('div');
    wrap.className = 'm-stack';
    (sec.stack || []).forEach(function (tk) {
      var s = document.createElement('span');
      s.className = 'm-tok';
      s.textContent = tk;
      wrap.appendChild(s);
    });
    return wrap;
  }

  function renderSections(sections) {
    var host = document.getElementById('m-sections');
    host.textContent = '';
    (sections || []).forEach(function (sec) {
      var block = document.createElement('div');
      var label = document.createElement('div');
      // text sections get the tighter default gap; the rest get extra room.
      label.className = 'm-section-label' + (sec.type === 'text' ? '' : ' m-mb12');
      label.textContent = sec.label;
      block.appendChild(label);

      var body;
      if (sec.type === 'steps') body = renderSteps(sec);
      else if (sec.type === 'points') body = renderPoints(sec);
      else if (sec.type === 'stack') body = renderStack(sec);
      else body = renderText(sec);

      block.appendChild(body);
      host.appendChild(block);
    });
  }

  function fillModal(p) {
    document.getElementById('m-num').textContent = p.num;
    document.getElementById('m-name').textContent = p.name;

    var statusEl = document.getElementById('m-status');
    statusEl.textContent = p.status;
    if (p.statusOutline) {
      // not-started: outline only (transparent fill, cream text) — the badge
      // reads "empty," which is the meaning.
      statusEl.style.background = 'transparent';
      statusEl.style.border = '1px solid rgba(243,234,217,.35)';
      statusEl.style.color = '#f3ead9';
    } else {
      statusEl.style.background = p.statusBg;
      statusEl.style.border = 'none';
      statusEl.style.color = '#171009';
    }

    document.getElementById('m-blurb').textContent = p.blurb;
    renderSections(p.sections);

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
      : 'PRIVATE REPO';
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
