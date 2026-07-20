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

  // github: link a project's public @George-Brothers repo where one exists;
  // leave '' for projects with no public repo yet (atlas, AI for Beginners) and
  // the open slot. Empty '' shows a PRIVATE REPO label and hides the repo button.
  var PROJECTS = [
    {
      num: '02 · MANDARIN', name: 'Lucy', status: 'BUILDING', statusBg: '#b48fd9',
      bg: '#1d2415', border: 'rgba(147,181,115,.5)', type: 'ai system', dateRank: 2, updated: 'MAY 2026', statusRank: 1,
      blurb: 'Lucy turns a long-term Mandarin goal into a daily plan, then uses tutoring feedback and study history to change the plan instead of repeating generic lessons.',
      sections: [
        { label: '01 · THE PROBLEM', type: 'text',
          text: 'Language apps kept me on a streak, not in a conversation. None of them remembered what I studied yesterday or heard what I got wrong today, so every session started from zero and I was quietly doing two jobs, the student and the teacher. I wanted to keep the student job and hand the rest to something with a memory that changes the plan when I improve, miss a week, or keep making the same mistake.' },
        { label: '02 · HOW IT WORKS', type: 'text',
          text: 'It is one study coach you reach three ways: a Telegram chat, a morning brief, and a private dashboard. All three share one reasoning pipeline that never forks, so the coach behaves the same wherever you talk to it and a fix reaches every surface at once. Notion is its memory. Every lesson, correction, and plan lives in plain Notion documents I can read and edit by hand, and the code treats those as the source of truth. A separate program on my own machine records lessons, transcribes them locally, and files the notes back.' },
        { label: '03 · ENGINEERING DECISIONS', type: 'points', points: [
          { k: 'Model routing by role', t: 'Every call is routed by role, quick chat, heavier reasoning, classification, long context, and vision, to the cheapest model that can do that job, with a fallback if the first one fails. Vision runs on Gemini and falls back to OpenAI when the Google key is absent, so a homework photo still gets read. Swapping a model or a whole provider is a one-line edit in a single file.' },
          { k: 'A search index that fails open', t: 'On top of Notion sits a derived semantic index in Neon Postgres with pgvector, a one-way copy that Notion always overrules. It fails open: if the index is missing, empty, or unreachable, Lucy answers from Notion anyway. The ranking is unit tested against an in-memory copy of the index, so the math is proven without a live database.' },
          { k: 'Built to never lose data', t: 'With no backups, every write path assumes a crash. A Notion update writes the new version before removing the old, so a failure mid-write cannot blank a document. Each lesson transcript is keyed by a hash of its contents, so the same lesson never lands twice, and a push that fails is parked and replayed instead of dropped. The card queue only gives up on work that can never succeed, so closing Anki just leaves the cards waiting.' },
          { k: 'Audio stays local', t: 'Lesson audio never leaves my laptop. It is transcribed locally with whisper.cpp and only the text is sent up. A recording that fails to process is quarantined, never deleted, because it is the only copy.' }
        ]},
        { label: '04 · WHERE IT STANDS', type: 'text',
          text: 'It runs as a working template for a single user, me, not a public product. There is no growth chart here, and that is the point. The hardest part of teaching yourself a language is building the plan and grading yourself every day, and that part now happens without me. The codebase carries 276 tests across 40 files, because a personal system with no backups has to be something you trust.' },
        { label: '05 · STACK', type: 'stack',
          stack: ['Next.js on Vercel', 'Notion API', 'Telegram Bot API', 'Neon Postgres + pgvector', 'Vercel AI SDK (DeepSeek, Gemini, OpenAI)', 'local transcription (whisper.cpp)', 'TypeScript'] }
      ],
      github: 'https://github.com/George-Brothers/Chief-of-Learning', cta: 'Ask for a walkthrough'
    },
    {
      num: '03 · ATLAS', name: 'atlas', status: 'BUILD-READY', statusBg: '#b48fd9',
      bg: '#26190b', border: 'rgba(239,168,92,.5)', type: 'ai system', dateRank: 1, updated: 'JUL 2026', statusRank: 2,
      blurb: 'A learning platform that will not pass you until you have earned it. Strict grading, real mastery gates, and a tutor that only teaches what it was actually taught.',
      sections: [
        { label: '01 · THE PROBLEM', type: 'text',
          text: 'Most self-teaching tools reward motion. You watch, you click next, you feel productive, and nothing checks whether the idea actually stuck. I wanted the opposite: a loop that will not let me move on until I can prove I learned the thing, and a tutor that will not bluff an answer it was never taught.' },
        { label: '02 · HOW IT WORKS', type: 'text',
          text: 'atlas teaches one subject, how large language models actually work, as a ten-topic spine that runs from tokens and embeddings up to retrieval. Each topic is a lesson, a quiz, and a mastery gate, and the topics open in order. Multiple-choice is graded by plain code; your written answer goes to a strict AI grader that scores it against a rubric. The model never decides whether you passed. Score 80 percent or better and deterministic code opens the next topic and schedules the material for review. Miss it and the topic stays shut.' },
        { label: '03 · ENGINEERING DECISIONS', type: 'points', points: [
          { k: 'An identity-blind grader', t: 'The grader sees the question, the rubric, and your answer, and nothing about who you are, your streak, or your history. It is a pure function with exactly that one shape, so it cannot soften to be nice because it never learns whose work it is. Its scores are clamped in code as a second line of defense, so a misbehaving model can never over-credit.' },
          { k: 'A cheap grader, held to a hard line', t: 'atlas grades on a cheap model, not a frontier one, and the risk in that trade is a cheap model that over-credits a vague but plausible answer. So a golden set of twelve labeled answers, spanning clearly correct, partial, vague traps, wrong, off-topic, and empty, runs against the real model, and the eval fails if it gives credit to anything it should have denied. That eval is the gate for ever swapping the grading model. Strictness is tested, not hoped for.' },
          { k: 'The machinery is plain code', t: 'Multiple-choice grading, the mastery math, the rules that open the next topic, the spaced-repetition schedule, and placement are all pure functions with no model in them, unit tested with no database and no key. The model is called only where real judgment is needed: grading written answers and answering tutor questions. Everything mechanical stays mechanical, and testable.' },
          { k: 'A tutor that can say “not covered”', t: 'Ask a follow-up and the tutor answers only from chunks of atlas’s own lessons, pulled by vector search and cited. When nothing relevant comes back it says the course does not cover that, without ever calling the model, so an empty shelf can never turn into a confident guess. It reads its own teaching text and nothing else.' }
        ]},
        { label: '04 · WHERE IT STANDS', type: 'text',
          text: 'The platform is built and ready to deploy, running on Next.js 16 with Neon Postgres behind it, wired for a single user by design. Seventy-nine tests cover the loop, the grader, and the retrieval, none of them needing a database or a key to run. The point was never a user count. It was proving a learning tool can hold a hard line: grade honestly, teach only what it was taught, and open the next lesson on real mastery instead of good intentions. What is not wired yet is a stronger grader behind the cheap one; the seam is built, the provider is not.' },
        { label: '05 · STACK', type: 'stack',
          stack: ['Next.js 16', 'Neon Postgres + pgvector', 'Drizzle ORM', 'DeepSeek + OpenAI (direct)', 'FSRS-5 spaced repetition', 'golden-set grader eval', 'TypeScript'] }
      ],
      github: 'https://github.com/George-Brothers/Atlas', cta: 'Ask for a walkthrough'
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
      github: 'https://github.com/George-Brothers/personal-website', cta: 'Ask me how'
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
      num: '01 · PRIVATE CONTEXT', name: 'Context Drop', status: 'PROTOTYPE', statusBg: '#b48fd9',
      bg: '#221609', border: 'rgba(239,168,92,.5)', type: 'ai system', dateRank: 5, updated: 'JUN 2026', statusRank: 5,
      blurb: 'AI assistants are only as useful as the information they get. Context Drop picks the few notes that matter for a request, keeps restricted material out, and shows what context was actually passed to the model.',
      sections: [
        { label: 'HOW A REQUEST FLOWS', type: 'image',
          src: '/assets/context-drop-flow.v1.svg', width: 520, height: 528,
          alt: 'Flow diagram. A request enters, then the broker retrieves candidate pages from the private vault, ranks them by relevance with embeddings, keywords, and curated load order fused with RRF, filters out restricted pages, fits the top pages to a token budget, and returns a context package plus a manifest of what was held back.',
          caption: 'A request in, a right-sized context package out: retrieve candidates, rank by relevance, hold restricted pages back, then fit the token budget.' },
        { label: '01 · THE PROBLEM', type: 'text',
          text: 'Most AI tools fail for a boring reason. They get too much context, the wrong context, or information they were never meant to see. Pasting the same notes into every tool by hand got old fast, and dumping a whole vault into a prompt is slow, expensive, and unsafe. I wanted one broker any AI tool could ask for the right few pages, on a budget, with the private ones held back by default.' },
        { label: '02 · HOW IT WORKS', type: 'text',
          text: 'It speaks MCP, the protocol AI tools use to reach outside data, and sits in front of a private wiki of tagged Markdown pages. The wiki already declares the rules: named packs that say, per task, which pages to load in what order and which private pages that task is allowed to touch. Context Drop is the broker that honors that contract on a token budget, then hands back the pages plus a manifest of everything it held back so the tool can ask for more. It is plain Python with no third-party dependencies, small enough to read end to end and audit.' },
        { label: '03 · ENGINEERING DECISIONS', type: 'points', points: [
          { k: 'Curated first, ranked only when needed', t: 'When a task maps to a named pack, the broker loads that curated order and does not guess. When a paraphrased question matches no pack, a hybrid ranker takes over: dense embeddings for meaning, BM25 for exact words, fused with reciprocal rank fusion over the same curated prior. If the embedder is offline it drops to keyword ranking and still answers.' },
          { k: 'Retrieval that is measured, not asserted', t: 'A gold set of nineteen queries, drawn from the vault’s own pack definitions, scores the ranker on precision and recall. Moving from dense-only to the hybrid ranker took precision-at-5 from 0.24 to 0.85 and recall-at-10 to 0.89, clearing the bar I set of 0.80 and 0.85. On a curated vault this small that is a tuning result, not a benchmark, and the eval says so plainly.' },
          { k: 'Privacy picked the architecture', t: 'Private pages are held back by default and return only when the task explicitly grants them. A withheld page still appears in the manifest, so the tool knows it exists but never sees the content. Because those pages must never leave the machine, every embedding is computed locally. The security rule chose the design, not the other way around.' },
          { k: 'Fail-closed on the wire', t: 'The HTTP transport refuses to start in any publicly reachable setup without auth, checks every request’s Host and Origin against an allowlist to block DNS rebinding, compares tokens in constant time, and never leaks a stack trace or the vault’s path. The claude.ai connector runs full OAuth 2.1 with PKCE behind a password-gated consent screen, tested end to end from discovery through token exchange.' }
        ]},
        { label: '04 · WHERE IT STANDS', type: 'text',
          text: 'The server is built and tested, standard library only, with the claude.ai connector verified end to end. It runs privately for me, as infrastructure for my own tools rather than a product with users, small and auditable on purpose. The result I care about is the retrieval jump, and the fact that a private page has to be asked for by name before it will ever surface. Next up is proving the same OAuth flow against ChatGPT’s connectors and adding Gmail, Calendar, and Drive behind the same budget and privacy rules.' },
        { label: '05 · STACK', type: 'stack',
          stack: ['Python (stdlib only)', 'MCP over JSON-RPC 2.0', 'SQLite vector store', 'local embeddings (Ollama)', 'BM25 + RRF ranking', 'OAuth 2.1 / PKCE'] }
      ],
      github: 'https://github.com/George-Brothers/context-drop', cta: 'Ask for a walkthrough'
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

  function renderImage(sec) {
    var fig = document.createElement('figure');
    fig.className = 'm-figure';
    var img = document.createElement('img');
    img.className = 'm-img';
    img.src = sec.src;
    img.alt = sec.alt || '';
    img.loading = 'lazy';
    img.decoding = 'async';
    if (sec.width) img.setAttribute('width', sec.width);
    if (sec.height) img.setAttribute('height', sec.height);
    fig.appendChild(img);
    if (sec.caption) {
      var cap = document.createElement('figcaption');
      cap.className = 'm-figcaption';
      cap.textContent = sec.caption;
      fig.appendChild(cap);
    }
    return fig;
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
      else if (sec.type === 'image') body = renderImage(sec);
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
    // match the .55s card transform transition (work.html:80) so the zoom-out
    // is not clipped at the tail.
    closeTimer = setTimeout(function () {
      if (dialog.open) dialog.close();
    }, 560);
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
    // Focus the matching card before showModal() so native <dialog> restores
    // focus here on close, not to document.body (deep-link focus return).
    target.focus({ preventScroll: true });
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
