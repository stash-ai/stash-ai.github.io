# JEEnius Brand Site — Design Spec

**Date:** 2026-07-03
**Author:** Sahil Singh (with Claude)
**Status:** Draft for review
**Branch:** `feat/jeenius-brand-site`

## 1. Problem & Goal

JEEnius is becoming a **brand with two products** — JEE JEEnius (engineering / IIT) and
NEET JEEnius (medical / MBBS) — but there is **no brand-level front door**. Today the domain
root (`index.html`) is a "Stash AI" corporate page, and each product has its own complete
landing (`jee-jeenius/landing/`, `neet-jeenius/landing/`). A visitor who lands on "JEEnius"
has nowhere that explains the brand and routes them to the right product.

**Goal:** Build a small, beautiful **4-page brand site** that introduces JEEnius, tells the
shared "why AI-powered prep" story once, and hands off to each product landing — in the same
calm, low-cognitive-load design language as the JEE page, while representing both products
with equal care.

### Decisions locked with stakeholder
- **Scope:** Full brand site — **Home + About + Products + Contact**, shared header/footer.
- **Placement:** A **separate new page/folder**, additive. The current root (Stash AI) and the
  two product landings are **not** modified.
- **Visual direction:** **"A — Warm editorial umbrella"** with the B refinement — the JEE
  calm-focus palette (cream + forest-green + gold) is the master brand, and **each product owns
  its own accent** inside its card/spotlight (JEE green/gold, NEET teal/coral). Rejected: B
  (neutral/equal-peers — cooler, less distinctive) and C (duotone split — fights the calm,
  one-idea-per-screen principle).
- **Tone:** Calm, confident, honest. No FOMO/countdowns/urgency (consistent with prior verticals).
- **Tech:** Static HTML + Tailwind CDN, no build step (matches the rest of the repo + Netlify).

### Defaults chosen (stakeholder said "continue")
- **Folder:** `jeenius-brand/landing/`.
- **Canonical/public URL:** placeholder, flagged `TODO(confirm)` in code — promoting the brand
  to a root domain is a separate decision.
- **Contact form:** Netlify Forms (`data-netlify="true"`) with a `mailto:` fallback.
- **Logo:** reuse the "JEEnius" Fraunces wordmark + existing `jeenius.webp` mark (no new logo).

## 2. Design principles (inherited)
From the JEE calm-focus system and the locked JEEnius feedback:
1. One calm idea per section; generous whitespace; skim-in-30s.
2. Relief over threat — no sirens, countdowns, or stat-stacking.
3. Real, verifiable numbers only; anything unconfirmed is `TODO(confirm)` in code, never invented.
4. Gold used sparingly (~once per viewport). Product accents scoped to product zones only.
5. Genuine dark mode + reduced-motion support are features, not afterthoughts.

## 3. Visual system — "Calm focus", extended for two products

### 3.1 Base tokens (forked from `jee-jeenius/landing/assets/app.css`)
Light: `--canvas #F6F4EF` · `--surface #FFFFFF` · `--surface-2 #FBFAF5` · `--ink #0F201D` ·
`--ink-soft #4A5A55` · `--green #1B3B36` · `--gold #FFD700` · `--gold-ink #8A6A00` ·
`--sage #DCEFD8` · `--mint #EAF3EF` · `--line #E8E3D8`.
Dark (`.dark`, OS-preference-aware + toggle): fork the JEE `.dark` block. localStorage key
`jeenius-brand-dark-mode` (distinct from `jeenius-dark-mode` / `neet-jeenius-dark-mode`).

### 3.2 New product-accent tokens
- JEE: `--jee #1B3B36` (green) · `--jee-gold #FFD700`.
- NEET: `--neet #006A65` (teal) · `--neet-bright #14A89D` · `--neet-coral #E63946`.
- Applied only via `.accent-jee` / `.accent-neet` scopes on product cards, spotlight bands,
  and the products comparison columns. The rest of the site stays green/gold.

### 3.3 Typography, layout, motion
- **Fraunces** (display, weights 400/500/600) + **Plus Jakarta Sans** (body, 400/500/600/700/800).
- Max width 1200px; section rhythm ~96px desktop / 64px mobile; radius 16–24px; hairline borders;
  soft shadows; bento grid for the shared-capabilities section.
- Motion: gentle fade/slide-up reveal, soft hover lift; `prefers-reduced-motion` fully respected.
- Sentence case everywhere except tiny letter-spaced eyebrow labels.

## 4. Information architecture

### 4.1 Home (`index.html`) — the hub (8 sections)
1. **Nav** (shared) — JEEnius wordmark · Products · About · Contact · dark toggle · one CTA.
2. **Hero + product picker** — brand promise ("Built by IITians — for JEE and NEET"), one quiet
   proof chip, and the two-path **JEE / NEET picker** as the primary action.
3. **One engine, two exams** — the shared "why AI prep" story as a bento: real PYQs,
   step-by-step AI reasoning (o-series + Fathom AI), prediction engine, NTA/NEET-style mocks,
   focus/dark mode.
4. **JEE JEEnius spotlight** — `.accent-jee` band: Main & Advanced, 2002–2025 PYQs, the "92% of
   JEE 2026 topics" proof → "Explore JEE JEEnius →" to the JEE landing.
5. **NEET JEEnius spotlight** — `.accent-neet` band: Biology-led + Physics/Chemistry, PYQs,
   clinical-calm → "Explore NEET JEEnius →" to the NEET landing.
6. **Proof & credibility** — "Built by IITians, for future IITians", real prediction stats, Play
   rating, "a Stash AI product", and the honesty disclaimer (predicts patterns not the exact
   paper; not affiliated with NTA/NMC or any exam body).
7. **Common questions** — brand-level FAQ (JEE vs NEET JEEnius? one app or two? who's behind it?
   what does it cost? → link to each product's pricing).
8. **Footer** (shared) — mark, one-liner, product links, app-store links, company
   (About/Contact/Stash AI), legal (privacy/terms/refund on `ai.jeenius.tech`), support email.

### 4.2 About (`about.html`)
Hero mission ("Built by IITians, for future IITians") → why JEEnius exists (prep is anxious and
generic; the belief in calm, PYQ-grounded, AI-personalised prep) → how the engine works
(reasoning models incl. Fathom AI, prediction methodology + honesty) → the two products (brief,
linked) → part of Stash AI → values (student-first, honest, low-stress). **No invented team
bios or testimonials.**

### 4.3 Products (`products.html`)
"Two exams. One AI engine." → **side-by-side JEE vs NEET** comparison (audience, subjects, PYQ
range, mock style, prediction proof, entry price, CTA to each landing) with each column in its
accent world → a "what's shared" row (same engine: PYQs, step-by-step AI, prediction, dark mode,
built by IITians) → a "not sure which?" helper (engineering → JEE, medicine → NEET) → CTA band.

### 4.4 Contact (`contact.html`)
"Get in touch." → support email `support@jeenius.tech`, X `@jeenius_ai`, Play Store links,
response-time note → a **contact form** (Netlify Forms: name, email, which product, message)
with a `mailto:` fallback so it never dead-ends → small support FAQ → footer.

## 5. Shared implementation shape (static, no build)
- **`jeenius-brand/landing/assets/app.css`** — fork the JEE `app.css` (base tokens + all component
  classes: `.btn`, `.card`, `.bento`, `.chip`, `.pill`, `.eyebrow`, `.price-card`, `.faq-item`,
  `.nav`, `.footer`, `.floating-cta`, `.reveal`) and add the product-accent tokens/scopes (§3.2).
- **`jeenius-brand/landing/assets/app.js`** — reuse the JEE behaviours: dark toggle
  (`jeenius-brand-dark-mode`), mobile menu, nav-scroll, scroll-reveal, count-up, FAQ accordion,
  analytics wrapper.
- **Header/footer** are repeated static markup on each of the 4 pages (no partial-include /
  build tooling), matching how `jee-jeenius` and `neet-jeenius` already work.
- **Preview:** add a `jeenius-brand-landing` entry to `.claude/launch.json`
  (`python -m http.server` in `jeenius-brand/landing`, port 8755).
- **Netlify:** additive only — no change to the current publish dir or redirects.

## 6. Copy, trust & SEO
- **Copy:** calm and concrete; no urgency. Every quantitative claim real and verifiable (92%
  topic coverage with the Physics 97 / Chemistry 94 / Maths 83 split, 218 near-identical
  questions, Play rating); anything unconfirmed → `TODO(confirm)` in code. Honesty disclaimer on
  Home + About.
- **SEO per page:** full `<head>` — title, description, canonical (placeholder host, `TODO(confirm)`),
  OG + Twitter, theme-color `#1B3B36`, favicon `jeenius.webp`.
- **JSON-LD:** `Organization` for JEEnius (with the two products as `subOrganization`/`brand`
  and parent Stash AI), `WebSite`, `BreadcrumbList`, and `FAQPage` on Home. Product/Course
  schema stays on the product landings (not duplicated here).
- **Analytics:** reuse the `gtag` / `firebase` / `posthog` config pattern — commit the
  `*-config.example.js` files; real configs stay gitignored.

## 7. Verification & success criteria
- Live preview (port 8755) screenshots in **light + dark + mobile** for every page; console clean.
- All links resolve: JEE landing, NEET landing, app stores, legal (`ai.jeenius.tech`), socials.
- Accessibility: contrast passes, visible focus, tap targets ≥44px, font ≥16px, reduced-motion
  respected, dark-mode parity on all 4 pages.
- Contact form submits (Netlify Forms) or cleanly falls back to `mailto:`.
- Reads calm and skimmable; both products represented with equal weight; visually of a family
  with the JEE page.

## 8. Out of scope
The root Stash AI page, the two product landing pages, the Android apps, the backend
(`ai.jeenius.tech`), and any future promotion of this brand site to a root domain.
