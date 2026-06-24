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

App Router pages live in `src/app/`. Routes: `/` (landing), `/about`, `/privacy`, `/terms`, `/delete-account`, `/auth/callback` (email-link fallback, noindex), and `/mockups` (dev-only preview). Navigation anchors (`/#how-it-works`, `/#faq`, `/#waitlist`) use smooth scroll (Lenis via the `SmoothScroll` wrapper, plus `scroll-behavior: smooth` in globals.css).

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

The landing page and legal pages are built. Current known work:

1. **i18n (EN/DE)**, planned and specced in `SPEC-i18n.md`: add `next-intl`, move routes under `app/[locale]/`, externalize all copy into `messages/{en,de}.json`, add a locale switcher. Not yet started.
2. **German legal copy**, the `/privacy`, `/terms`, and `/delete-account` bodies stay English until a reviewed German translation lands (per the i18n spec).
3. Replace the placeholder social links (`href="#"` for Instagram/LinkedIn in `Footer.tsx`) before launch.

`WEBSITE_PLAN.md` is an early planning document and is now largely historical; trust the code over it where they disagree.
