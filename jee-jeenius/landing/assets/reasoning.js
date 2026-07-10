/* JEEnius — "How it works" reasoning theater.
   Pick an answer or just watch; steps reveal while a diagram/graph draws in sync.
   Auto-plays when the nav "How it works" link is clicked or the section scrolls in. */
(function () {
  'use strict';
  var root = document.getElementById('rt');
  if (!root) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s) { return root.querySelector(s); };
  var subjectEl = $('#rt-subject'), countEl = $('#rt-count'), qEl = $('#rt-q'), optsEl = $('#rt-opts'),
      solveBtn = $('#rt-solve'), diagramEl = $('#rt-diagram'), stepsEl = $('#rt-steps'),
      answerEl = $('#rt-answer'), nextBtn = $('#rt-next'), skipEl = $('#rt-skip');

  var L = ['A', 'B', 'C', 'D'];

  var PROJ = '<svg viewBox="0 0 320 210" class="rt-svg" aria-hidden="true">' +
    '<line class="rt-axis" x1="28" y1="176" x2="300" y2="176"/>' +
    '<path class="rt-draw" data-phase="1" pathLength="1" d="M40,176 Q160,-88 280,176"/>' +
    '<path class="rt-accent" data-phase="1" d="M40,176 a24,24 0 0 1 22,-8"/>' +
    '<text class="rt-t" data-phase="1" x="66" y="168">30°</text>' +
    '<line class="rt-vec" data-phase="1" x1="40" y1="176" x2="40" y2="128" marker-end="url(#rtar)"/>' +
    '<text class="rt-t" data-phase="1" x="46" y="138">uᵧ</text>' +
    '<line class="rt-dash" data-phase="3" x1="160" y1="46" x2="160" y2="176"/>' +
    '<circle class="rt-node" data-phase="3" cx="160" cy="46" r="4"/>' +
    '<text class="rt-t rt-gold" data-phase="3" x="167" y="116">H = 5 m</text>' +
    '<defs><marker id="rtar" markerWidth="9" markerHeight="9" refX="5" refY="4" orient="auto"><path class="rt-fill" d="M1,1 L6,4 L1,7 z"/></marker></defs></svg>';

  var INTEG = '<svg viewBox="0 0 320 210" class="rt-svg" aria-hidden="true">' +
    '<line class="rt-axis" x1="60" y1="30" x2="60" y2="182"/>' +
    '<line class="rt-axis" x1="52" y1="176" x2="296" y2="176"/>' +
    '<path class="rt-area" data-phase="2" d="M60,176 Q140,168 214,56 L214,176 Z"/>' +
    '<path class="rt-draw" data-phase="1" pathLength="1" d="M60,176 Q140,168 214,56"/>' +
    '<line class="rt-dash" data-phase="2" x1="214" y1="56" x2="214" y2="176"/>' +
    '<text class="rt-t" data-phase="1" x="200" y="48">y = x²</text>' +
    '<text class="rt-t" data-phase="2" x="214" y="192" text-anchor="middle">1</text>' +
    '<text class="rt-t rt-gold rt-big" data-phase="3" x="118" y="150">= ⅓</text></svg>';

  var SHM = '<svg viewBox="0 0 340 200" class="rt-svg" aria-hidden="true">' +
    '<line class="rt-wall" x1="20" y1="40" x2="20" y2="120"/>' +
    '<g class="rt-mass" data-phase="1">' +
    '<path class="rt-spring" d="M20,80 l10,-8 l10,16 l10,-16 l10,16 l10,-16 l10,16 l8,-8"/>' +
    '<rect class="rt-box" x="86" y="66" width="26" height="26" rx="5"/></g>' +
    '<line class="rt-axis" x1="150" y1="80" x2="322" y2="80"/>' +
    '<line class="rt-axis" x1="150" y1="34" x2="150" y2="126"/>' +
    '<path class="rt-draw" data-phase="2" pathLength="1" d="M150,44 C176,44 176,116 202,116 C228,116 228,44 254,44 C280,44 280,116 306,116"/>' +
    '<line class="rt-dash" data-phase="3" x1="202" y1="34" x2="202" y2="126"/>' +
    '<line class="rt-dash" data-phase="3" x1="306" y1="34" x2="306" y2="126"/>' +
    '<text class="rt-t rt-gold" data-phase="3" x="230" y="150">T = 0.31 s</text></svg>';

  var EMI = '<svg viewBox="0 0 300 210" class="rt-svg" aria-hidden="true">' +
    '<circle class="rt-field" data-phase="1" cx="150" cy="100" r="82"/>' +
    '<circle class="rt-ring" data-phase="1" cx="150" cy="100" r="58"/>' +
    '<g class="rt-charges" data-phase="1"></g>' +
    '<g class="rt-earr" data-phase="2"></g>' +
    '<path class="rt-spin" data-phase="3" d="M150,30 a70,70 0 0 1 60,35" marker-end="url(#rtar2)"/>' +
    '<text class="rt-t rt-gold rt-big" data-phase="3" x="150" y="106" text-anchor="middle">ω = qB⁄2m</text>' +
    '<defs><marker id="rtar2" markerWidth="9" markerHeight="9" refX="5" refY="4" orient="auto"><path class="rt-fill" d="M1,1 L6,4 L1,7 z"/></marker></defs></svg>';

  var QS = [
    { id: 'proj', subject: 'JEE Main · Physics',
      q: 'A ball is thrown at 20 m/s at 30° above the horizontal. What is its maximum height? <span style="white-space:nowrap">(g = 10 m/s²)</span>',
      opts: ['2.5 m', '5 m', '10 m', '20 m'], ci: 1, answer: '5 m', svg: PROJ,
      steps: [
        { t: 'Vertical component of velocity', b: 'u<sub>y</sub> = u·sinθ = 20 · sin30° = 20 · 0.5 = <b>10 m/s</b>.' },
        { t: 'At the top, vertical velocity = 0', b: 'Use v² = u<sub>y</sub>² − 2gH &nbsp;→&nbsp; 0 = 10² − 2·10·H.' },
        { t: 'Solve for the height', b: 'H = 100 ⁄ 20 = <b>5 m</b>.' }
      ] },
    { id: 'integ', subject: 'JEE Main · Maths',
      q: 'Evaluate the definite integral ∫₀¹ x² dx.',
      opts: ['½', '⅓', '1', '⅔'], ci: 1, answer: '⅓', svg: INTEG,
      steps: [
        { t: 'Use the power rule', b: '∫xⁿ dx = xⁿ⁺¹ ⁄ (n+1). With n = 2, the antiderivative is <b>x³⁄3</b>.' },
        { t: 'Apply the limits 0 → 1', b: '[x³⁄3]₀¹ — the area under y = x² from 0 to 1.' },
        { t: 'Evaluate', b: '1³⁄3 − 0 = <b>⅓</b>.' }
      ] },
    { id: 'shm', subject: 'JEE Main · Physics',
      q: 'A 0.5 kg mass on a spring (k = 200 N/m) undergoes SHM. Find its time period. <span style="white-space:nowrap">(T = 2π√(m/k))</span>',
      opts: ['0.31 s', '0.63 s', '0.10 s', '3.14 s'], ci: 0, answer: '0.31 s', svg: SHM,
      steps: [
        { t: 'Write the time-period formula', b: 'T = 2π√(m⁄k) — the mass oscillates; the graph is x = A·cos(ωt).' },
        { t: 'Substitute the values', b: '√(m⁄k) = √(0.5⁄200) = √0.0025 = <b>0.05</b>.' },
        { t: 'Compute the period', b: 'T = 2π · 0.05 = <b>0.31 s</b> (one full oscillation).' }
      ] },
    { id: 'emi', subject: 'JEE Advanced · Physics',
      q: 'A non-conducting ring (charge q, mass m, radius R) sits in an axial field switched from 0 to B. Find its final angular velocity ω.',
      opts: ['qB⁄m', 'qB⁄2m', '2qB⁄m', 'qBR⁄2m'], ci: 1, answer: 'ω = qB⁄2m', svg: EMI,
      steps: [
        { t: 'A changing B induces an electric field', b: 'Around the ring, E = (R⁄2)·(dB/dt) — tangential, so it pushes the charge.' },
        { t: 'That field exerts a torque', b: 'τ = qER = (qR²⁄2)·(dB/dt); angular impulse ∫τ dt = (qR²⁄2)·B.' },
        { t: 'Angular impulse = Iω', b: 'With I = mR²: (qR²⁄2)B = mR²·ω → <b>ω = qB⁄2m</b>.' }
      ] }
  ];

  var cur = 0, solved = false, picked = null, userInteracted = false, timers = [];
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  function after(ms, fn) { var t = setTimeout(fn, ms); timers.push(t); return t; }
  function skipOn() { return !!(skipEl && skipEl.checked); }

  function buildDynamic() {
    // EMI charges + arrows generated to match the ring
    var ch = diagramEl.querySelector('.rt-charges'), ea = diagramEl.querySelector('.rt-earr');
    if (ch) { var s = ''; for (var i = 0; i < 16; i++) { var a = i / 16 * 6.283; s += '<circle cx="' + (150 + 58 * Math.cos(a)).toFixed(1) + '" cy="' + (100 + 58 * Math.sin(a)).toFixed(1) + '" r="3.4"/>'; } ch.innerHTML = s; }
    if (ea) { var e = ''; for (var j = 0; j < 8; j++) { var b = j / 8 * 6.283; var ox = 150 + 58 * Math.cos(b), oy = 100 + 58 * Math.sin(b); var tx = -Math.sin(b), ty = Math.cos(b); e += '<line x1="' + ox.toFixed(1) + '" y1="' + oy.toFixed(1) + '" x2="' + (ox + tx * 15).toFixed(1) + '" y2="' + (oy + ty * 15).toFixed(1) + '" marker-end="url(#rtar2)"/>'; } ea.innerHTML = e; }
  }

  function setPhase(n) {
    var els = diagramEl.querySelectorAll('[data-phase]');
    Array.prototype.forEach.call(els, function (el) { if (+el.getAttribute('data-phase') <= n) el.classList.add('on'); });
  }

  function stepHtml(s, idx) {
    return '<div class="rt-step"><div class="rt-sh"><span class="num">' + (idx + 1) + '</span>' + s.t + '</div><div class="rt-sb">' + s.b + '</div></div>';
  }

  function render(i) {
    clearTimers(); solved = false; picked = null;
    var q = QS[i];
    subjectEl.textContent = q.subject;
    countEl.textContent = (i + 1) + ' / ' + QS.length;
    qEl.innerHTML = q.q;
    optsEl.innerHTML = q.opts.map(function (o, idx) {
      return '<button class="rt-opt" data-i="' + idx + '"><span class="rt-ol">' + L[idx] + '</span><span class="rt-oh">' + o + '</span></button>';
    }).join('');
    Array.prototype.forEach.call(optsEl.querySelectorAll('.rt-opt'), function (b) {
      b.addEventListener('click', function () {
        if (solved) return; userInteracted = true; picked = +b.getAttribute('data-i');
        Array.prototype.forEach.call(optsEl.querySelectorAll('.rt-opt'), function (x) { x.classList.remove('sel'); });
        b.classList.add('sel');
        if (idxCorrect(q, picked)) b.classList.add('is-correct');
        solve('picked');
      });
    });
    diagramEl.className = 'rt-diagram'; diagramEl.setAttribute('data-q', q.id); diagramEl.innerHTML = q.svg;
    if (q.id === 'emi') buildDynamic();
    stepsEl.innerHTML = ''; answerEl.innerHTML = ''; answerEl.className = 'rt-answer';
    root.classList.remove('solving', 'done');
    solveBtn.style.display = ''; solveBtn.disabled = false;
  }
  function idxCorrect(q, i) { return i === q.ci; }

  function solve(mode) {
    if (solved) return; solved = true;
    var q = QS[cur];
    root.classList.add('solving'); solveBtn.style.display = 'none';
    if (reduce || skipOn()) {
      q.steps.forEach(function (s, idx) { stepsEl.insertAdjacentHTML('beforeend', stepHtml(s, idx)); var c = stepsEl.lastElementChild; c.classList.add('in'); });
      setPhase(q.steps.length + 1); showAnswer(q, mode); return;
    }
    stepsEl.innerHTML = '<div class="rt-think"><span></span><span></span><span></span> Thinking…</div>';
    after(760, function () {
      stepsEl.innerHTML = '';
      (function next(idx) {
        if (idx >= q.steps.length) { setPhase(q.steps.length + 1); after(560, function () { showAnswer(q, mode); }); return; }
        stepsEl.insertAdjacentHTML('beforeend', stepHtml(q.steps[idx], idx));
        var card = stepsEl.lastElementChild;
        requestAnimationFrame(function () { card.classList.add('in'); });
        setPhase(idx + 1);
        after(1000, function () { next(idx + 1); });
      })(0);
    });
  }

  function showAnswer(q, mode) {
    root.classList.add('done');
    var verdict = '';
    if (mode === 'picked') {
      if (picked === q.ci) { answerEl.classList.add('right'); verdict = '<div class="rt-verdict">Nice — that’s right.</div>'; }
      else { answerEl.classList.add('wrong'); verdict = '<div class="rt-verdict">Not quite — here’s why it’s ' + L[q.ci] + '.</div>'; }
    }
    answerEl.innerHTML = '<div class="rt-ans"><span class="rt-tick"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.4" d="M5 13l4 4L19 7"/></svg></span><div><div class="rt-al">Answer</div><div class="rt-av">' + q.answer + '</div></div></div>' + verdict;
    requestAnimationFrame(function () { answerEl.classList.add('in'); });
  }

  solveBtn.addEventListener('click', function () { userInteracted = true; solve('auto'); });
  nextBtn.addEventListener('click', function () { userInteracted = true; cur = (cur + 1) % QS.length; render(cur); });

  // auto-play triggers
  function maybeAuto() { if (!solved) solve('auto'); }
  Array.prototype.forEach.call(document.querySelectorAll('a[href="#how"]'), function (a) {
    a.addEventListener('click', function () { userInteracted = true; render(cur); after(680, maybeAuto); });
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { io.disconnect(); if (!userInteracted) after(450, maybeAuto); } });
    }, { threshold: 0.42 });
    io.observe(root);
  }

  render(0);
})();
