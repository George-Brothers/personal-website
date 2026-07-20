/* ============================================================
   George Brothers — js/demos/copywriter.js
   TRY IT demo for /work/copywriter. Mounts into [data-demo="copywriter"],
   replacing its [data-demo-fallback] with a live slop linter: a textarea
   pre-filled with a deliberately generic marketing sentence, and as the
   visitor edits it the demo flags the specific patterns it detects and
   explains why each one is banned.

   The rules below are a faithful port of the real, hard-coded checks in
   the Copywriter skill suite's skills/_shared/lint.py (the regexes and
   their order) plus the plain-English "why" from skills/_shared/forbidden.md.
   That linter is deterministic and has no model in the loop; so is this.
   No network calls, no dependencies. Plain ES2017, no modules.
   Loaded with <script defer>.
   ============================================================ */
(function () {
  'use strict';

  var host = document.querySelector('[data-demo="copywriter"]');
  if (!host) return;

  var fallback = host.querySelector('[data-demo-fallback]');
  if (!fallback) return;

  // Straight apostrophes on purpose: the real lint.py regexes match a plain
  // ' the same way this port does, so a curly quote from a pasted draft
  // slips past both linters identically. That is a faithful behavior, not
  // a bug to paper over.
  var SAMPLE = "In today's digital world, our seamless platform empowers you to unlock your potential - it's not just software, it's a game-changer for your business.";

  // Same checks, same order, as skills/_shared/lint.py. `re` carries the
  // source/flags pair so a fresh RegExp (and a fresh lastIndex) gets built
  // per line; label is what the real linter prints; why is the plain-English
  // reason from forbidden.md, shown to the visitor instead of a bare regex name.
  var CHECKS = [
    {
      label: 'em / en dash',
      re: [/[—–]/, 'g'],
      why: 'Banned punctuation. Use a comma, period, colon, semicolon, or parentheses instead.'
    },
    {
      label: 'spaced-hyphen dash substitute',
      re: [/\S \- \S/, 'g'],
      why: 'The " - " a model reaches for the instant the em dash is banned. Same slop rhythm; rewrite the sentence instead of swapping the punctuation.'
    },
    {
      label: 'negative-parallelism reframe',
      re: [/\b(it'?s|it is|its|this is|that'?s|that is)\s+not\s+(just\s+)?(about\s+)?\w+[.,;:]/, 'gi'],
      why: '"It’s not about X. It’s about Y." Delete everything before the positive claim and state it straight.'
    },
    {
      label: '"not just X, it’s Y"',
      re: [/not just\b[^.\n]*\bit'?s\b/, 'gi'],
      why: 'Same reframe in its other common shape. State the positive claim straight instead of setting up a contrast for it.'
    },
    {
      label: 'dead AI vocabulary',
      re: [/\b(delve|leverag(?:e|ed|ing|es)|crucial|pivotal|robust|seamless(?:ly)?|foster(?:s|ed|ing)?|tapestry|landscape|realm|unlock(?:s|ed|ing)?|elevat(?:e|es|ed|ing)|testament|showcas(?:e|es|ed|ing)|underscor(?:e|es|ed|ing)|holistic|empower(?:s|ed|ing)?|harness(?:es|ed|ing)?|streamlin(?:e|es|ed|ing)|cutting-edge|next-generation|revolutionary|game-?changer|transformative|supercharg(?:e|ed|ing)|turbocharg(?:e|ed|ing)|world-class|best-in-class|state-of-the-art)\b/, 'gi'],
      why: 'A flat, inflated word standing in for a plain one. Say what it actually does.'
    },
    {
      label: 'dead filler phrase',
      re: [/(in today'?s [a-z]+ (?:world|landscape|age)|it'?s (?:important|worth) (?:to note|noting)|let'?s (?:dive|delve) (?:in|into)|at the end of the day|i hope this (?:email|message) finds you well|i am (?:writing|reaching out)|let that sink in|what nobody tells you|read that again)/, 'gi'],
      why: 'Filler that fills space, not meaning. Cut it; the sentence after it loses nothing.'
    },
    {
      label: 'AI slop construction',
      re: [/(here'?s the thing|here is the thing|whether you'?re [a-z]+ or [a-z]+|whether you are [a-z]+ or [a-z]+|that'?s where [a-z .]+ comes? in|that is where [a-z .]+ comes? in|say goodbye to|in a world where|your [a-z]+ journey|level up|the best part\?|the result\?|where [a-z]+ meets [a-z]+)/, 'gi'],
      why: 'A construction so common in AI copy it now reads as a tell on sight. Rewrite it in your own words.'
    },
    {
      label: 'empty intensifier',
      re: [/\b(effortlessly|seamlessly|simply put|truly unique|very unique)\b/, 'gi'],
      why: 'Adds emphasis, not information. Cut it or replace it with a fact that earns the emphasis.'
    },
    {
      label: 'verb swap for is/has',
      re: [/\b(serves as|stands as|represents a|boasts|offers up)\b/, 'gi'],
      why: 'A dressed-up stand-in for a plain "is" or "has." Just say is or has.'
    },
    {
      label: 'unresolved proof token',
      re: [/\[(?:VERIFY|FILL)(?::[^\]]*)?\]/, 'g'],
      why: 'A placeholder for a claim nobody checked yet. Resolve it against real proof, or cut it, before it ships.'
    }
  ];

  function scan(text) {
    var lines = text.split(/\n/);
    var hits = [];
    lines.forEach(function (line, i) {
      CHECKS.forEach(function (check) {
        var re = new RegExp(check.re[0].source, check.re[1]);
        var m;
        while ((m = re.exec(line))) {
          hits.push({ line: i + 1, label: check.label, frag: m[0].trim(), why: check.why });
          if (m.index === re.lastIndex) re.lastIndex += 1;
        }
      });
    });
    return hits;
  }

  function buildDemo() {
    var wrap = document.createElement('div');
    wrap.className = 'cwd';

    var labelId = 'cwd-ta-label';
    var label = document.createElement('label');
    label.id = labelId;
    label.className = 'cwd-label';
    label.setAttribute('for', 'cwd-ta');
    label.textContent = 'Edit this sentence. The linter reads every keystroke.';

    var ta = document.createElement('textarea');
    ta.id = 'cwd-ta';
    ta.className = 'cwd-ta';
    ta.value = SAMPLE;
    ta.spellcheck = false;
    ta.setAttribute('rows', '4');
    ta.setAttribute('aria-labelledby', labelId);

    var resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'cwd-reset';
    resetBtn.textContent = 'Reset sample';

    var summary = document.createElement('p');
    summary.className = 'cwd-summary';
    summary.setAttribute('aria-live', 'polite');

    var listWrap = document.createElement('div');
    listWrap.className = 'cwd-hits';

    function render() {
      var text = ta.value;
      var hits = scan(text);

      if (hits.length === 0) {
        summary.className = 'cwd-summary v-clean';
        summary.textContent = 'LINT CLEAN: 0 violations. Copy may proceed to the human gate.';
        listWrap.textContent = '';
        return;
      }

      summary.className = 'cwd-summary v-failed';
      summary.textContent = 'LINT FAILED: ' + hits.length + ' violation' + (hits.length === 1 ? '' : 's') + '. Copy does not ship until clean.';

      listWrap.textContent = '';
      var ul = document.createElement('ul');
      ul.className = 'cwd-list';
      hits.forEach(function (hit) {
        var li = document.createElement('li');
        li.className = 'cwd-hit';

        var head = document.createElement('p');
        head.className = 'cwd-hit-head';
        var ln = document.createElement('span');
        ln.className = 'cwd-hit-ln';
        ln.textContent = 'L' + hit.line;
        var lab = document.createElement('span');
        lab.className = 'cwd-hit-lab';
        lab.textContent = hit.label;
        var frag = document.createElement('span');
        frag.className = 'cwd-hit-frag';
        frag.textContent = '“' + hit.frag + '”';
        head.appendChild(ln);
        head.appendChild(lab);
        head.appendChild(frag);

        var why = document.createElement('p');
        why.className = 'cwd-hit-why';
        why.textContent = hit.why;

        li.appendChild(head);
        li.appendChild(why);
        ul.appendChild(li);
      });
      listWrap.appendChild(ul);
    }

    ta.addEventListener('input', render);
    resetBtn.addEventListener('click', function () {
      ta.value = SAMPLE;
      ta.focus();
      render();
    });

    wrap.appendChild(label);
    wrap.appendChild(ta);
    wrap.appendChild(resetBtn);
    wrap.appendChild(summary);
    wrap.appendChild(listWrap);

    render();
    return wrap;
  }

  fallback.replaceWith(buildDemo());
})();
