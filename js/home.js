/* ============================================================
   George Brothers — home.js
   Pauses the 4 decorative card scenes (animation-play-state)
   while they're scrolled offscreen, using the shared gbObserve
   helper from site.js. No-op under prefers-reduced-motion (the
   global duration-clamp in site.css already freezes them).
   ============================================================ */
(function () {
  'use strict';

  if (window.gbReducedMotion && window.gbReducedMotion()) return;
  if (!window.gbObserve) return;

  var scenes = document.querySelectorAll('.r-scene');
  for (var i = 0; i < scenes.length; i++) {
    (function (scene) {
      window.gbObserve(scene, function () {
        scene.classList.remove('gb-paused');
      }, function () {
        scene.classList.add('gb-paused');
      });
    })(scenes[i]);
  }
})();
