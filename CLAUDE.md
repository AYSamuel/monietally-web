# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Dev server at http://localhost:3000
npm run build    # Production build (serverless, not static export)
npm run start    # Start production server locally
npm run lint     # ESLint via Next.js
```

No test suite is configured. After UI changes, start the dev server and verify visually.

## Architecture

**Next.js 14 App Router, TypeScript, Tailwind CSS 3, server-rendered on Vercel.**

The site is server-rendered (SSR / serverless functions on Vercel), NOT a static export. `next.config.js` is currently empty (`{}`): there is no `output: 'export'` and no `images: { unoptimized: true }`, so the Next.js `<Image>` optimiser is available. The waitlist depends on a Server Action (`src/app/actions/waitlist.ts`) and Supabase, both of which require the server runtime, so static export is not an option. `npm run build` produces a serverless build, not an `out/` directory.

Path alias `@/*` maps to `./src/*`.

### Routing

All App Router pages live under `app/[locale]/` (locales `en`/`de`, so e.g. `/en`, `/de/about`): the landing (`/[locale]`), `about`, `privacy`, `terms`, `delete-account`, plus `auth/callback` (email-link fallback, noindex, body stays English) and `mockups` (dev-only preview). See the **i18n (EN/DE)** section below for the full routing/middleware/layout shape and why everything is under `[locale]`. Navigation anchors (`/#how-it-works`, `/#faq`, `/#waitlist`) use smooth scroll (Lenis via the `SmoothScroll` wrapper, plus `scroll-behavior: smooth` in globals.css) and the locale-aware `Link` from `@/i18n/navigation`.

### Theme system

Dark/light mode uses **two layers**:
1. `next-themes` manages the `dark` class on `<html>` via `ThemeProvider` in the root layout.
2. `globals.css` defines all colours as CSS custom properties on `:root` and `.dark`, components consume `var(--token-name)` tokens, never raw hex values.
3. Tailwind `darkMode: 'class'` strategy, utility classes like `dark:bg-...` work, but the project primarily uses CSS variables for theming.

### Component organisation

```
src/components/
  Navbar.tsx          # "use client", sticky, mobile hamburger, theme toggle
  Footer.tsx
  ThemeToggle.tsx     # "use client", SSR-safe (useEffect before rendering icon)
  WaitlistForm.tsx    # "use client", posts via the submitWaitlist Server Action;
                      #   idle/loading/success/duplicate/no_mx/error states
  PhoneMockup.tsx     # phone render helpers
  PhoneCarousel.tsx   # "use client"
  SmoothScroll.tsx    # "use client", Lenis smooth-scroll wrapper (in root layout)
  landing/
    PhoneFrame.tsx          # fixed 336x712 device frame
    ScrollExperience.tsx    # "use client", exports Hero + Features
                            #   (alternating phone/text reveal panels)
    mockups/                # in-phone screens: HomePopulated, Activity, Insights,
                            #   Budgets, Savings, AddTransaction, Onboarding2
  sections/
    HowItWorks.tsx
    MissionBand.tsx
    TrustBar.tsx
    WaitlistCTA.tsx   # "use client"
    FAQ.tsx           # "use client", accordion
```

Note: the older `Hero`/`Features` split lives inside `landing/ScrollExperience.tsx` (it
exports both), not as separate `sections/` files. Interactive components carry `"use client"`;
server components have no directive.

### Design tokens

`tailwind.config.ts` extends Tailwind with the full token set: brand colours (`brand-blue: #4E6FD9`, `brand-purple: #6B5BC9`), accent colours (pink, orange, cyan, green), dark/light surface scales, 6 named gradient backgrounds, and custom animations (`fade-in`, `fade-in-up`, `slide-up`, `float`, `glow`).

Animation stagger utilities (`.animate-delay-100` through `.animate-delay-500`) and `.animate-gradient` are in `globals.css` `@layer utilities`.

Reusable component classes in `globals.css` `@layer components`:
- `.text-gradient`, blue→purple gradient text
- `.glass`, backdrop-blur glassmorphism card
- `.surface-card` / `.surface-card-elevated`
- `.section-container`, `max-w-6xl mx-auto px-6 md:px-8`
- `.btn-primary` / `.btn-secondary`
- `.feature-icon`, 44 × 44px icon container

### Lib and hooks

```
src/lib/
  constants.ts        # SITE object: name, tagline, description, url, email
  supabase.ts         # Supabase client (throws on missing env vars at startup)
  emailValidation.ts  # validateEmail() — format regex, 600+ disposable domains, suspicious local parts

src/hooks/
  useScrollReveal.ts  # IntersectionObserver — returns { ref, isVisible }, respects prefers-reduced-motion
  useReducedMotion.ts # Returns boolean from matchMedia("(prefers-reduced-motion: reduce)")
```

`useScrollReveal` is the standard pattern for scroll-triggered animations. Pass `threshold` (default 0.15). When `prefers-reduced-motion` is set, `isVisible` is immediately `true` (no animation delay).

### Email validation and waitlist flow

Email validation runs in three places:
1. **Client-side (on blur/submit):** `validateEmail()` — instant format, disposable domain, and suspicious local part checks.
2. **Server-side (Server Action):** Same checks, plus `domainHasMxRecord()` — DNS MX lookup with a 4-second timeout (fails open on timeout, fails closed on ENOTFOUND/ENODATA).
3. **Database-side:** Unique constraint on the `waitlist.email` column catches duplicates.

`WaitlistForm` accepts a `source` prop (`'hero' | 'cta'`) to track which form submitted. The server action returns typed `WaitlistResult` — never throws to the client.

### External integrations

- **Supabase**, the waitlist Server Action (`src/app/actions/waitlist.ts`) inserts into the `waitlist` table via the client in `src/lib/supabase.ts`. Validation runs in three layers (see above). There is no Formspree; references to it in older docs are obsolete.
- **Vercel**, `vercel.json` configures security headers (X-Frame-Options, X-XSS-Protection, etc.).
- **Fonts (`next/font/google`)**, Inter (body) and Fraunces (display) are loaded in `src/app/layout.tsx` and exposed as `--font-body` / `--font-display`. Not a CSS `@import`.

## Pending work

The landing page and legal pages are built, and EN/DE i18n is implemented. Current known work:

1. **German native review**, all German copy in `messages/de.json`, including the now fully-translated legal pages, was drafted during implementation (informal *du* tone) and still needs a native/financial (and, for the legal pages, legal) review before launch (per `SPEC-i18n.md` §13 phase 5).
2. **Legal pages are now fully translated** (`/privacy`, `/terms`, `/delete-account` bodies live in `messages/{en,de}.json` under `privacyPage`/`termsPage`/`deleteAccountPage`; the old English-only `legal.notice` is gone). This drafted German legal copy is the most review-sensitive part of the catalog. Governing-law wording stays jurisdiction-neutral (no registration specifics); "DELETE" confirmation keyword and provider names (GoCardless, finAPI) are kept literal.
3. Replace the placeholder social links (`href="#"` for Instagram/LinkedIn in `Footer.tsx`) before launch.
4. **`/auth/callback` German body (deferred)**, the page now lives under `[locale]` (so `/en/auth/callback`, `/de/auth/callback`) but its instructional body stays English for now (SPEC-i18n Q3); the bare emailed `/auth/callback` is middleware-redirected to the detected/default locale. Translate the body once the mobile app's email links can carry a locale.

`WEBSITE_PLAN.md` is an early planning document and is now largely historical; trust the code over it where they disagree.

## i18n (EN/DE)

Implemented with **next-intl v4** (`SPEC-i18n.md` is the source spec). Key points:

- **Routing**: ALL routes live under `app/[locale]/` (`en`, `de`; default `en`, `localePrefix: 'always'`, so `/en/...` and `/de/...`), including `auth/callback` and `mockups`. `src/middleware.ts` resolves bare `/` (cookie `NEXT_LOCALE` -> `Accept-Language` -> `en`) and writes the cookie on switch; its matcher excludes only `/api`, `/_next`, `/_vercel`, and dotted asset paths, so a bare `/auth/callback` (the mobile app's email link) is redirected to `/<locale>/auth/callback`.
- **Layouts**: canonical next-intl shape, `app/[locale]/layout.tsx` is the single root layout, owns `<html lang={locale}>`/`<body>` and the providers, validates the param (`hasLocale` -> `notFound`), and calls `setRequestLocale`. There is intentionally **no** `app/layout.tsx`: a non-localized root that reads `getLocale()` once does not re-render on a client-side locale switch, so `<html lang>` and the intl context go stale and the switcher doubles the prefix (`/de/de`). Keeping the root under `[locale]` makes it re-render per locale, which is why `auth/callback` and `mockups` were pulled under `[locale]` too (they need `<html>`/providers and a valid lang). 404s use `app/[locale]/not-found.tsx`.
- **Config**: `src/i18n/{routing,navigation,request}.ts` (defineRouting / createNavigation / getRequestConfig). Internal links use the `Link` from `@/i18n/navigation` so they stay in-locale. `next.config.js` wraps the config with `createNextIntlPlugin`.
- **Messages**: namespaced JSON in `messages/{en,de}.json` (one namespace per surface). Split/gradient headlines use next-intl rich text (`<gradient>`, `<br>` tags) so German word order can place the accent. `lib/constants.ts` keeps only `name`/`url`/`email`; tagline/description moved into messages. `lib/emailValidation.ts` returns codes only; `WaitlistForm` maps them via `t('waitlist.errors.<reason>')`.
- **Formatting**: `lib/sampleData.ts` exposes locale-aware `formatAmount`/`formatRound` (`Intl.NumberFormat` EUR) and date helpers (`formatMonthYear`/`formatWeekdayDate`/`formatMonthDay` via `Intl.DateTimeFormat`). The four landing mockups (`HomePopulated`, `Activity`, `Insights`, `Budgets`) read the active locale via `useLocale()` and chrome via `useTranslations('mockups')`; sample brand/merchant names stay as-is. The dev-only mockups (`Savings`, `AddTransaction`, `Onboarding2`) are not localized.
- **SEO**: per-page `generateMetadata` sets localized title/description plus `alternates` (canonical + `hreflang` en/de/x-default via `lib/seo.ts`). `app/sitemap.ts` and `app/robots.ts` cover both locales; `app/[locale]/opengraph-image.tsx` renders locale-specific card text.
- **Switcher**: `components/LocaleSwitcher.tsx` (compact `EN | DE`) sits in the desktop nav and inside the mobile dropdown menu (kept out of the compact mobile top bar to avoid crowding the hamburger).
