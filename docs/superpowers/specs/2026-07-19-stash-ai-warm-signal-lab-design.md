# Stash AI — "Warm Signal Lab" Reinvention

**Date:** 2026-07-19
**Target:** top-level `index.html` (the Stash AI venture-lab umbrella site, served at `stash-ai.github.io` / `stash.ai.tech`)
**Scope:** Full visual reinvention + rich motion. Single static file, GitHub Pages. No framework, no build step.

## 1. Direction

Chosen: **Blend of "Signal Lab" (engineering instrument panel) + "Human Warmth"** = **Warm Signal Lab**.

Deep engineering-dark canvas with a hairline technical grid, monospace labels, and a **live animated Model-Stack routing engine** as the hero centerpiece — warmed up with a coral/amber palette, soft warm glow, and human copy so it reads *technical but not cold*. Leans into the "we orchestrate many models into one brain" story and the IIT-engineer identity, while staying human-centric.

Motion character: **rich & lively** (per user) — scroll choreography, live routing animation, scramble/typed labels, animated counters, magnetic buttons, cursor-reactive glow — executed with taste (premium, not gaudy), and fully gated behind `prefers-reduced-motion`.

## 2. Design tokens

**Base (warm near-black):**
- `--void: #08090B` (page), `--panel: #0F1115`, `--panel-2: #14161C` (raised)
- `--line: rgba(255,255,255,.08)`, `--line-strong: rgba(255,255,255,.14)`

**Text (warm white, not pure #fff):**
- `--ink: #F5F2EC`, `--muted: #A0A0AC`, `--faint: #6C6C78`

**Accents — warm-led, cool-supported:**
- `--warm: #FF7A45` (ember/coral — PRIMARY, CTAs, energy)
- `--amber: #FFC24B` (highlight / gold warmth)
- `--cool: #37E0FF` (ion cyan — technical signals: routing lines, data, links)
- `--iris: #7C5CFF` (violet bridge for gradients only)
- Signature gradient: `linear-gradient(100deg, #FF7A45, #FFC24B)` (warm); cool cyan reserved for the routing/data layer.

**Type:**
- Display/headings: **Space Grotesk** 700 (tight tracking)
- Labels / kickers / stats / routing: **JetBrains Mono** 400/600 (e.g. `// 01 · MISSION`)
- Body: Space Grotesk 400 (warmth comes from color + copy + generous radii, not a third face)

**Shape/space:** radii 14–20px on panels; section rhythm ~120–160px; max-width 1200px; corner-tick + status-dot detailing on "instrument" panels.

## 3. Signature piece — Live Model-Stack Routing Engine

Replaces the 3 static tilted cards in the hero. An animated instrument panel:
- A prompt "enters" on the left → travels along **animated connection lines** to model nodes: **Gemini 3 Pro**, **GPT-5**, **Specialized Agents** (fine-tuned) → converges to a single **answer** node on the right.
- Nodes pulse; packets flow along routes on a GSAP loop; a live readout ticks (e.g. `confidence 94%`).
- **No "Open Source" node** (removed per request). Three nodes: two frontier models + their own fine-tuned agents — accurate to the copy.
- Cursor-reactive warm glow behind the panel.

## 4. Section-by-section (all existing content preserved, restructured)

1. **Nav** — Stash AI layered-cube mark + wordmark; links Vision / Products / Technology / Labs; warm "Start a Build" CTA. Sticky, blur-on-scroll, mono active indicator.
2. **Hero** — mono kicker, Space Grotesk headline, human subhead, ember CTA + ghost CTA, credibility line (IIT Kanpur · JEEnius Suite). Right: the **Live Model-Stack** panel. Scroll cue.
3. **Vision** ("Technology should serve humanity") — 3 instrument value cards: Real Impact, Privacy by Design, Human Co-Pilot. Staged reveal.
4. **Flagship — JEEnius Suite** — JEE + NEET product panels, alternating layout, **animated counters** (real targets already exist: 20k+ / 94% / 24/7 and 10k+ / 100% / 24/7). Make count-up **robust**: render the real number by default and only reset-then-animate under ScrollTrigger, so it never freezes at `0` when motion is off/JS stalls (the current build does — that's the `0/0/0` seen in headless preview). Sub-features, testimonial, CTAs to jee./neet.jeenius.tech.
5. **Engine — The Model Stack Advantage** — Old Way vs Stash Way as an instrument diff panel. **Reword the "We mix Gemini, OpenAI, and Open Source" line to drop Open Source** (→ "…and our own fine-tuned agents").
6. **Future Labs** — Project Vital / Civic / Green, "REVEALING SOON" with a locked/scan treatment + hover reveal.
7. **B2B / Client Projects** — Custom AI Solutions + "Let's Build Together" CTA.
8. **FAQ** — animated accordion; **preserve FAQPage JSON-LD + itemscope markup**.
9. **Footer** — "Let's build a better future," email, nav, IIT Kanpur credit, © Stash AI.

## 5. Motion system (GSAP + ScrollTrigger, already loaded)

- Scroll progress bar (warm gradient); per-section ScrollTrigger reveals (clip-wipe + rise); mono labels scramble/type in.
- Hero: manual split-text char/word reveal; scramble on one keyword; live routing timeline; cursor-follow glow.
- Interactions: magnetic buttons; subtle card tilt/parallax; ScrollTrigger number counters; instrument-panel hover (border-glow / scan-line).
- Background: animated hairline grid + one slow warm aurora glow (restrained; replaces the old 3 orbs), light parallax.
- **Progressive enhancement:** content is visible by default; only add "start-hidden→reveal" when JS runs (`<html class="js">` gate). Guards against the GSAP-CDN-fail / rAF-pause blank-hero problem.
- **`prefers-reduced-motion`:** disable loops/parallax/scramble, snap to end states.

## 6. Preserve (do not break)

- Entire `<head>`: meta/OG/canonical, Organization + FAQPage JSON-LD, `google-tag-config.js` include, favicon (`stash-logo.svg`).
- FAQ structured-data markup (itemscope/itemprop).
- All external links (product sites, email `stash.ai.tech@gmail.com`), in-page anchors used by nav.
- Accessibility: semantic landmarks, alt text, aria labels, visible focus states, reduced-motion, and **AA contrast** for warm accents on dark (verify text uses tokens that pass; use accents for large text/UI, `--ink`/`--muted` for body).

## 7. Non-goals (YAGNI)

- Do **not** touch `jee-jeenius/`, `neet-jeenius/`, `jeenius-brand/` sub-sites.
- No framework / bundler / backend. Stays one static `index.html`.
- Not redesigning the deployed product web apps.

## 8. Risks & mitigations

- **GSAP fail / rAF pause blanks content** → progressive-enhancement visibility gate (§5).
- **Routing animation cost** → transform/opacity only, pause offscreen, honor reduced-motion.
- **Warm-on-dark contrast** → keep body text on `--ink`/`--muted`; reserve `--warm`/`--amber` for large text, icons, borders, fills.

## 9. Verification

Build section-by-section; verify in the Browser pane (force-complete GSAP timelines to defeat the rAF-pause gotcha before screenshotting), check console/network clean, test desktop + mobile + reduced-motion, confirm no "Open Source" remains and counters animate to real values.
