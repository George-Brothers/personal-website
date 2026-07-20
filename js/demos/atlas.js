/* ============================================================
   George Brothers — js/demos/atlas.js
   TRY IT demo for /work/atlas. Mounts into [data-demo="atlas"],
   replacing its [data-demo-fallback] with one real, playable quiz
   question from atlas's first curriculum topic (tokens & embeddings).
   Canned/deterministic: no network calls, no dependencies. Grading
   mirrors atlas's own rule — the answer is checked by plain code,
   never "vibes" — and every option gets a real explanation, not just
   the one the visitor picked.
   Plain ES2017, no modules. Loaded with <script defer>.
   ============================================================ */
(function () {
  'use strict';

  var host = document.querySelector('[data-demo="atlas"]');
  if (!host) return;

  var fallback = host.querySelector('[data-demo-fallback]');
  if (!fallback) return;

  // The question this demo asks, straight from atlas's tokens & embeddings
  // topic. `correct` is the option index atlas's own answer key would grade
  // as right; every option carries its own explanation, same as a real
  // rubric would, so a wrong pick still teaches the concept.
  var QUESTION = {
    prompt: 'A model’s vocabulary has 50,000 entries. What best describes what one token actually is?',
    correct: 1,
    options: [
      {
        text: 'Always exactly one whole English word.',
        why: 'Not quite — if that were true, a 50,000-word vocabulary could never cover every word in the language, let alone typos, code, or other languages.'
      },
      {
        text: 'A chunk of text, often a sub-word piece, mapped to one ID in the vocabulary.',
        why: 'Right. Tokenizers split text into sub-word pieces so a fixed vocabulary can still cover almost any input — "strawberry" might cost 2–3 tokens instead of one. Each ID then looks up a learned embedding vector, which is the number the model actually computes on.'
      },
      {
        text: 'A slot of GPU memory reserved for one API call.',
        why: 'That’s a hardware/hosting concern, not a modeling one — tokens are a text-representation unit, not a memory allocation.'
      },
      {
        text: 'A confidence score attached to the model’s next guess.',
        why: 'That’s closer to what a token’s output probability is used for during generation — the token itself is the unit of text, not the score.'
      }
    ]
  };

  var LETTERS = ['A', 'B', 'C', 'D'];

  function buildDemo() {
    var wrap = document.createElement('div');
    wrap.className = 'atd';

    var qId = 'atd-q';
    var q = document.createElement('p');
    q.className = 'atd-q';
    q.id = qId;
    q.textContent = QUESTION.prompt;
    wrap.appendChild(q);

    var optsWrap = document.createElement('div');
    optsWrap.className = 'atd-options';
    optsWrap.setAttribute('role', 'group');
    optsWrap.setAttribute('aria-labelledby', qId);

    var feedback = document.createElement('div');
    feedback.className = 'atd-feedback';
    feedback.setAttribute('aria-live', 'polite');

    var verdict = document.createElement('p');
    verdict.className = 'atd-verdict';
    var explain = document.createElement('p');
    explain.className = 'atd-explain';
    var resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'atd-reset';
    resetBtn.textContent = 'Try again';

    feedback.appendChild(verdict);
    feedback.appendChild(explain);
    feedback.appendChild(resetBtn);

    var buttons = [];

    function reset() {
      feedback.classList.remove('on');
      verdict.textContent = '';
      explain.textContent = '';
      buttons.forEach(function (b) {
        b.disabled = false;
        b.classList.remove('is-correct', 'is-wrong', 'is-muted');
      });
      if (buttons[0]) buttons[0].focus();
    }

    function answer(idx) {
      buttons.forEach(function (b, i) {
        b.disabled = true;
        if (i === QUESTION.correct) b.classList.add('is-correct');
        else if (i === idx) b.classList.add('is-wrong');
        else b.classList.add('is-muted');
      });

      var passed = idx === QUESTION.correct;
      verdict.className = 'atd-verdict ' + (passed ? 'v-pass' : 'v-fail');
      verdict.textContent = passed
        ? 'Correct — mastery threshold cleared (80%+).'
        : 'Not quite — topic stays gated until you clear 80%.';
      explain.textContent = QUESTION.options[idx].why;
      feedback.classList.add('on');
    }

    QUESTION.options.forEach(function (opt, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'atd-opt';

      var k = document.createElement('span');
      k.className = 'atd-opt-k';
      k.textContent = LETTERS[i] + '.';

      var t = document.createElement('span');
      t.textContent = opt.text;

      btn.appendChild(k);
      btn.appendChild(t);
      btn.addEventListener('click', function () { answer(i); });

      buttons.push(btn);
      optsWrap.appendChild(btn);
    });

    resetBtn.addEventListener('click', reset);

    wrap.appendChild(optsWrap);
    wrap.appendChild(feedback);
    return wrap;
  }

  fallback.replaceWith(buildDemo());
})();
