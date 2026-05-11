# SPEC — MonieTally Landing Page Redesign

**Status:** Draft for review · **Author:** Ayo + Claude · **Date:** 2026-05-09
**Branch target:** new branch off `main` (suggest `features/landing-redesign-v2`)

---

## 1. Goal

Replace the current basic landing page with a premium, scroll-driven landing that *shows* what MonieTally does instead of describing it. The centerpiece is a pinned phone that slides L↔R between five feature panels while the on-screen mockup morphs to match, creating a "scrolling tells the product story" effect.

## 2. Decisions locked in interview

| Decision | Choice |
|---|---|
| Scroll mechanic | **Pin + slide phone L↔R**, screens crossfade |
| Animation library | **Framer Motion** (`useScroll` + `useTransform`) |
| Scope | **Full landing redesign** (Hero, scroll-morph showcase, refreshed downstream sections, polished Navbar/Footer) |
| Visual direction | **Editorial cream/ink**. `#F5F1E8` cream, `#0F1117` ink, `#C9A961` gold accent. Quiet, premium, coherent with the in-app palette |
| Display serif | **Fraunces** (variable, served via `next/font/google`). Inter stays for body. |
| Mobile fallback | **Stacked panels, no pin** below `md` breakpoint |
| Showcase panels | **5 panels:** Home → Activity → Insights → Budgets → Savings (Add Transaction lives in the HowItWorks strip downstream) |
| HowItWorks strip | **3 steps**: Set up in seconds → Tap + and log a spend → See your month at a glance |
| Privacy section | **Conceptual diagram** (not phone mockups), grounded in the real architecture (`ACCOUNT_SYNC_SPEC.md`). See §11. |
| Copy voice | **Calm, confident, anti-bullshit.** No em-dashes anywhere in user-facing text (project-wide convention from `ACCOUNT_SYNC_SPEC.md` §0). |

## 3. Out of scope (this iteration)

- Auth pages, dashboard, app-store deep links (no app shipped yet)
- New pages beyond the existing `/`, `/about`, `/privacy`, `/terms`
- Replacing the Formspree integration
- Video/Lottie animations inside the phone (mockups stay static; movement is the section's job, per `APP_MOCKUPS_USAGE.md`)
- Building React ports of mockups not used in the showcase (Onboarding, PIN, Biometric, Add Transaction beyond the small strip)

## 4. Constraints to respect

1. **Static export.** `next.config.js` has `output: 'export'`. No server components doing data fetching, no dynamic routes that need a runtime, no `next/image` optimizer.
2. **Mockup port rule** (from `APP_MOCKUPS_USAGE.md`): real DOM ports of the HTML mockups inside a shared `<PhoneFrame>`, **not screenshots, not iframes**. Tokens map to existing CSS variables in `globals.css`.
3. **Theme system stays.** `next-themes` + CSS custom properties. Every new color references a token, never raw hex.
4. **Reduced motion.** All scroll choreography must collapse to instant fade/no-movement under `prefers-reduced-motion: reduce`.
5. **No PII or analytics added** as part of this work. No third-party trackers.
6. **Performance budget.** First load JS ≤ 200KB gzipped for the landing route. Framer Motion is ~50KB gzip, we have headroom but must avoid tree-shake foot-guns (import from `framer-motion` not `framer-motion/dist/*`).
7. **No em-dashes in user-facing copy** (project-wide convention from `ACCOUNT_SYNC_SPEC.md` §0). Use periods, colons, or commas instead. This applies to headlines, subheads, button labels, alt text, meta descriptions, everything visible to a user.
8. **Privacy claims must match the architecture in `ACCOUNT_SYNC_SPEC.md`.** See §11 for the allowed/forbidden claim list. Overpromising privacy is a brand-damaging bug, treat it that way.

## 5. Page structure (new IA)

```
1. Navbar                    (refresh — see §10)
2. Hero                      (rebuild — see §6)
3. ScrollShowcase            (NEW — the centerpiece, see §7)
4. HowItWorks (3-step strip) (refresh — Add Transaction lives here)
5. Privacy                   (refresh — keep PIN/Biometric mockups)
6. TrustBar / Differentiators (light refresh)
7. WaitlistCTA               (refresh, same Formspree wiring)
8. Footer                    (refresh — see §10)
```

Removed from current site for this pass: `RegionMap`, `Testimonials` (no real testimonials yet — placeholder testimonials read as fake and erode trust on a pre-launch page).

## 6. Hero

**Layout:** Two-column on `md+`, single column below.

- **Left column:** display headline, subhead, primary CTA ("Join the waitlist", anchors to `#waitlist`), secondary CTA ("See how it works", anchors to `#showcase`).
- **Right column:** single phone showing `home-populated` (dark variant), with a soft gold radial glow behind it. Slight 3-degree perspective tilt on hover via Framer Motion (no scroll-driven for hero).

**Copy (locked draft):**
> **Eyebrow** (small caps, gold): A new kind of finance app
> **Headline:** Your money, finally legible.
> **Subhead:** MonieTally turns every spend into clarity. Beautifully designed, quietly private, and genuinely useful from the first transaction. Encrypted with a key your phone holds, not ours.
> **Primary CTA:** Join the waitlist
> **Secondary CTA:** See how it works ↓

Voice notes for whoever iterates this later: confident, calm, anti-bullshit. Lead with the product. Privacy is the closer, not the opener (per `ACCOUNT_SYNC_SPEC.md` §1: *"great finance app, with privacy as a structural moat"*). No em-dashes. Avoid "revolutionary," "smart," "AI-powered," and other empty intensifiers.

Scroll affordance: soft animated chevron at the bottom hinting the next section.

## 7. ScrollShowcase — the centerpiece

### 7.1 Mechanic

A single section that's `5 × 100vh` tall on desktop. Inside it:

- A `position: sticky; top: 0; height: 100vh` container that pins for the full duration.
- Inside the sticky container: one `<PhoneFrame>` and one **copy column**.
- A wrapping `useScroll` tracks section progress 0→1.
- `useTransform` maps progress to:
  - **Phone X position** — alternates between `+18%` (right) and `−18%` (left) as we move through panels (panel 1 right, 2 left, 3 right, 4 left, 5 right).
  - **Phone screen variant** — a discrete `useMotionValueEvent` swaps the rendered mockup at panel boundaries. Outgoing screen fades to opacity 0 (200ms), incoming fades in (200ms). Crossfade overlap kept tight to avoid mush.
  - **Copy column** — slides in from the *opposite* side of the phone, fades 0→1 over the first 30% of each panel's range.
  - **Phone Y rotation** — gentle 4-degree tilt that sways with the slide direction, giving a subtle 3D feel without committing to full perspective parallax.
- A vertical **panel indicator** (5 dots) on the right edge tracks which panel is active. Clicking a dot scrolls to that panel (uses `scrollIntoView({ behavior: 'smooth' })`).

### 7.2 Panels

| # | Mockup variant | Phone side | Headline | Subhead | Supporting line |
|---|---|---|---|---|---|
| 1 | `home-populated` (dark) | right | **See where you stand, instantly.** | One screen tells you what's left, what's coming up, and where it went. | No charts to decode. No menus to dig through. |
| 2 | `activity` (dark) | left | **Every spend, accounted for.** | A clean log of every transaction. Searchable, filterable, yours. | Tap any entry to see the full story behind it. |
| 3 | `insights` (dark) | right | **Patterns you'd miss in a bank statement.** | Where your money actually went, by category and by trend. The recurring drips. The unusual weeks. | The shape of your real life with money. |
| 4 | `budgets` (dark) | left | **Budgets that breathe with you.** | Set monthly limits, watch progress fill in real time, get a quiet nudge before you cross a line. | No guilt-trip notifications. Just calm awareness. |
| 5 | `savings` (dark) | right | **Save toward what matters.** | Name your goals, set a target, and watch the runway shrink as you go. | Encrypted on your device, synced privately to your other devices. |

Copy is locked. No em-dashes anywhere. Voice rules: short sentences, plain words, zero marketing intensifiers ("powerful", "smart", "intelligent", "revolutionary" all banned). If a sentence sounds like every other fintech landing page, rewrite it.

### 7.3 Mobile fallback (<md)

The sticky behavior is dropped entirely. Each panel becomes a vertically-stacked card:
- Phone scaled to ~240px wide via `transform: scale(0.6)` (per `APP_MOCKUPS_USAGE.md` rule — never reflow phone contents).
- Copy below the phone, left-aligned.
- 64px gap between panels.
- A subtle `fade-in-up` (intersection observer) per panel as it enters viewport.
- Panel indicator dots are hidden on mobile (vertical scroll already provides the position cue).

### 7.4 Reduced-motion fallback

Under `prefers-reduced-motion: reduce`:
- The pinned section still pins, but phone X-position is fixed centered.
- Screen swaps are instant (no crossfade, no slide — opacity step at panel boundary).
- Panel indicator works the same.
- Hero phone tilt-on-hover is disabled.

## 8. New components to build

```
src/components/
  landing/
    PhoneFrame.tsx               # NEW — shared frame chrome (status bar, dynamic island, home indicator)
    ScrollShowcase.tsx           # NEW — the pinned-scroll section (Framer Motion)
    PanelIndicator.tsx           # NEW — 5-dot rail on right edge of showcase
    mockups/
      HomePopulated.tsx          # NEW — port of 10-home.html (populated, dark)
      Activity.tsx               # NEW — port of 11-activity.html (list, dark)
      Insights.tsx               # NEW — port of 14-insights.html (overview, dark)
      Budgets.tsx                # NEW — port of 13-budgets.html (overview, dark)
      Savings.tsx                # NEW — port of 15-savings.html (overview, dark)
      AddTransaction.tsx         # NEW — port of 12-add-edit-transaction.html (idle, dark) — used by HowItWorks strip
  hooks/
    useScrollShowcaseProgress.ts # NEW — wraps useScroll/useTransform to expose {activePanel, phoneX, phoneRotateY, copyOpacity}
    useReducedMotion.ts          # NEW — small wrapper around matchMedia
lib/
  sampleData.ts                  # NEW — shared $ values / txn names so phones tell one consistent story
```

Existing components to **rebuild**: `Hero`, `Navbar`, `Footer`, `HowItWorks`, `PrivacySection`, `TrustBar`, `WaitlistCTA`.
Existing components to **delete**: `RegionMap`, `Testimonials`, `PhoneCarousel` (superseded by ScrollShowcase), the placeholder `PhoneMockup` (superseded by per-screen mockup ports).

## 9. Data flow / state

Pure presentational. No client state beyond the scroll-derived motion values. No fetch. No context beyond what `next-themes` already provides.

`sampleData.ts` exports a single coherent dataset (e.g., monthly net `$2,847`, top categories, recurring bills) consumed by all five mockup ports so the phones tell one consistent story across the scroll.

## 10. Visual system additions

Add to `tailwind.config.ts` if not already present:

- `colors.cream` = `#F5F1E8`, `colors.cream-soft` = `#FAF8F1`
- `colors.ink` = `#0F1117`, `colors.ink-soft` = `#1A1C24`
- `colors.gold` = `#C9A961`
- `fontFamily.display` set to **Fraunces** (variable, weights 400 + 600, opsz axis enabled), loaded via `next/font/google`. Inter stays for body.

Add to `globals.css`:

- `.text-display` utility for the editorial serif headline treatment (Fraunces, larger optical size).
- A subtle `noise.svg` background overlay on cream surfaces (~4% opacity) for texture. Optional. Drop it if it bloats first paint.

**Navbar refresh:** thinner, no border, backdrop-blur on scroll. Logo type-set as a Fraunces wordmark ("MonieTally"). No SVG logo file yet, render as text. Nav links: Features (jumps to `#showcase`), Privacy, Waitlist.

**Footer refresh:** cream surface, three columns (brand + tagline / product links / legal), small typography. No social icons until accounts exist. Use a `mailto:hello@monietally.app` placeholder as the contact link (real address to confirm before launch).

## 11. Privacy section content

Replaces the previous "PIN + Biometric mockups" plan with a conceptual diagram, grounded in the actual architecture in `ACCOUNT_SYNC_SPEC.md`. The PIN/Biometric mockups still exist as React ports but are not consumed by this section.

### 11.1 Section copy (locked draft)

> **Eyebrow:** How privacy actually works
> **Headline:** Encrypted with a key your phone holds. Not ours.
> **Lede:** MonieTally syncs across your devices, but the server only ever sees ciphertext. Your data is encrypted before it leaves your phone, with a key that lives in your OS keychain. We could not read your records if a court asked us to.

Three pillar cards beneath the lede:

| Pillar | Headline | Body |
|---|---|---|
| 1 | **End-to-end encrypted** | Your transactions, budgets, and goals are encrypted on your device with AES-256-GCM before sync. The server stores blobs it cannot decrypt. |
| 2 | **Your key, your devices** | The encryption key is generated on your phone and synced to your other devices through your OS keychain (iCloud or Google Block Store). It never passes through our servers. |
| 3 | **No bank login, ever** | MonieTally does not connect to your bank. No screen scraping. No Plaid. Nothing in our system has read access to your accounts. |

Closing line below the cards:

> Built on the architecture in our public spec. Hosted in the EU (Frankfurt) for GDPR. Audited before v1 release.

### 11.2 Conceptual diagram

A single SVG diagram, centered, replacing the phone mockups:

```
              ┌─────────────────┐
              │   Your phone    │
              │  ┌───────────┐  │
              │  │ data      │  │     encrypts on device
              │  │ + DEK 🔑  │──┼──┐  with AES-256-GCM
              │  └───────────┘  │  │
              └─────────────────┘  ▼
                                ╔═══════════════╗
                                ║  ciphertext   ║   ← server only
                                ║  blobs only   ║     sees this
                                ╚═══════════════╝
                                  ▲
              ┌─────────────────┐ │
              │  Your laptop /  │ │  decrypts with the
              │  second phone   │─┘  same key (delivered
              │  ┌───────────┐  │   via OS keychain)
              │  │ data      │  │
              │  │ + DEK 🔑  │  │
              │  └───────────┘  │
              └─────────────────┘
```

Render this as an inline SVG. Two phone outlines on the left (top and bottom), a "ciphertext blobs only" cylinder on the right labeled "MonieTally server", arrows annotated with what flows. The key icon is gold; the cylinder is cream-on-ink. Animate the encrypt arrow on scroll-into-view (a single 800ms pulse, respects reduced-motion).

### 11.3 What we can and cannot claim (guard rails)

**Source of truth:** `ACCOUNT_SYNC_SPEC.md` §1 (strategic frame), §3 (architecture), §4 (roles). Re-read before any copy change.

✅ **Allowed claims:**

- "Encrypted with a key your phone holds, not ours."
- "We could not read your data if a court asked us to."
- "End-to-end encrypted across your devices."
- "AES-256-GCM, the same standard used by Signal and 1Password." (Argon2id for key derivation if specifically mentioned.)
- "No bank login. No screen scraping. No Plaid."
- "Hosted in the EU (Hetzner Frankfurt) for GDPR."
- "Sync uses last-write-wins. Conflicts are rare and resolvable."

❌ **Forbidden claims (would be lies, today):**

- ~~"Your data never leaves your device."~~ It does. Encrypted, but it leaves.
- ~~"100% offline."~~ Sync is core to the product.
- ~~"AES-256 encrypted on device at rest."~~ **Currently false.** Isar 3.x does not encrypt the local DB (`ACCOUNT_SYNC_SPEC.md` §2.1, gotcha #1). At-rest encryption ships in Phase 2. Until then, restrict the encryption claim to data **in transit and on the server** (which is true via the backup/sync ciphertext path).
- ~~"Zero-knowledge"~~ as a marketing term. It's accurate but loaded; only use if we can defend the cryptographic detail.
- ~~"Bank-grade encryption"~~ meaningless and overused.
- ~~"Military-grade"~~ same.

⚠️ **Claims that need the v1 launch to be true:**

- "Cross-device sync" (Phase 2 of the sync spec, may not ship with v1 launch). If the waitlist site goes up before sync ships, soften to "Sync coming with v1" or remove the multi-device language until shippable.

**Mitigation pattern:** any time a copy line touches privacy, pair it with a footnote-style link to `/privacy` (technical writeup) so a curious user can verify. The waitlist page is a pre-launch site; over-claiming here will be the first thing security-minded users dunk on if it ships and turns out to be partial.

## 12. HowItWorks 3-step strip

Lives below the ScrollShowcase. Lighter visual weight than the showcase. Three side-by-side cards on `md+`, stacked on mobile.

| Step | Mockup | Headline | Subtext |
|---|---|---|---|
| 1 | `onboarding-2` | **Set up in seconds.** | Pick your currency, set a PIN, you're in. No bank login, no questionnaire. |
| 2 | `add-transaction` | **Tap + and log a spend.** | Three taps to record what you spent and where. Categories adapt to your habits as you go. |
| 3 | `home-populated` | **See your month at a glance.** | One screen tells you what's left, where it went, and what's coming up. |

Each card has a small (~180px wide) phone mockup at the top, headline below, subtext below that. No animation beyond a soft fade-in-up on scroll-into-view.

## 13. Accessibility

- **Focus order** through the showcase: section heading → each panel's headline-and-subhead in DOM order → indicator dots (focusable buttons with `aria-current="true"` on active).
- All mockup ports have `role="img"` and a meaningful `aria-label` describing the screen ("Home dashboard showing $2,847 left this month").
- Indicator dots: `<button>` with `aria-label="Jump to panel N: Insights"`.
- All scroll animations honor `prefers-reduced-motion` (see §7.4).
- Color contrast: cream/ink combo passes AA at all body sizes; gold on cream needs verification (likely AA Large only — restrict gold to large display copy).
- All headlines are real `<h2>` / `<h3>`, not divs. The mockup ports' inner text is real DOM (good for SEO and screen readers).

## 14. Performance considerations

- **Framer Motion import:** only import `motion`, `useScroll`, `useTransform`, `useMotionValueEvent`, `useReducedMotion`. Avoid the full barrel.
- **Mockup ports are heavy DOM.** Five mockups × ~150 nodes each = ~750 nodes inside the sticky. Use `will-change: transform, opacity` *only* on the phone frame and copy column, not on inner mockup nodes.
- **Off-screen mockups:** render all five inside the sticky container but set `display: none` on inactive ones (toggled at panel boundaries). Crossfade swaps the *active* and *outgoing* between each boundary so only ever 2 are mounted simultaneously.
- **No layout thrash:** all motion uses `transform` and `opacity` only. No animated `top`/`left`/`width`.
- **Fonts:** preload only Fraunces 400 + 600 (variable) plus Inter 400/500. Subset to Latin.
- **Lighthouse target:** Performance ≥ 90 on mobile, ≥ 95 on desktop. LCP < 2.5s on 4G.

## 15. Edge cases & open risks

| # | Risk | Mitigation |
|---|---|---|
| 1 | iOS Safari sticky + transform combos can stutter | Test on a real iPhone before merge. If janky, reduce `phoneRotateY` to 2deg or remove. |
| 2 | Tall users on short laptop screens (700px viewport) feel cramped at 5×100vh | Cap each panel at `max(100vh, 720px)` so short viewports get a touch more breathing room. |
| 3 | Anchor links from Navbar landing mid-panel inside the sticky | Use `scroll-margin-top` on each panel's section anchor matching navbar height. |
| 4 | Mockup ports drift from source HTML over time | Add header comment in each port pointing back to source: `// Mirrors monietally/design-mockups/14-insights.html`. Add to project CLAUDE.md as a maintenance rule. |
| 5 | Five panels = long section. Bouncy / hover scrollers might feel trapped | Native scroll only. Never `scroll-snap`. Always allow free scroll. |
| 6 | First-load JS budget creep | After build, verify `out/_next/static/chunks/*.js` total. If over budget, lazy-load `ScrollShowcase` below the fold via `next/dynamic` with `ssr: false`. |
| 7 | Static export means `next/font` localizes fonts at build time. Make sure `next build` succeeds offline. | Test build with no network. |
| 8 | Privacy copy drifts from product reality between waitlist launch and v1 ship | Whoever updates `ACCOUNT_SYNC_SPEC.md` must also re-check §11 of this spec the same day. Add a CODEOWNERS-style note in project CLAUDE.md. |
| 9 | Sync may not ship with v1 (Phase 2 of sync spec) but copy promises multi-device | Before pushing the site live, re-verify sync is shippable. If not, soften §11 copy ("sync coming with v1") and remove the second phone from the diagram. |

## 16. Resolved decisions (interview, this session)

These were open questions in v1 of the spec. Locking them here so the implementer doesn't relitigate.

- **Display serif:** Fraunces (variable, via `next/font/google`).
- **HowItWorks:** keep the 3-step strip (Set up → Log a spend → See your month). See §12 for copy.
- **Privacy section:** conceptual diagram (§11), not PIN/Biometric mockups. Grounded in `ACCOUNT_SYNC_SPEC.md`.
- **Hero + panel copy:** locked drafts in §6 and §7.2. Voice rules captured.
- **Logo wordmark:** Fraunces text wordmark for now. SVG can replace later without touching layout.
- **Footer contact:** `mailto:hello@monietally.app` placeholder. Confirm real address before launch.
- **Removed sections:** RegionMap and Testimonials (no real testimonials yet).

## 17. Genuinely open (need confirmation, not blocking PR 1)

These can be answered any time before the section that depends on them is built. None block kickoff.

1. **Confirm `hello@monietally.app` is the real contact email** (or supply the right one). Needed before §10 footer ships.
2. **v1 launch sync status.** Will `ACCOUNT_SYNC_SPEC.md` Phase 2 ship by waitlist-to-v1 conversion? Determines whether §11 keeps the multi-device language or softens it. Re-check during PR 4.
3. **`/privacy` page rewrite.** The current `src/app/privacy/page.tsx` likely still says "data never leaves your device" or similar. It will need a rewrite consistent with §11 guard rails. Out of scope for this redesign work, but flagging so we don't ship a homepage that contradicts the privacy page.

## 18. Acceptance criteria

The redesign is ready to merge when:

- [ ] All five panels render with correct mockups and copy, in correct order
- [ ] Phone slides L↔R smoothly between panels at 60fps on a mid-tier laptop
- [ ] Screen variant swaps cleanly (no flash, no double-render)
- [ ] Mobile fallback stacks correctly with no horizontal scroll
- [ ] `prefers-reduced-motion` collapses all scroll animation to instant transitions
- [ ] Indicator dots reflect active panel and clickable navigation works
- [ ] Light + dark theme both pass visual check on every section
- [ ] Lighthouse Performance ≥ 90 mobile, ≥ 95 desktop
- [ ] No raw hex values in component files (everything via tokens)
- [ ] No em-dashes anywhere in user-facing copy (`grep -RIn "—" src/` returns zero hits in component files; SPEC.md and other docs are exempt)
- [ ] Every privacy claim in shipped copy traces to a ✅ line in §11.3 (no ❌ or ⚠️ claims slipped through)
- [ ] `npm run build` produces a clean static export, no warnings
- [ ] Tested on: Chrome desktop, Safari desktop, iOS Safari, Android Chrome

## 19. Implementation order (suggested PRs)

1. **PR 1, Foundations.** Token additions, Fraunces setup via `next/font/google`, `<PhoneFrame>` shared component, `useReducedMotion` hook, `sampleData.ts`.
2. **PR 2, Mockup ports.** All 5 showcase mockup components (HomePopulated, Activity, Insights, Budgets, Savings) + AddTransaction + Onboarding2 (for HowItWorks). No scroll logic yet. Just verify each port matches its source HTML in dark + light.
3. **PR 3, ScrollShowcase + Hero.** The centerpiece + new Hero. Most of the visual lift lands here.
4. **PR 4, Downstream refresh.** HowItWorks, Privacy section (with the new SVG diagram), TrustBar, WaitlistCTA, Navbar, Footer. Re-verify sync status (§17 Q2) before locking §11 copy. Also rewrite `/privacy` page to match §11.3 guard rails (§17 Q3).
5. **PR 5, Polish + perf.** Lighthouse pass, real-device QA, reduced-motion verification, em-dash sweep, privacy claim audit.

Each PR should be small enough to review in one sitting and reversible if a direction isn't working.

---

**Next step:** start a fresh implementation session pointing at this file. Begin with PR 1.
