# JEEnius Brand Site — "Living calm" elevation — Design Spec

**Date:** 2026-07-13
**Author:** Sahil Singh (with Claude)
**Status:** Implemented on `redesign/brand-living-calm` (autonomous session — review the diff + this spec together)
**Applies to:** `jeenius-brand/landing/` (index, products, about, contact + shared assets)

## 1. Problem & Goal

The brand hub (Home / Products / About / Contact) ships the calm-focus design system but
reads **static and flat** next to the JEE flagship, which carries the proven "Living calm"
motion layer. As the front door of the ecosystem it should feel *at least* as premium as
the product landings it routes to. Two real dark-mode bugs compound this: the hero
headline highlight hardcodes light-mode colors (near-unreadable in dark), and spotlight
stat numerals use dark accents on dark surfaces.

**Goal:** Bring the brand hub to flagship level — alive, crafted, jaw-droppingly calm —
while staying low-cognitive-load, honest (no FOMO, no invented numbers) and green+gold.

## 2. Approach

Reuse, don't reinvent: port the dependency-free **motion layer** from
`jee-jeenius/landing/assets/motion.js` + the motion CSS block verbatim (aurora, 3D tilt +
glare, scroll stagger, gold highlighter sweep, magnetic CTAs, cursor spotlight — all gated
behind `prefers-reduced-motion` and `(hover:hover) and (pointer:fine)`). Then spend the
new budget on **content-level richness** unique to the hub:

1. **Hero** — 3-blob aurora (sage / gold-soft / mint) with pointer lean; `hl-sweep`
   headline highlight (dark-safe override `#7FD8BE`); staggered proof chips.
2. **Product picker** — the hub's signature interaction: richer JEE/NEET cards
   (`data-tilt` + glare, subject meta row, verifiable proof line, arrow-slide CTA).
3. **Engine bento** — hierarchy instead of 4 equal tiles: featured "step-by-step AI"
   tile embeds a compact worked solution (reuses `.step` styles); "Predicted mocks" tile
   embeds a mini NTA-style palette strip (reuses `.mock` styles); count-up-ready stats.
4. **Spotlights** — eased count-ups on the verified numbers (92 / 218 / 20+), dark-mode
   stat contrast fix (`--accent-ink` in dark), tilt depth on stat clusters.
5. **Footer** — gold cursor spotlight (as on the JEE page).
6. **Subpages** — motion wiring + stagger/tilt on Products cards, About belief tiles and
   product links, Contact cards; no aurora on subpages (one signature moment per site).

Honesty guardrails: only existing verified numbers (92% topic coverage, 218 near-identical,
20+ years PYQs); NEET stays qualitative; disclaimer lines untouched.

## 3. Out of scope

New sections, pricing on the hub, constellation/canvas work, propagating the layer to the
JEE subpages (tracked separately), host/canonical decisions (`TODO(confirm)` stays).
