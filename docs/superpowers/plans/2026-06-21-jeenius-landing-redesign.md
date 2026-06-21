# JEEnius Landing Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (inline) to implement task-by-task. Steps use checkbox (`- [ ]`) syntax. Design craft must stay coherent across sections, so this plan is executed **inline by one builder**, not fragmented across subagents.

**Goal:** Redesign the JEEnius AI marketing site (landing + 3 sub-pages) into a calm, beautiful, low-cognitive-load "Calm focus" experience while preserving all SEO/JSON-LD and real features.

**Architecture:** Static HTML + Tailwind CDN (no build). A single shared `assets/app.css` holds design tokens + component classes, linked from all 4 pages. Each page keeps its existing `<head>` (SEO/JSON-LD) and gets a rebuilt `<body>` using the shared system. Reuse existing JS (PYQ search, toggles); delete dead effects (confetti/canvas/countdown).

**Tech Stack:** HTML5, Tailwind CDN (forms + container-queries plugins), Plus Jakarta Sans + Fraunces (Google Fonts), vanilla JS, Netlify static hosting.

**Spec:** `docs/superpowers/specs/2026-06-21-jeenius-landing-redesign-design.md` — copy, tokens, IA all defined there; this plan references it rather than duplicating.

## Global Constraints
- Static drop-in only — no framework, no build step. Deploy stays Netlify.
- Preserve verbatim in every page `<head>`: `<title>`, all `<meta>`, `<link rel=canonical/alternate/icon>`, OG/Twitter tags, and **every `<script type="application/ld+json">` block**. Preserve gtag + `gtagSendEvent`.
- Keep working: dark-mode toggle, mobile menu, PYQ search, pricing monthly/annual toggle, floating mobile CTA, smooth-scroll anchors.
- Palette = green + gold per spec §3.1. Gold appears ≤ ~once per viewport. Sentence case. `prefers-reduced-motion` respected. Tap targets ≥44px, body ≥16px.
- Remove: 🚨 urgency, countdown timer, hero stat-stack, FOMO copy, confetti/particle/canvas/scan-line effects, duplicate pricing block, dense resource link-wall.
- Any unverified number → `TODO(confirm)` HTML comment, never invented.
- Commit after each task on branch `redesign/landing-calm-focus`.

---

### Task 1: Shared design layer (`assets/app.css`)
**Files:** Create `jeenius/landing/assets/app.css`

**Produces:** CSS custom properties (`--canvas`, `--surface`, `--ink`, `--ink-soft`, `--green`, `--green-hover`, `--green-deep`, `--gold`, `--gold-ink`, `--sage`, `--mint`, `--line`) for `:root` and `.dark`; component classes (`.btn-primary`, `.btn-ghost`, `.card`, `.eyebrow`, `.section`, `.bento`, `.chip`, `.reveal`); fade-up reveal + reduced-motion guard.

- [ ] Define `:root` and `.dark` token sets per spec §3.1.
- [ ] Add base typography (Jakarta body, Fraunces `.display`), `.section` rhythm, container.
- [ ] Add components: buttons, cards, chips, bento grid, accordion, `.reveal` animation (+ `@media (prefers-reduced-motion: reduce)` disabling transforms).
- [ ] Verify: `assets/app.css` exists and parses; grep confirms all token names present.
- [ ] Commit: `style: add shared calm-focus design layer (app.css)`

### Task 2: `index.html` — head wiring + nav + hero
**Files:** Modify `jeenius/landing/index.html`

- [ ] Keep `<head>` intact; add `<link rel="stylesheet" href="assets/app.css">` and Fraunces font link; update `tailwind.config` colors to the new tokens.
- [ ] Rebuild slim sticky nav (logo · Practice · How it works · Pricing · dark toggle · one CTA).
- [ ] Build hero per spec §5: H1, sub, proof chip, primary + ghost CTA, one calm product visual (single PYQ/solution card — no floating-card chaos). Remove hero stat-stack.
- [ ] Verify (browser): screenshot light + dark, desktop + mobile; nav sticky; CTAs link to Play Store / `#how`.
- [ ] Verify (SEO): `git diff` shows `<head>` JSON-LD/meta unchanged.
- [ ] Commit: `feat: redesign index hero + nav (calm focus)`

### Task 3: `index.html` — "Try it now" (PYQ search) + "See how the AI thinks"
- [ ] Restyle existing PYQ search form/results into a calm card; keep its JS hooks/IDs.
- [ ] Build one step-by-step solution card: question → revealed answer → collapsible numbered steps → one "Try a similar PYQ" action.
- [ ] Verify (browser): PYQ search UI renders; existing search JS still runs without console errors; steps expand/collapse.
- [ ] Commit: `feat: index try-it + AI-solution sections`

### Task 4: `index.html` — Predicted mocks + Know your rank
- [ ] Build predicted-mocks section: calm copy (spec §5), NTA-replica mock screenshot/mock-UI, ONE stat + "How we measure this →" link. No urgency.
- [ ] Build rank section: "know where you stand" framing + simple rank/college visual.
- [ ] Verify (browser): screenshots light/dark; no FOMO copy present (grep for "competitors", "🚨", "Offer ends" → none).
- [ ] Commit: `feat: index predicted-mocks + rank sections`

### Task 5: `index.html` — Why JEEnius (bento) + Pricing
- [ ] Build bento of 3–4 benefit tiles (PYQs '02–'25 · step-by-step AI · NTA-style mocks · focus/dark mode).
- [ ] Rebuild pricing: Free + Pro (highlighted) + Pro+, keep real prices + monthly/annual toggle JS; emphasize "Start free — no card needed"; single transparent block (remove the duplicate).
- [ ] Verify (browser): pricing toggle switches monthly/annual; Pro card highlighted; one pricing block only.
- [ ] Commit: `feat: index features bento + simplified pricing`

### Task 6: `index.html` — FAQ + footer + JS cleanup
- [ ] Build FAQ accordion (reuse FAQ content; good for AEO) + minimal footer with Play Store badge + legal links (`ai.jeenius.tech`).
- [ ] Wire/keep JS: dark toggle, mobile menu, scroll-reveal, smooth scroll, floating mobile CTA. **Delete** confetti, hero canvas grid, particles, scan-line, countdown JS + their DOM.
- [ ] Verify (browser): no console errors; dark toggle persists; mobile menu opens; floating CTA appears on scroll; reduced-motion honored.
- [ ] Commit: `feat: index FAQ/footer + remove dead effects`

### Task 7: Full verification of `index.html`
- [ ] Browser matrix: {light,dark} × {375px mobile, 1280px desktop} screenshots — confirm calm, coherent, ≤9 sections.
- [ ] SEO: diff `<head>`; confirm all JSON-LD blocks byte-identical; `<title>`/canonical intact.
- [ ] Links: every `href` resolves (store, legal, anchors); no `href="#"` dead CTAs except intended.
- [ ] Accessibility quick pass: headings order, alt text, contrast (gold uses `--gold-ink` on light), focus states.
- [ ] Commit any fixes: `fix: index redesign verification pass`

### Task 8: `about.html` — apply system
**Files:** Modify `jeenius/landing/about.html`
- [ ] Link `app.css` + fonts; swap to shared nav/footer; restyle body content to Calm focus; keep `<head>` SEO.
- [ ] Verify (browser): consistent with index light/dark/mobile; head diff clean.
- [ ] Commit: `feat: restyle about page (calm focus)`

### Task 9: `prediction-engine.html` — apply system
**Files:** Modify `jeenius/landing/prediction-engine.html`
- [ ] Same treatment; preserve any page-specific JSON-LD/meta and functionality.
- [ ] Verify (browser) + head diff.
- [ ] Commit: `feat: restyle prediction-engine page`

### Task 10: `prediction-results.html` — apply system
**Files:** Modify `jeenius/landing/prediction-results.html`
- [ ] Same treatment; preserve the proof/results data + JSON-LD.
- [ ] Verify (browser) + head diff.
- [ ] Commit: `feat: restyle prediction-results page`

### Task 11: Cross-page final pass
- [ ] Nav/footer consistent across all 4 pages; shared CSS only (no per-page drift).
- [ ] Spot-check all internal links between pages.
- [ ] Final screenshots of all 4 pages (light/dark) for the user.
- [ ] Commit: `chore: cross-page consistency pass`; offer PR via finishing-a-development-branch.

## Self-Review
- **Spec coverage:** §3 visual → T1; §4 IA + §5 copy → T2–T6; §6 mobile/perf → T2–T7 verify; §7 trust → T4; §8 impl shape → T1 + per-page; §9 success criteria → T7/T11. Scope §1 (4 pages) → T2–T10. ✓
- **Placeholders:** none; unverified numbers handled by the `TODO(confirm)` constraint. ✓
- **Consistency:** token + class names defined in T1 are reused verbatim downstream. ✓
