/* ============================================================
   George Brothers — connect.js
   Carv link UA swap + message form (client validation, guarded
   Formspree submit, success panel, send-another reset).
   Plain ES2017, no modules. Loaded with <script defer>.
   ============================================================ */
(function () {
  'use strict';

  // ---- Carv link: swap to the platform store URL based on UA ----
  // Markup default is the desktop URL (https://getcarv.com/); only
  // override it for Android / iOS, matching the original DC logic.
  (function initCarvLink() {
    var carv = document.getElementById('carv-link');
    if (!carv) return;
    var ua = navigator.userAgent;
    if (/android/i.test(ua)) {
      carv.href = 'https://play.google.com/store/apps/details?id=com.motionmetrics.carv';
    } else if (/iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) {
      carv.href = 'https://apps.apple.com/us/app/carv-digital-ski-coach/id1238683093';
    }
  })();

  // ---- Message form ----
  var form = document.getElementById('msg-form');
  if (!form) return;

  var formPanel = document.getElementById('form-panel');
  var sentPanel = document.getElementById('sent-panel');
  var sentNameEl = document.getElementById('sent-name');
  var errEl = document.getElementById('form-err');
  var sendAnotherBtn = document.getElementById('send-another');

  var submitBtn = form.querySelector('button[type="submit"]');
  var submitLabel = submitBtn ? submitBtn.textContent : '';
  var sending = false;

  function showError(msg, field) {
    errEl.textContent = msg;
    errEl.hidden = false;
    if (field) {
      field.setAttribute('aria-invalid', 'true');
      field.setAttribute('aria-describedby', 'form-err');
      field.focus();
    }
  }

  function clearError() {
    errEl.textContent = '';
    errEl.hidden = true;
    ['name', 'email', 'message'].forEach(function (n) {
      var f = form.elements[n];
      if (f) {
        f.removeAttribute('aria-invalid');
        f.removeAttribute('aria-describedby');
      }
    });
  }

  function setSending(on) {
    sending = on;
    if (!submitBtn) return;
    submitBtn.disabled = on;
    submitBtn.style.opacity = on ? '.6' : '';
    submitBtn.textContent = on ? 'Sending…' : submitLabel;
  }

  function markSent(name) {
    if (sentNameEl) sentNameEl.textContent = name || 'friend';
    if (formPanel) formPanel.hidden = true;
    if (sentPanel) sentPanel.hidden = false;
    var sentTitle = document.getElementById('sent-title');
    if (sentTitle) sentTitle.focus();
  }

  function resetForm() {
    form.reset();
    clearError();
    if (sentPanel) sentPanel.hidden = true;
    if (formPanel) formPanel.hidden = false;
    var nameField = form.elements['name'];
    if (nameField) nameField.focus();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (sending) return;
    clearError();

    var name = (form.elements['name'].value || '').trim();
    var email = (form.elements['email'].value || '').trim();
    var message = (form.elements['message'].value || '').trim();
    var okEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

    if (!name) {
      showError('A name would be nice.', form.elements['name']);
      return;
    }
    if (!okEmail) {
      showError('That email doesn’t look right.', form.elements['email']);
      return;
    }
    if (!message) {
      showError('Add a line or two so I know what this is about.', form.elements['message']);
      return;
    }

    var action = form.getAttribute('action') || '';
    if (action.indexOf('__FORMSPREE_ID__') !== -1) {
      showError('Form isn’t wired up yet. Reach me on LinkedIn.');
      return;
    }

    setSending(true);
    fetch(action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    }).then(function (res) {
      setSending(false);
      if (res.ok) {
        markSent(name);
      } else {
        showError('Something went wrong. Try again, or reach me on LinkedIn.');
      }
    }).catch(function () {
      setSending(false);
      showError('Something went wrong. Try again, or reach me on LinkedIn.');
    });
  });

  if (sendAnotherBtn) sendAnotherBtn.addEventListener('click', resetForm);
})();
