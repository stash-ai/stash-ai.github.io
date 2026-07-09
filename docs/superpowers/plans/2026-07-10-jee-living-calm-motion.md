# JEE "Living calm" Motion Layer — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a calm-but-jaw-dropping motion/micro-interaction layer to the JEE landing page (ambient hero aurora, 3D card tilt/depth, buttery scroll choreography, magnetic CTAs + cursor spotlight) with zero new content and zero regressions.

**Architecture:** Dependency-free progressive enhancement. One new `assets/motion.js` (self-initializing IIFE, no globals) reads `data-*` opt-ins from the HTML; new CSS lives in the shared `assets/app.css`. Capability flags (`prefers-reduced-motion`, `(hover:hover) and (pointer:fine)`) gate every effect: reduced-motion → calm static; touch → ambient-only. All animation is transform/opacity (compositor), pointer handlers are rAF-throttled.

**Tech Stack:** Static HTML + Tailwind CDN (existing), vanilla ES5-compatible JS (matches existing inline style), CSS custom properties + keyframes. No build step. Served locally via `python3 -m http.server` for verification through the preview MCP tools.

## Global Constraints

- **Calm discipline:** gold ≈ one accent per viewport; small amplitudes, slow eased timings. Motion must never gate content or interaction.
- **Keep green + gold** palette and the existing "Calm focus" tokens in `assets/app.css` (`--green`, `--gold`, `--sage`, `--gold-soft`, `--mint`, `--ease`, `--radius-lg`). Do not introduce new brand colors.
- **Zero regressions:** existing inline JS (dark toggle, mobile menu, nav scroll, PYQ search, pricing toggle, FAQ accordion, scroll reveal, count-up, 2027 prediction reveal) and all `<head>` SEO/JSON-LD stay functional and unedited except the one count-up easing line called out in Task 4.
- **Scope:** `jee-jeenius/landing/index.html` only. Build reusable (no page-specific hardcoding) so About/Prediction pages can adopt later — but do NOT wire those pages in this plan.
- **Accessibility/perf:** honor `prefers-reduced-motion`; pointer effects only on fine pointers; passive listeners; no CLS; 60fps target on mid-range Android.
- **Verification is browser-based** (preview MCP): "Expected" lines describe observed DOM/CSS/console state, not unit-test output. Ignore pre-existing 404s for `firebase-config.js` / `posthog-config.js` (only `.example` files exist in the repo) — they are unrelated to this work.
- **Commit style:** end every commit message with `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`. Work is on branch `feat/jee-living-calm-motion`.

## File Structure

- `jee-jeenius/landing/assets/motion.js` — **NEW.** The whole motion engine. IIFE, no globals. Units: capability flags + helpers (Task 1), `initAurora` (Task 2), `initTilt` (Task 3), `initScrollChoreography` (Task 4), `initMagnetic` + `initSpotlight` (Task 5). Each unit is a no-op when its targets/capabilities are absent.
- `jee-jeenius/landing/assets/app.css` — **MODIFY.** Append one "Living calm motion layer" section; extend the existing `@media (prefers-reduced-motion: reduce)` block (currently ends at line 308).
- `jee-jeenius/landing/index.html` — **MODIFY.** Link `motion.js`; swap hero glow markup for aurora; add `data-*` opt-ins and a few classes; one easing tweak in the existing inline `countUp`. No sections/content added or removed.
- `.claude/launch.json` — **NEW (if absent).** Static server config for local preview.

---

## Task 1: Foundation — motion.js scaffold, wiring, preview server

**Files:**
- Create: `jee-jeenius/landing/assets/motion.js`
- Create: `.claude/launch.json` (if it does not already exist)
- Modify: `jee-jeenius/landing/index.html` (add `<script defer src="assets/motion.js">` before `</body>`)
- Modify: `jee-jeenius/landing/assets/app.css` (append motion-layer section header + extend reduced-motion block)

**Interfaces:**
- Produces (consumed by all later tasks, inside the IIFE closure):
  - `state` = `{ reduce: boolean, fine: boolean }` — `fine` is already `AND !reduce`.
  - `rafThrottle(fn) -> throttledFn` — coalesces calls to one per animation frame, preserves latest args.
  - `lerp(a, b, t) -> number`, `clamp(v, min, max) -> number`.
  - Root classes on `<html>`: `motion-ready`, plus `motion-fine` (fine pointer & not reduced) or `motion-reduce`.
  - Stub functions `initAurora(state)`, `initTilt()`, `initMagnetic()`, `initSpotlight()`, `initScrollChoreography()` — replaced in later tasks. Called from a `ready()` gate: `initAurora(state)` and `initScrollChoreography()` always; `initTilt/initMagnetic/initSpotlight` only when `state.fine`.

- [ ] **Step 1: Create the motion.js scaffold**

Create `jee-jeenius/landing/assets/motion.js`:

```js
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
```

- [ ] **Step 2: Link motion.js from index.html**

In `jee-jeenius/landing/index.html`, find the closing of the main inline script and the `</body>`. The file ends (around line 1038-1039) with:

```html
    })();
  </script>
</body>
```

Replace with:

```html
    })();
  </script>
  <script defer src="assets/motion.js"></script>
</body>
```

- [ ] **Step 3: Append the motion-layer CSS section header and extend reduced-motion**

In `jee-jeenius/landing/assets/app.css`, the file currently ends with this reduced-motion block (lines ~303-308):

```css
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; }
  html { scroll-behavior: auto; }
  .reveal { opacity: 1 !important; transform: none !important; transition: none; }
  .btn:hover, .bento .tile:hover, .price-card { transform: none !important; }
}
```

Append AFTER it (leave the existing block intact; a second reduced-motion block for new selectors is added in later tasks — for now just add the section anchor comment so later tasks have a stable insertion point):

```css

/* ==========================================================================
   Living calm — motion layer (aurora / tilt / choreography / magnetic / spotlight)
   Added progressively; see docs/superpowers/plans/2026-07-10-jee-living-calm-motion.md
   ========================================================================== */
```

- [ ] **Step 4: Create the preview server config**

If `.claude/launch.json` does not exist, create it:

```json
{
  "version": "0.0.1",
  "configurations": [
    {
      "name": "jee-landing",
      "runtimeExecutable": "python3",
      "runtimeArgs": ["-m", "http.server", "4178", "--directory", "jee-jeenius/landing"],
      "port": 4178
    }
  ]
}
```

If it already exists, add the `jee-landing` configuration to its `configurations` array (do not remove existing entries).

- [ ] **Step 5: Start the preview and verify the scaffold loads cleanly**

Run: `preview_start` with name `jee-landing`, then load `http://localhost:4178/`.

Verify with `preview_eval`:
```js
({
  ready: document.documentElement.classList.contains('motion-ready'),
  pointerFlag: document.documentElement.classList.contains('motion-fine')
            || document.documentElement.classList.contains('motion-reduce'),
  auroraStub: typeof window.initAurora // should be 'undefined' — no globals leaked
})
```
Expected: `ready: true`, `pointerFlag: true`, `auroraStub: "undefined"`.

Run `preview_console_logs` (level error). Expected: no errors referencing `motion.js` (pre-existing config-file 404s are fine).

- [ ] **Step 6: Commit**

```bash
git add jee-jeenius/landing/assets/motion.js jee-jeenius/landing/index.html jee-jeenius/landing/assets/app.css .claude/launch.json
git commit -m "$(printf 'JEE motion: foundation (capability flags, helpers, wiring)\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>')"
```

---

## Task 2: Ambient hero aurora

**Files:**
- Modify: `jee-jeenius/landing/assets/app.css` (aurora CSS in the motion-layer section)
- Modify: `jee-jeenius/landing/index.html` (replace the two static `.glow` blobs in the hero header, ~lines 426-427)
- Modify: `jee-jeenius/landing/assets/motion.js` (replace `initAurora` stub)

**Interfaces:**
- Consumes: `state.fine`, `lerp` (Task 1).
- Produces: aurora DOM (`.aurora > .aurora__group[data-aurora-group] > .aurora__blob*3`); `initAurora(state)` adds pointer-lean transform to `[data-aurora-group]` on fine pointers.

- [ ] **Step 1: Add aurora CSS**

In `jee-jeenius/landing/assets/app.css`, under the motion-layer section header added in Task 1, add:

```css
.aurora { position: absolute; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; }
.aurora__group { position: absolute; inset: -12%; will-change: transform; }
.aurora__blob { position: absolute; border-radius: 50%; filter: blur(82px); will-change: transform; }
.aurora__blob--1 { width: 520px; height: 520px; top: -120px; right: -60px; background: var(--sage); opacity: .5; animation: auroraDrift1 26s var(--ease) infinite alternate; }
.aurora__blob--2 { width: 360px; height: 360px; bottom: -120px; left: -70px; background: var(--gold-soft); opacity: .38; animation: auroraDrift2 31s var(--ease) infinite alternate; }
.aurora__blob--3 { width: 320px; height: 320px; top: 34%; left: 44%; background: var(--mint); opacity: .42; animation: auroraDrift3 22s var(--ease) infinite alternate; }
@keyframes auroraDrift1 { from { transform: translate3d(0,0,0) scale(1); } to { transform: translate3d(-34px,26px,0) scale(1.08); } }
@keyframes auroraDrift2 { from { transform: translate3d(0,0,0) scale(1.05); } to { transform: translate3d(30px,-22px,0) scale(1); } }
@keyframes auroraDrift3 { from { transform: translate3d(0,0,0) scale(1); } to { transform: translate3d(22px,20px,0) scale(1.12); } }
.dark .aurora__blob--1 { opacity: .30; }
.dark .aurora__blob--2 { opacity: .20; }
.dark .aurora__blob--3 { opacity: .24; }
```

- [ ] **Step 2: Swap the hero glow markup for the aurora**

In `jee-jeenius/landing/index.html`, the hero header currently begins (lines 425-427):

```html
  <header id="top" class="section" style="position:relative; padding-top:clamp(94px, 11vw, 140px); overflow:hidden;">
    <div class="glow" style="width:520px; height:520px; background:var(--sage); top:-140px; right:-120px;"></div>
    <div class="glow" style="width:360px; height:360px; background:var(--gold-soft); bottom:-120px; left:-100px; opacity:.35;"></div>
```

Replace the two `.glow` lines with:

```html
  <header id="top" class="section" style="position:relative; padding-top:clamp(94px, 11vw, 140px); overflow:hidden;">
    <div class="aurora" data-aurora aria-hidden="true">
      <div class="aurora__group" data-aurora-group>
        <span class="aurora__blob aurora__blob--1"></span>
        <span class="aurora__blob aurora__blob--2"></span>
        <span class="aurora__blob aurora__blob--3"></span>
      </div>
    </div>
```

- [ ] **Step 3: Replace the initAurora stub**

In `jee-jeenius/landing/assets/motion.js`, replace `function initAurora(s) {}` with:

```js
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
```

- [ ] **Step 4: Verify aurora renders, drifts, and preserves contrast**

Reload `http://localhost:4178/`.

`preview_eval` — confirm structure and that blobs are animating:
```js
(function(){
  var b = document.querySelector('.aurora__blob--1');
  var s = getComputedStyle(b);
  return { blobs: document.querySelectorAll('.aurora__blob').length,
           animated: s.animationName, blur: s.filter,
           heroChildZero: document.querySelector('.aurora').style.zIndex || getComputedStyle(document.querySelector('.aurora')).zIndex };
})()
```
Expected: `blobs: 3`, `animated: "auroraDrift1"`, `blur` contains `blur(82px)`, aurora zIndex `0`.

`preview_screenshot` — Expected: soft green/gold/mint glow behind the hero; headline and body text remain fully legible (no wash-out).

`preview_resize` colorScheme `dark`, reload, `preview_screenshot` — Expected: dimmer "night-study" aurora, text legible. Reset colorScheme to `light` after.

- [ ] **Step 5: Commit**

```bash
git add jee-jeenius/landing/assets/app.css jee-jeenius/landing/index.html jee-jeenius/landing/assets/motion.js
git commit -m "$(printf 'JEE motion: living hero aurora (CSS drift + pointer lean)\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>')"
```

---

## Task 3: 3D card tilt & depth

**Files:**
- Modify: `jee-jeenius/landing/assets/app.css` (tilt CSS)
- Modify: `jee-jeenius/landing/index.html` (hero visual restructure + `data-tilt` on prediction card and bento tiles)
- Modify: `jee-jeenius/landing/assets/motion.js` (replace `initTilt` stub)

**Interfaces:**
- Consumes: `state.fine`, `rafThrottle` (Task 1).
- Produces: `initTilt()` binds pointer tilt to every `[data-tilt]`; reads max angle from the attribute value (default 6); appends a `.tilt-glare` span; applies `translateZ(var(--tz))` depth to `[data-tilt-layer]` children.

- [ ] **Step 1: Add tilt CSS**

In `jee-jeenius/landing/assets/app.css` motion-layer section, add:

```css
[data-tilt] { position: relative; transform-style: preserve-3d; transition: transform .5s var(--ease); will-change: transform; }
[data-tilt].tilting { transition: transform .1s linear; }
[data-tilt-layer] { transform: translateZ(var(--tz, 30px)); }
.tilt-glare {
  position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 3;
  opacity: 0; transition: opacity .3s var(--ease); mix-blend-mode: soft-light;
  background: radial-gradient(240px circle at var(--gx,50%) var(--gy,50%), rgba(255,255,255,.16), rgba(255,215,0,.06) 42%, transparent 62%);
}
[data-tilt].tilting .tilt-glare { opacity: 1; }
```

- [ ] **Step 2: Restructure the hero product visual for tilt + depth**

In `jee-jeenius/landing/index.html`, the hero right column is currently (lines 459-491):

```html
        <!-- Calm product visual: a single AI-solution preview -->
        <div class="reveal" style="position:relative;">
          <div class="card" style="padding:24px;">
```
…the card content…, then the floating badge:
```html
          <div class="card" style="position:absolute; bottom:-22px; left:-18px; padding:14px 18px; display:flex; align-items:center; gap:12px; box-shadow:var(--shadow);">
            <span style="font-family:'Fraunces',serif; font-size:30px; font-weight:600; color:var(--green);">92<span style="font-size:18px;">%</span></span>
            <span style="font-size:12px; font-weight:600; color:var(--ink-soft); line-height:1.3;">of JEE 2026<br>topics predicted</span>
          </div>
        </div>
```

Make two edits:

(a) Open a `data-tilt` wrapper and mark the solution card as a depth layer. Replace:
```html
        <div class="reveal" style="position:relative;">
          <div class="card" style="padding:24px;">
```
with:
```html
        <div class="reveal" style="position:relative;">
          <div data-tilt style="position:relative; border-radius:var(--radius-lg);">
          <div class="card" data-tilt-layer style="--tz:22px; padding:24px;">
```

(b) Make the badge a deeper layer and close the wrapper. Replace the badge block above with:
```html
          <div class="card" data-tilt-layer style="--tz:52px; position:absolute; bottom:-22px; left:-18px; padding:14px 18px; display:flex; align-items:center; gap:12px; box-shadow:var(--shadow);">
            <span style="font-family:'Fraunces',serif; font-size:30px; font-weight:600; color:var(--green);">92<span style="font-size:18px;">%</span></span>
            <span style="font-size:12px; font-weight:600; color:var(--ink-soft); line-height:1.3;">of JEE 2026<br>topics predicted</span>
          </div>
          </div>
        </div>
```
(The extra closing `</div>` closes the new `data-tilt` wrapper. Net div balance is unchanged: one opened, one closed.)

- [ ] **Step 3: Add `data-tilt` to the 2027 prediction card**

In `jee-jeenius/landing/index.html`, the prediction card (lines 516-517) is:
```html
        <div class="reveal">
          <div class="card" style="padding:24px;">
```
Replace with:
```html
        <div class="reveal">
          <div data-tilt style="border-radius:var(--radius-lg);">
          <div class="card" data-tilt-layer style="--tz:20px; padding:24px;">
```
Then find that card's matching close. It currently ends (line 538-539):
```html
          </div>
        </div>
```
Replace with:
```html
          </div>
          </div>
        </div>
```
(One extra `</div>` closes the new wrapper.)

- [ ] **Step 4: Add gentle tilt to the bento tiles**

In `jee-jeenius/landing/index.html`, each feature tile opens as `<div class="tile col-6">` (lines 682, 687, 692, 697). Add `data-tilt="4"` to each (smaller angle = calmer): change every `<div class="tile col-6">` in the `#features` bento to:
```html
        <div class="tile col-6" data-tilt="4">
```
(Four occurrences.)

- [ ] **Step 5: Replace the initTilt stub**

In `jee-jeenius/landing/assets/motion.js`, replace `function initTilt() {}` with:

```js
  function initTilt() {
    var els = document.querySelectorAll('[data-tilt]');
    if (!els.length) return;
    els.forEach(function (el) {
      var max = parseFloat(el.getAttribute('data-tilt')) || 6;
      var rect = null;
      var glare = el.querySelector('.tilt-glare');
      if (!glare) { glare = document.createElement('span'); glare.className = 'tilt-glare'; el.appendChild(glare); }
      var move = rafThrottle(function (e) {
        if (!rect) rect = el.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width;
        var py = (e.clientY - rect.top) / rect.height;
        var ry = (px - 0.5) * 2 * max;
        var rx = -(py - 0.5) * 2 * max;
        el.style.transform = 'perspective(900px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
        glare.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
        glare.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
      });
      el.addEventListener('pointerenter', function () { rect = el.getBoundingClientRect(); el.classList.add('tilting'); });
      el.addEventListener('pointermove', move, { passive: true });
      el.addEventListener('pointerleave', function () { el.classList.remove('tilting'); el.style.transform = ''; rect = null; });
    });
  }
```

- [ ] **Step 6: Verify tilt, depth, glare, and spring-back**

Reload. `preview_eval` — confirm binding and simulate a tilt:
```js
(function(){
  var el = document.querySelector('[data-tilt]');
  var r = el.getBoundingClientRect();
  el.dispatchEvent(new PointerEvent('pointerenter', {bubbles:true}));
  el.dispatchEvent(new PointerEvent('pointermove', {bubbles:true, clientX:r.left+r.width*0.85, clientY:r.top+r.height*0.2}));
  return new Promise(function(res){ requestAnimationFrame(function(){ requestAnimationFrame(function(){
    res({ count: document.querySelectorAll('[data-tilt]').length,
          hasGlare: !!el.querySelector('.tilt-glare'),
          transform: el.style.transform }); }); }); });
})()
```
Expected: `count: 6` (2 hero/pred cards + 4 tiles), `hasGlare: true`, `transform` contains `perspective(900px) rotateX(` with a negative X and positive Y (top-right pointer).

`preview_eval` leave check:
```js
(function(){ var el=document.querySelector('[data-tilt]'); el.dispatchEvent(new PointerEvent('pointerleave',{bubbles:true})); return el.style.transform; })()
```
Expected: `""` (springs back; class removed).

`preview_screenshot` while a card is tilted (optional) — Expected: subtle depth, badge visibly floats above the card, no clipping.

- [ ] **Step 7: Commit**

```bash
git add jee-jeenius/landing/assets/app.css jee-jeenius/landing/index.html jee-jeenius/landing/assets/motion.js
git commit -m "$(printf 'JEE motion: 3D card tilt + parallax depth\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>')"
```

---

## Task 4: Buttery scroll choreography

**Files:**
- Modify: `jee-jeenius/landing/assets/app.css` (stagger, underline sweep, write-on CSS)
- Modify: `jee-jeenius/landing/index.html` (add `data-stagger`, `.hl-sweep`, `.write-on`; one count-up easing edit)
- Modify: `jee-jeenius/landing/assets/motion.js` (replace `initScrollChoreography` stub)

**Interfaces:**
- Consumes: `state.reduce` (Task 1).
- Produces: `initScrollChoreography()` sets `--i` index on children of `[data-stagger]` and toggles `.stagger-in` via its own IntersectionObserver (independent of the existing inline `.reveal` observer, so no conflict). `.hl-sweep` and `.write-on` are triggered purely by CSS off the existing `.reveal.is-visible` ancestor.

- [ ] **Step 1: Add choreography CSS**

In `jee-jeenius/landing/assets/app.css` motion-layer section, add:

```css
/* staggered group reveal */
[data-stagger] > * { opacity: 0; transform: translateY(16px) scale(.995); filter: blur(6px);
  transition: opacity .6s var(--ease), transform .6s var(--ease), filter .6s var(--ease);
  transition-delay: calc(var(--i, 0) * 70ms); }
[data-stagger].stagger-in > * { opacity: 1; transform: none; filter: none; }

/* gold highlighter sweep (hero + can be reused) */
.hl-sweep { color: var(--green);
  background-image: linear-gradient(transparent 72%, rgba(255,215,0,.5) 72%);
  background-repeat: no-repeat; background-size: 0% 100%;
  -webkit-box-decoration-break: clone; box-decoration-break: clone; padding: 0 1px;
  transition: background-size .9s var(--ease) .3s; }
.reveal.is-visible .hl-sweep, .hl-sweep.is-visible { background-size: 100% 100%; }

/* formula "write-on" */
.write-on { clip-path: inset(0 100% 0 0); transition: clip-path .8s var(--ease) .5s; }
.reveal.is-visible .write-on, .write-on.is-visible { clip-path: inset(0 0 0 0); }
```

- [ ] **Step 2: Extend the reduced-motion block for the new effects**

In `jee-jeenius/landing/assets/app.css`, append a second reduced-motion block at the end of the file (keeps Task 1's block untouched):

```css
@media (prefers-reduced-motion: reduce) {
  .aurora__blob { animation: none !important; }
  [data-stagger] > * { opacity: 1 !important; transform: none !important; filter: none !important; transition: none !important; }
  .hl-sweep { background-size: 100% 100% !important; transition: none !important; }
  .write-on { clip-path: none !important; transition: none !important; }
  [data-tilt], [data-tilt-layer], [data-magnetic] { transform: none !important; }
  .tilt-glare, [data-spotlight]::before { display: none !important; }
}
```

- [ ] **Step 3: Add stagger + sweep + write-on hooks in the HTML**

In `jee-jeenius/landing/index.html`, make these edits:

(a) Hero highlight (line 435). Replace:
```html
            <span style="color:var(--green); background:linear-gradient(transparent 72%, rgba(255,215,0,.5) 72%); -webkit-box-decoration-break:clone; box-decoration-break:clone; padding:0 1px;">what's on the paper</span>.
```
with:
```html
            <span class="hl-sweep">what's on the paper</span>.
```

(b) Hero chip row (line 449). Replace:
```html
          <div class="flex flex-wrap items-center" style="gap:12px; margin-top:28px;">
```
with:
```html
          <div class="flex flex-wrap items-center" data-stagger style="gap:12px; margin-top:28px;">
```

(c) Hero answer formula (line 474). Replace:
```html
                <div style="font-weight:700; font-size:15px;">α = qB / 2m</div>
```
with:
```html
                <div class="write-on" style="font-weight:700; font-size:15px;">α = qB / 2m</div>
```

(d) How-it-works checklist `<ul>` (line 606). Replace:
```html
          <ul style="list-style:none; padding:0; margin:26px 0 0; display:flex; flex-direction:column; gap:14px;">
```
with:
```html
          <ul data-stagger style="list-style:none; padding:0; margin:26px 0 0; display:flex; flex-direction:column; gap:14px;">
```

(e) Bento grid (line 681). Replace:
```html
      <div class="bento reveal">
```
with:
```html
      <div class="bento" data-stagger>
```
(Drops `reveal` from the container so the stagger owns the entrance — children cascade instead of the block fading as one.)

(f) 2027 stat row (line 504). Replace:
```html
          <div class="grid grid-cols-3" style="gap:12px; margin:26px 0 22px;">
```
with:
```html
          <div class="grid grid-cols-3" data-stagger style="gap:12px; margin:26px 0 22px;">
```

(g) Prediction-lab subject stat row (line 661). Replace:
```html
          <div class="grid grid-cols-3" style="gap:12px; margin:26px 0 18px;">
```
with:
```html
          <div class="grid grid-cols-3" data-stagger style="gap:12px; margin:26px 0 18px;">
```

- [ ] **Step 4: Replace the initScrollChoreography stub**

In `jee-jeenius/landing/assets/motion.js`, replace `function initScrollChoreography() {}` with:

```js
  function initScrollChoreography() {
    var groups = document.querySelectorAll('[data-stagger]');
    if (!groups.length) return;
    groups.forEach(function (g) {
      for (var k = 0; k < g.children.length; k++) g.children[k].style.setProperty('--i', k);
    });
    if (state.reduce || !('IntersectionObserver' in window)) {
      groups.forEach(function (g) { g.classList.add('stagger-in'); });
      return;
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('stagger-in'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    groups.forEach(function (g) { io.observe(g); });
  }
```

- [ ] **Step 5: Refine the existing count-up to ease-out**

In `jee-jeenius/landing/index.html`, the existing inline `countUp` (lines 986-988) is:
```js
      function countUp(el) {
        var target = +el.dataset.count, suf = el.dataset.suffix || '', dur = 1100, t0 = null;
        function step(ts) { t0 = t0 || ts; var p = Math.min((ts - t0) / dur, 1); el.textContent = Math.round(p * target) + suf; if (p < 1) requestAnimationFrame(step); }
        requestAnimationFrame(step);
      }
```
Replace the `step` line's easing so the number decelerates. Change that inner function to:
```js
        function step(ts) { t0 = t0 || ts; var p = Math.min((ts - t0) / dur, 1); var e = 1 - Math.pow(1 - p, 3); el.textContent = Math.round(e * target) + suf; if (p < 1) requestAnimationFrame(step); }
```

- [ ] **Step 6: Verify cascade, sweep, write-on, and count-up**

Reload. `preview_eval` — confirm indices assigned and observer wiring:
```js
(function(){
  var b = document.querySelector('.bento[data-stagger]');
  return { staggerGroups: document.querySelectorAll('[data-stagger]').length,
           firstChildI: b.children[0].style.getPropertyValue('--i'),
           lastChildI: b.children[b.children.length-1].style.getPropertyValue('--i'),
           hlExists: !!document.querySelector('.hl-sweep'),
           writeOnExists: !!document.querySelector('.write-on') };
})()
```
Expected: `staggerGroups: 5`, `firstChildI: "0"`, `lastChildI: "3"`, `hlExists: true`, `writeOnExists: true`.

Scroll the bento into view (`preview_eval`: `document.querySelector('#features').scrollIntoView()`), then screenshot — Expected: tiles cascade in (not all at once); the hero gold highlight sweeps left→right on first load; the hero `α = qB / 2m` reveals; the 92%/218 and subject stats count up with a decelerating finish.

- [ ] **Step 7: Commit**

```bash
git add jee-jeenius/landing/assets/app.css jee-jeenius/landing/index.html jee-jeenius/landing/assets/motion.js
git commit -m "$(printf 'JEE motion: scroll choreography (stagger, underline sweep, write-on, eased count-up)\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>')"
```

---

## Task 5: Magnetic CTAs + cursor spotlight

**Files:**
- Modify: `jee-jeenius/landing/assets/app.css` (magnetic + spotlight CSS)
- Modify: `jee-jeenius/landing/index.html` (`data-magnetic` on two primary CTAs; `data-spotlight` on footer + mock)
- Modify: `jee-jeenius/landing/assets/motion.js` (replace `initMagnetic` and `initSpotlight` stubs)

**Interfaces:**
- Consumes: `state.fine`, `rafThrottle`, `clamp` (Task 1). Both inits are only called when `state.fine` (from Task 1's `ready` gate).
- Produces: `initMagnetic()` pulls each `[data-magnetic]` toward the pointer (max 7px, keeps a −2px lift); `initSpotlight()` moves a CSS `--mx/--my` spotlight inside each `[data-spotlight]`.

- [ ] **Step 1: Add magnetic + spotlight CSS**

In `jee-jeenius/landing/assets/app.css` motion-layer section, add:

```css
/* magnetic CTA — relies on .btn's existing transform transition for smoothing */
[data-magnetic] { will-change: transform; }

/* cursor spotlight on dark surfaces */
[data-spotlight] { position: relative; }
[data-spotlight]::before {
  content: ""; position: absolute; inset: 0; z-index: 0; pointer-events: none; border-radius: inherit;
  background: radial-gradient(380px circle at var(--mx, -200px) var(--my, -200px), rgba(255,215,0,.09), transparent 60%);
  opacity: 0; transition: opacity .4s var(--ease);
}
[data-spotlight].spot-on::before { opacity: 1; }
.footer .wrap { position: relative; z-index: 1; }
.mock > * { position: relative; z-index: 1; }
```

- [ ] **Step 2: Tag the two primary CTAs as magnetic**

In `jee-jeenius/landing/index.html`:

(a) Hero primary CTA (line 442). Replace:
```html
            <a href="https://play.google.com/store/apps/details?id=com.stash.jeenius&hl=en_IN" class="btn btn-primary" data-cta="true" data-track-label="hero_start_free">
```
with:
```html
            <a href="https://play.google.com/store/apps/details?id=com.stash.jeenius&hl=en_IN" class="btn btn-primary" data-magnetic data-cta="true" data-track-label="hero_start_free">
```

(b) 2027 primary CTA (line 511). Replace:
```html
            <a href="https://play.google.com/store/apps/details?id=com.stash.jeenius&hl=en_IN" class="btn btn-primary" data-cta="true" data-track-label="p2027_get">Get the 2027 predictions</a>
```
with:
```html
            <a href="https://play.google.com/store/apps/details?id=com.stash.jeenius&hl=en_IN" class="btn btn-primary" data-magnetic data-cta="true" data-track-label="p2027_get">Get the 2027 predictions</a>
```

- [ ] **Step 3: Tag the dark surfaces for the spotlight**

In `jee-jeenius/landing/index.html`:

(a) The predicted-mocks dark panel (line 639). Replace:
```html
          <div class="mock">
```
with:
```html
          <div class="mock" data-spotlight>
```

(b) The footer (line 824). Replace:
```html
  <footer class="footer">
```
with:
```html
  <footer class="footer" data-spotlight>
```

- [ ] **Step 4: Replace the initMagnetic and initSpotlight stubs**

In `jee-jeenius/landing/assets/motion.js`, replace `function initMagnetic() {}` with:

```js
  function initMagnetic() {
    var els = document.querySelectorAll('[data-magnetic]');
    if (!els.length) return;
    var STR = 0.25, MAX = 7;
    els.forEach(function (el) {
      var rect = null;
      var move = rafThrottle(function (e) {
        if (!rect) rect = el.getBoundingClientRect();
        var x = clamp((e.clientX - (rect.left + rect.width / 2)) * STR, -MAX, MAX);
        var y = clamp((e.clientY - (rect.top + rect.height / 2)) * STR, -MAX, MAX);
        el.style.transform = 'translate(' + x.toFixed(1) + 'px,' + (y - 2).toFixed(1) + 'px)';
      });
      el.addEventListener('pointerenter', function () { rect = el.getBoundingClientRect(); });
      el.addEventListener('pointermove', move, { passive: true });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; rect = null; });
    });
  }
```

Replace `function initSpotlight() {}` with:

```js
  function initSpotlight() {
    var els = document.querySelectorAll('[data-spotlight]');
    if (!els.length) return;
    els.forEach(function (el) {
      var rect = null;
      var move = rafThrottle(function (e) {
        if (!rect) rect = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
        el.style.setProperty('--my', (e.clientY - rect.top) + 'px');
      });
      el.addEventListener('pointerenter', function () { rect = el.getBoundingClientRect(); el.classList.add('spot-on'); });
      el.addEventListener('pointermove', move, { passive: true });
      el.addEventListener('pointerleave', function () { el.classList.remove('spot-on'); rect = null; });
    });
  }
```

- [ ] **Step 5: Verify magnetic pull and spotlight tracking**

Reload. `preview_eval` — magnetic:
```js
(function(){
  var el = document.querySelector('[data-magnetic]');
  var r = el.getBoundingClientRect();
  el.dispatchEvent(new PointerEvent('pointerenter',{bubbles:true}));
  el.dispatchEvent(new PointerEvent('pointermove',{bubbles:true, clientX:r.right+6, clientY:r.top+r.height/2}));
  return new Promise(function(res){ requestAnimationFrame(function(){ requestAnimationFrame(function(){
    var t = el.style.transform; el.dispatchEvent(new PointerEvent('pointerleave',{bubbles:true}));
    res({ pulled: t, resetAfterLeave: el.style.transform }); }); }); });
})()
```
Expected: `pulled` contains `translate(` with a positive (capped ≤7) X; `resetAfterLeave: ""`.

`preview_eval` — spotlight:
```js
(function(){
  var el = document.querySelector('.footer[data-spotlight]');
  var r = el.getBoundingClientRect();
  el.dispatchEvent(new PointerEvent('pointerenter',{bubbles:true}));
  el.dispatchEvent(new PointerEvent('pointermove',{bubbles:true, clientX:r.left+120, clientY:r.top+60}));
  return { spotOn: el.classList.contains('spot-on'), mx: el.style.getPropertyValue('--mx') };
})()
```
Expected: `spotOn: true`, `mx: "120px"`.

`preview_screenshot` of the footer with the spotlight active — Expected: a soft gold pool of light on the dark footer; text fully legible above it.

- [ ] **Step 6: Commit**

```bash
git add jee-jeenius/landing/assets/app.css jee-jeenius/landing/index.html jee-jeenius/landing/assets/motion.js
git commit -m "$(printf 'JEE motion: magnetic CTAs + cursor spotlight on dark surfaces\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>')"
```

---

## Task 6: Hardening — reduced-motion, mobile, dark, regression sweep

**Files:**
- Verify only; small fixes to `assets/app.css` / `assets/motion.js` if a check fails.

**Interfaces:** none new.

- [ ] **Step 1: Reduced-motion parity (code + emulation)**

Emulate via `preview_eval` overriding `matchMedia` before reload is not reliable; instead verify the CSS guard statically and the JS guard logically:

`preview_eval`:
```js
(function(){
  // find the reduced-motion rules that neutralize new effects
  var found = { stagger:false, aurora:false, tilt:false };
  for (var s=0; s<document.styleSheets.length; s++) {
    var rules; try { rules = document.styleSheets[s].cssRules; } catch(e){ continue; }
    for (var r=0; r<rules.length; r++) {
      var t = rules[r].cssText || '';
      if (t.indexOf('prefers-reduced-motion') > -1) {
        if (t.indexOf('data-stagger') > -1) found.stagger = true;
        if (t.indexOf('aurora__blob') > -1) found.aurora = true;
        if (t.indexOf('data-tilt') > -1) found.tilt = true;
      }
    }
  }
  return found;
})()
```
Expected: `{ stagger:true, aurora:true, tilt:true }`. If any is false, fix the reduced-motion block in `app.css` (Task 4 Step 2). Also confirm by reading `motion.js` that pointer inits are inside `if (state.fine)` and `state.fine` is `AND !reduce` — reduced-motion users never bind tilt/magnetic/spotlight.

- [ ] **Step 2: Mobile viewport sanity**

`preview_resize` preset `mobile`, reload, `preview_screenshot` + `preview_snapshot`.
Expected: single-column layout intact; aurora still drifts (autonomous); no horizontal scroll; hero headline + CTA legible; floating CTA visible after scroll. `preview_console_logs` (error) — no new errors.

- [ ] **Step 3: Dark mode full pass**

`preview_eval`: `document.documentElement.classList.add('dark')`, then screenshot hero, prediction card, footer.
Expected: night-study aurora (dim), tilt glare subtle, spotlight visible, all text legible. Remove with `document.documentElement.classList.remove('dark')`.

- [ ] **Step 4: Existing-feature regression sweep**

`preview_eval` — exercise the pre-existing interactions and confirm they still work:
```js
(function(){
  var out = {};
  // dark toggle
  document.getElementById('darkModeToggle').click();
  out.darkToggled = document.documentElement.classList.contains('dark');
  document.getElementById('darkModeToggle').click();
  // pricing toggle
  document.querySelector('[data-pricing-toggle="annual"]').click();
  out.annualShown = getComputedStyle(document.querySelector('[data-plan-group="annual"]')).display !== 'none';
  document.querySelector('[data-pricing-toggle="monthly"]').click();
  // FAQ
  document.querySelector('.faq-q').click();
  out.faqOpen = document.querySelector('.faq-item').classList.contains('active');
  // 2027 prediction reveal
  document.getElementById('pred-overlay').click();
  out.predRevealed = document.getElementById('pred-reveal').classList.contains('revealed');
  return out;
})()
```
Expected: all four `true`. Then test the PYQ search UI: `preview_eval` clicks the search button and confirms the loader→results path still renders (the existing `handleSearch`). Expected: results grid populates after ~1.4s.

- [ ] **Step 5: Console + performance sanity**

`preview_console_logs` (all) across the session — Expected: no errors/warnings from `motion.js`; only pre-existing config-file 404s.
`preview_eval`: `performance.now()` before/after a forced reflow is not needed; instead visually confirm via screenshot during scroll that motion is smooth. Confirm no layout shift: the aurora is `position:absolute` (out of flow) and stagger children reserve space (opacity/transform only, no display toggling).

- [ ] **Step 6: Final verification screenshots for the user**

Capture `preview_screenshot` of: (a) hero light, (b) hero dark, (c) footer with spotlight, (d) mobile hero. These are the proof artifacts to share.

- [ ] **Step 7: Final commit (if any fixes were made in this task)**

```bash
git add -A jee-jeenius/landing/
git commit -m "$(printf 'JEE motion: hardening — reduced-motion, mobile, dark, regression fixes\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>')"
```

---

## Self-Review (author check against the spec)

**Spec coverage:**
- Ambient hero aurora → Task 2. ✓ (autonomous CSS drift + pointer lean + dark variant)
- 3D depth & tilt on cards → Task 3. ✓ (hero card, prediction card, bento tiles; translateZ depth; glare)
- Buttery scroll choreography → Task 4. ✓ (stagger, underline sweep, write-on, eased count-up)
- Magnetic CTAs + cursor spotlight → Task 5. ✓ (two primary CTAs; footer + mock)
- Guards: reduced-motion + fine-pointer → Task 1 (flags/gate) + Task 4 Step 2 (CSS) + Task 6 (verify). ✓
- Performance (transform/opacity, rAF, passive) → built into every JS unit; Task 6 Step 5. ✓
- Mobile behavior (ambient-only, no CLS) → Task 6 Step 2. ✓
- Reusable / no page-specific hardcoding → data-attribute driven; motion.js has no `index`-specific selectors. ✓
- Scope index.html only → no other page touched. ✓

**Placeholder scan:** none — every code step contains full code.

**Type/name consistency:** `state` `{reduce, fine}`, `rafThrottle`, `lerp`, `clamp`, `initAurora(state)`, `initTilt`, `initMagnetic`, `initSpotlight`, `initScrollChoreography` used identically in Task 1 definitions and Tasks 2-5 replacements. CSS classes (`aurora__group`, `data-aurora-group`, `tilt-glare`, `data-tilt-layer`, `data-stagger`, `stagger-in`, `hl-sweep`, `write-on`, `data-magnetic`, `data-spotlight`, `spot-on`) match between CSS, HTML, and JS. Div-balance notes included where wrappers are added (Task 3 Steps 2-3).
