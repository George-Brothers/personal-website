/* ============================================================
   George Brothers — js/demos/context-drop.js
   TRY IT demo for /work/context-drop. Mounts into
   [data-demo="context-drop"], replacing its [data-demo-fallback]
   with a small stand-in vault (six notes, one restricted) and a
   query box. Picking a preset or typing a question scores every
   note by plain keyword overlap (no embeddings, no network — this
   is a legible toy, not the real hybrid ranker) and renders two
   lists: the context package the assistant would actually receive,
   and a manifest of anything held back, so the restricted note is
   always named, never silently dropped and never silently sent.
   Canned/deterministic: no network calls, no dependencies.
   Plain ES2017, no modules. Loaded with <script defer>.
   ============================================================ */
(function () {
  'use strict';

  var host = document.querySelector('[data-demo="context-drop"]');
  if (!host) return;

  var fallback = host.querySelector('[data-demo-fallback]');
  if (!fallback) return;

  // The stand-in vault. Every note has a title, tags, and a short
  // snippet; `restricted: true` marks the one page the demo must
  // never hand over, no matter how relevant the question.
  var VAULT = [
    {
      id: 'deploy-runbook',
      title: 'Deploy Runbook — Production',
      tags: ['deploy', 'vercel', 'production', 'ops', 'release'],
      snippet: 'Ship with the prod deploy command, watch the build log, then confirm the new deployment is live before closing the ticket. Roll back by promoting the previous deployment.',
      restricted: false
    },
    {
      id: 'auth-patterns',
      title: 'API Auth Patterns',
      tags: ['api', 'auth', 'oauth', 'security', 'tokens'],
      snippet: 'External tools authenticate over OAuth 2.1 with PKCE. Tokens are short-lived and compared in constant time on every request.',
      restricted: false
    },
    {
      id: 'onboarding-checklist',
      title: 'Client Onboarding Checklist',
      tags: ['onboarding', 'client', 'sales', 'kickoff'],
      snippet: 'Kickoff call, grant workspace access, walk through the first dashboard, schedule the 30-day check-in.',
      restricted: false
    },
    {
      id: 'db-schema',
      title: 'Database Schema Notes',
      tags: ['database', 'schema', 'postgres', 'vault'],
      snippet: 'Pages, tags, and packs each get a table; the vector index is a separate table keyed to page id so it can be rebuilt without touching page content.',
      restricted: false
    },
    {
      id: 'comp-bands',
      title: 'Compensation Bands (Q3)',
      tags: ['compensation', 'salary', 'pay', 'hr', 'bands'],
      snippet: 'Level-by-level pay bands effective this quarter, plus the review calendar for adjustments.',
      restricted: true
    },
    {
      id: 'incident-postmortem',
      title: 'Incident Postmortem — Apr 12 Outage',
      tags: ['incident', 'outage', 'postmortem', 'ops'],
      snippet: 'Root cause was an expired auth token on the ranking service. Fix shipped same day; a token-expiry alert now fires an hour before expiry.',
      restricted: false
    }
  ];

  var PRESETS = [
    'How do we deploy to production?',
    "What's our OAuth setup?",
    'What are the current compensation bands?',
    'Draft an onboarding note for a new client.'
  ];

  var STOPWORDS = ['the', 'a', 'an', 'do', 'does', 'is', 'are', 'to', 'of', 'for',
    'our', 'we', 'what', "what's", 'whats', 'how', 'on', 'in', 'and', 'me', 'note',
    'current', 'draft', 'new', 'up', 'get', 'give'];

  function tokenize(text) {
    return (text.toLowerCase().match(/[a-z0-9']+/g) || [])
      .filter(function (w) { return w.length > 2 && STOPWORDS.indexOf(w) === -1; });
  }

  // Score = tag-match count (weight 2) + title/snippet substring match
  // count (weight 1). Plain and readable on purpose: the real Context
  // Drop ranker fuses dense embeddings, BM25, and curated order with
  // RRF; this toy only needs to be legible, not accurate.
  function scoreNote(note, queryTokens) {
    var haystack = (note.title + ' ' + note.snippet).toLowerCase();
    var score = 0;
    queryTokens.forEach(function (tok) {
      if (note.tags.indexOf(tok) !== -1) score += 2;
      else if (note.tags.some(function (t) { return t.indexOf(tok) !== -1 || tok.indexOf(t) !== -1; })) score += 2;
      if (haystack.indexOf(tok) !== -1) score += 1;
    });
    return score;
  }

  function runQuery(query) {
    var tokens = tokenize(query);
    var ranked = VAULT.map(function (note) {
      return { note: note, score: scoreNote(note, tokens) };
    }).sort(function (a, b) { return b.score - a.score; });

    var allowed = ranked.filter(function (r) { return !r.note.restricted && r.score > 0; }).slice(0, 3);
    var restrictedHit = ranked.filter(function (r) { return r.note.restricted; })[0];

    return {
      tokens: tokens,
      returned: allowed,
      restricted: restrictedHit
    };
  }

  function buildDemo() {
    var wrap = document.createElement('div');
    wrap.className = 'cdd';

    var qId = 'cdd-q';
    var qLabel = document.createElement('label');
    qLabel.className = 'cdd-label';
    qLabel.setAttribute('for', qId);
    qLabel.textContent = 'Ask the vault a question';
    wrap.appendChild(qLabel);

    var form = document.createElement('form');
    form.className = 'cdd-form';
    form.setAttribute('role', 'search');

    var input = document.createElement('input');
    input.type = 'text';
    input.id = qId;
    input.className = 'cdd-input';
    input.placeholder = 'e.g. How do we deploy to production?';
    input.autocomplete = 'off';

    var askBtn = document.createElement('button');
    askBtn.type = 'submit';
    askBtn.className = 'cdd-ask';
    askBtn.textContent = 'Ask';

    form.appendChild(input);
    form.appendChild(askBtn);
    wrap.appendChild(form);

    var chipsWrap = document.createElement('div');
    chipsWrap.className = 'cdd-chips';
    chipsWrap.setAttribute('role', 'group');
    chipsWrap.setAttribute('aria-label', 'Sample questions');
    PRESETS.forEach(function (preset) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'cdd-chip';
      chip.textContent = preset;
      chip.addEventListener('click', function () {
        input.value = preset;
        render(preset);
      });
      chipsWrap.appendChild(chip);
    });
    wrap.appendChild(chipsWrap);

    var results = document.createElement('div');
    results.className = 'cdd-results';
    results.setAttribute('aria-live', 'polite');
    wrap.appendChild(results);

    function noteCard(note, kind) {
      var card = document.createElement('div');
      card.className = 'cdd-card cdd-card-' + kind;
      var title = document.createElement('span');
      title.className = 'cdd-card-title';
      title.textContent = note.title;
      card.appendChild(title);
      if (kind === 'returned') {
        var snip = document.createElement('p');
        snip.className = 'cdd-card-snip';
        snip.textContent = note.snippet;
        card.appendChild(snip);
      } else {
        var lock = document.createElement('p');
        lock.className = 'cdd-card-snip cdd-locked';
        lock.textContent = 'Restricted — content withheld. Named here so the assistant knows it exists, but it was never sent.';
        card.appendChild(lock);
      }
      return card;
    }

    function render(query) {
      var result = runQuery(query);
      results.textContent = '';

      var colReturned = document.createElement('div');
      colReturned.className = 'cdd-col';
      var hReturned = document.createElement('div');
      hReturned.className = 'cdd-col-h';
      hReturned.textContent = 'CONTEXT PACKAGE — sent to the assistant';
      colReturned.appendChild(hReturned);

      if (result.returned.length === 0) {
        var empty = document.createElement('p');
        empty.className = 'cdd-empty';
        empty.textContent = 'No vault page matched this request. Nothing gets sent.';
        colReturned.appendChild(empty);
      } else {
        result.returned.forEach(function (r) {
          colReturned.appendChild(noteCard(r.note, 'returned'));
        });
      }

      var colHeld = document.createElement('div');
      colHeld.className = 'cdd-col';
      var hHeld = document.createElement('div');
      hHeld.className = 'cdd-col-h';
      hHeld.textContent = 'MANIFEST — held back';
      colHeld.appendChild(hHeld);

      if (result.restricted && result.restricted.score > 0) {
        colHeld.appendChild(noteCard(result.restricted.note, 'held'));
      } else {
        var note = result.restricted.note;
        var card = document.createElement('div');
        card.className = 'cdd-card cdd-card-held cdd-held-idle';
        var title = document.createElement('span');
        title.className = 'cdd-card-title';
        title.textContent = note.title;
        var idle = document.createElement('p');
        idle.className = 'cdd-card-snip cdd-locked';
        idle.textContent = 'Restricted page in the vault. Not relevant to this request, and would be held back regardless.';
        card.appendChild(title);
        card.appendChild(idle);
        colHeld.appendChild(card);
      }

      results.appendChild(colReturned);
      results.appendChild(colHeld);
      results.classList.add('on');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = input.value.trim();
      if (q) render(q);
    });

    return wrap;
  }

  fallback.replaceWith(buildDemo());
})();
