# App Mockups → Landing Page

This document is for future-you (or future engineer) working on the marketing site. It exists so you don't end up rebuilding screens from scratch when the Flutter app already has pixel-perfect HTML mockups for every shipped feature.

## TL;DR

The app team has been designing every screen as a self-contained HTML+CSS file in `C:\Users\AY\Desktop\monietally\design-mockups\` *before* writing Flutter. Each file shows the screen at 320×696 inside a phone frame, in dark + light, sometimes with multiple states (idle, focused, empty, etc.). These are the design canon for the app.

For the marketing site, **don't take screenshots, don't redesign, don't redraw.** Port each mockup into a React component (one component per screen variant), keeping the HTML structure 1:1. The HTML mockup remains the source of truth; the React port is the production render. When a mockup updates, the matching React component updates with the same diff.

## Why this approach (not screenshots, not iframes)

**Not screenshots:** they go stale the moment we iterate the app. They also can't reflow for dark/light, can't animate, can't be lazy-loaded properly, and they hurt SEO (no real text in them).

**Not iframes of the HTML mockups:** iframes are awkward for SEO, accessibility, and integrating with the page's scroll-triggered animations. They also pull in font loaders / CSS resets / style isolation that conflicts with the host page.

**Yes, React ports of the mockups:** real DOM, real text (good for SEO), themes via CSS variables (so the existing Next.js `next-themes` setup just works), animatable on scroll, accessible. Cost: ~30 minutes per screen to port.

## Inventory — what mockups exist today

All paths relative to the **app repo** (`monietally/design-mockups/`):

| File | Screen | States in mockup | Landing-page candidate |
|---|---|---|---|
| `01-splash.html` | Splash | Single | Maybe (brand intro) |
| `02-onboarding.html` | Onboarding (3 slides) | All slides | Yes — "Three reasons" section |
| `03-account-choice.html` | Account choice | Single | No (auth-only) |
| `04a-email-input.html` | Email input | Single | No (auth-only) |
| `04b-password.html` | Password | Sign-up + sign-in | No (auth-only) |
| `05-currency.html` | Currency setup | Single | Maybe (multi-currency story) |
| `06-pin-create.html` | PIN create | Single | Yes — "Privacy" section (visual proof) |
| `07-pin-confirm.html` | PIN confirm | Single | Maybe (alongside 06) |
| `08-biometric.html` | Biometric setup | Single | Yes — "Privacy" section |
| `09-name-collection.html` | Name collection | Single | No |
| `10-home.html` | **Home dashboard** | **3 states** (welcome / spent-only / populated) | **Yes — Hero** |
| `11-activity.html` | **Activity + detail** | 6 phones (list, detail, 4 empty states) | **Yes — Features** |
| `12-add-edit-transaction.html` | **Add/edit transaction** | 3 input states + category sheet | **Yes — Features** |

**Bolded = the screens with the strongest marketing value.** They're the ones that should anchor the landing-page hero and the feature sections.

## Mapping to landing-page sections

Per `WEBSITE_PLAN.md`, the landing has these sections (planned or built). Here's which mockup feeds which section:

| Landing section | Mockup(s) to render | What the user sees |
|---|---|---|
| **Hero** | `10-home.html` (populated state, dark) | A single dark phone showing the populated Home dashboard with "+$2,847 LEFT THIS MONTH". This is the hero shot — it conveys "I see my money clearly" in one glance. Optionally fan two more phones behind it (Activity + Add transaction) for the staggered look the plan describes. |
| **Features section** | `11-activity.html` (Activity dark, light), `12-add-edit-transaction.html` (idle dark) | Three feature cards. Card 1 = "Log in seconds" with the Add transaction phone. Card 2 = "See where your money goes" with Activity. Card 3 = "On-device, private" with biometric / PIN screens. |
| **How It Works** | `02-onboarding.html` (each slide), `12-add-edit-transaction.html` (idle), `10-home.html` (populated) | Three-step illustration: 1) "Set up in 30 seconds" (onboarding slide), 2) "Tap + and log a spend" (add transaction), 3) "See your month at a glance" (home). |
| **Privacy section** | `06-pin-create.html`, `08-biometric.html` | Visual proof of "encrypted so only your devices can read it" — show the actual security setup screens, not stock illustrations. |
| **Empty-state showcase** (optional) | `10-home.html` welcome state, `11-activity.html` truly empty | "Beautiful from day one" — show the welcome states, not the populated ones. Differentiates against apps that look broken until you've used them for two weeks. |

Three mockups still need to be designed in the app repo before the landing page can fully populate:
- `13-budgets.html` (Phase 5.4 deliverable)
- `14-insights.html` (Phase 5.5 deliverable)
- `15-savings.html` (Phase 5.6 deliverable)

Once those land, this table extends accordingly.

## Implementation strategy

### Step 1 — `<PhoneMockup variant="..." theme="dark|light" />`

The website plan already references a `PhoneMockup.tsx` component with three placeholder variants (`dashboard | chart | transactions`). **Replace those placeholders with real ports of the app mockups.** Suggested variant names matching the app file numbering:

```
type PhoneMockupVariant =
  | 'home-populated'   // 10-home.html populated
  | 'home-welcome'     // 10-home.html welcome (zero transactions)
  | 'activity'         // 11-activity.html list
  | 'transaction-detail' // 11-activity.html detail
  | 'add-transaction'  // 12-add-edit-transaction.html idle
  | 'pin-setup'        // 06-pin-create.html
  | 'biometric'        // 08-biometric.html
  | 'onboarding-1' | 'onboarding-2' | 'onboarding-3'  // 02-onboarding.html
```

Each variant is a small JSX subtree that mirrors the corresponding `<div class="screen dark|light">` block in the HTML mockup, 1:1. No simplification — same dimensions, same structure, same hairlines.

### Step 2 — phone frame as a shared wrapper

The phone frame (status bar, dynamic island, home indicator, rounded outer frame) is identical across every mockup. Pull it into a single `<PhoneFrame theme>` wrapper. Variants render *inside* it:

```tsx
<PhoneFrame theme="dark">
  <HomePopulated />
</PhoneFrame>
```

### Step 3 — translate mockup CSS to Tailwind

The mockups use vanilla CSS with custom properties (`--ink`, `--cream`, etc.) and a few utility classes. The web project already has these tokens in `tailwind.config.ts` (`--brand-ink`, `--brand-cream`, etc.). Just map them. Use Tailwind for everything; keep arbitrary CSS to a minimum.

### Step 4 — text content

Real text inside the phone (e.g., "LEFT THIS MONTH", "+$2,847.50", transaction descriptions) should be **real text in the DOM**, not images. This is good for SEO and for hover/scroll animations. Pull realistic placeholder data from a `lib/sampleData.ts` so multiple variants stay coherent (don't show a $2,847 net on the home phone and a $58 transaction on the Activity phone — make the numbers tell a consistent story).

### Step 5 — keep the two in sync

The HTML mockup is the source of truth. When you iterate a screen in the app, **also update the matching React variant**. Add a comment at the top of each variant pointing back at the source file:

```tsx
// Mirrors monietally/design-mockups/10-home.html (populated state).
// Update both files when the design changes.
export function HomePopulated() { … }
```

A weekly diff sweep keeps drift down — `git diff monietally/design-mockups/10-home.html` since the last landing-page commit tells you exactly what to port.

## What about animations?

Each variant should be static markup. Animations live at the **section level** (scroll-into-view fades, parallax tilt on the phone frames, etc.) using the existing `useScrollReveal` hook from `WEBSITE_PLAN.md`. Keep the variant components dumb — they just render the screen. Movement is the section's job.

## What about responsive?

The phone is always 320×696 inside its frame. On mobile (the website is being viewed on a phone), shrink the entire `<PhoneFrame>` proportionally with `transform: scale(0.7)` rather than reflowing the contents. The phone is an *image of an app* — it should look like a phone, not like the actual web page.

## Migration order (when building the landing page)

1. Hero with one variant: `home-populated` dark. Ship the section.
2. Features with three variants: `add-transaction`, `activity`, `biometric`.
3. How It Works with three variants: `onboarding-2`, `add-transaction`, `home-populated`.
4. Privacy with two variants: `pin-setup`, `biometric`.
5. Add Budget / Insights / Savings variants as Phase 5.4–5.6 of the app ships.

Each step is one PR. Don't build all variants up front — build them as the section that needs them gets built.

## File layout to expect on the website side

```
src/
  components/
    landing/
      PhoneFrame.tsx              # shared frame + chrome
      mockups/
        HomePopulated.tsx
        HomeWelcome.tsx
        Activity.tsx
        TransactionDetail.tsx
        AddTransaction.tsx
        PinSetup.tsx
        Biometric.tsx
        Onboarding1.tsx
        Onboarding2.tsx
        Onboarding3.tsx
      sections/
        Hero.tsx                  # consumes HomePopulated
        Features.tsx              # consumes Activity, AddTransaction, Biometric
        HowItWorks.tsx            # consumes Onboarding2, AddTransaction, HomePopulated
        Privacy.tsx               # consumes PinSetup, Biometric
  lib/
    sampleData.ts                 # shared $ values, txn names so phones tell one story
```

## What this avoids

The screenshot dance. We don't need to:
- Run the app, screenshot every screen, edit out status bars, save to `/public/screenshots/`
- Re-screenshot every time we iterate a screen design
- Maintain dark + light + multiple-state versions of the same screenshot
- Worry about device-specific safe areas, status bar fonts, time strings, etc.

The mockup ports are device-independent, theme-aware, and update with the design naturally.

## Cross-references

- `monietally/design-mockups/` — the source-of-truth mockups
- `monietally/MONIETALLY_DESIGN.md` — design system tokens, component specs
- `monietally-web/WEBSITE_PLAN.md` — landing page structure (sections, copy, layout)
- `monietally/MONIETALLY_IMPLEMENTATION_PLAN.md` § Phase 5 — schedule for which mockups ship when
