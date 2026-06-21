# JEEnius AI — Landing Redesign Design Spec

**Date:** 2026-06-21
**Author:** Sahil Singh (with Claude)
**Status:** Draft for review

## 1. Problem & Goal

The current JEEnius AI landing page (`jeenius/landing/index.html`) is a single static
HTML + Tailwind-CDN page. It is **high cognitive load and high anxiety**: 12 dense
sections, hero stat-stacking (92% / 218 / +25-60 all at once), and aggressive FOMO
("Your competitors are not waiting. Will you?", 🚨 countdown banners, blinking alerts).

**Goal:** Redesign into a beautiful, modern, creative, **low-cognitive-load** marketing
site aimed at a stressed 16–18 year old Indian JEE aspirant (and fee-paying parent) —
calm, confident, and trustworthy, while preserving the careful SEO/structured-data work
and all real product features.

### Decisions locked with stakeholder
- **Scope:** Landing page (`index.html`) first, then propagate the system to `about.html`,
  `prediction-engine.html`, `prediction-results.html`.
- **Tech:** Drop-in **static HTML + Tailwind** (keep Netlify deploy + SEO). No framework, no build step.
- **Visual identity:** Evolve existing **green + gold**, modernized.
- **Tone:** **Calm, confident, encouraging.** Cut the FOMO.
- **Visual direction:** **"Calm focus"** — light, airy, premium editorial; deep-green ink on
  warm cream, gold as a single disciplined accent. Ships with a dark mode that doubles as
  the "Night study" direction.

## 2. Research basis (leading Indian JEE sites)

Researched Physics Wallah, Vedantu, Doubtnut, MARKS (+ AI-first Cape-up / Achieve /
jee-neet-solver). Convergent takeaways the design is built on:

1. **One promise + one CTA in the hero.** MARKS (category leader) ships a 7-word headline.
   Stop stat-stacking — one hero proof point, the rest lower and quiet.
2. **Lead with relief, not threat.** None of the real apps use sirens/countdowns. "Never get
   stuck again" beats "competitors aren't waiting."
3. **Let users touch the product before signup** — live PYQ search + one AI solution inline.
4. **Solution micro-structure:** restate question → reveal answer → numbered steps (collapsible) → one next action.
5. **NTA-replica exam realism** is the strongest trust signal — show the real mock/CBT interface.
6. **Trust via specific numbers + recency, not testimonial walls.** Protect AI credibility by
   showing working, not shouting accuracy %.
7. **Genuine dark mode + distraction-free** = a study *feature*.
8. **Whitespace is the opening:** competitors are crowded/utilitarian. JEEnius wins on calm, premium polish.

## 3. Visual system — "Calm focus"

### 3.1 Color tokens
Light (default):
- `--canvas` `#F6F4EF` (warm paper cream) · `--surface` `#FFFFFF`
- `--ink` `#0F201D` (forest near-black, primary text) · `--ink-soft` `#4A5A55` (secondary)
- `--green` `#1B3B36` (brand) · `--green-hover` `#244A44` · `--green-deep` `#0F201D` (dark sections/footer)
- `--gold` `#FFD700` (fills/highlights only) · `--gold-ink` `#8A6A00` (accessible gold *text* on light)
- `--sage` `#DCEFD8` · `--mint` `#EAF3EF` · `--line` `#E2E8E6` (hairline borders)

Dark (`.dark`, doubles as "Night study"):
- `--canvas` `#0F201D` · `--surface` `#16302B` · glass cards `rgba(255,255,255,.04)` + border `rgba(255,255,255,.08)`
- `--ink` `#EAF3EF` · `--ink-soft` `#9FB5AE` · `--gold` `#FFD700` (works as text on dark) · `--green` `#2D5A52`

**Gold discipline:** gold appears at most ~once per viewport (one highlight word, one accent
line, or the primary CTA glow). Never gold-on-cream body text (use `--gold-ink`).

### 3.2 Typography
- Body/UI: **Plus Jakarta Sans** (already loaded) — 400/600/800.
- Display headings (hero H1, section H2): **Fraunces** (variable serif, Google Fonts) at soft
  optical size for the editorial "premium calm" feel. `font-display:swap`, only weights 400/600.
  *(Removable for perf — if mobile budget is tight, fall back to Jakarta 800 for headings.)*
- Scale: hero 44–72px / sections 32–48px / body 16–18px / line-height 1.6 body, 1.1 display.
- **Sentence case** everywhere (no SHOUTING CAPS except tiny eyebrow labels with letter-spacing).

### 3.3 Layout & motion
- Max width 1200px, generous gutters; section rhythm ~112px desktop / 64px mobile.
- Soft cards: radius 16–24px, 1px hairline border, very subtle shadow. **Bento grid** for features.
- Motion: gentle fade/slide-up on scroll, soft hover lift. `prefers-reduced-motion` respected.
- **Removed:** confetti, particle storm, canvas grid, scan-lines, blinking pulses, countdown.
  At most one calm ambient element (a soft static radial glow behind the hero).

## 4. Information architecture (12 → ~9, each = one idea)

1. **Nav** — logo · Practice · How it works · Pricing · dark toggle · one CTA ("Start free").
2. **Hero** — one promise, one primary CTA + one ghost secondary, one quiet proof chip, one calm product visual.
3. **Try it now** — the live PYQ search (existing feature), styled calm; do something with zero signup.
4. **See how the AI thinks** — one real step-by-step solution (collapsible steps).
5. **Predicted mocks** — calm reframe + NTA-replica mock screenshot + ONE credible stat with "how we measure" link.
6. **Know your rank** — rank/college prediction framed as "know where you stand" (reduces anxiety).
7. **Why JEEnius** — bento of 3–4 benefit tiles.
8. **Pricing** — Free + Pro (highlighted) + Pro+; transparent; generous free tier; monthly/annual toggle kept.
9. **FAQ + Footer** — one accordion (AEO) + minimal footer + Play Store badge + legal links to `ai.jeenius.tech`.

**Cut:** 🚨 "2027 spotlight" doom section, countdown timer, hero stat-stack, duplicate pricing
block, dense `jee-resources` link-wall (→ relocate to a future `/resources` page for SEO).
**Preserve:** all `<head>` SEO (title/meta/canonical/hreflang/OG/Twitter), **all JSON-LD**, sitemap/robots,
gtag + conversion tracking, dark-mode toggle, mobile menu, floating mobile CTA, PYQ search JS,
pricing toggle JS. App/store links and legal links unchanged.

## 5. Copy direction (calm, concrete — final copy in implementation)

- **Hero H1:** "Walk into JEE knowing exactly what to study."
- **Hero sub:** "Practice 20+ years of real JEE PYQs, get step-by-step help from an AI tutor, and
  see your predicted rank — in one calm, focused app."
- **Proof chip:** "JEE Main 2002–2025 · JEE Advanced 2007–2025"
- **Primary CTA:** "Start practising free" → Play Store. **Secondary:** "See how it works".
- **Predicted mocks:** "Practice what's most likely to come. Our AI studies 20+ years of papers to
  build exam-realistic mocks focused on high-probability topics — it lined up with 92% of JEE Main
  2026's topic spread." + "How we measure this →". *(No threat/urgency copy.)*
- **Know your rank:** "Know where you stand — today. See a predicted rank and the colleges in reach,
  so you can plan instead of worry."
- **Feature tiles:** Real PYQs 2002–2025 (searchable) · Step-by-step AI solutions · AI-predicted
  NTA-style mocks · Focus + dark mode for late-night study.
- **Pricing eyebrow:** "Start free — no card needed."

> All quantitative claims (92%, ratings, counts) use **real, verifiable** numbers. Any number not
> confirmed is flagged `TODO(confirm)` in code rather than invented.

## 6. Mobile & performance
- Mobile-first single column; full-width thumb-reachable CTA; one idea per screen.
- No horizontal stat strips / sticky urgency banners on small viewports.
- Lazy-load below-the-fold images; defer non-critical JS; keep hero light (no video).
- Tap targets ≥44px; font ≥16px; respects reduced motion.

## 7. Trust & proof
- One quiet hero proof chip; a dedicated low-key "proven on JEE 2026" stat with a credibility link.
- App rating + a couple of attributed testimonials (real, ≤4) — not a wall.
- Show the actual mock interface (NTA-replica) and real AI working (step-by-step) as the trust play.

## 8. Implementation shape (static, no build)
- **Shared design layer:** extract tokens + component classes into a single static
  `jeenius/landing/assets/app.css`, linked from all 4 pages (no build needed). Keep Tailwind CDN
  for utilities; keep the small `tailwind.config` inline per page (CDN requirement).
- **Rewrite** `index.html` body to the new IA; keep `<head>` intact (SEO/JSON-LD).
- **Propagate** shared nav/footer/tokens to `about.html`, `prediction-engine.html`,
  `prediction-results.html` (phase 2).
- Reuse existing JS (PYQ search, toggles) — restyle, don't rebuild.

## 9. Success criteria
- ≤9 sections; calm copy; no FOMO/countdown; passes a "skim in 30s" read.
- All existing `<head>` SEO + JSON-LD preserved (verified by diff).
- All current functional features still work (PYQ search, dark toggle, pricing toggle, mobile menu, floating CTA).
- Works in light + dark, mobile + desktop; good Lighthouse mobile (perf + a11y).
- No broken links; store/legal links unchanged.

## 10. Out of scope
- The Android app itself; backend (`ai.jeenius.tech`); the Stash AI corporate root page.
- New `/resources` SEO page (noted as a follow-up to absorb the cut link-wall content).
