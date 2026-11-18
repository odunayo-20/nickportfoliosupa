# Portfolio — Web Test Plan (local Chrome, driven by Claude Code)

This plan is for a Claude Code session that runs the site locally (`next dev`) and drives the
**locally installed Google Chrome** through **Playwright** (`playwright-core`, no bundled browser),
checking results in the database through the **Supabase MCP**.

The site is a Next.js 16 App Router app (`app/(main)` = public site, `app/admin` = CMS,
`app/auth` = login). Most of what changes from release to release is **visual and motion work**
(`motion` library, View Transitions, Lenis smooth scroll), so a large part of this plan checks
animation *state* (opacity, transforms, timing) rather than just "does the page load".

> ⚠️ **There is only one Supabase project (`nickportfolio`), and it is production.** Visitor
> traffic, contact messages, newsletter subscribers, comments and likes all land in real tables
> that the owner reads. Follow [§2 Ground rules](#2-ground-rules-production-safety). Never run a
> test marked 🔴 without the owner's explicit OK in that session.

---

## 0. Contents

1. [Environment setup](#1-environment-setup)
2. [Ground rules (production safety)](#2-ground-rules-production-safety)
3. [How Claude drives Chrome](#3-how-claude-drives-chrome) (mobile engines: §1.6)
4. [Recording results](#4-recording-results)
5. [Test suites](#5-test-suites) — P0 smoke first, then by area
6. [Server invariant checks (read-only SQL)](#6-server-invariant-checks-read-only-sql)
7. [Cleanup](#7-cleanup)
8. [Out of scope / needs a human](#8-out-of-scope--needs-a-human)

---

## 1. Environment setup

### 1.1 Requirements

| | |
|---|---|
| Node | 20+ (`node -v`) |
| Package manager | **pnpm** (lockfile is `pnpm-lock.yaml`). On Windows, `pnpm` may only be on the PowerShell path, not Git Bash — run installs from PowerShell or use `npx -y pnpm@10` |
| Browser | Google Chrome, `C:\Program Files\Google\Chrome\Application\chrome.exe` |
| Driver | `playwright-core` installed in the **test-run folder**, not in the project |
| MCP | Supabase MCP connected (`/mcp`), project `nickportfolio` (`ycdylfacmyxghfilhakq`) |

### 1.2 Environment variables

`.env*` files are not in git. The public site needs only public values:

| Var | Needed for | Where to get it |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | everything | Supabase MCP `get_project_url` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | everything | Supabase MCP `get_publishable_keys` (use the `sb_publishable_…` key) |
| `NEXT_PUBLIC_APP_URL` | canonical URLs, sitemap, OG | `http://localhost:3123` for test runs |
| `SUPABASE_SERVICE_ROLE_KEY` | `/api/track-visit`, admin client | **Leave unset for QA runs** — then visit tracking fails locally (expected console noise) and no test traffic lands in `page_visits` |
| `BREVO_*` | newsletter / transactional email | **Leave unset** — prevents real emails being sent |

Pass them inline instead of writing an env file:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://ycdylfacmyxghfilhakq.supabase.co \
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<sb_publishable_…> \
NEXT_PUBLIC_APP_URL=http://localhost:3123 \
npx next dev -p 3123
```

### 1.3 Start, build, static checks

```bash
pnpm install --frozen-lockfile        # PowerShell on Windows
npx tsc --noEmit -p .                 # must be clean
npx eslint                            # known warning: <img> in Navbar logo (no-img-element)
npx next build                        # needs the env vars above, otherwise prerender fails
npx next dev -p 3123                  # wait for "✓ Ready" and "✓ viewTransition" under Experiments
```

- Any `tsc` error or a new ESLint **error** is a P0 finding.
- The dev server prints `⚠ Next.js inferred your workspace root` because of a stray
  `C:\Users\Nikola\package-lock.json` — harmless.
- **Windows gotcha**: stopping the `npx next dev` wrapper can leave `node.exe` listening on the
  port (`EADDRINUSE` on restart). Free it with
  `Get-NetTCPConnection -LocalPort 3123 -State Listen | % { Stop-Process -Id $_.OwningProcess -Force }`.
- First request per route in dev mode compiles it (5–30 s). Warm every route once with `curl`
  before timing anything.

### 1.4 Test data

There are no QA accounts on the public site — it's read-only for visitors. Pick real content once
per run and record it in `results.md`:

```sql
select slug, title, is_featured, display_order from public.projects where status = 'published' order by display_order limit 5;
select slug, title, status from public.posts where status = 'published' order by created_at desc limit 5;
```

Admin tests (§5.17) need the owner to log in; Claude never handles the password.

### 1.5 Viewports

| Name | Size | Playwright options |
|---|---|---|
| Desktop | 1440×900 | default |
| Laptop | 1280×720 | default |
| Tablet | 820×1180 | `hasTouch: true` |
| Mobile | 390×844 | `isMobile: true, hasTouch: true, deviceScaleFactor: 3` |

Tests marked **⇄** run on **Desktop and Mobile**. Tests marked **📱** must also run on the real
mobile engines in §1.6 — viewport emulation in desktop Chrome is **not** a mobile browser test.

### 1.6 Mobile browsers (real engines)

| Engine | Stands in for | How | Notes |
|---|---|---|---|
| **Chrome for Android** | Android Chrome (most mobile visitors) | Android emulator `Pixel_9a` (Play Store image, has Chrome) + Playwright `_android` | Real Chrome build, real touch input |
| **WebKit** | iPhone / iPad Safari | Playwright `webkit` + `devices['iPhone 15']` | Playwright's WebKit on Windows ≈ Safari, **not identical** — confirm big releases on a real iPhone (§8) |
| Chrome desktop, mobile viewport | quick layout checks only | `isMobile/hasTouch` context (§1.5) | Same engine as desktop — misses WebKit and Android-only bugs |

**Android emulator + Chrome**

```bash
SDK="$LOCALAPPDATA/Android/Sdk"
"$SDK/emulator/emulator.exe" -list-avds                          # Pixel, Pixel_9a, Small_Phone
"$SDK/emulator/emulator.exe" -avd Pixel_9a -no-snapshot-save &   # opens a window
adb wait-for-device   # then poll: adb shell getprop sys.boot_completed  → 1
adb reverse tcp:3123 tcp:3123      # device's localhost:3123 → host dev server
adb shell "echo '_ --disable-fre --no-default-browser-check --no-first-run' > /data/local/tmp/chrome-command-line"
```
```js
import { _android as android } from 'playwright-core'
const [device] = await android.devices()
const context = await device.launchBrowser()     // real Chrome on the device
const page = await context.newPage()
await page.goto('http://localhost:3123/')
// real touch: await device.shell('input swipe 540 1800 540 600 300')
```
Record `adb shell dumpsys package com.android.chrome | grep versionName` and the Android version.
Shut down with `adb emu kill` only if the run booted the emulator.

**WebKit (Safari engine)**

```bash
npm i playwright@<same version as playwright-core> && npx playwright install webkit
```
```js
import { webkit, devices } from 'playwright'
const browser = await webkit.launch()
const ctx = await browser.newContext({ ...devices['iPhone 15'] })
```

**Engine-specific things to watch**: View Transitions support (`'startViewTransition' in document`
— pages must still navigate without it), `-webkit-text-stroke` (footer CTA), `mask-image`
(marquee edges), `backdrop-filter` (navbar), `inert` (marquee copies), sticky positioning inside
transformed parents (blog TOC), touch scrolling not hijacked by Lenis, `min-h-[85vh]` with the
mobile URL bar.

---

## 2. Ground rules (production safety)

1. **Never submit a form** unless the test is marked 🔴 and the owner approved it in this session:
   contact form (`messages`), newsletter (`newsletter_subscribers` + Brevo email), comments
   (`comments`), unsubscribe.
2. **Never click like buttons** on blog posts (`post_likes`) except in 🔴 FORM tests.
3. **Never open `/admin` or `/auth/*` pages while signed in** unless the test is in §5.17 and the
   owner is driving the login. Never change Settings, Profile, Whitelist, projects or posts.
4. **Prefix any test content with `[QA]`** (name/message/comment) so §7 can find it, and use the
   address `qa+portfolio@<owner domain>` that the owner provides.
5. **Database access is read-only (`select`)** except the §7 cleanup, scoped to `[QA]` rows.
6. **GDPR banner**: clicking Accept/Decline writes to `gdpr_consents`. Tests that need the banner
   gone should set the consent cookie/localStorage directly (see §3.4) instead of clicking, except
   GDPR-02 which tests the click.
7. If something would email real people (newsletter compose/send in admin), **stop and ask**.

---

## 3. How Claude drives Chrome

### 3.1 Harness

Each run lives in `test-runs/YYYY-MM-DD/` (git-ignored):

```bash
mkdir -p test-runs/$(date +%F)/shots && cd test-runs/$(date +%F)
npm init -y >/dev/null && npm i playwright-core
```

```js
// qa.mjs — minimal harness
import { chromium } from 'playwright-core'
export const BASE = 'http://localhost:3123'
export async function open({ mobile = false, reducedMotion = 'no-preference' } = {}) {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  })
  const ctx = await browser.newContext(
    mobile
      ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3, reducedMotion }
      : { viewport: { width: 1440, height: 900 }, reducedMotion },
  )
  const page = await ctx.newPage()
  const errors = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message))
  return { browser, ctx, page, errors }
}
```

Use `headless: false` when the owner wants to watch.

### 3.2 Selectors

| Element | Selector |
|---|---|
| Navbar | `#site-header` (has `viewTransitionName: site-header`) |
| Active nav link | `#site-header a[aria-current="page"]` |
| Mobile menu button / drawer | `#navbar-hamburger` / `#mobile-drawer` (`role=dialog`) |
| Scroll progress bar | `[data-testid="scroll-progress"]` |
| Hero section | `section#home`; rotating title = `h1 .inline-grid > span:not(.invisible)` |
| Hero badge | `svg textPath[href="#hero-badge-circle"]` |
| Scroll indicator | `a[aria-label="Scroll to services"]` |
| Sections on `/` | `#services`, `#about`, `#tools`, `#skills` |

There are few test ids; prefer roles and visible text (`getByRole('link', { name: 'Projects' })`).

### 3.3 Checking animations

Motion components start at `opacity: 0` and animate to `1` once in view (`whileInView`, `once`).
Assert on **computed state after settling**, never on timing alone:

```js
// effective opacity including ancestors
const effOpacity = (el) => { let o = 1; for (let n = el; n; n = n.parentElement) o *= +getComputedStyle(n).opacity; return o }
// transform of an element (matrix → translate)
const t = await page.$eval(sel, (el) => getComputedStyle(el).transform)
```

- Wait **≥ 2.5 s** after load for hero entrances; **1.5 s** after each scroll step for reveals.
- Scroll in steps (300 px / 250 ms) — a single jump to the bottom skips `whileInView` triggers
  for some sections and is not how people scroll.
- **Lenis** (§5.13) intercepts wheel input: use `page.mouse.wheel()` to test the smooth path,
  `window.scrollTo()` for instant positioning. Lenis is off for reduced motion and touch.
- **Scroll-linked opacity/transform** (`useTransform(scrollYProgress, …)`) is hardware-accelerated
  by motion as a native scroll-timeline animation, which does **not** clamp: a map that ends
  before progress 1 drifts back toward the base value. Sample such values across the *whole*
  scroll range, not just the start (regression from 2026-11-18: hero text + scroll indicator
  faded back in).
- Count View Transitions by wrapping the API before load:
  ```js
  await page.addInitScript(() => {
    window.__vt = 0
    const orig = document.startViewTransition?.bind(document)
    if (orig) document.startViewTransition = (...a) => { window.__vt++; return orig(...a) }
  })
  ```

### 3.4 Hiding the GDPR banner without writing to the DB

Consent lives in `localStorage['gdpr_consent']` (`context/GDPRContext.tsx`). Pre-set it so the
banner never shows and nothing is logged to `gdpr_consents`:

```js
await ctx.addInitScript(() =>
  localStorage.setItem('gdpr_consent', JSON.stringify({ necessary: true, analytics: false, marketing: false })))
```
If the banner still appears, the consent shape changed — re-read `GDPRContext.tsx`.

### 3.5 Per-test loop

1. New context per suite (clean storage); attach console/pageerror listeners.
2. Navigate, wait for `networkidle` (max 60 s in dev) + settle time.
3. Assert UI state (DOM / computed styles) and take a screenshot on any failure.
4. Any `pageerror`, React hydration warning or `Minified React error` fails the test.
   Known noise you may ignore (but list): `Failed to track visit` (no service-role key locally).
5. Write the result row (§4).

---

## 4. Recording results

`test-runs/YYYY-MM-DD/results.md` — header (date, git commit, Chrome version
`chrome.exe --version`, Node version, env flags used), then:

| ID | Viewport | Result | Notes / observed | Evidence |
|---|---|---|---|---|
| HERO-02 | Desktop | ✅ PASS | phrase changed 2× in 7 s | |
| NAV-03 | Desktop | ❌ FAIL | nav did not re-show on scroll up | `NAV-03_desktop.png` |
| FORM-01 | — | ⏭ SKIP | no owner approval | |
| PT-01 | Desktop | ⚠️ FLAKY | 2/3 runs fired a view transition | |

Screenshots: `shots/<TC-ID>_<viewport>.png`. At the end: pass/fail/skip counts, every failure
with repro steps and the suspected file.

**Priorities**: **P0** smoke — every change (~5 min). **P1** — every feature phase / before
deploy. **P2** — before bigger releases.

---

## 5. Test suites

### 5.1 Smoke (P0) — stop the run if any fail

| ID | VP | Steps | Expected |
|---|---|---|---|
| SMOKE-01 | ⇄ | Load `/`, `/about`, `/services`, `/projects`, `/blog`, `/contact`, `/privacy`, `/cookies` | HTTP 200, no `pageerror`, no hydration warning |
| SMOKE-02 | ⇄ | Open one project detail and one blog post (from §1.4) | 200, title rendered, images load (`naturalWidth > 0`) |
| SMOKE-03 | Desktop | `/does-not-exist` | Custom 404 page (`app/not-found.tsx`), status 404 |
| SMOKE-04 | Desktop | Click every navbar link in order | Correct URL, correct `aria-current` link |
| SMOKE-05 | — | `tsc`, `eslint`, `next build` (§1.3) | Clean |

### 5.2 Hero (HERO) — `app/(main)/_components/Hero.tsx`

| ID | P | VP | Steps | Expected |
|---|---|---|---|---|
| HERO-01 | P0 | ⇄ | Load `/`, wait 2.5 s | Badge, h1, bio, both CTAs at effective opacity ≈ 1 |
| HERO-02 | P1 | Desktop | Read rotating phrase, wait 7 s, read again | Changed at least once; h1 height unchanged (no layout shift) |
| HERO-03 | P1 | Desktop | `h1 .sr-only` text | `I'm <name>, <full title>` (for screen readers / SEO) |
| HERO-04 | P1 | Desktop | Badge `textPath` | Text "Hire Me • Let's Talk • Hire Me •" fits the circle (no overlap/clipping in screenshot); badge links to `/contact` |
| HERO-05 | P1 | Desktop | Hover "View My Portfolio", move 20 px off-centre | Wrapper `transform` ≠ none (magnetic); returns to identity on leave |
| HERO-06 | P1 | Desktop | Move mouse left → right across the hero | Photo / blob / chip wrappers' transforms change in different directions |
| HERO-07 | P2 | Mobile | Touch-scroll the hero | No parallax jitter from touch (pointer handlers ignore non-mouse) |
| HERO-08 | P1 | Desktop | Scroll 0 → 1200 px in 100 px steps, sample opacities | Scroll indicator → ~0 by 200 px; text column fades monotonically; **neither fades back in** later |
| HERO-09 | P2 | Desktop | Watch blobs 6 s (two screenshots) | `border-radius` changes (morph animation running) |
| HERO-10 | P1 | ⇄ | Hero image request | Loaded eagerly with `fetchpriority="high"`; it's the LCP element |

### 5.3 Navbar (NAV) — `app/(main)/_components/Navbar.tsx`

| ID | P | VP | Steps | Expected |
|---|---|---|---|---|
| NAV-01 | P1 | Desktop | Compare `scrollY=0` vs `50` | Nav gets shadow + border, inner padding shrinks (`py-4` → `py-2.5`) |
| NAV-02 | P1 | Desktop | Scroll down past 300 px | Nav hides (bounding `top < 0`, translateY ≈ −100%) |
| NAV-03 | P1 | Desktop | Then scroll up 50 px | Nav visible again |
| NAV-04 | P1 | Desktop | On `/projects` | "Projects" has `aria-current="page"` and the orange underline under it |
| NAV-05 | P2 | Desktop | Hover Home → About → Blog | Grey pill slides between links (one pill element at a time) |
| NAV-06 | P2 | Desktop | Navigate `/` → `/about` | Underline slides to the new link; nav visible after navigation |
| NAV-07 | P1 | Mobile | Tap `#navbar-hamburger` | Drawer slides in, links stagger in, icon morphs to X, body scroll locked |
| NAV-08 | P1 | Mobile | Escape / tap backdrop / tap X | Drawer closes each way |
| NAV-09 | P1 | Mobile | Open drawer, tap "Services" | Navigates to `/services`, drawer closed |
| NAV-10 | P2 | Desktop | Tab through the nav with keyboard | Visible focus, hover pill follows focus, Enter navigates |

### 5.4 Scroll progress (PROG) — `components/motion/ScrollProgress.tsx`

| ID | P | VP | Steps | Expected |
|---|---|---|---|---|
| PROG-01 | P1 | ⇄ | Top of a long page (`/blog/<slug>`) | `scaleX` ≈ 0 |
| PROG-02 | P1 | ⇄ | Scroll to bottom, wait 1 s | `scaleX` ≈ 1 |
| PROG-03 | P2 | Desktop | Nav hidden (NAV-02) | Progress bar still visible at the top, above the nav |

### 5.5 Page transitions (PT) — `components/motion/PageTransition.tsx`, `experimental.viewTransition`

| ID | P | VP | Steps | Expected |
|---|---|---|---|---|
| PT-01 | P1 | Desktop | With the §3.3 counter: `/` → About → Projects → Blog via the nav | `__vt` increments per navigation; URLs correct |
| PT-02 | P1 | Desktop | Screenshot mid-transition (~100 ms after click) | Old page fading/blurring; nav **not** moving or doubled |
| PT-03 | P1 | Desktop | Project card → detail page | Transition plays, detail renders, scroll at top |
| PT-04 | P2 | Desktop | Browser Back | Page restores (no animation required — back has no transition type) |
| PT-05 | P1 | Desktop | 🔴 Only with FORM-01: submit contact form | **No** page transition fires on submit (`__vt` unchanged) |
| PT-06 | P2 | Desktop | Reduced motion + navigate | Instant swap (durations 0) |

### 5.6 Scroll reveals (REV)

| ID | P | VP | Steps | Expected |
|---|---|---|---|---|
| REV-01 | P0 | ⇄ | Every page in SMOKE-01/02: scroll to bottom in steps, wait 1.5 s | **Zero** visible-size elements in `<main>` with effective opacity < 0.05 (ignore `.invisible` size reservers) |
| REV-02 | P1 | Desktop | Load `/`, before scrolling | Below-the-fold sections still at opacity 0 (reveals not firing early) |
| REV-03 | P1 | Desktop | Scroll back up after REV-01 | Revealed content stays visible (`once: true`) |
| REV-04 | P2 | Desktop | Deep link `/#skills` | Section visible after load (reveal fires when landing mid-page) |
| REV-05 | P2 | Desktop | Hover cards in Services / Skills / Projects | Hover lift/shadow is smooth; entrance isn't slowed by CSS transitions (`transition-motion-safe` on `m.*` elements, never `transition-all`) |

### 5.7 Projects (PROJ)

| ID | P | VP | Steps | Expected |
|---|---|---|---|---|
| PROJ-01 | P1 | ⇄ | `/projects` | Featured first, then grid, ordered by `display_order` (compare with §1.4 SQL) |
| PROJ-02 | P1 | Desktop 📱 | Click each category filter | Only matching projects; counts on chips match; "All" restores; the dark pill slides to the active chip (one `layoutId` element); cards glide into new slots (no jump), exiting cards scale/fade out |
| PROJ-03 | P2 | Desktop | Filter with an odd number of results | "Your Project Here" CTA card appears |
| PROJ-04 | P1 | ⇄ | Project detail | Title, tech stack, gallery; lightbox opens/closes (Esc, arrows) |
| PROJ-05 | P2 | Mobile 📱 | Lightbox swipe | Swipes between images; page underneath doesn't scroll |
| PROJ-06 | P1 | Desktop | Hover a grid card image | "View case study" overlay fades in; image goes colour + zooms |
| PROJ-07 | P1 | Desktop | Click a card image on `/projects` (with the §3.3 View Transition counter) | Counter +1; card image morphs into the detail hero (`project-image-<slug>` names, `.project-morph` CSS) — screenshot ~200 ms after click |
| PROJ-08 | P1 | ⇄ | Detail page bottom | "More projects" nav with Previous/Next (wrap-around, ordered like `/projects`); clicking navigates; current project never listed |
| PROJ-09 | P2 | Desktop | Scroll past the detail hero image | Image drifts inside its frame (parallax `translateY` changes); hover overlay icon on hero/gallery cards becomes visible on card hover |

### 5.8 Blog (BLOG)

| ID | P | VP | Steps | Expected |
|---|---|---|---|---|
| BLOG-01 | P1 | ⇄ | `/blog` | Latest post featured, others in grid; category filter works |
| BLOG-02 | P2 | Desktop | "Load more" | 6 more posts appear (animated), no duplicates |
| BLOG-03 | P1 | ⇄ | Post page | Article body styled (`.article-body`), code blocks scroll horizontally, images load |
| BLOG-04 | P1 | Desktop | Like count + comments list | Render read-only; **don't click like** |
| BLOG-05 | P2 | Desktop | Related posts | Link to other posts, not the current one |
| BLOG-06 | P1 | Desktop (≥1280) | Post with ≥2 h2/h3 | Sticky "On this page" sidebar left of the article; headings have ids matching the TOC (`lib/toc.ts`); active link (`aria-current="location"`) follows scrolling; clicking scrolls the heading to ~88 px below the top |
| BLOG-07 | P1 | Tablet / Mobile 📱 | Same post below 1280 px | Collapsible "On this page" box (`aria-expanded`); tapping a link scrolls there and collapses the box |
| BLOG-08 | P2 | — | Post with <2 headings | No TOC rendered |

### 5.8a Home sections (HOME)

| ID | P | VP | Steps | Expected |
|---|---|---|---|---|
| HOME-01 | P1 | Desktop | Services bento | Large green card spans 2×2, two cards stacked right; cards tilt toward the cursor (`TiltCard`) and show a spotlight; flat again on leave |
| HOME-02 | P1 | ⇄ | About: tap each topic pill | Only that pill `aria-pressed="true"` + ring; image crossfades (blur/zoom in); pills bob (`animation-name: float`) |
| HOME-03 | P1 | ⇄ | Scroll to About stats | "20+ / 5+ / 5+" roll in like an odometer (`Odometer`, digit columns slide, staggered); server HTML already contains the final values; screen readers get the plain number |
| HOME-04 | P1 | ⇄ 📱 | Tools | Two marquee rows moving in opposite directions; hover pauses a row; second copy `inert` + `aria-hidden`; no horizontal page scroll |
| HOME-05 | P1 | Desktop | Skills | Cards tilt; chips pop in one after another after each card appears; all end visible |
| HOME-06 | P1 | ⇄ 📱 | Footer CTA on `/`, `/about`, a project | Oversized two-line text slides in opposite directions on scroll; outlined line renders (`-webkit-text-stroke`); "Get in touch" → `/contact`; band **absent** on `/contact` |
| HOME-07 | P2 | ⇄ | Footer "Back to top" | Smoothly scrolls to 0 (Lenis) |

### 5.9 Contact & forms (FORM) — 🔴 writes to production

| ID | P | VP | Steps | Expected |
|---|---|---|---|---|
| FORM-00 | P1 | ⇄ | Contact page without submitting: empty submit, invalid email | Client validation messages; nothing sent (no network POST) |
| FORM-01 | 🔴 P1 | Desktop | Submit `[QA] contact test` with the QA address | Success toast; DB: one `messages` row; button returns from "Sending…" |
| FORM-02 | 🔴 P2 | Desktop | Newsletter form with the QA address | Success; DB `newsletter_subscribers` row (no Brevo email locally if `BREVO_*` unset) |
| FORM-03 | 🔴 P2 | Desktop | `/unsubscribe?email=<QA address>` | Status set to unsubscribed |
| FORM-04 | 🔴 P2 | Desktop | Comment `[QA] comment` on a post | "Awaiting approval" (not shown publicly until approved) |

### 5.10 GDPR & tracking (GDPR)

| ID | P | VP | Steps | Expected |
|---|---|---|---|---|
| GDPR-01 | P1 | ⇄ | Fresh context, load `/` | Banner animates in; doesn't cover nav/CTAs on mobile. With `localStorage.gdpr_consent` pre-set (returning visitor) it never appears. Consent is read via `useSyncExternalStore`, so a second open tab updates too |
| GDPR-02 | 🔴 P2 | Desktop | Click Accept | Banner animates out; DB `gdpr_consents` row; not shown on reload |
| GDPR-03 | P2 | Desktop | `/privacy`, `/cookies` | Render; links from the banner work |
| GDPR-04 | P2 | — | Network log during SMOKE-01 | `/api/track-visit` called once per page view (fails locally without service key — expected) |

### 5.11 Mobile & layout (MOB)

| ID | P | VP | Steps | Expected |
|---|---|---|---|---|
| MOB-01 | P0 | Mobile | Every SMOKE-01 page, at top and after scrolling to bottom | `documentElement.scrollWidth <= innerWidth` (no horizontal scroll) |
| MOB-02 | P1 | Mobile | Hero | Text above photo; chips/badge not clipped or overlapping the photo badly (screenshot) |
| MOB-03 | P1 | Tablet | `/`, `/projects` | 2-column layouts don't overflow; nav switches to hamburger below `md` |
| MOB-04 | P2 | Mobile | Long titles (rotating hero phrase, long project name) | Wrap, no overflow |
| MOB-05 | P0 | 📱 Android Chrome + WebKit | SMOKE-01 pages on both real engines (§1.6) | 200, no `pageerror`, no horizontal overflow, nothing stuck invisible after a touch-scroll through each page |
| MOB-06 | P1 | 📱 both | Drawer, filters, lightbox, TOC by **tap** | Same results as the desktop tests; page behind drawer/lightbox doesn't scroll on swipe |
| MOB-07 | P1 | 📱 both | `'startViewTransition' in document` | Record per engine; navigation works either way (no stuck/blank page) |
| MOB-08 | P2 | 📱 both | Touch scroll through `/` | Native momentum (Lenis doesn't hijack touch); no visible jank; long tasks > 200 ms counted |

### 5.12 Reduced motion (RM) — `MotionConfig reducedMotion="user"` + CSS media query

| ID | P | VP | Steps | Expected |
|---|---|---|---|---|
| RM-01 | P1 | ⇄ | `reducedMotion: 'reduce'`, load `/` | Content visible; rotating title **static** for 7 s; no parallax on mouse move |
| RM-02 | P1 | Desktop | Same, scroll every page | REV-01 still passes (fades only, nothing stuck) |
| RM-03 | P2 | Desktop | Computed `animation-name` on marquee (`.marquee-track`), blob, badge SVG, float chips | `none` |
| RM-05 | P2 | Desktop | Mouse over tilt cards; scroll to About stats | No tilt; stats show final values immediately |
| RM-04 | P2 | Desktop | Wheel scroll | Native scrolling (Lenis disabled) |

### 5.13 Smooth scroll (LENIS) — `components/motion/SmoothScroll.tsx`

| ID | P | VP | Steps | Expected |
|---|---|---|---|---|
| LENIS-01 | P1 | Desktop | `html` element | Has class `lenis` (Lenis active) |
| LENIS-02 | P1 | Desktop | `page.mouse.wheel(0, 600)` then sample `scrollY` every 50 ms | `scrollY` increases over several frames (eased), ends ≈ +600 |
| LENIS-03 | P1 | Desktop | Click the hero "Scroll" indicator / a `#section` link | Smoothly scrolls to the target, lands under the navbar, not behind it |
| LENIS-04 | P1 | Desktop | Open the project lightbox / any modal, wheel inside it | Inner content scrolls; page behind doesn't (`data-lenis-prevent` or Lenis stopped) |
| LENIS-05 | P1 | Mobile | Touch device (`hasTouch`, `isMobile`) | Lenis is **not mounted** on touch-primary devices (`(hover: none) and (pointer: coarse)`) or under reduced motion: `html` has no `lenis` class; native momentum scroll; `#section` links land below the navbar via `section[id] { scroll-margin-top }`; drawer/palette still lock scroll (`html` overflow hidden) |
| LENIS-06 | P2 | Desktop | Navigate to another page | New page starts at the top; Lenis still active |
| LENIS-07 | P2 | Desktop | Keyboard: Space, PageDown, End | Scrolls normally |
| LENIS-08 | P2 | Desktop | Mobile drawer open (narrow desktop window 700 px) | Page behind doesn't scroll |

### 5.14 SEO & metadata (SEO)

| ID | P | VP | Steps | Expected |
|---|---|---|---|---|
| SEO-01 | P1 | — | `curl /` | `<title>`, meta description, OG + Twitter tags, canonical, JSON-LD (`Person`, `WebSite`) present |
| SEO-02 | P1 | — | Project & blog detail pages | Own title/description (`generateMetadata`); `og:image` points at `/…/opengraph-image-<hash>`, which returns a 1200×630 PNG: dark green card, kicker, title, subtitle; right panel = cover (PNG/JPEG covers) or orbit graphic (WebP covers) |
| SEO-03 | P1 | — | `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest` | Valid; sitemap lists published projects/posts with absolute URLs |
| SEO-04 | P2 | — | Every page | Exactly one `<h1>` |

### 5.15 Accessibility (A11Y)

| ID | P | VP | Steps | Expected |
|---|---|---|---|---|
| A11Y-01 | P1 | Desktop | Inject axe-core (`npm i axe-core`, `page.addScriptTag`) on SMOKE-01 pages | No `critical`/`serious` violations (list the rest) |
| A11Y-02 | P1 | Desktop | Keyboard-only: Tab from top of `/` to the footer | Every interactive element reachable, visible focus, no traps; drawer traps focus while open |
| A11Y-03 | P2 | Desktop | Images | All content images have `alt`; decorative ones `alt=""`/`aria-hidden` |
| A11Y-04 | P2 | Desktop | Colour contrast on brand orange text (`#ffb800` on white) | Flag failures (known risk for small orange text) |

### 5.16 Performance (PERF)

Measure on a **production build** (`next build && next start -p 3124`), not dev. Mobile = 390×844, DPR 3, CPU throttled 4× (`Emulation.setCPUThrottlingRate`). Measure LCP **without** scrolling (scrolling keeps producing LCP candidates).

Baseline after the performance pass (production build, local server):

| Page | LCP desktop | LCP mobile 4× | CLS | Notes |
|---|---|---|---|---|
| `/` | ~1.3 s | ~3.5 s | 0.002–0.006 | hero idles ≈ 56 fps at 4× CPU, no long tasks |
| `/projects`, `/blog`, details | 0.4–1.3 s | 2.4–2.9 s | ≤ 0.011 | |
| `/contact` | ~0.7 s | ~2.0 s | 0.002 | 347 KB gzip JS (Google Maps not loaded until scrolled near) |

| ID | P | VP | Steps | Expected |
|---|---|---|---|---|
| PERF-01 | P1 | ⇄ | Lighthouse via Chrome (`npx lighthouse http://localhost:3124 --chrome-flags=--headless`) | Performance ≥ 85 desktop / ≥ 70 mobile; record LCP, CLS, TBT |
| PERF-02 | P1 | ⇄ | CLS during hero role rotation + reveals (PerformanceObserver `layout-shift`, 10 s) | CLS < 0.1 — the decoding role text is absolutely positioned over a reserved box |
| PERF-05 | P0 | ⇄ | Append + remove a `<span>` in the footer 60× with forced layout (`document.body.offsetHeight`) | < 1 ms each. **Regression guard:** a root-level `:has()` selector (e.g. `:root:has(.site-root)`) made this ~27 ms and re-styled the whole page on every DOM change — keep public-site scoping on the `html.site` class |
| PERF-06 | P1 | Mobile 4× | Idle 5 s at the hero (rAF counter + `longtask` observer) | ≥ 50 fps, no long tasks (flow-field canvas DPR capped at 1.25 and ≤ 320 particles on small screens) |
| PERF-07 | P1 | Desktop | `/contact` network log at page top | No requests to `maps.google.com` / `maps.gstatic.com` until the map section is within ~300 px of the viewport |
| PERF-08 | P2 | ⇄ | View source of any public page | Navbar site title/logo present in the server HTML (settings are passed from the root layout, no placeholder flash) |
| PERF-03 | P2 | Desktop | Long animation frames while scrolling `/` (Performance API `long-animation-frame`) | No frames > 100 ms during steady scrolling |
| PERF-04 | P2 | — | JS for `/` (`.next` build output) | Motion features load as a separate lazy chunk (`components/motion/features.ts`) |

### 5.17 Admin & auth (ADM) — 🔴 owner logs in

| ID | P | VP | Steps | Expected |
|---|---|---|---|---|
| ADM-01 | P1 | Desktop | `/admin/dashboard` while signed out | Redirect to `/auth/login` |
| ADM-02 | P1 | Desktop | `/auth/sign-up` with a non-whitelisted email — **don't submit with a real address** | Read the UI only; whitelist enforced server-side (`/api/auth/signup`) |
| ADM-03 | 🔴 P2 | Desktop | Owner signs in; open every admin page read-only | Each loads; no console errors; **no saves** |
| ADM-04 | P2 | Desktop | Admin pages visually | Unaffected by public-site CSS changes (`main.css` is only imported by `app/(main)`) |
| ADM-05 | P0 | — | Code check: every exported function in `actions/*.ts` and `app/admin/**/actions.ts` that is admin-only starts with `await requireAdmin()` (`lib/auth-guard.ts`) | `grep -c "await requireAdmin()"` matches the list of admin actions. Server actions are public POST endpoints — the `/admin` redirect does not protect them |
| ADM-06 | P0 | — | Code check: `lib/whitelist.ts` | Exact, case-insensitive match (`_`/`%` escaped); `____@gmail.com` must not match a whitelisted address |
| ADM-07 | 🔴 P1 | Desktop | Owner: open a **draft** project/post, type, wait 6 s / 31 s | One autosave ("Saved"), then nothing more while idle. On a **published** item the badge shows "Unsaved — click Update" and nothing is saved until Update. Toggling status shows "(click Publish/Update to apply)" and does not go live by itself |
| ADM-08 | 🔴 P1 | Desktop | Owner: clear a project URL / remove the cover, Update, reload | Field stays empty (cleared fields are sent as `null`) |
| ADM-09 | 🔴 P2 | Desktop | Owner: Media → upload a large JPEG, a GIF, an SVG, an iPhone HEIC; drag-and-drop; paste a screenshot | JPEG → resized WebP with a size toast; GIF/SVG kept as-is; HEIC converted; SVG with `<script>`/`onload` rejected; a file > 20 MB rejected; uploading the same file twice → "already in the library" |
| ADM-10 | P1 | — | Code check: `lib/image-prep.ts` in a browser (`qa/mobile/imgprep_test.mjs`, Chrome + WebKit, on a localhost page) | Matches ADM-09 without touching storage |
| ADM-11 | P1 | — | Public post/project HTML | Rendered through `sanitizeRichText` (`lib/sanitize.ts`) inside the cached fetchers: no `<script>`, `on*=` or `javascript:` survive; editor formatting does |
| ADM-12 | 🔴 P2 | ⇄ | Newsletter link `…/unsubscribe?email=…&token=…` (owner, own test address) | Unsubscribes immediately. Without/with a wrong token the page says a confirmation email was sent (same message whether or not the address is subscribed) |
| ADM-13 | P1 | — | After the RLS migration `20261118120000_admin_security_hardening.sql` is applied: with the anon key, `select author_email from comments`, `update newsletter_subscribers`, `insert into post_likes`, `update gdpr_consents` | All denied. Owner can still edit everything in /admin |

---

### 5.18 Themes (THEME) — `components/theme/*`, `app/main.css`

| ID | P | VP | Steps | Expected |
|---|---|---|---|---|
| THEME-01 | P0 | ⇄ | Fresh context with `colorScheme: 'dark'`, load `/` | `<html data-theme="dark">` **before first paint** (check in `page.on('domcontentloaded')`); no white flash; body bg ≈ `#0e1311` |
| THEME-02 | P0 | Desktop | Click the sun/moon button in the navbar | Circle wipe from the button (`document.startViewTransition`, ~650 ms); `data-theme` flips; `localStorage.theme` saved; reload keeps the choice |
| THEME-03 | P1 | 📱 | Drawer → Light / Dark / System segmented control | `aria-checked` follows; System follows `prefers-color-scheme` emulation live |
| THEME-04 | P1 | ⇄ | Walk every public page in dark mode | No white blocks, no dark-on-dark text; brand green/orange sections and footer unchanged; text on orange stays dark |
| THEME-05 | P1 | — | `curl` any admin page HTML / check CSS | Dark tokens are scoped to `:root.site[data-theme="dark"]`; the head script skips `html.site` on /admin and /auth and `SiteMarker` removes it on client navigation, so admin stays light (do **not** visit /admin — check the script/CSS instead) |
| THEME-06 | P2 | ⇄ | Toggle under reduced motion | Switches instantly, no wipe |

### 5.19 Command palette (CMDK) — `components/CommandPalette.tsx`

| ID | P | VP | Steps | Expected |
|---|---|---|---|---|
| CMDK-01 | P1 | Desktop | Press Ctrl/⌘+K, then `/` on a fresh page; also the navbar search button | Dialog opens, input focused, page scroll locked |
| CMDK-02 | P1 | Desktop | Type a project title fragment; ↓/↑; Enter | Results ranked (pages, projects, posts); active row follows keys; Enter navigates and closes |
| CMDK-03 | P1 | ⇄ | Run the "Toggle theme" action | Theme flips |
| CMDK-04 | P2 | ⇄ | Esc / click backdrop | Closes; focus returns to the trigger |
| CMDK-05 | P2 | 📱 | Drawer → Search | Palette opens full-width, usable with the on-screen keyboard |

### 5.20 Motion proposals (FX) — `components/motion/*`

| ID | P | VP | Steps | Expected |
|---|---|---|---|---|
| FX-01 | P1 | ⇄ | Hero + footer CTA + 404 | Flow-field canvas animates (H1); bends around the pointer on desktop; stops drawing when off-screen; footer field uses the dark palette in both themes |
| FX-02 | P2 | ⇄ | Between Services and About on `/` | Dot-stream divider (H2) drifts |
| FX-03 | P1 | ⇄ | Section headings + page `h1`s | Letters rise from a mask (T2); `aria-label` holds the full text; all chars end `opacity:1` |
| FX-04 | P1 | ⇄ | Hero role line, availability badge | Text decodes from glyphs (T3) and re-scrambles on each role change; badge links to `/contact`; no layout shift |
| FX-05 | P1 | ⇄ | Scroll the home About bio and `/about` philosophy intro | Words light up with scroll (T4); highlighted words orange |
| FX-06 | P1 | Desktop | Hover navbar + footer links; hover `.btn-fill` buttons | Label rolls up (I1); button fills from the entry point of the cursor and drains toward the exit |
| FX-07 | P1 | Desktop | Move over project cards / blog cards / gallery images | Custom cursor ring grows with "View" / "Read" / "Zoom" (I2); native cursor hidden only there; absent on touch and reduced motion |
| FX-08 | P1 | Desktop | `/projects` → List view | Rows; a cover preview follows the pointer with tilt (I3); filter still applies; Grid view restores the morphing grid |
| FX-09 | P1 | Desktop | `/services` service list | Cards pin and stack, earlier ones scale down/dim (S1); on mobile a normal list |
| FX-10 | P1 | Desktop ≥1024 | Home "Things I've shipped" | Section pins; vertical scroll moves the card row sideways; orange progress bar fills (S2); below lg it's a snap-scroll row |
| FX-11 | P1 | ⇄ | `/about` timeline | Line draws with scroll; dots fill as items pass 60 % of the viewport (S3) |
| FX-12 | P1 | ⇄ | Project cards, blog covers, `/about` photo | Images wipe in from the bottom with a slight zoom-out (C1); project→detail morph still works |
| FX-13 | P2 | Desktop | Skills, services bento, blog grid, `/about` pillars | Border glow follows the cursor across the whole group (C2) |
| FX-14 | P2 | ⇄ | Testimonials | Hidden while `TESTIMONIALS` in `lib/content.ts` is empty; when filled: auto-advance every 6 s with progress bar, pause on hover/focus, arrow keys + swipe (C4) |
| FX-15 | P1 | ⇄ | Reduced motion on all of the above | Final states shown immediately, no canvas animation, no custom cursor, no pinning (plain lists) |
| FX-16 | P1 | ⇄ | Any unknown URL | Themed 404: decoding "404", split heading, fill buttons, rolling quick links, theme toggle works |

## 6. Server invariant checks (read-only SQL)

Run via Supabase MCP `execute_sql`. Record output in `results.md`.

```sql
-- RLS must be on for every public table
select relname, relrowsecurity from pg_class
where relnamespace = 'public'::regnamespace and relkind = 'r' order by relname;

-- No QA leftovers from earlier runs
select 'messages' t, count(*) from public.messages where message ilike '[QA]%' or name ilike '[QA]%'
union all select 'comments', count(*) from public.comments where content ilike '[QA]%' or author_name ilike '[QA]%';

-- Published content has slugs (public routes depend on them)
select 'projects' t, count(*) from public.projects where status = 'published' and (slug is null or slug = '')
union all select 'posts', count(*) from public.posts where status = 'published' and (slug is null or slug = '');
```

Also run Supabase MCP `get_advisors` (security + performance) and list anything new.
Column names match the migrations as of 2026-11-18 — check with `list_tables` if a query fails.

---

## 7. Cleanup

Only after 🔴 tests, only `[QA]` rows / the QA address, and show the owner the `select` before
running any `delete`:

```sql
select id, created_at from public.messages where name ilike '[QA]%' or message ilike '[QA]%';
select id, created_at from public.comments where content ilike '[QA]%' or author_name ilike '[QA]%';
select id, email, status from public.newsletter_subscribers where email = '<QA address>';
-- only if GDPR-02 ran: match the run's fingerprint (localStorage['gdpr_fingerprint'] in the test context)
select id, consent_date from public.gdpr_consents where session_fingerprint = '<fingerprint>';
```

Then stop the dev server (and free the port, §1.3) and delete `test-runs/<date>/node_modules`.

---

## 8. Out of scope / needs a human

- **Real iPhone Safari**: §1.6 covers the WebKit engine, but iOS-specific behaviour (URL bar
  resizing, rubber-band overscroll, Low Power Mode throttling animations) needs a real device —
  spot-check before big releases (Safari Web Inspector over USB from a Mac, or a cloud device farm).
- **Firefox (desktop/Android)**: not covered; spot-check manually before big releases.
- **How motion *feels*** (easing, speed, "too much"): automated checks prove state, not taste.
  The owner reviews screen recordings (`recordVideo` in the Playwright context).
- **Real email delivery** (Brevo / Resend) and the newsletter send flow.
- **Production deployment** (Vercel env vars, image domains, caching).
- Trackpad momentum + Lenis interaction on macOS.
