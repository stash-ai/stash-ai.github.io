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
