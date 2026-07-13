/* JEEnius — shared behaviours for nav/footer across pages */
(function () {
  var t = document.getElementById('darkModeToggle');
  if (t) {
    var sun = document.getElementById('sunIcon'), moon = document.getElementById('moonIcon');
    function sync() { var d = document.documentElement.classList.contains('dark'); if (sun) sun.classList.toggle('hidden', d); if (moon) moon.classList.toggle('hidden', !d); }
    sync();
    t.addEventListener('click', function () {
      document.documentElement.classList.toggle('dark');
      try { localStorage.setItem('jeenius-brand-dark-mode', document.documentElement.classList.contains('dark')); } catch (e) {}
      sync();
    });
  }

  var b = document.getElementById('mobileMenuBtn'), m = document.getElementById('mobileMenu');
  if (b && m) {
    b.addEventListener('click', function () { m.classList.toggle('open'); });
    m.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { m.classList.remove('open'); }); });
  }

  window.addEventListener('scroll', function () {
    var n = document.getElementById('nav'); if (n) n.classList.toggle('scrolled', window.scrollY > 40);
    var f = document.getElementById('floatingCta'); if (f) f.classList.toggle('show', window.scrollY > 600);
  });

  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  function track(label, type) {
    var name = 'stashai_' + (type || 'interaction');
    if (window.posthog) { try { posthog.capture(name, { label: label, type: type }); } catch (e) {} }
    if (window.firebaseAnalytics) { try { firebaseAnalytics.logEvent(name, { label: label, type: type }); } catch (e) {} }
  }
  document.querySelectorAll('[data-cta="true"]').forEach(function (el) {
    el.addEventListener('click', function () { track(el.dataset.trackLabel || 'cta', 'cta'); });
  });
})();

/* Count-up stats when scrolled into view (elements with data-count) */
(function () {
  var els = document.querySelectorAll('[data-count]');
  if (!els.length) return;
  function countUp(el) {
    var target = +el.dataset.count, suf = el.dataset.suffix || '', dur = 1100, t0 = null;
    function step(ts) { t0 = t0 || ts; var p = Math.min((ts - t0) / dur, 1); var e = 1 - Math.pow(1 - p, 3); el.textContent = Math.round(e * target) + suf; if (p < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.textContent = el.dataset.count + (el.dataset.suffix || ''); });
    return;
  }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { countUp(e.target); io.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  els.forEach(function (el) { io.observe(el); });
})();

/* FAQ accordion (brand pages) */
(function () {
  document.querySelectorAll('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.parentElement, open = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(function (i) { i.classList.remove('active'); });
      if (!open) item.classList.add('active');
    });
  });
})();
