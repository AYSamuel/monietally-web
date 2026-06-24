# SPEC: EN/DE Internationalization (i18n)

Status: Draft for implementation. Written after a planning interview. No code has been
written yet. Implement this from a fresh session.

## 1. Goal

Make the entire marketing website available in English and German so German speakers can
read it in their own language. English remains the default/fallback. The architecture must
leave room to add more locales later (the brand explicitly promises "more languages on the
way"), so nothing should hardcode a two-locale assumption where a list would do.

## 2. Decisions (locked in the interview)

| Decision | Choice |
| --- | --- |
| Locales (now) | `en` (default), `de` |
| URL strategy | Both prefixed: `/en/...` and `/de/...` |
| Bare `/` behaviour | Middleware auto-detects: saved cookie first, then `Accept-Language`, fallback `en` |
| Library | `next-intl` |
| Legal pages now | Translate UI + marketing now. `privacy`, `terms`, `about`, `delete-account` bodies stay English for now; their chrome (nav/footer/metadata) localizes. German legal copy is a later, reviewed pass. |
| German copy source | I draft all in-scope German during implementation; Ayo arranges a native/financial review before launch. |

### Important correction to project docs
`next.config.js` no longer sets `output: 'export'` (it is currently `{}`), and the site uses
Server Actions (`src/app/actions/waitlist.ts`) + Supabase, which require a server runtime.
The site is server-rendered on Vercel, **not** a static export. This is why middleware-based
locale detection is available. `CLAUDE.md` still says "static export / `output: 'export'`";
that note is stale and should be fixed separately (it will keep misleading decisions).

## 3. Scope

### In scope (translate to German now)
- Root metadata + per-page metadata (titles, descriptions, OG/Twitter).
- `<html lang>` becomes dynamic.
- Navbar, Footer, language switcher (new).
- Landing sections: Hero + 3 feature panels (`ScrollExperience`), `HowItWorks`,
  `MissionBand` (incl. founder quote), `TrustBar`, `FAQ`, `WaitlistCTA`.
- `WaitlistForm` (placeholders, labels, helper text, all status/error messages).
- `lib/constants.ts` tagline + description (used in metadata).
- Email validation messages (`EMAIL_ERROR_MESSAGES`) surfaced in the form.
- About page (`/about`) marketing content. (About is marketing, not legal, so it IS
  translated, despite living near the legal pages.)
- Locale-aware number/currency/date formatting (see §7).
- `hreflang` alternates, sitemap, OG image per locale (see §8).

### Out of scope for now (stays English, revisit later)
- Legal/long-form page bodies: `/privacy`, `/terms`, `/delete-account`. Their nav, footer,
  and metadata still localize; only the document body stays English. Each German legal page
  shows a small, translated notice: "This document is currently available in English only."
- `/auth/callback` body: see open question Q3.
- `/mockups`: dev-only preview page, excluded from localization and the middleware matcher.

### Open decisions to settle at implementation start (see §11)
- German tone: informal **du** (recommended) vs formal **Sie**.
- Phone-mockup in-app UI labels: translate the chrome (recommended) vs keep English.
- `/auth/callback` localization + whether the app's email links can carry a locale.

## 4. Dependencies to add
- `next-intl` (latest v3+). This is a new runtime dependency; it needs Ayo's approval before
  install (per the project's dependency rule). No other deps required.

## 5. Routing & file-structure changes

Adopt the standard next-intl App Router layout. All routes move under a `[locale]` segment.

```
src/
  i18n/
    routing.ts        # defineRouting: locales ['en','de'], defaultLocale 'en', localePrefix 'always'
    navigation.ts     # createNavigation(routing) -> Link, redirect, usePathname, useRouter, getPathname
    request.ts        # getRequestConfig: load messages for the active locale
  middleware.ts       # createMiddleware(routing); matcher excludes /api, /_next, /mockups, static files
  messages/
    en.json
    de.json
  app/
    [locale]/
      layout.tsx          # renders <html lang={locale}>, providers, fonts (moved from app/layout.tsx)
      page.tsx            # landing (moved from app/page.tsx)
      about/page.tsx
      privacy/page.tsx
      terms/page.tsx
      delete-account/page.tsx
      auth/callback/page.tsx   # see Q3
      opengraph-image.tsx      # locale-aware (moved/duplicated from app/opengraph-image.tsx)
    not-found.tsx         # top-level fallback for unmatched/non-locale paths
    sitemap.ts            # both locales (add if missing)
    robots.ts             # if not already present
    mockups/page.tsx      # stays OUTSIDE [locale], dev-only
```

Notes:
- With everything under `[locale]`, `app/[locale]/layout.tsx` becomes the effective root
  layout and owns `<html>`/`<body>`. There is no `app/layout.tsx` (next-intl's canonical
  pattern). Keep a top-level `app/not-found.tsx` for non-localized 404s.
- `localePrefix: 'always'` gives the symmetric `/en` + `/de` URLs chosen. Bare `/` is handled
  by the middleware redirect.
- Middleware uses next-intl's default detection (`localeDetection: true`): it reads the
  `NEXT_LOCALE` cookie, then `Accept-Language`, then falls back to `en`. next-intl writes the
  `NEXT_LOCALE` cookie when a user switches language, satisfying "returning users keep their
  language."
- Static rendering: call `setRequestLocale(locale)` at the top of each localized layout/page
  and add `generateStaticParams` returning `routing.locales.map(l => ({locale: l}))` so both
  locales prerender.

## 6. String externalization

### Message file shape
Namespaced JSON, one namespace per surface. Sketch (keys illustrative, not exhaustive):

```jsonc
{
  "site": { "name": "MonieTally", "tagline": "...", "description": "..." },
  "nav": { "home": "...", "howItWorks": "...", "about": "...", "faq": "...", "joinWaitlist": "...", "toggleMenu": "...", "language": "..." },
  "hero": { "eyebrow": "...", "headline": "...", "subline": "...", "body": "...", "trust": { "free": "...", "eu": "...", "readOnly": "..." } },
  "features": { "activity": { "number": "01", "headline": "...", "subhead": "...", "support": "..." }, "insights": {...}, "budgets": {...} },
  "howItWorks": { "eyebrow": "...", "headline": "...", "steps": { "connect": {...}, "arrive": {...}, "plan": {...} } },
  "mission": { "eyebrow": "...", "headline": "...", "body": "...", "quote": "...", "attribution": "..." },
  "trustBar": { "label": "...", "footnote": "..." },
  "faq": { "eyebrow": "...", "headline": "...", "items": [ { "q": "...", "a": "..." }, ... ] },
  "waitlistCta": { "eyebrow": "...", "headline": "...", "subline": "...", "reassurance1": "...", "reassurance2": "..." },
  "waitlist": {
    "emailPlaceholder": "...", "emailLabel": "...", "submit": "...", "submitting": "...",
    "bankPlaceholder": "...", "bankLabel": "...", "countryPlaceholder": "...", "countryLabel": "...",
    "helper": "...", "successTitle": "...", "successBody": "...",
    "errors": { "format": "...", "disposable": "...", "suspicious": "...", "no_mx": "...", "duplicate": "...", "generic": "..." }
  },
  "footer": { "tagline": "...", "euNote": "...", "product": "...", "company": "...", "rights": "...", "signoff": "...", "instagram": "...", "linkedin": "..." },
  "about": { ... },
  "metadata": { "homeTitle": "...", "homeDescription": "...", "aboutTitle": "...", ... },
  "legalNotice": "This document is currently available in English only."
}
```

### Split/gradient headlines (important)
Several headlines mix a plain part and a gradient-accent `<span>` (and some have a `<br/>`):
- `MissionBand`: "Built for the people big finance apps **overlook.**"
- Hero / `WaitlistCTA`: "Understand your money, / **wherever you bank.**"
- About: "Clarity for everyone **the big apps overlook.**", "More banks. **More countries.**"

Do NOT split these into two separate keys (German word order moves the accent). Use
next-intl rich text: one message per headline with custom tags the translator can place:

```tsx
t.rich('headline', {
  gradient: (chunks) => <span className="text-gradient">{chunks}</span>,
  br: () => <br />,
})
// en: "Understand your money,<br/><gradient>wherever you bank.</gradient>"
// de: translator decides where <gradient> and <br/> fall
```

### Client vs server components
- Server components (`HowItWorks`, `MissionBand`, `TrustBar`, `Footer`, pages): use
  `useTranslations`/`getTranslations` directly; data arrays (`STEPS`, `PRINCIPLES`, `FAQS`,
  `PANELS`) move from module-level constants to being read from messages inside the component,
  or keep the structure/icons in code and pull only the text via keys.
- Client components (`Navbar`, `ScrollExperience`, `WaitlistForm`, `WaitlistCTA`,
  `ThemeToggle`): wrap the app in `NextIntlClientProvider` (in the `[locale]` layout, fed by
  `getMessages()`), then use `useTranslations`.

### Email validation
`validateEmail()` already returns a typed `reason` code; keep it returning codes only. Move
the user-facing strings out of `EMAIL_ERROR_MESSAGES` and resolve them in `WaitlistForm` via
`t('waitlist.errors.' + reason)`. The server action (`actions/waitlist.ts`) already returns
codes, not prose, so it needs no string changes; the form maps codes to translated messages.

### constants.ts
Keep `name`, `url`, `email` in `SITE`. Move `tagline` and `description` into `messages` (they
feed metadata). Update references accordingly.

## 7. Number, currency, and date formatting

Current state: `src/lib/sampleData.ts` hardcodes `toLocaleString("en-US")` and a literal `€`,
and the mockups hardcode English month/day names ("May 2026", "Thursday, May 14"). German uses
`1.234,56 €` (symbol trailing, period thousands, comma decimal) and `DD.MM.` dates.

Work:
- Refactor `formatAmount` / `formatRound` to take a `locale` and use
  `Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR', ... })`.
- Derive month/day labels with `Intl.DateTimeFormat(locale, ...)` from real `Date`s instead of
  hardcoded English strings (`MONTH_LABEL`, `SHORT_MONTH`, day headers in `Activity`).
- The mockups are server components; pass them the active `locale` (via `getLocale()` or the
  `[locale]` param) so their formatters render per locale.
- Dynamic count strings ("across N budgets", "View all N categories") use ICU plurals in the
  message even though the mockup counts are currently fixed sample numbers, to stay correct.

## 8. SEO

- Per-page `generateMetadata(locale)` produces localized `title`/`description`/OG/Twitter, plus
  `alternates.canonical` and `alternates.languages` (`en`, `de`, and `x-default` -> `/en`).
- `app/sitemap.ts`: emit every public route for both locales with `alternates`. Add if absent.
- `app/robots.ts`: allow indexing; keep `/auth/callback` and `/mockups` out of the index
  (the callback already sets `robots: { index: false }`).
- OG image: move `opengraph-image.tsx` under `[locale]` and render locale-specific text, so
  `/de` shares a German social card. (It renders text via the OG image runtime; switch the
  literals to translated strings keyed by locale.)

## 9. Language switcher (new component)

- New `LocaleSwitcher` client component, mounted in `Navbar` beside `ThemeToggle` on both the
  desktop bar and the mobile menu.
- Compact `EN | DE` control to match the minimalist design (not a flag dropdown). Active locale
  emphasized; `aria-label` + `lang` attributes on each option.
- Switches with next-intl navigation (`usePathname` + `useRouter` from `i18n/navigation`):
  replace the locale while preserving the current path and hash. next-intl persists the choice
  via the `NEXT_LOCALE` cookie automatically.
- All internal links in `Navbar` and `Footer` must use next-intl's `Link` (from
  `i18n/navigation`) so they stay within the active locale. Current hrefs (`/`, `/about`,
  `/#how-it-works`, `/#faq`, `/#waitlist`) keep their paths; next-intl prepends the locale.

## 10. German translation guidelines (for the drafting pass)

- **Tone**: default to informal **du** (modern German fintech norm: N26, Trade Republic). Flag
  for confirmation before drafting (Q1). Be consistent across the whole site.
- **Length**: German runs ~30-50% longer. Verify no clipping/overflow on: Navbar links
  ("How it works", "Join waitlist"), the `Get early access` button, hero headline, FAQ
  questions, feature panel headlines. Layouts must wrap gracefully (relates to the standards'
  "tolerate 30-50% text expansion").
- **Currency/date**: `1.234,56 €`, `DD.MM.YYYY`, handled by `Intl` (§7).
- **Proper nouns / do-not-translate**: brand "MonieTally", bank names (Sparkasse, N26, DKB,
  Commerzbank, ING, Volksbank), "GDPR" (use "DSGVO" in German prose), "EU", emails, URLs.
- **Sample data inside mockups** (person name "Vick", merchant names, goal names like "Trip to
  Lisbon"): keep as-is, they are illustrative, not UI copy. (Mockup *chrome* labels are Q2.)

## 11. Open questions (resolve at implementation start)

- **Q1 - German tone**: informal **du** (recommended) or formal **Sie**? Affects every string.
- **Q2 - Mockup chrome**: translate the in-app UI labels shown inside the phone mockups
  (bottom nav "Home/Activity/Budgets/Insights/Profile", "Left this month", "Income", "Spent",
  "Recent", "Search transactions", section titles, budget status text)? Recommended: yes, so
  the product looks native to German viewers. Risk to weigh: if the real app is English-only
  today, a fully German mockup slightly oversells; it is a marketing illustration, which is
  common, but worth a conscious call. Sample *data* stays English either way.
- **Q3 - Auth callback**: localize `/auth/callback` under `[locale]`? It is opened from emails
  sent by the mobile app; showing the right language depends on those email links carrying a
  locale, which is outside this repo. Options: (a) localize and require the app to append the
  locale to the link, (b) keep it locale-agnostic with an in-page language toggle, (c) leave
  English-only for now. Recommended: (c) for this pass, revisit with the app team.

## 12. Verification plan

- Build passes; `/en`, `/de`, and every localized route render.
- Bare `/` redirects: cookie wins; otherwise `Accept-Language: de` -> `/de`, else `/en`.
- Language switcher swaps locale in place, preserves path + hash, and the choice survives a
  reload (cookie).
- `<html lang>` matches the active locale on every page.
- `hreflang` alternates present and correct; sitemap lists both locales.
- No raw English leaks on `/de` for in-scope surfaces; legal bodies show the English-only
  notice in German chrome.
- Responsive + German-length check: small phone, large phone, tablet, ~200% text scale, with
  German strings in place (longest-copy locale is the real stress test).
- Currency/date render in German format on `/de` mockups.
- Mobile centering work from the prior change still holds with longer German text.

## 13. Suggested phasing (implementation)

1. Framework: add `next-intl`, `i18n/*`, `middleware.ts`, move routes under `[locale]`,
   dynamic `<html lang>`, providers, English messages extracted (site still English, now
   fully keyed). Verify nothing regressed in English.
2. Language switcher + locale-aware links + metadata/hreflang/sitemap/OG.
3. Locale-aware formatting (§7).
4. Draft German messages for all in-scope surfaces; legal English-only notice.
5. German review (Ayo) -> corrections.

## 14. Files touched (summary)

New: `i18n/routing.ts`, `i18n/navigation.ts`, `i18n/request.ts`, `middleware.ts`,
`messages/en.json`, `messages/de.json`, `components/LocaleSwitcher.tsx`, `app/sitemap.ts`
(if missing), `app/not-found.tsx`.

Moved under `app/[locale]/`: `layout.tsx`, `page.tsx`, `about/`, `privacy/`, `terms/`,
`delete-account/`, `auth/callback/` (pending Q3), `opengraph-image.tsx`.

Edited for keys/locale: `Navbar`, `Footer`, `WaitlistForm`, `ThemeToggle`, all
`components/sections/*`, `components/landing/ScrollExperience.tsx`, `components/landing/
mockups/*`, `lib/constants.ts`, `lib/emailValidation.ts` (strings out, codes stay),
`lib/sampleData.ts` (locale-aware formatters). `actions/waitlist.ts`: no string changes
(already code-based).

Unchanged/excluded: `components/SmoothScroll.tsx`, `app/mockups/page.tsx` (dev-only).
