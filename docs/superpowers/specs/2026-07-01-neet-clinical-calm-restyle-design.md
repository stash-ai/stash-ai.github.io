# NEET JEEnius — new logo + "clinical calm" restyle

Date: 2026-07-01
Scope: `neet-jeenius/landing/` (index.html, sitemap.xml, new logo assets)

## Goal

Give NEET JEEnius a distinct, cohesive medical identity that is still visibly
part of the JEEnius family. Two deliverables:

1. A new **Vital-ring** logo — JEE's "J + dotted instrument-ring" mark, recolored
   into the NEET teal palette, fused with a coral ECG heartbeat.
2. A full visual restyle of the landing page toward "clinical calm".

## North star

Feel like a precise, trustworthy medical product — airy, confident, quietly
clinical. Keep the existing teal + ECG/DNA foundation; unify it into one system
and retire the FOMO devices (calm over urgency — consistent with prior direction).

## Logo (Vital ring)

Same geometry as JEE's mark so the family bond reads instantly:
- Dotted instrument-ring + bold geometric "J" with the triangular top flag.
- NEET palette: deep-teal tile `#053b37`, mark in near-white `#E9F7F4`.
- Medical signifier: a coral `#FF6470` ECG heartbeat replacing the bottom ring dot.

Three forms, all built as inline SVG from the same parts:
- App-icon tile → exported to `neet-jeenius.webp` (favicon/app icon) + a real
  1200×630 `og-cover` (replaces the square-logo-as-OG hack).
- Horizontal lockup "ring + NEET JEEnius AI" → navbar.
- Light-on-dark variant → footer.

## Design tokens

Introduce CSS variables and apply consistently:
- `--teal #006a65` (primary), `--teal-bright #14a89d` (accent), `--mint #d3ece9`
  (soft surface), `--coral #E63946` (vital — sparing), `--ink #0f1b1a`.
- One surface ladder (white → mint-tint → deep-teal) replacing ad-hoc
  `#f8fafa / #f2f4f4 / #e1e3e3`.

## Per-section changes

- Nav: new lockup logo, calmer frosted bar.
- Hero: keep dark-teal + ECG, reduce motif clutter, stronger type hierarchy,
  single primary CTA.
- Stat band: clean clinical "vitals" cards.
- Search archive / Prediction lab: unify card + input styling to tokens.
- Features / Adaptive flow: consistent card grid, teal iconography, more air.
- Pricing: calmer cards, clear hierarchy, no neon.
- FAQ / Resources / Footer: token-consistent; new footer logo.

## FOMO devices — REMOVE

Drop the countdown floating CTA, the confetti, and the floating gold
"NEET 2027 READY" badge. Keep a single quiet "Start practising free" CTA.

## Hard guardrails (must not regress)

- All SEO fixed earlier (OG/twitter/JSON-LD image URLs, color-scheme meta,
  sitemap) stays correct.
- All JS behavior preserved: search archive, prediction lab, pricing toggle,
  dark-mode toggle (`neet-jeenius-dark-mode`), FAQ accordions. Do not rename the
  IDs/classes these depend on.
- Full dark-mode parity (OS-preference driven).
- `prefers-reduced-motion` respected.

## Verification

Live preview (port 8754) screenshots in light + dark + mobile for every section;
console clean; then an adversarial multi-agent review of the diff for
correctness, SEO preservation, accessibility, and dark-mode parity.
