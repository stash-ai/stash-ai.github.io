# JEEnius JEE — Immersive "lab" pages (A/B centerpieces) — Design Spec

**Date:** 2026-07-10
**Status:** Approved concepts; building standalone prototypes
**Deliverable:** 3 self-contained, immersive, interactive HTML pages in `jee-jeenius/landing/lab/`,
each a promotable hero variant for A/B testing.

## Goal
Three "only-a-high-paid-dev-would-build-this" interactive centerpieces that emotionally connect
with a JEE aspirant — immersive, out-of-the-box, but still **calm** (no FOMO, disciplined gold).
Each is a standalone page so it can be split-tested on Netlify or promoted into the real hero.

Chosen (user A/B set): **Feel the physics**, **Exam universe**, **Watch the AI think**.
(Not building "Know where you'll stand" this round.)

## Shared design system (every page)
- **Self-contained:** one HTML file, all CSS/JS inline. No JS libraries, no build. Only external
  allowed = the site's Google Fonts (Fraunces + Plus Jakarta Sans) via the same `<link>` the main
  site uses. Everything else inline. No network calls.
- **Tokens (reuse exactly):**
  - Light: `--canvas #F6F4EF` · `--surface #FFFFFF` · `--ink #0F201D` · `--ink-soft #4A5A55` ·
    `--green #1B3B36` · `--gold #FFD700` · `--gold-ink #8A6A00` · `--gold-soft #FBEFC2` ·
    `--sage #DCEFD8` · `--mint #EAF3EF` · `--line #E8E3D8`
  - Dark / night-study: `--canvas #0E1E1B` · `--green-deep #0A1714` · `--surface #16302B` ·
    `--ink #EAF3EF` · `--ink-soft #A2B7B0` · `--green #2E5A52` · `--gold #FFD700` · `--gold-ink #FFE373`
- **Type:** Fraunces (display H1/section, weight 400–500, `font-optical-sizing:auto`), Plus Jakarta
  Sans (UI/body 400–800). Sentence case. Tight display leading (1.05–1.15).
- **Ethos:** calm, premium, editorial; generous whitespace; gold ≈ one accent per view; soft
  radii (16–24px); hairline borders; gentle easing `cubic-bezier(.22,.61,.36,1)`.
- **Each page is a landing-worthy variant:** tiny "JEEnius" brand mark top-left, the immersive
  interactive as the centerpiece, one calm headline, one primary CTA
  (`https://play.google.com/store/apps/details?id=com.stash.jeenius&hl=en_IN`, label "Start practising free"),
  and a small "← back to lab" link to `index.html`.
- **Interactivity is user-driven** (they drive it; it doesn't just autoplay).
- **A11y + perf:** honor `prefers-reduced-motion` (show a meaningful *static* end-state, no motion);
  full mobile/touch support (pointer + touch, responsive, DPR-capped canvas ≤2); 60fps target on
  mid-range Android; `requestAnimationFrame`, passive listeners, cleanup; no layout thrash; no CLS.
- **No invented hard claims presented as fact:** probabilities/weights are illustrative and labelled
  as "illustrative / based on 20+ yrs of papers," never "official."

## Page 1 — `feel-the-physics.html` (light "lab", calm)
**One-liner:** "Don't memorise it. Feel it."
**The interactive:** the hero's charged-ring EMI problem, made tactile on a `<canvas>`.
- Centerpiece: a non-conducting ring (radius R) drawn as a circle of faint gold charge dots, inside
  a shaded circular magnetic-field region (green tint), axis out of screen.
- **Control:** a large slider / draggable dial for magnetic field **B** (0 → Bmax), plus a "switch
  field on" that ramps B with a real `dB/dt`. Optional second slider: charge q or mass m.
- **Live response (physics-accurate enough to be honest):** while B ramps, an induced tangential
  E-field appears as curling arrows around the ring (magnitude ∝ r·dB/dt / 2); this exerts torque
  τ = qER on the charge distribution → angular acceleration α; the ring visibly spins up; when the
  ramp ends the ring keeps spinning at ω. Show the classic result **ω = qB/2m** building up; label the
  instantaneous **α** during the ramp. Render a live equation panel (styled math via HTML/Unicode/SVG,
  NOT MathJax) whose numbers update as you drag: dB/dt, E, τ, α, ω.
- **The "click" moment:** the abstract formula becomes visible motion. A subtle gold pulse when ω
  locks to qB/2m after the ramp.
- **Visual:** cream canvas, deep-green field region + arrows, gold charges/ring, one gold accent.
- **Reduced motion:** ring shown at a representative ω with vectors drawn statically; slider still sets
  values + equation, but no continuous spin.
- **Mobile:** touch-drag the slider; canvas scales; equation panel stacks under the canvas.

## Page 2 — `exam-universe.html` (dark night-sky, most immersive)
**One-liner:** "Walk in knowing what's on the paper."
**The interactive:** a full-viewport `<canvas>` cosmos of JEE topics.
- ~120–260 "stars," each a JEE topic across **Physics / Chemistry / Maths** (define a real topic list;
  ~30–45 named topics, remaining stars are ambient dust). Star size/brightness ∝ an illustrative
  "2027 likelihood" weight. Three soft clusters/nebulae by subject, gently color-separated within the
  brand: Physics = green/sage glow, Chemistry = gold glow, Maths = mint/cool glow.
- **Immersion:** slow autonomous drift + **parallax** to pointer/tilt (multi-depth layers); faint
  constellation lines linking related topics within a subject; soft bloom on bright stars.
- **Interaction:** hover/tap a named star → it blooms; a calm card appears with topic, subject,
  "~X% likely / high-probability" (illustrative), and a one-line sample PYQ + "match likelihood."
  Optional scroll/pinch to zoom toward a cluster.
- **Overlay:** headline + subhead + primary CTA, and a tiny legend (3 subjects). Keep text off the
  busiest area; ensure contrast (dark scrim behind text).
- **Visual:** deep forest-black `#0A1714` → `#0E1E1B` gradient; green/gold/mint stars; disciplined.
- **Reduced motion:** static star map (no drift/parallax); hover/tap still reveals cards.
- **Mobile:** touch to explore/tap stars; cap star count + DPR for perf; parallax via touch-move.
- **Perf:** single canvas, offscreen gradients cached, ≤~260 stars, throttle pointer, cap DPR at 2.

## Page 3 — `watch-the-ai-think.html` (light "whiteboard", product magic)
**One-liner:** "See how it thinks — not just the answer."
**The interactive:** a reasoning theater on a paper/whiteboard surface.
- A real JEE question at top + 4 options (A–D). User taps their answer.
- Then "Watch JEEnius solve it": the reasoning unfolds step-by-step — a short "thinking…" pulse, then
  each step's text reveals with a handwriting/typewriter feel; math lines render (styled HTML/SVG math,
  NOT MathJax) and draw in; any diagram draws via SVG `stroke-dashoffset`. Final answer lands with a
  calm gold highlight; if the user's pick matches, a gentle "nice — that's right" affirmation (never
  punishing if wrong: "here's why the answer is …").
- 2–3 questions available; "Try another" cycles. Include ≥1 with a small SVG diagram.
- **Visual:** cream/paper surface, green ink, gold highlight, soft cards; unhurried pacing (a step
  every ~600–900ms) that feels like real reasoning, not a spinner.
- **Reduced motion:** steps appear instantly (no typewriter), still sequential-readable.
- **Mobile:** single column; tap targets ≥44px; math wraps/scrolls within its own container.

## Delivery & A/B
- Files in `jee-jeenius/landing/lab/`: `feel-the-physics.html`, `exam-universe.html`,
  `watch-the-ai-think.html`, plus `index.html` (a calm hub linking all three, for side-by-side review).
- Each is promotable to the real hero, or split-testable via Netlify branch/deploy split.
- Served locally at `http://localhost:8753/lab/`.

## Success criteria
- Each page feels genuinely immersive + interactive + calm, on-brand, and "expensive."
- Works light/dark where applicable, mobile + desktop, reduced-motion; no console errors; 60fps.
- Self-contained (no libs); no invented factual claims; CTA + brand present.
