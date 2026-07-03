# JEEnius Brand Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 4-page static JEEnius brand site (Home, Products, About, Contact) that introduces the umbrella brand and routes visitors to the JEE and NEET product landings, in the JEE calm-focus design language.

**Architecture:** Static HTML + Tailwind CDN, no build step, forked from `jee-jeenius/landing/` (the "Calm focus" system). One shared `assets/app.css` (JEE tokens + new product-accent tokens) and `assets/app.js` (JEE behaviours, brand dark-mode key) linked from all 4 pages; nav + footer are repeated static markup. Additive only — the current root and the two product landings are untouched.

**Tech Stack:** HTML5, Tailwind CDN (`?plugins=forms,container-queries`), Fraunces + Plus Jakarta Sans (Google Fonts), vanilla JS, Netlify (Forms for Contact), Python `http.server` for local preview.

**Testing note (domain adaptation):** There is no unit-test framework in this repo (it's a static marketing site). The per-task "test" is **browser verification via the preview tools**: `preview_console_logs` (must be clean), `preview_snapshot` (content present), `preview_inspect` (exact CSS values), and `preview_screenshot` + `preview_resize` (light/dark/mobile). Each task ends with concrete expected outcomes, then a commit.

## Global Constraints

- **Folder:** `jeenius-brand/landing/`. Files: `index.html`, `products.html`, `about.html`, `contact.html`, `assets/app.css`, `assets/app.js`, `jeenius.webp`, `sitemap.xml`, `robots.txt`, `*-config.example.js`.
- **Palette (verbatim):** `--canvas #F6F4EF` · `--surface #FFFFFF` · `--ink #0F201D` · `--ink-soft #4A5A55` · `--green #1B3B36` · `--gold #FFD700` · `--gold-ink #8A6A00` · `--sage #DCEFD8` · `--mint #EAF3EF` · `--line #E8E3D8`. Product accents: JEE `--jee #1B3B36` / `--jee-gold #FFD700`; NEET `--neet #006A65` / `--neet-bright #14A89D` / `--neet-coral #E63946`.
- **Type:** Fraunces (display, 400/500/600) + Plus Jakarta Sans (body, 400/500/600/700/800). Sentence case except letter-spaced eyebrow labels.
- **Dark mode:** OS-preference-aware + toggle; localStorage key `jeenius-brand-dark-mode` (NOT `jeenius-dark-mode`). Full parity on all 4 pages.
- **Product URLs:** JEE → `https://landing.jeenius.tech/` · NEET → `https://neet.jeenius.tech/`.
- **App stores:** JEE → `https://play.google.com/store/apps/details?id=com.stash.jeenius&hl=en_IN` · NEET → `https://play.google.com/store/apps/details?id=com.stash.neetjeenius&hl=en_IN` (carry `TODO(NEET-APP): confirm package id` — NEET's own code flags it unverified).
- **Support/social:** `support@jeenius.tech` · `@jeenius_ai` · `@neet_jeenius_ai`.
- **Legal (unchanged, on backend):** `https://ai.jeenius.tech/privacy-policy/` · `/terms-of-service/` · `/refund-policy/`.
- **Canonical base:** `https://jeenius.tech/` — `TODO(confirm)` the final brand host.
- **Copy rules:** calm, no FOMO/countdowns/urgency. Real verifiable numbers only; unconfirmed → `TODO(confirm)` in code, never invented. Honesty disclaimer on Home + About: "JEEnius predicts topic areas and question patterns, not the exact paper, and is not affiliated with NTA, NMC or any exam body." **Do not hardcode prices** (they change per product) — say "Start free" and link to each product's pricing.
- **Real stats (JEE 2026 only, from `jee-jeenius/landing/index.html`):** 92% topic coverage (Physics 97 / Chemistry 94 / Maths 83), 218 near-identical questions, 1,284 JEE Main 2026 questions, Play rating 4.4 (34 reviews). **No invented NEET stats** — NEET claims stay qualitative.
- **Motion/a11y:** gentle reveal only; `prefers-reduced-motion` respected; tap targets ≥44px; body font ≥16px; visible focus.

---

## Task 1: Scaffold folder + shared assets (CSS/JS/logo/launch)

**Files:**
- Create: `jeenius-brand/landing/assets/app.css` (fork of JEE + accent tokens)
- Create: `jeenius-brand/landing/assets/app.js` (fork of JEE, brand dark key)
- Create: `jeenius-brand/landing/jeenius.webp` (copy of JEE mark)
- Modify: `.claude/launch.json` (add `jeenius-brand-landing`, port 8755)

**Interfaces:**
- Produces: the token set + component classes (`.btn`, `.card`, `.bento .tile`, `.chip`, `.pill`, `.eyebrow`, `.section-title`, `.lead`, `.nav`, `.mobile-menu`, `.footer`, `.faq-item`, `.reveal`, `.floating-cta`, `.icon-btn`) and the accent scopes (`.accent-jee`, `.accent-neet`, `.product-card`, `.spotlight`) that all pages consume; JS behaviours `initDarkMode/initMobileMenu/initReveal/initFaq/track` keyed to shared IDs.

- [ ] **Step 1: Create the folder and fork the CSS/JS/logo**

```bash
cd /Users/sahilsingh/Codebase/jeenius/website
mkdir -p jeenius-brand/landing/assets
cp jee-jeenius/landing/assets/app.css jeenius-brand/landing/assets/app.css
cp jee-jeenius/landing/assets/app.js  jeenius-brand/landing/assets/app.js
cp jee-jeenius/landing/jeenius.webp   jeenius-brand/landing/jeenius.webp
cp jee-jeenius/landing/google-tag-config.example.js jeenius-brand/landing/google-tag-config.example.js
cp jee-jeenius/landing/posthog-config.example.js     jeenius-brand/landing/posthog-config.example.js 2>/dev/null || true
cp jee-jeenius/landing/firebase-config.example.js    jeenius-brand/landing/firebase-config.example.js 2>/dev/null || true
```

- [ ] **Step 2: Append product-accent tokens to `assets/app.css`**

Append at the end of `jeenius-brand/landing/assets/app.css`:

```css
/* ---------- product-accent tokens (brand site) ---------- */
:root {
  --jee: #1B3B36; --jee-gold: #FFD700;
  --neet: #006A65; --neet-bright: #14A89D; --neet-coral: #E63946;
}
.dark { --jee: #2E5A52; --neet: #14A89D; --neet-coral: #FF6470; }

.accent-jee  { --accent: var(--jee);  --accent-ink: var(--green);   --accent-soft: var(--sage); }
.accent-neet { --accent: var(--neet); --accent-ink: var(--neet);    --accent-soft: #D3ECE9; }
.dark .accent-neet { --accent-soft: #0F2E2B; }

/* product picker + spotlight */
.pick { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
@media (max-width: 680px) { .pick { grid-template-columns: 1fr; } }
.product-card {
  background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-lg);
  padding: 26px; box-shadow: var(--shadow-sm);
  border-top: 3px solid var(--accent);
  transition: transform .3s var(--ease), box-shadow .3s var(--ease), border-color .3s var(--ease);
}
.product-card:hover { transform: translateY(-4px); box-shadow: var(--shadow); }
.product-badge {
  display: inline-flex; align-items: center; gap: 6px; font-size: 11.5px; font-weight: 800;
  letter-spacing: .04em; text-transform: uppercase; padding: 5px 11px; border-radius: 999px;
  background: var(--accent-soft); color: var(--accent-ink);
}
.spotlight { background: var(--accent-soft); }
.on-accent { background: var(--accent); color: #fff; }
```

- [ ] **Step 3: Rename the dark-mode localStorage key in `assets/app.js`**

In `jeenius-brand/landing/assets/app.js`, replace every occurrence of `jeenius-dark-mode` with `jeenius-brand-dark-mode`.

```bash
cd /Users/sahilsingh/Codebase/jeenius/website
sed -i '' 's/jeenius-dark-mode/jeenius-brand-dark-mode/g' jeenius-brand/landing/assets/app.js
grep -c 'jeenius-brand-dark-mode' jeenius-brand/landing/assets/app.js   # expect >= 1
grep -c "'jeenius-dark-mode'" jeenius-brand/landing/assets/app.js || true  # expect 0
```

> Note: if `jee-jeenius/landing/index.html` uses an inline (not `app.js`) dark-mode read, Task 2's `<head>` inline script (Step shown there) is the source of truth for the key. Confirm the key string is `jeenius-brand-dark-mode` wherever it appears.

- [ ] **Step 4: Add the preview server to `.claude/launch.json`**

Add this object to the `configurations` array in `.claude/launch.json`:

```json
{
  "name": "jeenius-brand-landing",
  "runtimeExecutable": "sh",
  "runtimeArgs": ["-c", "cd jeenius-brand/landing && python3 -m http.server 8755"],
  "port": 8755
}
```

- [ ] **Step 5: Commit**

```bash
git add jeenius-brand/landing/assets jeenius-brand/landing/jeenius.webp jeenius-brand/landing/*.example.js .claude/launch.json
git commit -m "JEEnius brand: scaffold folder, fork calm-focus assets + accent tokens"
```

---

## Task 2: Shared nav + footer + Home shell (head, SEO, JSON-LD)

**Files:**
- Create: `jeenius-brand/landing/index.html` (head + nav + empty `<main>` + footer + script tags)

**Interfaces:**
- Produces: the canonical **nav** and **footer** markup blocks (copied verbatim into `products.html`, `about.html`, `contact.html` in later tasks) and the standard `<head>` block (per-page title/description/canonical differ; structure identical). Consumes Task 1 CSS/JS.

- [ ] **Step 1: Create `index.html` with head + brand chrome**

Create `jeenius-brand/landing/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">

  <title>JEEnius — AI-powered JEE &amp; NEET prep, built by IITians</title>
  <meta name="description" content="JEEnius is AI-powered exam prep for India's toughest entrance exams. JEE JEEnius for engineering, NEET JEEnius for medical — real PYQs, step-by-step AI solutions and predicted mocks.">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" href="https://jeenius.tech/"><!-- TODO(confirm) final brand host -->
  <meta name="theme-color" content="#1B3B36">
  <link rel="icon" type="image/webp" href="jeenius.webp">
  <link rel="apple-touch-icon" href="jeenius.webp">

  <meta property="og:type" content="website">
  <meta property="og:site_name" content="JEEnius">
  <meta property="og:title" content="JEEnius — AI-powered JEE &amp; NEET prep, built by IITians">
  <meta property="og:description" content="One brand, two exams. JEE JEEnius for engineering and NEET JEEnius for medical — real PYQs, step-by-step AI solutions and predicted mocks.">
  <meta property="og:url" content="https://jeenius.tech/"><!-- TODO(confirm) -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@jeenius_ai">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
  <script>
    tailwind.config = { darkMode: 'class', theme: { extend: {
      colors: { canvas:'var(--canvas)', surface:'var(--surface)', ink:'var(--ink)', green:'var(--green)', gold:'var(--gold)' },
      fontFamily: { sans:['"Plus Jakarta Sans"','sans-serif'], display:['Fraunces','Georgia','serif'] },
      maxWidth: { content:'1200px' }
    } } }
  </script>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/app.css">
  <script>(function(){try{if(localStorage.getItem('jeenius-brand-dark-mode')==='true')document.documentElement.classList.add('dark');}catch(e){}})();</script>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://jeenius.tech/#organization",
        "name": "JEEnius",
        "alternateName": ["Jeenius", "JEEnius AI"],
        "url": "https://jeenius.tech/",
        "logo": "https://jeenius.tech/jeenius.webp",
        "sameAs": ["https://x.com/jeenius_ai"],
        "parentOrganization": { "@type": "Organization", "name": "Stash AI", "url": "https://stash.ai/" },
        "subOrganization": [
          { "@type": "EducationalOrganization", "name": "JEE JEEnius", "url": "https://landing.jeenius.tech/" },
          { "@type": "EducationalOrganization", "name": "NEET JEEnius", "url": "https://neet.jeenius.tech/" }
        ],
        "contactPoint": [{ "@type": "ContactPoint", "email": "support@jeenius.tech", "contactType": "customer support", "areaServed": "IN" }]
      },
      {
        "@type": "WebSite",
        "@id": "https://jeenius.tech/#website",
        "url": "https://jeenius.tech/",
        "name": "JEEnius",
        "publisher": { "@id": "https://jeenius.tech/#organization" },
        "inLanguage": "en-IN"
      }
    ]
  }
  </script>
</head>
<body>

  <nav class="nav" id="nav">
    <div class="wrap" style="display:flex; align-items:center; justify-content:space-between; width:100%;">
      <a href="index.html" class="brand"><img src="jeenius.webp" alt="JEEnius logo" width="32" height="32"> JEEnius</a>
      <div class="hidden md:flex items-center" style="gap:30px;">
        <a href="products.html" class="nav-link">Products</a>
        <a href="about.html" class="nav-link">About</a>
        <a href="contact.html" class="nav-link">Contact</a>
      </div>
      <div class="flex items-center" style="gap:12px;">
        <button id="darkModeToggle" class="icon-btn" aria-label="Toggle dark mode">
          <svg id="sunIcon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.36 6.36l-.7-.7M6.34 6.34l-.7-.7m12.72 0l-.7.7M6.34 17.66l-.7.7M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          <svg id="moonIcon" class="hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.35 15.35A9 9 0 018.65 3.65 9 9 0 1020.35 15.35z"></path></svg>
        </button>
        <a href="#pick" class="btn btn-primary hidden sm:inline-flex" style="padding:11px 20px; font-size:14.5px;">Choose your exam</a>
        <button class="icon-btn md:hidden" id="mobileMenuBtn" aria-label="Open menu">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
      </div>
    </div>
  </nav>
  <div class="mobile-menu" id="mobileMenu">
    <a href="products.html">Products</a>
    <a href="about.html">About</a>
    <a href="contact.html">Contact</a>
    <a href="#pick" class="btn btn-primary" style="margin-top:12px;">Choose your exam</a>
  </div>

  <main id="top"><!-- SECTIONS ADDED IN TASKS 3-4 --></main>

  <footer class="footer">
    <div class="wrap">
      <div class="footer-cols">
        <div>
          <a href="index.html" class="brand" style="color:#fff;"><img src="jeenius.webp" alt="JEEnius" width="32" height="32"> JEEnius</a>
          <p style="margin:16px 0 20px; max-width:34ch; font-size:14.5px; color:#9FB5AE;">AI-powered prep for India's toughest entrance exams — built by IITians. A Stash AI product.</p>
        </div>
        <div>
          <h4 style="color:#fff; font-size:14px; margin-bottom:14px;">Products</h4>
          <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:10px; font-size:14px;">
            <li><a href="https://landing.jeenius.tech/">JEE JEEnius</a></li>
            <li><a href="https://neet.jeenius.tech/">NEET JEEnius</a></li>
            <li><a href="products.html">Compare</a></li>
          </ul>
        </div>
        <div>
          <h4 style="color:#fff; font-size:14px; margin-bottom:14px;">Company</h4>
          <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:10px; font-size:14px;">
            <li><a href="about.html">About</a></li>
            <li><a href="contact.html">Contact</a></li>
            <li><a href="https://stash.ai/">Stash AI</a></li>
          </ul>
        </div>
        <div>
          <h4 style="color:#fff; font-size:14px; margin-bottom:14px;">Legal</h4>
          <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:10px; font-size:14px;">
            <li><a href="https://ai.jeenius.tech/privacy-policy/" target="_blank" rel="noopener">Privacy Policy</a></li>
            <li><a href="https://ai.jeenius.tech/terms-of-service/" target="_blank" rel="noopener">Terms of Service</a></li>
            <li><a href="https://ai.jeenius.tech/refund-policy/" target="_blank" rel="noopener">Cancellation Policy</a></li>
          </ul>
        </div>
      </div>
      <div style="border-top:1px solid rgba(255,255,255,.1); margin-top:40px; padding-top:24px; display:flex; flex-wrap:wrap; gap:12px; justify-content:space-between; font-size:13px; color:#9FB5AE;">
        <span>© 2026 JEEnius · A Stash AI product</span>
        <a href="mailto:support@jeenius.tech">support@jeenius.tech</a>
      </div>
    </div>
  </footer>

  <script src="assets/app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Confirm `assets/app.js` binds the shared IDs**

Open `jeenius-brand/landing/assets/app.js` and confirm it wires `#darkModeToggle` (+ `#sunIcon`/`#moonIcon`), `#mobileMenuBtn`/`#mobileMenu`, `#nav` scroll, and `.reveal`. If any behaviour is inline-only in the JEE `index.html` (not in `app.js`), port that snippet into `app.js` so the brand pages share one script. Expected: opening the page runs no missing-element errors.

- [ ] **Step 3: Start the preview server and verify the shell**

Use `preview_start` with name `jeenius-brand-landing`. Then:
- `preview_console_logs` (level error) → Expected: empty.
- `preview_snapshot` → Expected: nav shows "JEEnius", "Products", "About", "Contact", "Choose your exam"; footer shows the 4 columns + "support@jeenius.tech".
- `preview_click` `#darkModeToggle`, then `preview_inspect` `body` `background-color` → Expected: switches to the dark canvas; toggle again returns to cream.
- `preview_click` `#mobileMenuBtn` after `preview_resize` preset `mobile` → Expected: `#mobileMenu` gains `.open` (snapshot shows the links).

- [ ] **Step 4: Commit**

```bash
git add jeenius-brand/landing/index.html
git commit -m "JEEnius brand: Home shell — head/SEO/JSON-LD, shared nav + footer"
```

---

## Task 3: Home — hero + product picker + "one engine" bento

**Files:**
- Modify: `jeenius-brand/landing/index.html` (replace the `<main>` placeholder comment with the hero + engine sections)

**Interfaces:**
- Consumes: `.accent-jee` / `.accent-neet` / `.product-card` / `.product-badge` from Task 1; nav anchor `#pick`.
- Produces: `id="pick"` (nav CTA target), the hero and `#engine` sections.

- [ ] **Step 1: Insert the hero + picker + bento into `<main>`**

Replace `<!-- SECTIONS ADDED IN TASKS 3-4 -->` with:

```html
<header class="section" style="position:relative; padding-top:clamp(94px,11vw,140px); overflow:hidden;">
  <div class="glow" style="width:520px; height:520px; background:var(--sage); top:-140px; right:-120px;"></div>
  <div class="wrap" style="position:relative; z-index:1;">
    <div class="reveal" style="text-align:center; max-width:760px; margin:0 auto;">
      <span class="eyebrow" style="justify-content:center;">Built by IITians · AI-powered prep</span>
      <h1 class="font-display" style="font-size:clamp(40px,6vw,66px); margin:18px 0 0; font-weight:500;">
        One home for <span style="color:var(--green); background:linear-gradient(transparent 72%, rgba(255,215,0,.5) 72%);">JEE and NEET</span>
      </h1>
      <p class="lead" style="margin:22px auto 0;">Real previous-year questions, step-by-step AI solutions and predicted mocks — for India's two toughest entrance exams. Pick your path.</p>
    </div>

    <div id="pick" class="pick reveal" style="margin:44px auto 0; max-width:820px; scroll-margin-top:90px;">
      <div class="product-card accent-jee">
        <span class="product-badge">Engineering · IIT</span>
        <h2 class="font-display" style="font-size:26px; font-weight:600; margin:14px 0 6px;">JEE JEEnius</h2>
        <p style="color:var(--ink-soft); font-size:15px; margin:0 0 18px;">JEE Main &amp; Advanced. 20+ years of PYQs (2002–2025), AI-predicted mocks and 24×7 doubt solving.</p>
        <a href="https://landing.jeenius.tech/" class="btn btn-primary" style="background:var(--accent);">Explore JEE JEEnius
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg></a>
      </div>
      <div class="product-card accent-neet">
        <span class="product-badge">Medical · MBBS</span>
        <h2 class="font-display" style="font-size:26px; font-weight:600; margin:14px 0 6px;">NEET JEEnius</h2>
        <p style="color:var(--ink-soft); font-size:15px; margin:0 0 18px;">NEET-UG across Biology, Physics and Chemistry. Real PYQs, predicted mocks and step-by-step AI solutions.</p>
        <a href="https://neet.jeenius.tech/" class="btn btn-primary" style="background:var(--accent);">Explore NEET JEEnius
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg></a>
      </div>
    </div>

    <div class="flex flex-wrap items-center justify-center reveal" style="gap:12px; margin-top:28px;">
      <span class="chip"><span class="dot"></span>Same AI engine · two exams</span>
      <span class="chip">92% of JEE 2026 topics predicted</span>
    </div>
  </div>
</header>

<section id="engine" class="section" style="background:var(--surface-2);">
  <div class="wrap">
    <div class="reveal" style="text-align:center; max-width:680px; margin:0 auto 44px;">
      <span class="eyebrow">One engine, two exams</span>
      <h2 class="section-title font-display" style="margin:14px 0 12px;">The same AI does the heavy lifting</h2>
      <p class="lead" style="margin:0 auto;">Whichever exam you're preparing for, JEEnius runs on one engine — grounded in real papers, not generic content.</p>
    </div>
    <div class="bento reveal">
      <div class="tile col-6"><span class="tile-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10a2 2 0 002 2h12a2 2 0 002-2V7M4 7l2-3h12l2 3M4 7h16M9 12h6"></path></svg></span><h3 style="font-size:20px; font-weight:600; margin-bottom:8px;">Real PYQs</h3><p style="color:var(--ink-soft); font-size:15px;">Decades of actual previous-year questions, searchable by year, subject and topic.</p></div>
      <div class="tile col-6"><span class="tile-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.66 17h4.68M12 3a6 6 0 00-3.6 10.8c.37.28.6.7.6 1.15V16h6v-1.05c0-.45.23-.87.6-1.15A6 6 0 0012 3z"></path></svg></span><h3 style="font-size:20px; font-weight:600; margin-bottom:8px;">Step-by-step AI solutions</h3><p style="color:var(--ink-soft); font-size:15px;">See the reasoning, not just the answer — powered by reasoning models including Fathom AI.</p></div>
      <div class="tile col-6"><span class="tile-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg></span><h3 style="font-size:20px; font-weight:600; margin-bottom:8px;">Predicted mocks</h3><p style="color:var(--ink-soft); font-size:15px;">Full-length mocks in a real exam-style interface, focused on what's most likely to appear.</p></div>
      <div class="tile col-6"><span class="tile-icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.35 15.35A9 9 0 018.65 3.65 9 9 0 1020.35 15.35z"></path></svg></span><h3 style="font-size:20px; font-weight:600; margin-bottom:8px;">Focus &amp; dark mode</h3><p style="color:var(--ink-soft); font-size:15px;">A calm, distraction-free space designed for long, late-night study sessions.</p></div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Verify hero + picker + bento**

Reload (HMR is off for static; use `preview_eval` `window.location.reload()`), then:
- `preview_console_logs` (error) → Expected: empty.
- `preview_snapshot` → Expected: H1 "One home for JEE and NEET"; two product cards "JEE JEEnius" and "NEET JEEnius"; four bento tiles.
- `preview_inspect` `.accent-jee .btn-primary` `background-color` → Expected: `rgb(27, 59, 54)` (`#1B3B36`). `preview_inspect` `.accent-neet .btn-primary` `background-color` → Expected: `rgb(0, 106, 101)` (`#006A65`).
- Verify the two card CTAs' `href` are `https://landing.jeenius.tech/` and `https://neet.jeenius.tech/` (snapshot/inspect).
- `preview_click` nav "Choose your exam" → Expected: scrolls to `#pick`.

- [ ] **Step 3: Commit**

```bash
git add jeenius-brand/landing/index.html
git commit -m "JEEnius brand: Home hero + product picker + one-engine bento"
```

---

## Task 4: Home — product spotlights + proof + FAQ

**Files:**
- Modify: `jeenius-brand/landing/index.html` (append sections after `#engine`)
- Modify: `jeenius-brand/landing/assets/app.js` (ensure FAQ accordion is bound — port from JEE if inline)

**Interfaces:**
- Consumes: `.accent-jee`/`.accent-neet`, `.spotlight`, `.faq-item` (+ its accordion JS).
- Produces: `#jee`, `#neet`, `#proof`, `#faq` sections.

- [ ] **Step 1: Append the two spotlights + proof + FAQ**

Insert after the `#engine` section's closing `</section>`:

```html
<section id="jee" class="section spotlight accent-jee">
  <div class="wrap">
    <div class="grid lg:grid-cols-2 items-center" style="gap:56px;">
      <div class="reveal">
        <span class="product-badge">JEE JEEnius · Engineering</span>
        <h2 class="section-title font-display" style="margin:14px 0 14px;">Walk into JEE knowing what to study</h2>
        <p class="lead">JEE Main (2002–2025) and Advanced (2007–2025) PYQs, AI-predicted mocks and step-by-step solutions. On JEE Main 2026 our predictions covered <strong>92% of the topics</strong> that appeared (Physics 97%, Chemistry 94%, Maths 83%), with 218 near-identical questions.</p>
        <a href="https://landing.jeenius.tech/" class="btn btn-primary" style="background:var(--accent); margin-top:24px;">Explore JEE JEEnius
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg></a>
      </div>
      <div class="reveal grid grid-cols-3" style="gap:12px;">
        <div class="stat-box"><div class="num">92%</div><div class="lbl">JEE 2026 topic coverage</div></div>
        <div class="stat-box"><div class="num">218</div><div class="lbl">Near-identical questions</div></div>
        <div class="stat-box"><div class="num">20+</div><div class="lbl">Years of PYQs</div></div>
      </div>
    </div>
  </div>
</section>

<section id="neet" class="section spotlight accent-neet">
  <div class="wrap">
    <div class="grid lg:grid-cols-2 items-center" style="gap:56px;">
      <div class="reveal" style="order:2;">
        <span class="product-badge">NEET JEEnius · Medical</span>
        <h2 class="section-title font-display" style="margin:14px 0 14px;">Precise, trustworthy NEET practice</h2>
        <p class="lead">NEET-UG across Biology, Physics and Chemistry — real PYQs, predicted mocks and step-by-step AI solutions, in a clean, clinical-calm interface built for medical aspirants.</p>
        <a href="https://neet.jeenius.tech/" class="btn btn-primary" style="background:var(--accent); margin-top:24px;">Explore NEET JEEnius
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg></a>
      </div>
      <div class="reveal" style="order:1;">
        <div class="grid grid-cols-3" style="gap:12px;">
          <div class="stat-box"><div class="num">3</div><div class="lbl">Subjects: Bio · Phys · Chem</div></div>
          <div class="stat-box"><div class="num">PYQs</div><div class="lbl">Real previous papers</div></div>
          <div class="stat-box"><div class="num">AI</div><div class="lbl">Step-by-step solutions</div></div>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="proof" class="section">
  <div class="wrap">
    <div class="reveal" style="text-align:center; max-width:720px; margin:0 auto 8px;">
      <span class="eyebrow" style="justify-content:center;">Why JEEnius</span>
      <h2 class="section-title font-display" style="margin:14px 0 14px;">Built by IITians, for future IITians and doctors</h2>
      <p class="lead" style="margin:0 auto 8px;">JEEnius is a Stash AI product. Our engine includes Fathom AI — a perfect scorer on JEE Advanced 2025 — and is verified by IITian faculty.</p>
      <p style="font-size:12px; color:var(--ink-faint); max-width:60ch; margin:8px auto 0;">JEEnius predicts topic areas and question patterns, not the exact paper, and is not affiliated with NTA, NMC or any exam body.</p>
    </div>
  </div>
</section>

<section id="faq" class="section" style="background:var(--surface-2);">
  <div class="wrap" style="max-width:820px;">
    <div class="reveal" style="text-align:center; margin-bottom:36px;">
      <span class="eyebrow" style="justify-content:center;">FAQ</span>
      <h2 class="section-title font-display" style="margin:14px 0 0;">Questions, answered</h2>
    </div>
    <div class="reveal">
      <div class="faq-item"><button class="faq-q">What's the difference between JEE JEEnius and NEET JEEnius?<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></button><div class="faq-a">JEE JEEnius is for engineering aspirants (JEE Main &amp; Advanced); NEET JEEnius is for medical aspirants (NEET-UG). Both run on the same AI engine — real PYQs, step-by-step solutions and predicted mocks — tuned to each exam.</div></div>
      <div class="faq-item"><button class="faq-q">Is it one app or two?<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></button><div class="faq-a">Two focused apps — one for JEE, one for NEET — so each experience is tailored to that exam. Pick the one that matches your goal from the cards above.</div></div>
      <div class="faq-item"><button class="faq-q">Who is behind JEEnius?<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></button><div class="faq-a">JEEnius is built by IITians and is a product of Stash AI, which builds human-centric AI tools. Our engine includes reasoning models fine-tuned for high-level exam problems.</div></div>
      <div class="faq-item"><button class="faq-q">How much does it cost?<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></button><div class="faq-a">Both products are free to start, with paid plans that unlock unlimited AI solutions and predicted mocks. See current pricing on each product: <a href="https://landing.jeenius.tech/#pricing" style="color:var(--gold-ink); font-weight:700;">JEE pricing</a> · <a href="https://neet.jeenius.tech/#pricing" style="color:var(--gold-ink); font-weight:700;">NEET pricing</a>.</div></div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Ensure FAQ accordion JS is present**

Confirm `assets/app.js` binds `.faq-q` clicks to toggle `.faq-item.active` (port the snippet from JEE `index.html` if it was inline). Expected: clicking a question expands its answer.

- [ ] **Step 3: Verify full Home in light + dark + mobile**

- `preview_console_logs` (error) → empty.
- `preview_snapshot` → Expected: `#jee`, `#neet`, `#proof`, `#faq` present; JEE stats "92% / 218 / 20+"; the honesty disclaimer text present.
- `preview_inspect` `#jee` `background-color` → Expected sage; `#neet` `background-color` → Expected NEET mint (`#D3ECE9`).
- `preview_click` first `.faq-q` → snapshot shows the answer.
- `preview_resize` preset `mobile` → `preview_screenshot`: spotlights stack, product cards single-column.
- `preview_resize` colorScheme `dark` (and toggle) → `preview_screenshot`: dark parity, text readable on both spotlight bands.

- [ ] **Step 4: Commit**

```bash
git add jeenius-brand/landing/index.html jeenius-brand/landing/assets/app.js
git commit -m "JEEnius brand: Home spotlights + proof + FAQ"
```

---

## Task 5: Products page (side-by-side comparison)

**Files:**
- Create: `jeenius-brand/landing/products.html`

**Interfaces:**
- Consumes: shared nav/footer (from Task 2), `.accent-jee`/`.accent-neet`, `.product-card`.

- [ ] **Step 1: Create `products.html`**

Copy `index.html`, then (a) change `<title>` to `JEEnius — JEE vs NEET | Compare our two AI prep products`, its `<meta name="description">` to `Compare JEE JEEnius and NEET JEEnius — audience, subjects, PYQs, mocks and pricing. Same AI engine, tuned to each exam.`, and the canonical to `https://jeenius.tech/products.html` (`TODO(confirm)`); (b) drop the home-only JSON-LD `WebSite` node (keep `Organization`); (c) replace `<main>`'s content with:

```html
<section class="section" style="padding-top:clamp(94px,11vw,140px);">
  <div class="wrap">
    <div class="reveal" style="text-align:center; max-width:680px; margin:0 auto 44px;">
      <span class="eyebrow" style="justify-content:center;">Compare</span>
      <h1 class="section-title font-display" style="margin:14px 0 12px;">Two exams. One AI engine.</h1>
      <p class="lead" style="margin:0 auto;">Same core — real PYQs, step-by-step AI solutions and predicted mocks. Choose the product built for your exam.</p>
    </div>
    <div class="pick reveal" style="max-width:900px; margin:0 auto;">
      <div class="product-card accent-jee">
        <span class="product-badge">JEE JEEnius</span>
        <h2 class="font-display" style="font-size:24px; font-weight:600; margin:12px 0 14px;">Engineering · IIT</h2>
        <ul style="list-style:none; padding:0; margin:0 0 20px; display:flex; flex-direction:column; gap:12px;">
          <li style="display:flex; gap:10px;"><b style="min-width:96px; color:var(--ink-soft); font-weight:600;">Exam</b><span>JEE Main &amp; Advanced</span></li>
          <li style="display:flex; gap:10px;"><b style="min-width:96px; color:var(--ink-soft); font-weight:600;">Subjects</b><span>Physics, Chemistry, Mathematics</span></li>
          <li style="display:flex; gap:10px;"><b style="min-width:96px; color:var(--ink-soft); font-weight:600;">PYQs</b><span>Main 2002–2025 · Advanced 2007–2025</span></li>
          <li style="display:flex; gap:10px;"><b style="min-width:96px; color:var(--ink-soft); font-weight:600;">Proof</b><span>92% of JEE 2026 topics predicted</span></li>
        </ul>
        <a href="https://landing.jeenius.tech/" class="btn btn-primary btn-block" style="background:var(--accent);">Explore JEE JEEnius</a>
      </div>
      <div class="product-card accent-neet">
        <span class="product-badge">NEET JEEnius</span>
        <h2 class="font-display" style="font-size:24px; font-weight:600; margin:12px 0 14px;">Medical · MBBS</h2>
        <ul style="list-style:none; padding:0; margin:0 0 20px; display:flex; flex-direction:column; gap:12px;">
          <li style="display:flex; gap:10px;"><b style="min-width:96px; color:var(--ink-soft); font-weight:600;">Exam</b><span>NEET-UG</span></li>
          <li style="display:flex; gap:10px;"><b style="min-width:96px; color:var(--ink-soft); font-weight:600;">Subjects</b><span>Biology, Physics, Chemistry</span></li>
          <li style="display:flex; gap:10px;"><b style="min-width:96px; color:var(--ink-soft); font-weight:600;">PYQs</b><span>Real NEET-UG previous papers</span></li>
          <li style="display:flex; gap:10px;"><b style="min-width:96px; color:var(--ink-soft); font-weight:600;">Style</b><span>Clinical-calm, biology-led</span></li>
        </ul>
        <a href="https://neet.jeenius.tech/" class="btn btn-primary btn-block" style="background:var(--accent);">Explore NEET JEEnius</a>
      </div>
    </div>

    <div class="reveal" style="text-align:center; max-width:620px; margin:48px auto 0;">
      <h3 class="font-display" style="font-size:22px; font-weight:600; margin-bottom:10px;">Not sure which?</h3>
      <p class="lead" style="margin:0 auto;">Preparing for engineering / the IITs → <b>JEE JEEnius</b>. Preparing for medicine / MBBS → <b>NEET JEEnius</b>. Both are free to start.</p>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Verify**

- `preview_eval` navigate to `/products.html`; `preview_console_logs` (error) → empty.
- `preview_snapshot` → Expected: H1 "Two exams. One AI engine."; both product columns with Exam/Subjects/PYQs rows; "Not sure which?" block.
- Nav/footer identical to Home; dark toggle works (`preview_click` + `preview_screenshot` dark).
- `preview_resize` mobile → columns stack.

- [ ] **Step 3: Commit**

```bash
git add jeenius-brand/landing/products.html
git commit -m "JEEnius brand: Products comparison page"
```

---

## Task 6: About page (brand story)

**Files:**
- Create: `jeenius-brand/landing/about.html`

- [ ] **Step 1: Create `about.html`**

Copy `index.html`; set `<title>` to `About JEEnius — AI exam prep built by IITians`, description to `JEEnius builds AI-powered prep for JEE and NEET — real PYQs, step-by-step solutions and predicted mocks. A Stash AI product, built by IITians.`, canonical `https://jeenius.tech/about.html` (`TODO(confirm)`); keep the `Organization` JSON-LD, drop `WebSite`. Replace `<main>` content with:

```html
<section class="section" style="padding-top:clamp(94px,11vw,140px);">
  <div class="wrap" style="max-width:820px;">
    <div class="reveal">
      <span class="eyebrow">About JEEnius</span>
      <h1 class="font-display" style="font-size:clamp(36px,5vw,54px); font-weight:500; margin:16px 0 20px;">Built by IITians, for future IITians and doctors.</h1>
      <p class="lead">JEEnius exists because entrance-exam prep is stressful and often generic. We believe a calmer, more honest approach — grounded in real past papers and genuinely helpful AI — beats hype and fear.</p>
    </div>
    <div class="reveal" style="margin-top:40px; display:flex; flex-direction:column; gap:28px;">
      <div><h2 class="font-display" style="font-size:24px; font-weight:600; margin-bottom:8px;">One engine, tuned to each exam</h2><p style="color:var(--ink-soft);">JEE JEEnius and NEET JEEnius share the same core: real PYQs, step-by-step reasoning from models including Fathom AI (a perfect scorer on JEE Advanced 2025), and a prediction engine that studies decades of papers to build exam-realistic mocks.</p></div>
      <div><h2 class="font-display" style="font-size:24px; font-weight:600; margin-bottom:8px;">Honest about what AI can do</h2><p style="color:var(--ink-soft);">Our prediction engine covered 92% of JEE Main 2026's topics — but we're clear about the limits. JEEnius predicts topic areas and question patterns, not the exact paper, and is not affiliated with NTA, NMC or any exam body.</p></div>
      <div><h2 class="font-display" style="font-size:24px; font-weight:600; margin-bottom:8px;">Part of Stash AI</h2><p style="color:var(--ink-soft);">JEEnius is a product of <a href="https://stash.ai/" style="color:var(--gold-ink); font-weight:700;">Stash AI</a>, which builds human-centric AI tools that pair strong model stacks with real empathy for the people using them.</p></div>
    </div>
    <div class="reveal pick" style="margin-top:44px;">
      <a href="https://landing.jeenius.tech/" class="product-card accent-jee" style="text-decoration:none;"><span class="product-badge">JEE JEEnius</span><p style="margin:12px 0 0; color:var(--ink-soft);">For engineering aspirants →</p></a>
      <a href="https://neet.jeenius.tech/" class="product-card accent-neet" style="text-decoration:none;"><span class="product-badge">NEET JEEnius</span><p style="margin:12px 0 0; color:var(--ink-soft);">For medical aspirants →</p></a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Verify** — navigate to `/about.html`; console clean; snapshot shows the H1, the three story blocks, and two product links; dark + mobile screenshots OK.

- [ ] **Step 3: Commit**

```bash
git add jeenius-brand/landing/about.html
git commit -m "JEEnius brand: About / brand-story page"
```

---

## Task 7: Contact page (+ Netlify form)

**Files:**
- Create: `jeenius-brand/landing/contact.html`

- [ ] **Step 1: Create `contact.html`**

Copy `index.html`; set `<title>` `Contact JEEnius`, description `Get in touch with JEEnius — support, feedback and partnership enquiries for JEE JEEnius and NEET JEEnius.`, canonical `https://jeenius.tech/contact.html` (`TODO(confirm)`); keep `Organization` JSON-LD, drop `WebSite`. Replace `<main>` content with:

```html
<section class="section" style="padding-top:clamp(94px,11vw,140px);">
  <div class="wrap" style="max-width:820px;">
    <div class="reveal" style="text-align:center; margin-bottom:40px;">
      <span class="eyebrow" style="justify-content:center;">Contact</span>
      <h1 class="section-title font-display" style="margin:14px 0 12px;">Get in touch</h1>
      <p class="lead" style="margin:0 auto;">Questions, feedback or partnerships — we read everything. For app support, the fastest route is email.</p>
    </div>
    <div class="grid md:grid-cols-2" style="gap:24px;">
      <div class="card reveal" style="padding:26px;">
        <h2 class="font-display" style="font-size:20px; font-weight:600; margin-bottom:14px;">Reach us</h2>
        <p style="display:flex; gap:10px; align-items:center; margin:0 0 12px;"><svg width="18" height="18" fill="none" stroke="var(--green)" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg><a href="mailto:support@jeenius.tech" style="font-weight:600;">support@jeenius.tech</a></p>
        <p style="display:flex; gap:10px; align-items:center; margin:0 0 12px;"><svg width="18" height="18" fill="none" stroke="var(--green)" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M22 4L12 14.01l-3-3"></path></svg>JEE: <a href="https://x.com/jeenius_ai" style="font-weight:600;">@jeenius_ai</a> · NEET: <a href="https://x.com/neet_jeenius_ai" style="font-weight:600;">@neet_jeenius_ai</a></p>
        <div style="display:flex; gap:10px; margin-top:16px; flex-wrap:wrap;">
          <a href="https://play.google.com/store/apps/details?id=com.stash.jeenius&hl=en_IN" class="chip">JEE on Google Play</a>
          <a href="https://play.google.com/store/apps/details?id=com.stash.neetjeenius&hl=en_IN" class="chip">NEET on Google Play</a>
        </div>
      </div>
      <form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" class="card reveal" style="padding:26px;" action="/contact.html?sent=1">
        <input type="hidden" name="form-name" value="contact">
        <p class="hidden"><label>Skip: <input name="bot-field"></label></p>
        <label style="font-size:13px; font-weight:600; color:var(--ink-soft);">Name<input name="name" required style="width:100%; margin-top:6px; margin-bottom:14px; padding:11px 12px; border:1px solid var(--line); border-radius:12px; background:var(--surface-2); color:var(--ink);"></label>
        <label style="font-size:13px; font-weight:600; color:var(--ink-soft);">Email<input type="email" name="email" required style="width:100%; margin-top:6px; margin-bottom:14px; padding:11px 12px; border:1px solid var(--line); border-radius:12px; background:var(--surface-2); color:var(--ink);"></label>
        <label style="font-size:13px; font-weight:600; color:var(--ink-soft);">About<select name="product" style="width:100%; margin-top:6px; margin-bottom:14px; padding:11px 12px; border:1px solid var(--line); border-radius:12px; background:var(--surface-2); color:var(--ink);"><option>JEE JEEnius</option><option>NEET JEEnius</option><option>Something else</option></select></label>
        <label style="font-size:13px; font-weight:600; color:var(--ink-soft);">Message<textarea name="message" rows="4" required style="width:100%; margin-top:6px; margin-bottom:16px; padding:11px 12px; border:1px solid var(--line); border-radius:12px; background:var(--surface-2); color:var(--ink);"></textarea></label>
        <button type="submit" class="btn btn-primary btn-block">Send message</button>
        <p style="font-size:12px; color:var(--ink-faint); margin:12px 0 0;">Prefer email? Write to <a href="mailto:support@jeenius.tech" style="font-weight:600;">support@jeenius.tech</a>.</p>
      </form>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add the "message sent" confirmation script**

Before `</body>` (after `assets/app.js`), add:

```html
<script>
  if (new URLSearchParams(location.search).get('sent') === '1') {
    var f = document.querySelector('form[name="contact"]');
    if (f) f.innerHTML = '<div style="text-align:center; padding:24px 0;"><h2 class="font-display" style="font-size:22px; font-weight:600; margin-bottom:8px;">Thanks — message sent.</h2><p style="color:var(--ink-soft);">We\'ll get back to you at the email you gave us.</p></div>';
  }
</script>
```

- [ ] **Step 3: Verify**

- Navigate to `/contact.html`; `preview_console_logs` (error) → empty.
- `preview_snapshot` → Expected: email `support@jeenius.tech`, both social handles, both Play chips, and the form (Name/Email/About/Message/Send message).
- `preview_fill` name/email/message; `preview_snapshot` → values present. (Netlify Forms only processes on the deployed site; local just confirms the markup + fallback email are correct.)
- Navigate to `/contact.html?sent=1` → Expected: the form is replaced by the "Thanks — message sent." confirmation.
- Dark + mobile screenshots OK.

- [ ] **Step 4: Commit**

```bash
git add jeenius-brand/landing/contact.html
git commit -m "JEEnius brand: Contact page + Netlify form with mailto fallback"
```

---

## Task 8: SEO finalize (sitemap/robots) + full verification + wrap-up

**Files:**
- Create: `jeenius-brand/landing/sitemap.xml`, `jeenius-brand/landing/robots.txt`

- [ ] **Step 1: Create `robots.txt`**

```
User-agent: *
Allow: /
Sitemap: https://jeenius.tech/sitemap.xml
```
(`TODO(confirm)` host.)

- [ ] **Step 2: Create `sitemap.xml`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://jeenius.tech/</loc></url>
  <url><loc>https://jeenius.tech/products.html</loc></url>
  <url><loc>https://jeenius.tech/about.html</loc></url>
  <url><loc>https://jeenius.tech/contact.html</loc></url>
</urlset>
```
(`TODO(confirm)` host — update all four `<loc>` when the final brand URL is decided.)

- [ ] **Step 3: Full-site verification pass**

For each of `/`, `/products.html`, `/about.html`, `/contact.html`:
- `preview_console_logs` (error) → empty on every page.
- `preview_snapshot` → nav + footer identical; no broken internal links (Products/About/Contact resolve; product CTAs → `landing.jeenius.tech` / `neet.jeenius.tech`; legal → `ai.jeenius.tech`).
- `preview_inspect` a focused element → visible focus outline present.
- `preview_resize` mobile + `preview_screenshot`; then toggle dark + `preview_screenshot`. Expected: parity, no overflow, readable contrast.
- Confirm no leftover `jeenius-dark-mode` (unbranded) key: `grep -rn "jeenius-dark-mode" jeenius-brand/landing` → only `jeenius-brand-dark-mode` matches.
- Confirm no accidental FOMO copy: `grep -rniE "countdown|hurry|don't miss|last chance|running out" jeenius-brand/landing` → no matches.

- [ ] **Step 4: Commit**

```bash
git add jeenius-brand/landing/sitemap.xml jeenius-brand/landing/robots.txt
git commit -m "JEEnius brand: sitemap + robots; full light/dark/mobile verification"
```

- [ ] **Step 5: Finalize the branch**

Use `superpowers:finishing-a-development-branch` to choose merge / PR / cleanup. Screenshots (light + dark + mobile, all 4 pages) accompany the summary.

---

## Self-Review

**Spec coverage:** Home 8-section IA → Tasks 2–4. Products → Task 5. About → Task 6. Contact + Netlify form + mailto fallback → Task 7. Shared nav/footer + design system + accent tokens → Tasks 1–2. Dark mode (`jeenius-brand-dark-mode`) → Tasks 1–2, verified Task 8. SEO/JSON-LD/canonical `TODO(confirm)` → Tasks 2, 5–8. Both products routed to real URLs → Tasks 3–7. Honesty disclaimer → Task 4 (Home) + Task 6 (About). No hardcoded prices (link out) → Tasks 4–5. Preview config → Task 1. All spec sections map to a task.

**Placeholder scan:** The only `TODO`s are the intentional `TODO(confirm)` on the brand host and `TODO(NEET-APP)` on the NEET package id — both are real deferred inputs carried verbatim from the spec / source, not plan gaps. No "TBD", no "add error handling", no un-shown code.

**Type/name consistency:** Shared IDs (`#darkModeToggle`, `#sunIcon`, `#moonIcon`, `#mobileMenuBtn`, `#mobileMenu`, `#nav`) match `app.js` across all pages. Accent classes (`.accent-jee`, `.accent-neet`, `.product-card`, `.product-badge`, `.spotlight`, `.pick`) are defined in Task 1 and used identically in Tasks 3–6. Nav CTA target `#pick` is defined in Task 3 and referenced in Task 2's nav. Canonical host `https://jeenius.tech/` used consistently (all flagged `TODO(confirm)`).
