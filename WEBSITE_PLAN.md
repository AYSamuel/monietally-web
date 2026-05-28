# MonieTally Website, Build Plan

> ⚠️ **SUPERSEDED (2026-05-28).** This early plan is replaced by `SPEC.md`, which holds the current copy, structure, and privacy guard rails (including the rule not to claim "your data never leaves your device"). Kept for historical reference only; follow `SPEC.md`.

> **Status:** Planning  
> **Last updated:** 2026-04-30  
> **Target:** monietally.com (or monietally.com), currently deployed via Vercel

---

## 1. Overview

A modern, premium landing site for **MonieTally**, a privacy-first personal finance app. The site serves two purposes: (1) communicate what MonieTally is and build trust, and (2) collect waitlist signups via email.

### Design direction

| Attribute       | Decision                                                     |
| --------------- | ------------------------------------------------------------ |
| Visual style    | **Dark & premium** as the default feel (Linear / Vercel aesthetic), with full **light/dark mode** support |
| Imagery         | **Real app screenshots** inside phone frames. Stylized code mockups as placeholders until the app UI is finalized |
| Copy tone       | **Confident & direct**, short, punchy, authoritative. No fluff |
| Animations      | **Rich & dynamic**, scroll-triggered reveals, floating mockups, gradient animations, subtle parallax |
| Hero layout     | **Centered** headline + subtext on top, three phone mockups fanned/staggered below |

### Pages

| Page     | Route      | Purpose                                                    |
| -------- | ---------- | ---------------------------------------------------------- |
| Landing  | `/`        | Hero, trust bar, features, how-it-works, privacy, regions, testimonials, waitlist CTA |
| About    | `/about`   | Product mission & philosophy, why MonieTally exists           |
| Privacy  | `/privacy` | Standard legal privacy policy                               |
| Terms    | `/terms`   | Standard legal terms of service                             |

---

## 2. Tech Stack

| Layer            | Tool                            | Why                                                         |
| ---------------- | ------------------------------- | ----------------------------------------------------------- |
| Framework        | **Next.js 14** (App Router)     | React-based, great SEO with static export, seamless Vercel deploy |
| Styling          | **Tailwind CSS 3.4**            | Utility-first, design-system-friendly, dark mode via `class` strategy |
| Theme switching  | **next-themes**                 | System preference detection + manual toggle, SSR-safe        |
| TypeScript       | **TypeScript 5**                | Type safety across components                                |
| Waitlist backend | **Supabase** (PostgreSQL)       | Stores waitlist emails in a real database; queryable, manageable via dashboard |
| Email delivery   | **None yet** (add Resend when domain is ready) | UI confirmation only at launch; transactional email added post-domain |
| Scroll animation | **Intersection Observer** (native) | No dependency, custom hook for scroll-triggered reveals   |
| Hosting          | **Vercel** (already configured) | Zero-config deploys from Git, edge CDN                       |
| Output           | **Next.js on Vercel** (serverless)     | Removes `output: 'export'`; enables API routes and Server Actions for the Supabase backend |

### Project structure

```
MonieTally/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout, fonts, theme provider, metadata
│   │   ├── page.tsx                # Landing page (assembles all sections)
│   │   ├── globals.css             # Tailwind directives + CSS custom properties
│   │   ├── about/
│   │   │   └── page.tsx            # About / Mission page
│   │   ├── privacy/
│   │   │   └── page.tsx            # Privacy Policy
│   │   └── terms/
│   │       └── page.tsx            # Terms of Service
│   ├── components/
│   │   ├── Navbar.tsx              # Sticky nav with mobile menu + theme toggle
│   │   ├── Footer.tsx              # Links, brand, copyright
│   │   ├── ThemeToggle.tsx         # Sun/moon icon toggle
│   │   ├── WaitlistForm.tsx        # Email input + Formspree submit
│   │   ├── PhoneMockup.tsx         # Reusable phone frame (accepts screenshot or placeholder)
│   │   └── sections/
│   │       ├── Hero.tsx            # Headline + CTAs + phone mockups
│   │       ├── TrustBar.tsx        # 4-stat row (100% local, AES-256, 3 regions, 0 cloud)
│   │       ├── Features.tsx        # 6-card grid of capabilities
│   │       ├── HowItWorks.tsx      # 3-step flow with connecting line
│   │       ├── PrivacySection.tsx  # "Your data. Your device." manifesto
│   │       ├── RegionMap.tsx       # Europe / Africa / North America cards
│   │       ├── Testimonials.tsx    # Placeholder quotes (swap in real ones later)
│   │       └── WaitlistCTA.tsx     # Final CTA section with gradient bg
│   ├── hooks/
│   │   ├── useScrollReveal.ts      # Intersection Observer hook for animate-on-scroll
│   │   └── useReducedMotion.ts     # Respects prefers-reduced-motion
│   └── lib/
│       └── constants.ts            # Site-wide strings, links, metadata
├── public/
│   ├── screenshots/                # App screenshot PNGs (added later)
│   │   ├── dashboard.png
│   │   ├── transactions.png
│   │   └── charts.png
│   ├── og-image.png                # Open Graph share image
│   └── favicon.svg                 # MonieTally logo favicon
├── tailwind.config.ts              # Design system tokens
├── postcss.config.js
├── next.config.js                  # Static export config
├── tsconfig.json
├── package.json
├── vercel.json                     # Security headers
└── .gitignore
```

---

## 3. Design System

### 3.1 Color tokens

All colors are defined as **Tailwind custom colors** in `tailwind.config.ts` and mirrored as **CSS custom properties** in `globals.css` for runtime theme switching.

#### Brand palette (from the Flutter app's `app_colors.dart`)

| Token             | Hex       | Usage                         |
| ----------------- | --------- | ----------------------------- |
| `brand-blue`      | `#4E6FD9` | Primary brand, CTAs, links    |
| `brand-purple`    | `#6B5BC9` | Secondary brand, gradients    |
| `brand-deep-blue` | `#3D4FA8` | Deep accents                  |
| `brand-royal`     | `#4A5DC9` | Alternate primary             |

#### Accent palette

| Token          | Hex       | Usage                           |
| -------------- | --------- | ------------------------------- |
| `accent-pink`  | `#E85D8A` | Expense, attention, highlights  |
| `accent-orange`| `#E67A3D` | Warnings, warm accents          |
| `accent-cyan`  | `#00B8D9` | Info, cool accents              |
| `accent-green` | `#00C98B` | Income, success, positive       |

#### Surface tokens (theme-aware via CSS variables)

| Token               | Light mode  | Dark mode   |
| -------------------- | ----------- | ----------- |
| `--bg-primary`       | `#F8F9FD`   | `#0A0B0D`   |
| `--bg-secondary`     | `#FFFFFF`   | `#12131A`   |
| `--surface`          | `#FFFFFF`   | `#16171D`   |
| `--surface-elevated` | `#F5F6FA`   | `#1D1E26`   |
| `--text-primary`     | `#1A1B1E`   | `#E8E9ED`   |
| `--text-secondary`   | `#6B6C73`   | `#8A8B95`   |
| `--text-tertiary`    | `#9B9BA5`   | `#5A5B65`   |
| `--border`           | `#D1D2D9`   | `#2D2E35`   |
| `--border-subtle`    | `#E8E9EE`   | `#23242B`   |
| `--nav-bg`           | `rgba(255,255,255,0.85)` | `rgba(10,11,13,0.85)` |

#### Gradients

| Name                | Value                                      | Usage                  |
| ------------------- | ------------------------------------------ | ---------------------- |
| `gradient-hero`     | `135deg, #2D3E85 → #4A4A92`               | Hero background glow   |
| `gradient-card-blue`| `135deg, #4E6FD9 → #6B5BC9`               | Primary gradient cards  |
| `gradient-cta`      | `135deg, #2D3E85 → #4A4A92`               | Waitlist CTA section   |
| `gradient-ocean`    | `135deg, #008FA8 → #3D4FA8`               | Accent sections        |

### 3.2 Typography

| Element     | Font        | Size (mobile / desktop) | Weight |
| ----------- | ----------- | ----------------------- | ------ |
| H1 (hero)   | Inter       | 36px / 60px             | 700    |
| H2 (section)| Inter       | 30px / 40px             | 600    |
| H3 (card)   | Inter       | 16px / 18px             | 600    |
| Body        | Inter       | 14px / 16px             | 400    |
| Small/label | Inter       | 12px / 13px             | 500    |
| Section tag | Inter       | 11px / 12px             | 500, tracking-widest, uppercase |

### 3.3 Spacing & Radius

| Token         | Value  | Usage                    |
| ------------- | ------ | ------------------------ |
| Section padding (y) | `5rem / 7rem` | Between major sections |
| Card padding  | `1.5rem` | Inside feature cards     |
| Card radius   | `16px`   | All cards                |
| Button radius | `12px`   | All buttons              |
| Icon container| `44px`   | Feature icon backgrounds |
| Max content width | `72rem (1152px)` | Section container  |

### 3.4 Shadows

| Token            | Light mode                        | Dark mode                          |
| ---------------- | --------------------------------- | ---------------------------------- |
| `--shadow-sm`    | `0 1px 3px rgba(0,0,0,0.06)`     | `0 1px 3px rgba(0,0,0,0.3)`       |
| `--shadow-md`    | `0 4px 12px rgba(0,0,0,0.08)`    | `0 4px 12px rgba(0,0,0,0.4)`      |
| `--shadow-lg`    | `0 8px 30px rgba(0,0,0,0.1)`     | `0 8px 30px rgba(0,0,0,0.5)`      |
| `--shadow-glow-blue` | `0 0 40px rgba(78,111,217,0.15)` | `0 0 60px rgba(78,111,217,0.2)` |

### 3.5 Component classes (defined in globals.css `@layer components`)

| Class                | Description                                       |
| -------------------- | ------------------------------------------------- |
| `.text-gradient`     | Blue→purple gradient text                         |
| `.glass`             | Glassmorphism: blurred background + subtle border |
| `.surface-card`      | Themed card: `--surface` bg + border + 16px radius|
| `.section-container` | `max-w-6xl mx-auto px-6 md:px-8`                 |
| `.section-label`     | Uppercase tracking-wide label in tertiary color   |
| `.section-heading`   | `text-3xl md:text-4xl font-semibold tracking-tight`|
| `.btn-primary`       | Blue→purple gradient button with hover lift       |
| `.btn-secondary`     | Ghost button with border and hover fill           |
| `.feature-icon`      | 44px rounded-xl icon container                    |

---

## 4. Page-by-Page Specification

### 4.1 Landing Page (`/`)

#### Section 1, Navbar (sticky)

- **Left:** Logo icon (gradient rounded square with pulse/chart SVG) + "MonieTally" wordmark
- **Center (desktop):** Links, Features, Privacy, About
- **Right:** Theme toggle (sun/moon) + "Get early access" CTA button
- **Mobile:** Hamburger → slide-down menu with all links
- **Behavior:** Sticky top, glass backdrop blur, border-bottom in theme color
- **Animation:** None (always visible)

#### Section 2, Hero

- **Layout:** Centered, stacked vertically
- **Content (top to bottom):**
  1. **Badge pill:** Green dot + "Every transaction leaves a trace", small rounded pill
  2. **Headline:** "Your finances. **Beautifully traced.**", H1, gradient on "Beautifully traced."
  3. **Subtext:** "MonieTally automatically captures every transaction and transforms your spending into clear, visual stories, all without ever leaving your device.", body text, secondary color
  4. **Waitlist form:** Email input + "Get early access" button, inline on desktop, stacked on mobile
  5. **Phone mockups:** Three phones in a fan arrangement:
     - Left phone: Transaction list screen (slightly rotated, smaller, partially behind center)
     - Center phone: Dashboard/home screen (largest, elevated, highlighted border)
     - Right phone: Charts/analytics screen (slightly rotated, smaller, partially behind center)
- **Background:** Radial gradient glow behind headline (blue center, fading to transparent). Secondary purple glow to the right.
- **Animations:**
  - Badge: fade-in
  - Headline: fade-in-up (100ms delay)
  - Subtext: fade-in-up (200ms delay)
  - Form: fade-in-up (300ms delay)
  - Phones: slide-up from bottom (400ms delay), then subtle float animation (infinite, 6s ease-in-out)
- **Phone mockups detail:**
  - Until real screenshots are ready: stylized wireframe UIs built in code (colored bars, skeleton cards, placeholder charts using the brand palette)
  - When screenshots arrive: swap `<Image>` src from mockup component to `/public/screenshots/*.png`
  - Phone frame: dark surface (#16171D) with rounded corners, subtle notch, status bar dots

#### Section 3, Trust Bar

- **Layout:** Full-width band, elevated surface background, top/bottom border
- **Content:** 4 stats in a row (2x2 on mobile):
  | Value     | Label              | Color       |
  | --------- | ------------------ | ----------- |
  | `100%`    | Local & private    | brand-blue  |
  | `AES-256` | Encryption         | accent-green|
  | `3`       | Regions supported  | brand-purple|
  | `Zero`    | Data sent to cloud | accent-pink |
- **Animation:** Counter/fade-in on scroll into view

#### Section 4, Features

- **Label:** "What MonieTally does"
- **Heading:** "Everything you need to **understand your money**" (gradient on last part)
- **Layout:** 3-column grid (1 col mobile, 2 col tablet, 3 col desktop), 6 cards
- **Cards:**
  | # | Title              | Icon              | Icon color   | Description                                                          |
  |---|--------------------|-------------------|--------------|----------------------------------------------------------------------|
  | 1 | Auto-sync          | Refresh arrows    | brand-blue   | Bank transactions flow in automatically via Plaid, Tink, or Mono     |
  | 2 | Visual insights    | Bar chart         | accent-green | Beautiful charts and breakdowns that make spending patterns clear     |
  | 3 | Device-only storage| Lock              | brand-purple | Financial data never leaves your phone. AES-256 encrypted on-device  |
  | 4 | Smart budgets      | Clock/target      | accent-pink  | Set budgets by category, track in real time, get notified             |
  | 5 | Multi-region       | Globe             | accent-orange| Europe, Africa, North America. 12,000+ financial institutions        |
  | 6 | Biometric security | Shield            | accent-cyan  | Face ID, fingerprint, and PIN protection                             |
- **Card design:** `surface-card` with icon container (colored bg), title, description. Hover: lift -1px + shadow increase
- **Animation:** Staggered scroll-reveal (each card fades in 100ms after the previous)

#### Section 5, How It Works (NEW)

- **Label:** "How it works"
- **Heading:** "Three steps to financial clarity"
- **Layout:** 3 columns with a connecting line/dots between them
- **Steps:**
  | Step | Title               | Description                                    | Icon/Visual           |
  | ---- | ------------------- | ---------------------------------------------- | --------------------- |
  | 1    | Connect your bank   | Link your account securely through your region's provider | Bank/link icon + "Plaid · Tink · Mono" subtitle |
  | 2    | MonieTally syncs       | Transactions flow in automatically. No manual entry, ever | Sync/refresh icon + animated dots |
  | 3    | See the full picture| Charts, budgets, and insights, all on your device | Chart/eye icon + mini mockup preview |
- **Visual:** A horizontal line connects the 3 steps (vertical on mobile). Each step has a numbered circle (1, 2, 3) on the line, with content below/beside it.
- **Animation:** Line draws in on scroll, then each step reveals sequentially

#### Section 6, Privacy Manifesto

- **Label:** "Privacy first"
- **Heading:** "Your data. Your device. Period."
- **Subtext:** "No accounts. No cloud. No tracking. No compromise."
- **Layout:** 3 glass/frosted cards in a row:
  | Card             | Icon   | Title text     | Detail                      |
  | ---------------- | ------ | -------------- | --------------------------- |
  | No cloud sync    | Cloud-off | Everything stays local | Data never touches a server |
  | No user accounts | User-x | No email required | No signup, no profile       |
  | AES-256 encrypted| Shield-check | Military-grade security | Same standard as banks |
- **Card design:** Semi-transparent glass effect, colored accent border-top or left border
- **Background:** Subtle gradient shift from primary bg
- **Animation:** Cards fade-in-up on scroll

#### Section 7, Region Map

- **Label:** "Works where you are"
- **Heading:** "Global bank sync, local storage"
- **Layout:** 3 cards side by side (stack on mobile)
- **Cards:**
  | Region         | Color        | Provider   | Detail                |
  | -------------- | ------------ | ---------- | --------------------- |
  | Europe         | brand-blue   | Tink       | PSD2 compliant        |
  | Africa         | accent-green | Mono       | CBN Open Banking      |
  | North America  | brand-purple | Plaid      | 12,000+ institutions  |
- **Card design:** Surface card with colored top accent bar, provider logo/name, region name large, regulatory detail small
- **Animation:** Scroll reveal, staggered

#### Section 8, Testimonials (NEW)

- **Label:** "What people say"
- **Heading:** "Trusted by early users"
- **Layout:** 3 quote cards in a row (carousel on mobile)
- **Content:** Placeholder quotes for now:
  | Quote | Attribution |
  |-------|-------------|
  | "Finally, a finance app that doesn't want my data." |, Early beta user |
  | "The charts made me actually understand where my money goes." |, Beta tester |
  | "I love that everything stays on my phone. No cloud, no worry." |, Waitlist member |
- **Card design:** Surface card with large opening quotation mark in brand-blue/purple, quote text, attribution in tertiary text
- **Note:** Replace with real testimonials once beta users provide feedback
- **Animation:** Scroll reveal

#### Section 9, Waitlist CTA

- **Background:** Full-width gradient (gradient-cta: #2D3E85 → #4A4A92)
- **Content:**
  1. Label: "Join the waitlist"
  2. Heading: "Be the first to trace your finances" (white text)
  3. Subtext: "Get early access when we launch. No spam, ever." (white/60%)
  4. Waitlist form (same component, but styled for dark gradient background, white/translucent input)
- **Animation:** Section fade-in on scroll, form elements slide up

#### Section 10, Footer

- **Layout:** 4-column grid (brand + tagline | Product links | Company links | empty or social)
- **Content:**
  - Brand: Logo + "Every transaction leaves a trace."
  - Product: Features, Privacy, Waitlist
  - Company: About, Privacy policy, Terms of service
  - Bottom bar: © 2026 MonieTally. All rights reserved. | "Made with care. Your data stays yours."
- **Style:** Secondary bg, subtle top border

---

### 4.2 About Page (`/about`)

**Focus:** Product mission and philosophy (not founder story)

**Sections:**

1. **Hero:** "Why MonieTally exists", centered heading with gradient text
2. **Mission statement:** 2-3 paragraphs explaining the philosophy:
   - The problem: finance apps that harvest your data, sell to advertisers, or require cloud accounts
   - The belief: your financial data is deeply personal and should stay on your device
   - The solution: MonieTally captures every financial trace locally, encrypts it, and gives you visual clarity without compromise
3. **Principles:** 3-4 cards:
   - Privacy by design, not an afterthought
   - Local-first, your device, your data, your rules
   - Beautiful clarity, complex data made visually simple
   - Global reach, works wherever you bank
4. **Looking ahead:** Brief paragraph about the roadmap vision (bank sync, more regions, community features, all privacy-preserving)
5. **Waitlist CTA:** Same component as landing page

---

### 4.3 Privacy Policy (`/privacy`)

**Format:** Standard legal document with numbered sections

**Structure:**
1. Introduction, what MonieTally is, effective date
2. Information we collect, minimal: only waitlist email (on the website). The app collects zero data.
3. How we use information, only to send launch notifications
4. Data storage, app data is device-only, AES-256 encrypted, never transmitted
5. Third-party services, bank aggregators (Plaid/Tink/Mono) and their own privacy policies
6. Bank sync data flow, explain the relay architecture: aggregator tokens only, transaction data stays on device
7. Cookies, none on the website (or minimal analytics if added later)
8. Children's privacy, not directed at children under 13
9. Changes to this policy, how we notify
10. Contact, email address

**Design:** Clean, readable typography. Numbered sections with clear headings. Surface card container with generous padding. Table of contents sidebar on desktop.

---

### 4.4 Terms of Service (`/terms`)

**Format:** Standard legal document

**Structure:**
1. Acceptance of terms
2. Description of service
3. User responsibilities
4. Intellectual property
5. Disclaimer of warranties, app provided "as is"
6. Limitation of liability
7. Bank sync disclaimer, MonieTally is not a bank, not a financial advisor
8. Third-party services, aggregator terms
9. Termination
10. Governing law
11. Changes to terms
12. Contact

**Design:** Same layout as Privacy page, numbered sections, sidebar ToC on desktop, surface card container.

---

## 5. Animations & Interactions

### 5.1 Scroll-triggered reveals

A custom `useScrollReveal` hook using Intersection Observer:
- Threshold: 0.15 (triggers when 15% visible)
- Default animation: fade-in-up (opacity 0→1, translateY 20px→0, 600ms ease-out)
- Stagger support: each child delays by 100ms
- Respects `prefers-reduced-motion`: falls back to instant reveal

### 5.2 Specific animations

| Element             | Animation                                           | Trigger       |
| ------------------- | --------------------------------------------------- | ------------- |
| Hero badge          | Fade in                                             | On load       |
| Hero headline       | Fade in + slide up                                  | On load +100ms|
| Hero phones         | Slide up from below + continuous float              | On load +400ms|
| Trust bar numbers   | Fade in (potential: count-up animation)              | Scroll        |
| Feature cards       | Staggered fade-in-up (100ms between each)           | Scroll        |
| How-it-works line   | Draw-in (width grows from 0 to 100%)                | Scroll        |
| How-it-works steps  | Sequential reveal after line draws                  | Scroll        |
| Privacy cards       | Fade-in-up                                          | Scroll        |
| Region cards        | Staggered fade-in-up                                | Scroll        |
| Testimonial cards   | Fade-in                                             | Scroll        |
| CTA section         | Fade in, form slides up                             | Scroll        |

### 5.3 Hover effects

| Element        | Effect                                        |
| -------------- | --------------------------------------------- |
| Feature cards  | Lift -2px, shadow increase, subtle border glow|
| Buttons        | Lift -1px, shadow increase                    |
| Nav links      | Color transition to brand-blue                |
| Region cards   | Subtle scale(1.02)                            |
| Footer links   | Color transition to brand-blue                |

### 5.4 Background effects

- Hero: Radial gradient glow (blue, centered), static but large and atmospheric
- Subtle gradient mesh/noise texture on dark mode backgrounds (CSS only, no images)
- CTA section: animated gradient shift (very slow, background-position animation)

---

## 6. Responsive Breakpoints

| Breakpoint | Tailwind | Layout changes                              |
| ---------- | -------- | ------------------------------------------- |
| Mobile     | default  | Single column, stacked sections, hamburger menu, 2-stat trust bar rows |
| Tablet     | `md:`    | 2-column feature grid, side-by-side region cards, full nav |
| Desktop    | `lg:`    | 3-column feature grid, all 3 phones visible, sidebar ToC on legal pages |

---

## 7. SEO & Meta

| Tag                | Value                                                                |
| ------------------ | -------------------------------------------------------------------- |
| `<title>`          | MonieTally, Your finances, beautifully traced                          |
| `meta description` | Privacy-first personal finance app. Track spending, see visual insights, all on your device. |
| `og:image`         | `/og-image.png`, branded card with MonieTally logo + tagline           |
| `og:type`          | website                                                              |
| `twitter:card`     | summary_large_image                                                  |
| Favicon            | SVG favicon, gradient square with chart icon                        |

---

## 8. Screenshot Swap Plan

The phone mockups are designed to accept either:

1. **Placeholder mode** (current): Stylized wireframe UIs built with colored divs, SVG shapes, and skeleton elements. Looks polished and intentional, not broken.
2. **Screenshot mode** (future): `<Image>` components loading from `/public/screenshots/`

### When ready to swap:

1. Take 3 screenshots from the Flutter app:
   - `dashboard.png`, Home/dashboard screen
   - `transactions.png`, Transaction list
   - `charts.png`, Analytics/charts screen
2. Drop them into `/public/screenshots/`
3. In `PhoneMockup.tsx`, set `mode="screenshot"` and pass the image path
4. The phone frame, status bar, and scaling are handled by the component

Recommended screenshot dimensions: **390 x 844px** (iPhone 14 Pro viewport)

---

## 9. Waitlist Backend, Supabase

### Why Supabase instead of Formspree
Formspree routes emails through a third-party dashboard and has no queryable database. Supabase stores submissions in a proper PostgreSQL table, filterable, exportable, and manageable directly. It also unblocks adding email sending (Resend) once a custom domain is available, without changing the form component.

### Architecture
- `output: 'export'` is **removed** from `next.config.js`, the site runs as a standard Next.js app on Vercel with serverless functions
- A Next.js **Server Action** (or API route `/api/waitlist`) receives the form POST, validates the email, and inserts a row into Supabase
- The Supabase anon key is used server-side only, never exposed to the browser
- Row Level Security (RLS) on the `waitlist` table: inserts allowed, reads denied for anon role

### Supabase table schema
```sql
create table waitlist (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  created_at  timestamptz not null default now(),
  source      text default 'website'   -- 'hero' | 'cta'
);
```

### Setup steps
1. Create a Supabase project (free tier, 500 MB, 50,000 rows, sufficient for launch)
2. Run the schema above in the Supabase SQL editor
3. Enable RLS on the `waitlist` table; add insert policy for `anon`
4. Copy `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` → add to `.env.local` and Vercel environment variables
5. Install `@supabase/supabase-js`
6. Rewrite `WaitlistForm.tsx` to POST to the Server Action instead of Formspree

### Form behavior (unchanged from original spec)
- **Idle:** Email input + "Get early access" button
- **Loading:** Button shows spinner, input disabled
- **Success:** Green check + "You're on the list!" replaces the form, no confirmation email sent yet
- **Error:** Clear, actionable message below form + retry possible

### Future: adding email (when domain is ready)
1. Buy domain → verify with Resend → add `RESEND_API_KEY` to env
2. Add Resend call inside the Server Action after the Supabase insert
3. No changes to the form component needed

---

## 10. Vercel Deployment

The existing `vercel.json` has security headers. Updated config for Next.js:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

Next.js static export will generate an `out/` directory. Vercel auto-detects Next.js and handles this. No additional config needed, just push to Git.

---

## 11. Build Order

| Phase | Task                                                        | Dependencies    |
| ----- | ----------------------------------------------------------- | --------------- |
| 1     | Project setup: package.json, configs, install dependencies  |,               |
| 2     | Design system: tailwind.config.ts, globals.css, CSS vars    | Phase 1         |
| 3     | Shared components: Navbar, Footer, ThemeToggle, WaitlistForm, PhoneMockup | Phase 2 |
| 4     | Landing page sections: Hero, TrustBar, Features, HowItWorks, PrivacySection, RegionMap, Testimonials, WaitlistCTA | Phase 3 |
| 5     | Assemble landing page: `/` page.tsx composing all sections  | Phase 4         |
| 6     | About page                                                  | Phase 3         |
| 7     | Privacy & Terms pages                                       | Phase 3         |
| 8     | Animation hooks: useScrollReveal, useReducedMotion          | Phase 2         |
| 9     | Wire animations into all sections                           | Phase 4 + 8     |
| 10    | Build verification, responsive testing, lighthouse audit    | All             |
| 11    | Supabase integration: remove static export, create Server Action, wire WaitlistForm | Phase 3 |
| 12    | Screenshot swap (when app UI is ready)                      | Phase 3         |

---

## 12. Files Already Created

The following files have already been written during the initial build attempt. They should be **reviewed and updated** to match this plan during the build phase:

| File | Status | Notes |
| ---- | ------ | ----- |
| `package.json` | Created | Dependencies correct |
| `next.config.js` | Created | Static export configured |
| `tsconfig.json` | Created | Paths alias set up |
| `tailwind.config.ts` | Created | Full design token system |
| `postcss.config.js` | Created | Standard setup |
| `.gitignore` | Created | Standard Next.js ignores |
| `src/app/globals.css` | Created | Full CSS variable system for light/dark |
| `src/components/ThemeToggle.tsx` | Created | Sun/moon toggle, SSR-safe |
| `src/components/Navbar.tsx` | Created | Sticky, mobile menu, theme toggle |
| `src/components/Footer.tsx` | Created | 4-column layout, brand, links |
| `src/components/WaitlistForm.tsx` | Needs rewrite | Replace Formspree logic with Server Action POST to Supabase; keep all four UI states |
| `src/components/PhoneMockup.tsx` | Created | 3 variants, placeholder wireframes |
| `src/components/sections/Hero.tsx` | Created | Needs scroll animation hook |
| `src/components/sections/TrustBar.tsx` | Created | Needs scroll animation |
| `src/components/sections/Features.tsx` | Created | Needs stagger animation |

### Still needs to be built:

| File | Description |
| ---- | ----------- |
| `src/app/layout.tsx` | Root layout with ThemeProvider, fonts, metadata |
| `src/app/page.tsx` | Landing page assembling all sections |
| `src/components/sections/HowItWorks.tsx` | 3-step flow section |
| `src/components/sections/PrivacySection.tsx` | Privacy manifesto |
| `src/components/sections/RegionMap.tsx` | 3-region cards |
| `src/components/sections/Testimonials.tsx` | Quote cards |
| `src/components/sections/WaitlistCTA.tsx` | Final CTA with gradient |
| `src/hooks/useScrollReveal.ts` | Intersection Observer hook |
| `src/hooks/useReducedMotion.ts` | Motion preference hook |
| `src/lib/constants.ts` | Site metadata and strings |
| `src/app/about/page.tsx` | About/mission page |
| `src/app/privacy/page.tsx` | Privacy policy |
| `src/app/terms/page.tsx` | Terms of service |
| `public/favicon.svg` | MonieTally favicon |
| `public/og-image.png` | Open Graph image (generated) |
