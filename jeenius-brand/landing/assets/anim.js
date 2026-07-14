/* JEEnius brand — GSAP motion layer.
   One system for load choreography, scrolltelling and pointer micro-physics.
   Requires gsap + ScrollTrigger + SplitText (CDN, loaded before this file).
   Every effect is gated through gsap.matchMedia: reduced-motion gets a static page. */
(function () {
  'use strict';

  var root = document.documentElement;

  // CDN failed → keep the pre-GSAP fallback behaviours from app.js untouched.
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  if (window.SplitText) gsap.registerPlugin(SplitText);

  root.classList.add('gsap');

  var hero = document.querySelector('main > header');

  // The legacy CSS reveal system is neutralised under html.gsap; mark everything
  // outside the hero visible so app.js's IntersectionObserver becomes a no-op.
  document.querySelectorAll('.reveal').forEach(function (el) {
    if (!hero || !hero.contains(el)) el.classList.add('is-visible');
  });
  document.querySelectorAll('[data-stagger]').forEach(function (el) { el.classList.add('stagger-in'); });

  var mm = gsap.matchMedia();

  /* ---------- reduced motion: everything visible, nothing moves ---------- */
  mm.add('(prefers-reduced-motion: reduce)', function () {
    document.querySelectorAll('[data-count]').forEach(function (el) {
      el.textContent = el.dataset.count + (el.dataset.suffix || '');
    });
  });

  /* ==========================================================================
     MAIN choreography — gated on motion preference ONLY (not width), so a
     resize across a breakpoint never reverts and replays the hero intro.
     ========================================================================== */
  mm.add('(prefers-reduced-motion: no-preference)', function () {
    /* ---------- shared enter states ---------- */
    var enterEase = 'power3.out';

    /* ---------- hero load choreography ---------- */
    if (hero) {
      var eyebrow = hero.querySelector('.eyebrow');
      var h1 = hero.querySelector('h1');
      var lead = hero.querySelector('.lead');
      var cards = hero.querySelectorAll('.pick > *');
      var chips = hero.querySelectorAll('.chip');
      var blobs = hero.querySelectorAll('.aurora__blob');

      gsap.set([eyebrow, lead], { autoAlpha: 0, y: 18 });
      gsap.set(cards, { autoAlpha: 0, y: 42, scale: 0.985 });
      gsap.set(chips, { autoAlpha: 0, y: 14 });
      gsap.set(blobs, { autoAlpha: 0, scale: 0.85 });

      var heroPlayed = false;
      var buildHero = function (lines) {
        // the sweep span may have been split into one fragment per line
        var sweeps = hero.querySelectorAll('.hl-sweep');
        var tl = gsap.timeline({ defaults: { ease: enterEase } });
        tl.set(sweeps, { backgroundSize: '0% 100%' }, 0)
          .to(blobs, { autoAlpha: 1, scale: 1, duration: 1.6, ease: 'sine.out', stagger: 0.15 }, 0)
          .to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.55 }, 0.1);
        if (lines) {
          tl.from(lines, { yPercent: 115, duration: 0.95, ease: 'power4.out', stagger: 0.12 }, 0.22);
        } else {
          tl.from(h1, { autoAlpha: 0, y: 24, duration: 0.8 }, 0.22);
        }
        tl.to(sweeps, { backgroundSize: '100% 100%', duration: 0.8, ease: 'power2.inOut' }, 0.9)
          .to(lead, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.7)
          .to(cards, { autoAlpha: 1, y: 0, scale: 1, duration: 0.85, stagger: 0.14 }, 0.85)
          .to(chips, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.07 }, 1.25);
        heroPlayed = true;
        return tl;
      };

      if (h1 && window.SplitText) {
        SplitText.create(h1, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit: function (self) {
            if (heroPlayed) {
              return gsap.set(hero.querySelectorAll('.hl-sweep'), { backgroundSize: '100% 100%' });
            }
            return buildHero(self.lines);
          }
        });
      } else if (h1) {
        buildHero(null);
      }

      // Safety net: if the intro never runs (e.g. GSAP ticker stalls), reveal
      // the hero so content is never trapped invisible. Fires well after the
      // ~1.8s intro; a normal playthrough leaves nothing to reveal.
      window.setTimeout(function () {
        if (parseFloat(getComputedStyle(eyebrow).opacity) < 0.9) {
          gsap.set([eyebrow, lead, cards, chips, blobs], { clearProps: 'all', autoAlpha: 1 });
          gsap.set(hero.querySelectorAll('.hl-sweep'), { backgroundSize: '100% 100%' });
        }
      }, 2600);
    }

    /* ---------- section titles: masked line rise on scroll ---------- */
    if (window.SplitText) {
      document.querySelectorAll('.section-title, main .section h1.font-display').forEach(function (title) {
        if (hero && hero.contains(title)) return;
        SplitText.create(title, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit: function (self) {
            return gsap.from(self.lines, {
              yPercent: 110,
              duration: 0.85,
              ease: 'power4.out',
              stagger: 0.1,
              scrollTrigger: { trigger: title, start: 'top 86%', once: true }
            });
          }
        });
      });
    }

    /* ---------- batched content reveals (tiles, cards, faq, stats) ---------- */
    var batchTargets = gsap.utils.toArray([
      '.bento .tile', '.stat-box', '.faq-item', '.pick > *', '.price-card',
      'main .section .card', 'main .section .lead, main .section p.lead'
    ].join(',')).filter(function (el) { return !hero || !hero.contains(el); });

    if (batchTargets.length) {
      gsap.set(batchTargets, { autoAlpha: 0, y: 30 });
      ScrollTrigger.batch(batchTargets, {
        start: 'top 88%',
        once: true,
        onEnter: function (els) {
          gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.75, ease: enterEase, stagger: 0.09, overwrite: true });
        }
      });
    }

    // mini mock palette squares pop in one by one
    var squares = gsap.utils.toArray('.mini-palette .q');
    if (squares.length) {
      gsap.set(squares, { autoAlpha: 0, scale: 0.5 });
      ScrollTrigger.batch(squares, {
        start: 'top 92%',
        once: true,
        onEnter: function (els) {
          gsap.to(els, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(2)', stagger: 0.05, overwrite: true });
        }
      });
    }

    // worked-solution card: answer writes on, steps slide in
    var sol = document.querySelector('.mini-sol');
    if (sol) {
      var ans = sol.querySelector('.ans');
      var steps = sol.querySelectorAll('.step');
      gsap.set(ans, { clipPath: 'inset(0 100% 0 0)' });
      gsap.set(steps, { autoAlpha: 0, x: -14 });
      gsap.timeline({ scrollTrigger: { trigger: sol, start: 'top 82%', once: true } })
        .to(ans, { clipPath: 'inset(0 0% 0 0)', duration: 0.7, ease: 'power2.inOut' })
        .to(steps, { autoAlpha: 1, x: 0, duration: 0.5, ease: enterEase, stagger: 0.14 }, '-=0.25');
    }

    /* ---------- count-ups tied to scroll entry ---------- */
    document.querySelectorAll('[data-count]').forEach(function (el) {
      var end = parseFloat(el.dataset.count), suf = el.dataset.suffix || '';
      var state = { v: 0 };
      el.textContent = '0' + suf;
      gsap.to(state, {
        v: end,
        duration: 1.6,
        ease: 'power2.out',
        onUpdate: function () { el.textContent = Math.round(state.v) + suf; },
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });

    /* ---------- syllabus marquee: slow, constant, seamless ---------- */
    var track = document.querySelector('[data-marquee]');
    if (track && !track.dataset.cloned) {
      track.innerHTML += track.innerHTML;   // two copies → -50% loop
      track.dataset.cloned = 'true';
    }
    if (track) {
      gsap.to(track, { xPercent: -50, duration: 36, ease: 'none', repeat: -1 });
    }

  }); // end main choreography

  /* ==========================================================================
     DESKTOP scrolltelling — sticky product stack + aurora parallax.
     Own matchMedia context: crossing 900px reverts ONLY this, never the hero.
     ========================================================================== */
  mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', function () {
    var stack = document.querySelector('.stack');
    if (stack && stack.children.length === 2) {
      var first = stack.children[0], second = stack.children[1];
      ScrollTrigger.create({
        trigger: first,
        start: 'top top',
        endTrigger: second,
        end: 'top top',
        pin: true,
        pinSpacing: false,
        anticipatePin: 1
      });
      gsap.to(first, {
        scale: 0.94,
        autoAlpha: 0.3,
        transformOrigin: 'center 30%',
        ease: 'none',
        scrollTrigger: { trigger: second, start: 'top bottom', end: 'top top', scrub: true }
      });
    }

    // hero aurora drifts up slightly as you scroll away
    var group = hero && hero.querySelector('.aurora__group');
    if (group) {
      gsap.to(group, {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
      });
    }
  });

  /* ==========================================================================
     POINTER micro-physics — magnetic CTAs, 3D tilt + glare, cursor spotlight.
     Fine pointers only; touch devices skip it entirely.
     ========================================================================== */
  mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', function () {
    document.querySelectorAll('[data-magnetic]').forEach(function (el) {
      var qx = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3' });
      var qy = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3' });
      var rect = null;
      el.addEventListener('pointerenter', function () { rect = el.getBoundingClientRect(); });
      el.addEventListener('pointermove', function (e) {
        if (!rect) rect = el.getBoundingClientRect();
        qx(gsap.utils.clamp(-8, 8, (e.clientX - (rect.left + rect.width / 2)) * 0.28));
        qy(gsap.utils.clamp(-8, 8, (e.clientY - (rect.top + rect.height / 2)) * 0.28) - 1);
      }, { passive: true });
      el.addEventListener('pointerleave', function () { qx(0); qy(0); rect = null; });
    });

    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      var max = parseFloat(el.getAttribute('data-tilt')) || 5;
      var glare = el.querySelector('.tilt-glare');
      if (!glare) { glare = document.createElement('span'); glare.className = 'tilt-glare'; el.appendChild(glare); }
      gsap.set(el, { transformPerspective: 900 });
      var qrx = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power2' });
      var qry = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power2' });
      var setG = gsap.quickSetter(glare, 'css');
      var rect = null;
      el.addEventListener('pointerenter', function () { rect = el.getBoundingClientRect(); el.classList.add('tilting'); });
      el.addEventListener('pointermove', function (e) {
        if (!rect) rect = el.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width, py = (e.clientY - rect.top) / rect.height;
        qry((px - 0.5) * 2 * max);
        qrx(-(py - 0.5) * 2 * max);
        setG({ '--gx': (px * 100).toFixed(1) + '%', '--gy': (py * 100).toFixed(1) + '%' });
      }, { passive: true });
      el.addEventListener('pointerleave', function () { el.classList.remove('tilting'); qrx(0); qry(0); rect = null; });
    });

    document.querySelectorAll('[data-spotlight]').forEach(function (el) {
      var set = gsap.quickSetter(el, 'css');
      var rect = null;
      el.addEventListener('pointerenter', function () { rect = el.getBoundingClientRect(); el.classList.add('spot-on'); });
      el.addEventListener('pointermove', function (e) {
        if (!rect) rect = el.getBoundingClientRect();
        set({ '--mx': (e.clientX - rect.left) + 'px', '--my': (e.clientY - rect.top) + 'px' });
      }, { passive: true });
      el.addEventListener('pointerleave', function () { el.classList.remove('spot-on'); rect = null; });
    });
  });
})();
