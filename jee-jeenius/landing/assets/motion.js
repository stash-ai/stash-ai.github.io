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
  function initAurora(s) {}
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
