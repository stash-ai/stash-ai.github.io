# JEEnius JEE — "Living calm" motion layer — Design Spec

**Date:** 2026-07-10
**Author:** Sahil Singh (with Claude)
**Status:** Approved for planning
**Applies to:** `jee-jeenius/landing/index.html` (+ shared `assets/app.css`, new `assets/motion.js`)

## 1. Problem & Goal

The JEE landing page already ships the "Calm focus" design system (deep green + gold,
Fraunces display serif, warm cream canvas, dark "Night study" mode) and real interactivity
(blur-to-reveal 2027 prediction card, PYQ search, count-up stats, pricing toggle, FAQ
accordion, scroll reveals). It reads *calm* but *static* — it does not yet feel like a
world-class, premium product on first load.

**Goal:** Add a signature **motion / micro-interaction layer** that makes the page feel
alive and jaw-dropping — while staying **calm and low-cognitive-load** for a stressed
16–18 year old JEE aspirant. Delight through **craft and physicality, not noise**. No new
sections, no new content, no FOMO. Green + gold preserved.

### Decisions locked with stakeholder
- **Direction:** Motion-polish pass only — elevate the whole page's *feel*; do **not** add a
  new interactive section or new content.
- **Intensity:** **Balanced showcase** — a serene base with 2–3 deliberate "wow" beats (the
  hero especially). Most of the page stays calm; standout moments earn attention.
- **Effects (all four):** ambient hero aurora · 3D depth & tilt on cards · buttery scroll
  choreography · magnetic CTAs + cursor spotlight.
- **Scope:** `index.html` first. Built **reusable** so `about.html`,
  `prediction-engine.html`, `prediction-results.html` can adopt it in a later pass (not this one).
- **Tech:** Vanilla, **dependency-free**, no build step. New `assets/motion.js` + a motion
  section in shared `assets/app.css`. Keeps Netlify static deploy.
- **Guardrails:** `prefers-reduced-motion` fully honored (calm static fallback); pointer
  effects gated to fine-pointer devices (phones get ambient-only); gold stays disciplined
  (~one accent per viewport); no regression to existing features or SEO.

## 2. Approach (chosen)

**Vanilla progressive enhancement.** One small `assets/motion.js` (~5–6kb, no libraries),
linked from `index.html`, plus a motion section in `assets/app.css`. HTML opts in via
`data-*` attributes so JS stays decoupled from content and each feature is a no-op when its
targets or capabilities are absent.

**Rejected alternatives:**
- *Micro-library (VanillaTilt / Atropos / GSAP):* adds weight + a CDN request against the
  lean static ethos; GSAP (~50kb) is overkill for "balanced." Rejected.
- *WebGL / canvas mesh-gradient aurora:* the most spectacular aurora, but too much
  GPU/battery cost for a mid-range-Android audience and harder to keep "calm." Rejected as
  default; noted as a possible future hero upgrade only.

## 3. The motion layer — behavior spec

Numbers below are targets to implement against (tunable during review), chosen for "calm":
small amplitudes, slow timings, eased returns.

### 3.1 Ambient hero aurora — *signature moment*
- **Replaces** the two static `.glow` blobs behind the hero (`#top`) with **three**
  heavily-blurred radial fields in brand tones: sage-green, gold-soft (the single gold
  accent), mint. Layered at `z-index:0`, hero content at `z-index:1`.
- **Autonomous drift:** each blob animates on its own via CSS keyframes — `translate` ±20–40px
  and `scale` 1 ↔ ~1.08 — over **20–30s** loops with **offset phases**, so the field is alive
  with zero interaction and on mobile. Very slow, meditative, never busy.
- **Pointer lean (desktop / fine pointer only):** the aurora group parallax-shifts toward the
  pointer, **max ±8px**, eased via a lerp (~0.06/frame), rAF-driven. Responsive, never chasing.
- **Dark mode = "night-study aurora":** deeper, dimmer tones; group opacity lower
  (~0.30–0.40 vs ~0.45–0.55 light) so it reads as calm late-night ambiance.
- **Blur ~70–90px.** Contrast preserved behind headline/body. GPU transform/opacity only.

### 3.2 3D depth & tilt on cards
- **Targets** (`data-tilt`): hero solution card, 2027-prediction card, and the feature bento
  tiles.
- **Behavior:** on pointer move inside the card, tilt toward the cursor with
  `perspective:~900px`, **max ~6°** on each axis (subtle — calm, not a toy), plus a soft
  **specular highlight** (a faint white/gold radial, ~0.10–0.14 opacity) that tracks the
  pointer, and a small shadow lift. Eased spring-back on `pointerleave` (~0.4–0.5s).
- **Parallax depth:** designated inner layers (`data-tilt-layer`, e.g. the floating "92%
  topics predicted" badge, the pill) get `translateZ` (~30–50px) so the tilt reveals real
  depth — the jaw-drop detail.
- **rAF-throttled** pointermove; passive listeners.
- **Touch / no fine pointer:** tilt + highlight disabled; cards keep existing calm
  hover-lift / scroll-in behavior.

### 3.3 Buttery scroll choreography
- **Staggered reveals:** items within a group (bento tiles, hero chips, stat boxes) reveal
  with an incremental delay `--i * ~60–80ms` and a **blur-to-sharp** (blur 8px → 0) in
  addition to the existing fade/slide, so they cascade rather than pop together. Reuses the
  existing IntersectionObserver.
- **Gold underline sweep:** the hero highlight ("what's on the paper") and section titles get
  a gold underline that draws in from the left (`scaleX 0→1`, `transform-origin:left`, ~0.6s)
  when they enter view.
- **Formula "write-on":** the hero answer `α = qB / 2m` (and the 92% badge) reveal with a
  subtle clip/opacity so the "AI just solved it" reads as a live moment.
- **Physical count-ups:** refine the existing `data-count` animation to an ease-out cubic;
  the prediction probability bar fills with an eased spring.
- **Fully scroll-driven → works on mobile.** No pointer required.

### 3.4 Magnetic CTAs + cursor spotlight — *desktop delight*
- **Magnetic buttons** (`data-magnetic`): primary CTAs ("Start practising free", "Get the
  2027 predictions") gently pull toward the cursor when it enters a small radius
  (~bbox + 24px). Pull ≈ 0.25 × offset, **max translate ~7px**; the label/arrow lead a touch
  more for depth; spring back on leave (~0.4s). Calm, not cartoonish.
- **Cursor spotlight** (`data-spotlight`): on the dark sections (footer + dark
  prediction/mock surfaces), a large, very soft **gold-tinted** radial (~380px,
  `rgba(255,215,0,.06)` → transparent) follows the pointer via CSS custom props `--mx/--my`
  updated on rAF — a torch on a calm dark study desk.
- **Fine pointer only** → both simply absent on phones (no layout/JS cost, no degradation
  needed). Disabled under reduced-motion.

## 4. Architecture & implementation shape

- **`assets/motion.js`** — NEW, dependency-free IIFE, self-initializing on `DOMContentLoaded`,
  exposes no globals. Internally split into independent, individually-guarded units, each a
  no-op if its targets/capabilities are missing:
  - `initAurora()` · `initTilt()` · `initMagnetic()` · `initSpotlight()` · scroll
    choreography (fold into / extend the existing reveal observer).
  - Shared capability flags computed once: `reduce = matchMedia('(prefers-reduced-motion:
    reduce)')`, `fine = matchMedia('(hover: hover) and (pointer: fine)')`. Pointer units init
    only when `fine && !reduce`; aurora drift runs unless `reduce`.
  - Linked from `index.html` with `defer`.
- **`assets/app.css`** — new "motion layer" section: aurora blobs + keyframes, tilt highlight,
  magnetic/spotlight surfaces, stagger/underline/write-on classes. Uses existing green/gold
  tokens. Extends the existing `@media (prefers-reduced-motion: reduce)` block to neutralize
  all new motion.
- **`index.html`** — add aurora markup in the hero, and `data-*` opt-in attributes on the
  cards / CTAs / dark sections; link `motion.js`. **No content or section changes.** The
  existing inline `<script>` (dark toggle, PYQ search, pricing, FAQ, prediction reveal,
  count-up, analytics) is untouched; the count-up easing tweak is the only edit to existing JS
  behavior and stays backward-compatible.

## 5. Performance & accessibility
- Transform/opacity only (compositor) — no layout thrash; `will-change` scoped and limited.
- All pointer handlers rAF-throttled; listeners passive; no synchronous layout reads in the
  hot path (measure once, cache rects, refresh on resize/scroll as needed).
- No new blocking/external requests; aurora is CSS; `motion.js` deferred; ~5–6kb.
- Reduced-motion ON = fully calm static experience (no drift, no tilt, no magnetic/spotlight,
  reveals become instant). This is a first-class supported state, not an afterthought.
- Contrast and tap targets unchanged; motion never gates content or interaction.

## 6. Mobile behavior
- Aurora: autonomous drift only (no pointer lean) — still alive and premium.
- Tilt / magnetic / spotlight: absent (pointer-only) — page is complete without them.
- Scroll choreography, underline sweep, write-on, count-ups: fully active (scroll-driven).
- No new mobile weight beyond the small shared JS; no CLS.

## 7. Success criteria
- Feels premium and "alive" on first load; the hero aurora + one tilt/magnetic beat land as
  the "wow."
- Still reads calm — passes the "study-focused, not a casino" test; gold stays ~one accent
  per viewport.
- 60fps on a mid-range Android; zero CLS; Lighthouse perf + a11y unharmed vs. baseline.
- Full parity with reduced-motion ON (calm static) and on touch (ambient-only).
- Zero regressions to existing interactivity, links, or SEO/JSON-LD.

## 8. Out of scope
- Any new section, copy, or product content.
- Propagating the layer to `about.html` / `prediction-engine.html` / `prediction-results.html`
  (built reusable for a later pass).
- WebGL/canvas aurora upgrade (possible future).
- The Android app, backend, or brand-umbrella site.
