/* JEEnius — hero "exam universe" constellation background.
   Themed (light network on cream / night sky on dark), tooltips, dependency-free. */
(function () {
  'use strict';
  var canvas = document.getElementById('hero-constellation');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var tip = document.getElementById('hc-tip');
  var host = canvas.parentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0;

  var PAL = {
    light: {
      core: { phys: '#173d37', chem: '#8a6a00', math: '#276c5e' },
      glow: { phys: '#6fbfa4', chem: '#e9c766', math: '#7fc9b4' },
      glowA: 0.18, coreA: 0.7, lineA: 0.10, dust: 'rgba(70,100,90,0.28)'
    },
    dark: {
      core: { phys: '#EFFDF7', chem: '#FFF3C4', math: '#EAFBF4' },
      glow: { phys: '#74E0AD', chem: '#FFD86B', math: '#9BE7D6' },
      glowA: 0.5, coreA: 0.95, lineA: 0.12, dust: 'rgba(200,225,215,0.5)'
    }
  };
  function isDark() { return document.documentElement.classList.contains('dark'); }
  function pal() { return isDark() ? PAL.dark : PAL.light; }

  // Illustrative topic weights + one-line samples (kept short for the hero).
  var TOPICS = {
    phys: [
      ['EMI', .9], ['Rotational Motion', .88], ['Electrostatics', .87], ['Modern Physics', .86],
      ['Current Electricity', .85], ['Kinematics', .84], ['SHM', .8], ['Ray Optics', .78]
    ],
    chem: [
      ['General Organic Chem', .86], ['Chemical Bonding', .85], ['Electrochemistry', .83],
      ['Coordination Compounds', .81], ['Mole Concept', .8], ['Thermodynamics', .78], ['Kinetics', .76]
    ],
    math: [
      ['Definite Integration', .88], ['Application of Derivatives', .85], ['Vectors & 3D', .84],
      ['Conic Sections', .83], ['Probability', .82], ['Complex Numbers', .8], ['Matrices', .78]
    ]
  };
  var SUBJ = { phys: 'Physics', chem: 'Chemistry', math: 'Maths' };

  var stars = [], named = [], links = [], glow = {};
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function g1() { var u = Math.random() || 1e-9, v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.2832 * v); }

  // Clusters positioned toward the top / sides so they read behind the hero copy.
  var CENTER = { phys: [.20, .30], chem: [.82, .26], math: [.62, .60] };

  function build() {
    stars = []; named = []; links = [];
    Object.keys(TOPICS).forEach(function (sub) {
      var c = CENTER[sub];
      TOPICS[sub].forEach(function (t) {
        var s = {
          fx: Math.min(.98, Math.max(.02, c[0] + g1() * .12)),
          fy: Math.min(.96, Math.max(.04, c[1] + g1() * .16)),
          sub: sub, name: t[0], w: t[1], named: true,
          z: rnd(.5, 1), tw: Math.random() * 6.283, tws: rnd(.6, 1.4),
          r: 1.5 + t[1] * 2.6
        };
        stars.push(s); named.push(s);
      });
      var ss = named.filter(function (s) { return s.sub === sub; });
      ss.forEach(function (a) {
        var best = null, bd = 1e9;
        ss.forEach(function (b) { if (b === a) return; var d = (a.fx - b.fx) * (a.fx - b.fx) + (a.fy - b.fy) * (a.fy - b.fy); if (d < bd) { bd = d; best = b; } });
        if (best && Math.random() < .8) links.push([a, best, sub]);
      });
    });
    var dust = W < 680 ? 26 : 54;
    for (var i = 0; i < dust; i++) {
      stars.push({ fx: Math.random(), fy: Math.random(), sub: ['phys', 'chem', 'math'][i % 3], w: 0, named: false,
        z: rnd(.25, .85), tw: Math.random() * 6.283, tws: rnd(.5, 1.3), r: rnd(.5, 1.2) });
    }
  }

  function hexA(hex, a) {
    var n = parseInt(hex.slice(1), 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  }
  function makeGlow(color, a) {
    var S = 96, c = document.createElement('canvas'); c.width = c.height = S;
    var g = c.getContext('2d'), rg = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    rg.addColorStop(0, hexA(color, a)); rg.addColorStop(.5, hexA(color, a * .35)); rg.addColorStop(1, hexA(color, 0));
    g.fillStyle = rg; g.beginPath(); g.arc(S / 2, S / 2, S / 2, 0, 6.283); g.fill();
    return c;
  }
  function rebuildGlow() {
    var p = pal();
    glow = { phys: makeGlow(p.glow.phys, p.glowA), chem: makeGlow(p.glow.chem, p.glowA), math: makeGlow(p.glow.math, p.glowA) };
  }

  var par = { x: 0, y: 0, tx: 0, ty: 0 }, hovered = null, raf = null;

  function resize() {
    W = host.clientWidth; H = host.clientHeight;
    canvas.width = W * DPR; canvas.height = H * DPR; canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    if (!stars.length) build();
    rebuildGlow();
    if (reduce) draw(0);
  }
  function pos(s) {
    return { x: s.fx * W + par.x * 26 * s.z, y: s.fy * H + par.y * 22 * s.z };
  }
  function draw(time) {
    if (!reduce) { par.x += (par.tx - par.x) * .06; par.y += (par.ty - par.y) * .06; }
    ctx.clearRect(0, 0, W, H);
    var p = pal();
    // links
    ctx.globalCompositeOperation = 'source-over';
    ctx.lineWidth = 1;
    for (var li = 0; li < links.length; li++) {
      var a = pos(links[li][0]), b = pos(links[li][1]);
      ctx.strokeStyle = 'rgba(' + (isDark() ? '255,255,255,' : '27,59,54,') + p.lineA + ')';
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    // stars
    ctx.globalCompositeOperation = isDark() ? 'lighter' : 'source-over';
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i], q = pos(s);
      var tw = reduce ? 1 : (.75 + .25 * Math.sin(time * .001 * s.tws + s.tw));
      var hov = s === hovered, rr = s.r * (hov ? 1.6 : 1);
      if (s.named) {
        var sp = glow[s.sub], gs = rr * (hov ? 10 : 6.5);
        ctx.globalAlpha = (hov ? 1 : Math.min(1, s.w)) * tw;
        ctx.drawImage(sp, q.x - gs / 2, q.y - gs / 2, gs, gs);
        ctx.globalAlpha = p.coreA * tw;
        ctx.fillStyle = isDark() ? p.core[s.sub] : p.core[s.sub];
        ctx.beginPath(); ctx.arc(q.x, q.y, rr * .9, 0, 6.283); ctx.fill();
      } else {
        ctx.globalAlpha = tw; ctx.fillStyle = p.dust;
        ctx.beginPath(); ctx.arc(q.x, q.y, rr, 0, 6.283); ctx.fill();
      }
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    if (!reduce) raf = requestAnimationFrame(draw);
  }

  // tooltip
  function pick(mx, my) {
    var best = null, bd = 26 * 26;
    for (var i = 0; i < named.length; i++) { var q = pos(named[i]); var d = (q.x - mx) * (q.x - mx) + (q.y - my) * (q.y - my); if (d < bd) { bd = d; best = named[i]; } }
    return best;
  }
  function showTip(s, mx, my) {
    if (!tip) return;
    hovered = s;
    tip.querySelector('.hc-ss').textContent = SUBJ[s.sub];
    tip.querySelector('.hc-dot').style.background = pal().glow[s.sub];
    tip.querySelector('.hc-t').textContent = s.name;
    tip.querySelector('.hc-l').textContent = '~' + Math.round(s.w * 100) + '% likely · illustrative';
    var tw = 190, th = tip.offsetHeight || 70, x = mx + 16, y = my - th - 10;
    if (x + tw > W - 8) x = mx - tw - 16; if (x < 8) x = 8;
    if (y < 4) y = my + 16;
    tip.style.left = x + 'px'; tip.style.top = y + 'px';
    tip.classList.add('show'); tip.setAttribute('aria-hidden', 'false');
  }
  function hideTip() { hovered = null; if (tip) { tip.classList.remove('show'); tip.setAttribute('aria-hidden', 'true'); } if (reduce) draw(0); }

  var sched = false, last = { x: 0, y: 0 };
  function move(x, y) {
    var r = canvas.getBoundingClientRect(); last.x = x - r.left; last.y = y - r.top;
    par.tx = (last.x / W - .5) * 2; par.ty = (last.y / H - .5) * 2;
    if (sched) return; sched = true;
    requestAnimationFrame(function () {
      sched = false;
      var s = pick(last.x, last.y);
      if (s) { if (s !== hovered) showTip(s, last.x, last.y); canvas.style.cursor = 'pointer'; }
      else { if (hovered) hideTip(); canvas.style.cursor = 'default'; }
      if (reduce) draw(0);
    });
  }
  if (fine) {
    canvas.addEventListener('pointermove', function (e) { move(e.clientX, e.clientY); }, { passive: true });
    canvas.addEventListener('pointerleave', function () { par.tx = 0; par.ty = 0; hideTip(); });
  }
  canvas.addEventListener('pointerdown', function (e) {
    var r = canvas.getBoundingClientRect(), s = pick(e.clientX - r.left, e.clientY - r.top);
    if (s) { if (s === hovered) hideTip(); else showTip(s, e.clientX - r.left, e.clientY - r.top); } else hideTip();
  });

  // re-theme on dark toggle
  var mo = new MutationObserver(function () { rebuildGlow(); if (reduce) draw(0); });
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  window.addEventListener('resize', resize, { passive: true });
  resize();
  if (!reduce) { raf = requestAnimationFrame(draw); }
})();
