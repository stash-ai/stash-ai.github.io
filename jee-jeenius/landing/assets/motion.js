/* JEEnius — "Living calm" motion layer.
   Dependency-free progressive enhancement. No globals; ES5-compatible. */
(function () {
  'use strict';

  var root = document.documentElement;
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mqFine = window.matchMedia('(hover: hover) and (pointer: fine)');

  var state = { reduce: mqReduce.matches, fine: mqFine.matches && !mqReduce.matches };

  root.classList.add('motion-ready');
  root.classList.toggle('motion-fine', state.fine);
  root.classList.toggle('motion-reduce', state.reduce);

  function rafThrottle(fn) {
    var queued = false, self, args;
    return function () {
      self = this; args = arguments;
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () { queued = false; fn.apply(self, args); });
    };
  }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, min, max) { return v < min ? min : (v > max ? max : v); }

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  // ---- feature units (stubs replaced in later tasks; hoisted, safe to call) ----
  function initAurora(s) {
    var group = document.querySelector('[data-aurora-group]');
    if (!group || !s.fine) return; // touch/reduced: CSS drift only
    var tx = 0, ty = 0, cx = 0, cy = 0, MAX = 8, active = false;
    function tick() {
      cx = lerp(cx, tx, 0.06); cy = lerp(cy, ty, 0.06);
      group.style.transform = 'translate3d(' + cx.toFixed(2) + 'px,' + cy.toFixed(2) + 'px,0)';
      if (Math.abs(cx - tx) > 0.1 || Math.abs(cy - ty) > 0.1) requestAnimationFrame(tick);
      else active = false;
    }
    window.addEventListener('pointermove', function (e) {
      tx = (e.clientX / window.innerWidth - 0.5) * 2 * MAX;
      ty = (e.clientY / window.innerHeight - 0.5) * 2 * MAX;
      if (!active) { active = true; requestAnimationFrame(tick); }
    }, { passive: true });
  }
  function initTilt() {}
  function initMagnetic() {}
  function initSpotlight() {}
  function initScrollChoreography() {}

  ready(function () {
    initAurora(state);
    initScrollChoreography();
    if (state.fine) { initTilt(); initMagnetic(); initSpotlight(); }
  });
})();
