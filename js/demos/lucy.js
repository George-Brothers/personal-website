/* ============================================================
   George Brothers — js/demos/lucy.js
   TRY IT demo for /work/lucy. Mounts into [data-demo="lucy"],
   replacing its [data-demo-fallback] with a Telegram-style replay
   of one real Lucy exchange: a quick quiz, a miss, and that miss
   folded straight into tomorrow's plan, which is the actual product
   idea, every session is a learning record that rewrites the next
   plan. Canned/deterministic: no network calls, no dependencies.
   The visitor triggers the replay with a button rather than it
   looping forever, and prefers-reduced-motion renders the whole
   exchange instantly with no staged typing. A plain-text transcript
   stays in the DOM at all times for assistive tech, independent of
   the animation state.
   Plain ES2017, no modules. Loaded with <script defer>.
   ============================================================ */
(function () {
  'use strict';

  var host = document.querySelector('[data-demo="lucy"]');
  if (!host) return;

  var fallback = host.querySelector('[data-demo-fallback]');
  if (!fallback) return;

  function reducedMotion() {
    if (typeof window.gbReducedMotion === 'function') return window.gbReducedMotion();
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  // The exchange this demo replays. `side` picks the bubble side/style
  // (lucy = coach, you = learner, plan = the plan-update card); `html`
  // is the bubble's rendered markup, `text` is the plain-text line used
  // for the always-present screen-reader transcript.
  var MESSAGES = [
    {
      side: 'lucy',
      html: 'One more before you sign off: how do you say ‘I’ve already eaten’?',
      text: 'Lucy: One more before you sign off: how do you say ‘I’ve already eaten’?'
    },
    {
      side: 'you',
      html: '我已经吃 <span class="lud-gloss">(wǒ yǐjīng chī)</span>',
      text: 'You: 我已经吃 (wǒ yǐjīng chī)'
    },
    {
      side: 'lucy',
      html: 'So close, you need 了 to mark it as finished. 我已经吃了 <span class="lud-gloss">(wǒ yǐjīng chī le)</span> is ‘I’ve already eaten.’ That’s the third time this week 了 has slipped after 已经.',
      text: 'Lucy: So close, you need 了 (le) to mark it as finished. 我已经吃了 (wǒ yǐjīng chī le) is ‘I’ve already eaten.’ That’s the third time this week 了 has slipped after 已经 (yǐjīng, already).'
    },
    {
      side: 'plan',
      label: 'TOMORROW’S PLAN — UPDATED',
      html: 'A 5-question warm-up on 了 as a completion marker, before any new vocabulary.',
      text: 'Tomorrow’s plan, updated: a 5-question warm-up on 了 as a completion marker, before any new vocabulary.'
    }
  ];

  var TYPING_MS = 700;
  var GAP_MS = 850;

  function buildDemo() {
    var wrap = document.createElement('div');
    wrap.className = 'lud';

    var chat = document.createElement('div');
    chat.className = 'lud-chat';
    chat.setAttribute('aria-hidden', 'true'); // decorative replay; transcript below carries the content

    var head = document.createElement('div');
    head.className = 'lud-head';
    var headName = document.createElement('span');
    headName.className = 'lud-head-name';
    headName.textContent = 'Lucy';
    var headStatus = document.createElement('span');
    headStatus.className = 'lud-head-status';
    headStatus.textContent = 'adaptive study coach';
    head.appendChild(headName);
    head.appendChild(headStatus);

    var body = document.createElement('div');
    body.className = 'lud-body';

    chat.appendChild(head);
    chat.appendChild(body);

    var transcript = document.createElement('p');
    transcript.className = 'sr-only';
    transcript.textContent = MESSAGES.map(function (m) { return m.text; }).join(' ');

    var controls = document.createElement('div');
    controls.className = 'lud-controls';
    var playBtn = document.createElement('button');
    playBtn.type = 'button';
    playBtn.className = 'lud-play';
    playBtn.textContent = '▶ Play the check-in';
    controls.appendChild(playBtn);

    var playing = false;

    function clearBody() {
      while (body.firstChild) body.removeChild(body.firstChild);
    }

    function renderInstant() {
      clearBody();
      MESSAGES.forEach(function (m) {
        body.appendChild(renderMessage(m, true));
      });
    }

    function renderMessage(m, instant) {
      var row = document.createElement('div');
      row.className = 'lud-msg lud-msg-' + m.side;

      if (m.side === 'plan') {
        var label = document.createElement('p');
        label.className = 'lud-plan-label';
        label.textContent = m.label;
        row.appendChild(label);
      }

      var bubble = document.createElement('p');
      bubble.className = 'lud-bubble';
      bubble.innerHTML = m.html;
      row.appendChild(bubble);

      if (instant) row.classList.add('on');
      return row;
    }

    function typingBubble(side) {
      var row = document.createElement('div');
      row.className = 'lud-msg lud-msg-' + side + ' on';
      var t = document.createElement('div');
      t.className = 'lud-typing';
      t.appendChild(document.createElement('span'));
      t.appendChild(document.createElement('span'));
      t.appendChild(document.createElement('span'));
      row.appendChild(t);
      return row;
    }

    function playAnimated() {
      clearBody();
      var i = 0;

      function step() {
        if (i >= MESSAGES.length) {
          playing = false;
          playBtn.disabled = false;
          playBtn.textContent = '▶ Replay the check-in';
          return;
        }
        var m = MESSAGES[i];
        var typing = typingBubble(m.side === 'plan' ? 'lucy' : m.side);
        body.appendChild(typing);

        setTimeout(function () {
          body.removeChild(typing);
          var row = renderMessage(m, false);
          body.appendChild(row);
          // Force layout so the opacity/transform transition actually runs.
          // eslint-disable-next-line no-unused-expressions
          row.offsetWidth;
          row.classList.add('on');

          i += 1;
          setTimeout(step, GAP_MS);
        }, TYPING_MS);
      }

      step();
    }

    function play() {
      if (playing) return;
      playing = true;
      playBtn.disabled = true;

      if (reducedMotion()) {
        renderInstant();
        playing = false;
        playBtn.disabled = false;
        playBtn.textContent = '▶ Replay the check-in';
        return;
      }

      playAnimated();
    }

    playBtn.addEventListener('click', play);

    wrap.appendChild(chat);
    wrap.appendChild(transcript);
    wrap.appendChild(controls);
    return wrap;
  }

  fallback.replaceWith(buildDemo());
})();
