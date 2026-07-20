/* ============================================================
   George Brothers — js/demos/this-site.js
   TRY IT demo for /work/this-site. Mounts into [data-demo="this-site"],
   replacing its [data-demo-fallback] with a live inspector over the
   real design tokens this very page is built from: the five palette
   swatches, the three typefaces and their real roles, and the site's
   actual reduced-motion contract. Every value below is copied from
   css/site.css, not invented. No network calls, no dependencies.
   Plain ES2017, no modules. Loaded with <script defer>.
   ============================================================ */
(function () {
  'use strict';

  var host = document.querySelector('[data-demo="this-site"]');
  if (!host) return;

  var fallback = host.querySelector('[data-demo-fallback]');
  if (!fallback) return;

  // Real palette, copied from css/site.css / css/case.css / js/scenes.js —
  // the five colors this whole site is built from, with the role each
  // one actually plays, not a guess.
  var SWATCHES = [
    { hex: '#171009', name: 'Ink', role: 'Page background (site.css body{}) and the dark text stamped onto light buttons/badges — color-scheme: dark throughout.' },
    { hex: '#f3ead9', name: 'Paper', role: 'Primary text color and the light fill on the repo button and skip link — the warmest neutral in the palette.' },
    { hex: '#efa85c', name: 'Amber', role: 'The one accent: focus-visible outlines, hover states, the CTA border, and the italic dot after every case-study title.' },
    { hex: '#b48fd9', name: 'Violet', role: 'Status badges on Work (BUILDING, BUILD-READY, PROTOTYPE, WRITING) and a secondary accent in the diorama art.' },
    { hex: '#93b573', name: 'Sage', role: 'A quieter accent — plant/stem details in the SVG dioramas, and the "correct answer" green in the atlas demo.' }
  ];

  // Real typefaces, copied from the @font-face block in css/site.css,
  // with the role each one is actually assigned across the site.
  var TYPEFACES = [
    {
      key: 'serif', label: 'Instrument Serif', role: 'Headings',
      detail: 'Weight 400, roman and italic. Every case-study and section h1 on the site, plus the mobile menu links.',
      sampleFont: "400 clamp(28px,7vw,44px) 'Instrument Serif', serif", sampleColor: '#f3ead9',
      sample: 'This site.'
    },
    {
      key: 'sans', label: 'Space Grotesk', role: 'Body text',
      detail: 'A variable font, weight 300–700 in one file. Every paragraph of prose on the site, plus buttons and nav links.',
      sampleFont: "300 17px 'Space Grotesk', sans-serif", sampleColor: 'rgba(243,234,217,.85)',
      sample: 'The body text you are reading right now is set in this typeface, at this weight.'
    },
    {
      key: 'mono', label: 'IBM Plex Mono', role: 'Labels',
      detail: 'Weights 400 and 500, plus italic. Section eyebrows, status badges, the nav wordmark, and every mono UI label.',
      sampleFont: "500 11px 'IBM Plex Mono', monospace", sampleColor: '#efa85c',
      sample: '05 · THIS SITE'
    }
  ];

  function osReducedMotion() {
    return !!(window.gbReducedMotion && window.gbReducedMotion());
  }

  function el(tag, className, attrs) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (attrs) {
      Object.keys(attrs).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    }
    return node;
  }

  function buildDemo() {
    var wrap = el('div', 'tsd');

    // ---- tabs ----
    var tabs = el('div', 'tsd-tabs', { role: 'tablist', 'aria-label': 'Design system aspect' });
    var TABS = [
      { key: 'palette', label: 'Palette' },
      { key: 'type', label: 'Type' },
      { key: 'motion', label: 'Motion' }
    ];

    var tabEls = [];
    var panelEls = {};

    function selectTab(key, focus) {
      TABS.forEach(function (t) {
        var tabEl = tabEls[t.key];
        var on = t.key === key;
        tabEl.setAttribute('aria-selected', on ? 'true' : 'false');
        tabEl.tabIndex = on ? 0 : -1;
        tabEl.classList.toggle('is-active', on);
        panelEls[t.key].hidden = !on;
      });
      if (focus && tabEls[key]) tabEls[key].focus();
    }

    TABS.forEach(function (t, i) {
      var tabId = 'tsd-tab-' + t.key;
      var panelId = 'tsd-panel-' + t.key;
      var tabEl = el('button', 'tsd-tab', {
        type: 'button', role: 'tab', id: tabId, 'aria-controls': panelId, 'aria-selected': i === 0 ? 'true' : 'false'
      });
      tabEl.tabIndex = i === 0 ? 0 : -1;
      tabEl.textContent = t.label;
      tabEl.addEventListener('click', function () { selectTab(t.key, false); });
      tabEl.addEventListener('keydown', function (e) {
        var order = TABS.map(function (x) { return x.key; });
        var idx = order.indexOf(t.key);
        var next = null;
        if (e.key === 'ArrowRight') next = order[(idx + 1) % order.length];
        else if (e.key === 'ArrowLeft') next = order[(idx - 1 + order.length) % order.length];
        else if (e.key === 'Home') next = order[0];
        else if (e.key === 'End') next = order[order.length - 1];
        if (next) { e.preventDefault(); selectTab(next, true); }
      });
      tabEls[t.key] = tabEl;
      tabs.appendChild(tabEl);
    });

    wrap.appendChild(tabs);

    // ---- palette panel ----
    var palettePanel = el('div', 'tsd-panel', { role: 'tabpanel', id: 'tsd-panel-palette', 'aria-labelledby': 'tsd-tab-palette' });
    var swatchGroup = el('div', 'tsd-swatches', { role: 'group', 'aria-label': 'Palette swatches' });
    var paletteDetail = el('div', 'tsd-detail', { 'aria-live': 'polite' });

    function showSwatch(sw, btn) {
      swatchGroup.querySelectorAll('.tsd-swatch').forEach(function (b) { b.classList.remove('is-active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');
      paletteDetail.textContent = '';
      var name = el('div', 'tsd-detail-name');
      name.textContent = sw.name + '  ' + sw.hex;
      var role = el('p', 'tsd-detail-role');
      role.textContent = sw.role;
      paletteDetail.appendChild(name);
      paletteDetail.appendChild(role);
    }

    SWATCHES.forEach(function (sw, i) {
      var btn = el('button', 'tsd-swatch', { type: 'button', 'aria-pressed': i === 0 ? 'true' : 'false' });
      btn.style.background = sw.hex;
      if (sw.hex === '#171009') btn.classList.add('tsd-swatch-dark');
      var lbl = el('span', 'tsd-swatch-label');
      lbl.textContent = sw.name;
      btn.appendChild(lbl);
      btn.addEventListener('click', function () { showSwatch(sw, btn); });
      if (i === 0) btn.classList.add('is-active');
      swatchGroup.appendChild(btn);
    });

    palettePanel.appendChild(swatchGroup);
    palettePanel.appendChild(paletteDetail);
    showSwatch(SWATCHES[0], swatchGroup.querySelector('.tsd-swatch'));
    wrap.appendChild(palettePanel);
    panelEls.palette = palettePanel;

    // ---- type panel ----
    var typePanel = el('div', 'tsd-panel', { role: 'tabpanel', id: 'tsd-panel-type', 'aria-labelledby': 'tsd-tab-type', hidden: 'hidden' });
    var typeGroup = el('div', 'tsd-typebtns', { role: 'group', 'aria-label': 'Typefaces' });
    var typeSample = el('div', 'tsd-type-sample');
    var typeDetail = el('p', 'tsd-detail-role tsd-type-detail');

    function showTypeface(tf, btn) {
      typeGroup.querySelectorAll('.tsd-typebtn').forEach(function (b) { b.classList.remove('is-active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');
      typeSample.style.font = tf.sampleFont;
      typeSample.style.color = tf.sampleColor;
      typeSample.textContent = tf.sample;
      typeDetail.textContent = tf.label + ' — ' + tf.role + '. ' + tf.detail;
    }

    TYPEFACES.forEach(function (tf, i) {
      var btn = el('button', 'tsd-typebtn', { type: 'button', 'aria-pressed': i === 0 ? 'true' : 'false' });
      btn.textContent = tf.label;
      btn.addEventListener('click', function () { showTypeface(tf, btn); });
      if (i === 0) btn.classList.add('is-active');
      typeGroup.appendChild(btn);
    });

    typePanel.appendChild(typeGroup);
    typePanel.appendChild(typeSample);
    typePanel.appendChild(typeDetail);
    showTypeface(TYPEFACES[0], typeGroup.querySelector('.tsd-typebtn'));
    wrap.appendChild(typePanel);
    panelEls.type = typePanel;

    // ---- motion panel ----
    var motionPanel = el('div', 'tsd-panel', { role: 'tabpanel', id: 'tsd-panel-motion', 'aria-labelledby': 'tsd-tab-motion', hidden: 'hidden' });
    var motionIntro = el('p', 'tsd-detail-role');
    motionIntro.textContent = 'The real rule, from css/site.css: when your system requests reduced motion, one media query clamps every animation and transition on this site to near-zero duration, without disabling them outright, so the final frame still lands. This toggle applies that exact rule to the demo below it.';

    var motionRow = el('div', 'tsd-motion-row');
    var motionToggle = el('button', 'tsd-toggle', { type: 'button', role: 'switch' });
    var motionToggleLabel = el('span', 'tsd-toggle-label');
    motionToggleLabel.textContent = 'Reduced motion';
    var motionNote = el('p', 'tsd-motion-note');

    var motionDemo = el('div', 'tsd-motion-demo', { 'aria-hidden': 'true' });
    var dotsRow = el('div', 'tsd-dots');
    for (var d = 0; d < 3; d++) {
      var dot = el('span', 'tsd-dot');
      dot.style.animationDelay = (d * 0.22) + 's';
      dotsRow.appendChild(dot);
    }
    var dotsCaption = el('span', 'tsd-dots-caption');
    dotsCaption.textContent = 'ACTIVE';
    motionDemo.appendChild(dotsRow);
    motionDemo.appendChild(dotsCaption);

    var locked = osReducedMotion();
    var reduced = locked ? true : false;

    function applyMotionState() {
      motionToggle.setAttribute('aria-checked', reduced ? 'true' : 'false');
      motionToggle.classList.toggle('is-on', reduced);
      wrap.dataset.motion = reduced ? 'reduced' : 'full';
      if (locked) {
        motionNote.textContent = 'Your system already requests reduced motion, so this demo stays clamped to match it — it will not fight that setting.';
      } else {
        motionNote.textContent = reduced
          ? 'Clamped: the dots still show "active," but the pulse animation is cut to near-zero duration, same as the real site.'
          : 'Full motion: the dots pulse continuously, same animation the real "ACTIVE" indicator on /now uses.';
      }
    }

    if (locked) {
      motionToggle.disabled = true;
      motionToggle.setAttribute('aria-disabled', 'true');
    } else {
      motionToggle.addEventListener('click', function () {
        reduced = !reduced;
        applyMotionState();
      });
    }
    applyMotionState();

    motionRow.appendChild(motionToggle);
    motionRow.appendChild(motionToggleLabel);

    motionPanel.appendChild(motionIntro);
    motionPanel.appendChild(motionRow);
    motionPanel.appendChild(motionNote);
    motionPanel.appendChild(motionDemo);
    wrap.appendChild(motionPanel);
    panelEls.motion = motionPanel;

    return wrap;
  }

  fallback.replaceWith(buildDemo());
})();
