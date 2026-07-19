/* ============================================================
   George Brothers — now.js
   Page behavior for /now: Nashville clock in the nav. Plain ES2017.
   ============================================================ */
(function () {
  'use strict';

  // ---- Nashville clock: updates #nash-time textContent only, 1/s ----
  function updateClock() {
    var el = document.getElementById('nash-time');
    if (!el) return;
    try {
      var t = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Chicago',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(new Date());
      el.textContent = '— ' + t;
    } catch (e) {
      /* Intl/timeZone unsupported: leave placeholder text as-is */
    }
  }
  updateClock();
  setInterval(updateClock, 1000);
})();
