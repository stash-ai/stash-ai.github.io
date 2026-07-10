/* JEEnius — "Feel the physics" section: interactive charged-ring EMI simulation.
   Physics: E = (R/2)·dB/dt, α = (q/2m)·dB/dt, ω = qB/2m (q=m=1, illustrative units). */
(function () {
  'use strict';
  var cv = document.getElementById('fp-canvas');
  if (!cv || !cv.getContext) return;
  var ctx = cv.getContext('2d');
  var slider = document.getElementById('fp-b');
  var elA = document.getElementById('fp-alpha'), elW = document.getElementById('fp-omega'),
      elD = document.getElementById('fp-dbdt'), elB = document.getElementById('fp-bval');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, R = 0, cx = 0, cy = 0, Q = 24;
  var B = reduce ? 1.2 : 0.6, target = B, dBdt = 0, omega = B / 2, angle = -0.4, lastT = 0, raf = null, pulse = 0, visible = false, running = false;

  function css(v) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim() || v; }

  function resize() {
    var w = cv.clientWidth || 360; W = w; R = w * 0.29; cx = w / 2; cy = w / 2;
    cv.width = Math.round(w * DPR); cv.height = Math.round(w * DPR);
    cv.style.height = w + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    draw();
  }

  function draw() {
    var ink = css('--ink'), green = '#1B3B36', gold = '#FFD700', soft = 'rgba(27,59,54,.06)';
    var dark = document.documentElement.classList.contains('dark');
    if (dark) { green = '#7FD8BE'; soft = 'rgba(127,216,190,.08)'; }
    ctx.clearRect(0, 0, W, W);
    // field region
    var Rf = R * 1.42;
    ctx.fillStyle = soft; ctx.beginPath(); ctx.arc(cx, cy, Rf, 0, 6.283); ctx.fill();
    ctx.strokeStyle = dark ? 'rgba(127,216,190,.25)' : 'rgba(27,59,54,.12)'; ctx.lineWidth = 1;
    ctx.setLineDash([4, 5]); ctx.beginPath(); ctx.arc(cx, cy, Rf, 0, 6.283); ctx.stroke(); ctx.setLineDash([]);
    // ⊙ field-out-of-screen symbols
    ctx.strokeStyle = dark ? 'rgba(162,183,176,.5)' : 'rgba(126,140,135,.55)';
    ctx.fillStyle = ctx.strokeStyle;
    for (var gx = -2; gx <= 2; gx++) for (var gy = -2; gy <= 2; gy++) {
      var px = cx + gx * R * 0.55, py = cy + gy * R * 0.55;
      if ((px - cx) * (px - cx) + (py - cy) * (py - cy) > Rf * Rf * 0.82) continue;
      ctx.beginPath(); ctx.arc(px, py, 4.5, 0, 6.283); ctx.stroke();
      ctx.beginPath(); ctx.arc(px, py, 1.1, 0, 6.283); ctx.fill();
    }
    // induced E arrows (tangential), magnitude ~ |dBdt|, direction flips with sign (Lenz)
    var mag = Math.min(Math.abs(dBdt) / 6, 1);
    if (mag > 0.02) {
      var sign = dBdt > 0 ? 1 : -1;
      ctx.strokeStyle = green; ctx.fillStyle = green; ctx.lineWidth = 1.6;
      for (var k = 0; k < 12; k++) {
        var a = angle + k / 12 * 6.283;
        var ox = cx + R * Math.cos(a), oy = cy + R * Math.sin(a);
        var tx = -Math.sin(a) * sign, ty = Math.cos(a) * sign; // tangent
        var len = 10 + mag * 20;
        ctx.globalAlpha = 0.35 + mag * 0.5;
        ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + tx * len, oy + ty * len); ctx.stroke();
        // arrowhead
        var hx = ox + tx * len, hy = oy + ty * len;
        ctx.beginPath(); ctx.moveTo(hx, hy);
        ctx.lineTo(hx - tx * 5 - ty * 3.5, hy - ty * 5 + tx * 3.5);
        ctx.lineTo(hx - tx * 5 + ty * 3.5, hy - ty * 5 - tx * 3.5);
        ctx.closePath(); ctx.fill();
      }
      ctx.globalAlpha = 1;
      // angular-acceleration arc at top, with an arrowhead showing the spin direction
      ctx.strokeStyle = ink; ctx.fillStyle = ink; ctx.lineWidth = 2;
      var aR = R + 26;
      ctx.beginPath(); ctx.arc(cx, cy, aR, -2.4, -0.9, false); ctx.stroke();
      var pos = dBdt >= 0 ? -0.9 : -2.4, dir = dBdt >= 0 ? 1 : -1;
      var ex = cx + aR * Math.cos(pos), ey = cy + aR * Math.sin(pos);
      var tx = -Math.sin(pos) * dir, ty = Math.cos(pos) * dir;
      ctx.beginPath();
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex - tx * 9 - ty * 5, ey - ty * 9 + tx * 5);
      ctx.lineTo(ex - tx * 9 + ty * 5, ey - ty * 9 - tx * 5);
      ctx.closePath(); ctx.fill();
      ctx.font = '600 14px "Plus Jakarta Sans", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('α', cx, cy - aR - 8);
    }
    // ring of charges
    ctx.strokeStyle = dark ? 'rgba(255,215,0,.35)' : 'rgba(180,150,0,.35)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.stroke();
    for (var i = 0; i < Q; i++) {
      var an = angle + i / Q * 6.283;
      var x = cx + R * Math.cos(an), y = cy + R * Math.sin(an);
      ctx.fillStyle = gold;
      ctx.globalAlpha = 0.9;
      ctx.beginPath(); ctx.arc(x, y, 4.2, 0, 6.283); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function readouts() {
    var a = 0.5 * dBdt, w = B / 2;
    if (elA) elA.textContent = a.toFixed(2);
    if (elW) elW.textContent = w.toFixed(2);
    if (elD) elD.textContent = dBdt.toFixed(2);
    if (elB) elB.textContent = B.toFixed(2);
    if (elW && pulse > 0) { elW.style.color = 'var(--gold-ink)'; }
    else if (elW) { elW.style.color = ''; }
  }

  function frame(t) {
    var dt = lastT ? Math.min((t - lastT) / 1000, 0.05) : 0.016; lastT = t;
    var nb = B + (target - B) * Math.min(1, dt * 8);
    var delta = nb - B; dBdt = dt > 0 ? delta / dt : 0; B = nb;
    omega = B / 2;
    angle += omega * 0.5 * dt + 0.02 * dt; // gentle spin ∝ ω
    if (Math.abs(dBdt) < 0.05 && Math.abs(target - B) < 0.002) pulse = Math.max(0, pulse - dt); else pulse = 0.6;
    draw(); readouts();
    if (visible && !reduce) raf = requestAnimationFrame(frame); else running = false;
  }
  function start() { if (running || reduce || !visible) return; running = true; lastT = 0; raf = requestAnimationFrame(frame); }
  function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = null; }

  if (slider) {
    slider.value = B;
    slider.addEventListener('input', function () {
      target = parseFloat(slider.value);
      if (reduce) { B = target; dBdt = 0; omega = B / 2; draw(); readouts(); }
    });
  }
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });
  if ('IntersectionObserver' in window) {
    var vo = new IntersectionObserver(function (es) { es.forEach(function (e) { visible = e.isIntersecting; if (visible) start(); else stop(); }); });
    vo.observe(cv);
  } else { visible = true; }
  resize(); readouts();
  if (!reduce) start();
})();
