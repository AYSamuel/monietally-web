"use client";

/**
 * ScrollExperience — hero + product showcase as alternating reveal sections.
 *
 * Design:
 *   - Each panel is its own full-height section.
 *   - The phone sits on one side and the text on the other, alternating
 *     left/right down the page (hero: phone right, then left, right, ...).
 *   - As each section scrolls into view, the phone slides in from its side
 *     and the text rises in from the opposite side. The hero animates on load.
 *   - Natural scrolling only: no sticky pin, no scroll-position mapping, no
 *     scroll hijacking. Robust across browsers and the Lenis smooth scroll.
 *
 * Mobile: the columns stack (phone above text), still with a gentle reveal.
 * Reduced motion: everything renders statically, no animation.
 *
 * Copy lives in messages (hero.*, features.*); only structure, icons, and the
 * mockup wiring live here.
 */

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { type ComponentType, type ReactNode } from "react";
import {
  PhoneFrame,
  PHONE_FRAME_WIDTH,
  PHONE_FRAME_HEIGHT,
} from "./PhoneFrame";
import { HomePopulated } from "./mockups/HomePopulated";
import { Activity } from "./mockups/Activity";
import { Insights } from "./mockups/Insights";
import { Budgets } from "./mockups/Budgets";
import WaitlistForm from "../WaitlistForm";

/* ── Panel definitions (structure only; text comes from messages) ────────── */

interface PanelMeta {
  id: string;
  /** Message-namespace prefix: "hero" or "features.activity", etc. */
  tKey: string;
  type: "hero" | "showcase";
  phoneSide: "right" | "left";
  Mockup: ComponentType;
}

const icon = (path: ReactNode): ReactNode => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {path}
  </svg>
);

// Hero trust row: icon in code, label key into hero.trust.*
const TRUST_ITEMS: ReadonlyArray<{ key: string; icon: ReactNode }> = [
  {
    key: "free",
    icon: icon(
      <>
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </>,
    ),
  },
  {
    key: "eu",
    icon: icon(
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </>,
    ),
  },
  {
    key: "readOnly",
    icon: icon(
      <>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </>,
    ),
  },
];

const PANELS: ReadonlyArray<PanelMeta> = [
  { id: "hero", tKey: "hero", type: "hero", phoneSide: "right", Mockup: HomePopulated },
  { id: "activity", tKey: "features.activity", type: "showcase", phoneSide: "left", Mockup: Activity },
  { id: "insights", tKey: "features.insights", type: "showcase", phoneSide: "right", Mockup: Insights },
  { id: "budgets", tKey: "features.budgets", type: "showcase", phoneSide: "left", Mockup: Budgets },
];

const DESKTOP_SCALE = 0.82;
const ease = [0.22, 0.61, 0.36, 1] as const;

/* ── Scaled phone (fixed 336x712 frame, scaled to fit a column) ──── */

function PhoneShell({
  panel,
  scale,
  ariaLabel,
}: {
  panel: PanelMeta;
  scale: number;
  ariaLabel: string;
}) {
  const Mockup = panel.Mockup;
  return (
    <div
      style={{
        width: PHONE_FRAME_WIDTH * scale,
        height: PHONE_FRAME_HEIGHT * scale,
      }}
    >
      <div style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>
        <PhoneFrame ariaLabel={ariaLabel}>
          <Mockup />
        </PhoneFrame>
      </div>
    </div>
  );
}

/* ── Text block ────────────────────────────────────────────────── */

function PanelText({ panel }: { panel: PanelMeta }) {
  const t = useTranslations();

  if (panel.type === "hero") {
    return (
      <>
        <p className="section-label mb-4">{t("hero.eyebrow")}</p>
        <h1
          className="text-display text-4xl md:text-5xl lg:text-6xl tracking-tight mb-5"
          style={{ color: "var(--text-primary)" }}
        >
          {t.rich("hero.headline", {
            gradient: (chunks) => <span className="text-gradient">{chunks}</span>,
            br: () => <br />,
          })}
        </h1>
        <p
          className="text-lg md:text-xl leading-relaxed mb-4 max-w-md mx-auto md:mx-0"
          style={{ color: "var(--text-primary)" }}
        >
          {t("hero.subline")}
        </p>
        <p
          className="text-base md:text-lg leading-relaxed mb-7 max-w-md mx-auto md:mx-0"
          style={{ color: "var(--text-secondary)" }}
        >
          {t("hero.body")}
        </p>
        <div className="mb-8 max-w-md mx-auto md:mx-0">
          <WaitlistForm source="hero" />
        </div>
        {/* inline-block so the list centres as a block on mobile (under the
            centred phone) while each tick row stays left-aligned for tidiness;
            md+ reverts to a full-width block in the left-aligned column. */}
        <ul className="space-y-2.5 inline-block text-left md:block">
          {TRUST_ITEMS.map((item) => (
            <li
              key={item.key}
              className="flex items-center gap-2.5 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              <span style={{ color: "var(--eyebrow)" }}>{item.icon}</span>
              {t(`hero.trust.${item.key}`)}
            </li>
          ))}
        </ul>
      </>
    );
  }
  return (
    <>
      <p
        className="text-sm font-semibold mb-3"
        style={{ letterSpacing: "0.2em", color: "var(--eyebrow)" }}
      >
        {t(`${panel.tKey}.number`)}
      </p>
      <h2
        className="text-display text-3xl md:text-4xl lg:text-5xl tracking-tight mb-5"
        style={{ color: "var(--text-primary)" }}
      >
        {t(`${panel.tKey}.headline`)}
      </h2>
      <p
        className="text-base md:text-lg leading-relaxed mb-3 max-w-md mx-auto md:mx-0"
        style={{ color: "var(--text-secondary)" }}
      >
        {t(`${panel.tKey}.subhead`)}
      </p>
      <p
        className="text-sm max-w-md mx-auto md:mx-0"
        style={{ color: "var(--text-tertiary)" }}
      >
        {t(`${panel.tKey}.support`)}
      </p>
    </>
  );
}

/* ── One alternating section ───────────────────────────────────── */

function FeatureSection({
  panel,
  index,
}: {
  panel: PanelMeta;
  index: number;
}) {
  const t = useTranslations();
  const reduced = useReducedMotion() ?? false;
  const isHero = panel.type === "hero";
  const phoneRight = panel.phoneSide === "right";
  // Alternate theme-responsive surfaces for a subtle rhythm.
  const background =
    index % 2 === 0 ? "var(--bg-primary)" : "var(--bg-secondary)";

  // Phone slides in from its own side; text rises in from the opposite side.
  const phoneVariants: Variants = {
    hidden: { opacity: 0, x: reduced ? 0 : phoneRight ? 64 : -64 },
    show: { opacity: 1, x: 0, transition: { duration: 0.7, ease } },
  };
  const textVariants: Variants = {
    hidden: { opacity: 0, x: reduced ? 0 : phoneRight ? -48 : 48 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease, delay: 0.08 },
    },
  };

  // Hero plays on mount; later sections play when scrolled into view.
  const motionProps = isHero
    ? { initial: "hidden" as const, animate: "show" as const }
    : {
        initial: "hidden" as const,
        whileInView: "show" as const,
        viewport: { once: true, amount: 0.35 },
      };

  const sectionAria = isHero ? t("hero.sectionAria") : t(`${panel.tKey}.headline`);
  const phoneAria = t(`${panel.tKey}.phoneAria`);

  return (
    <section
      aria-label={sectionAria}
      className={`relative overflow-hidden flex items-center ${
        isHero ? "min-h-screen py-20" : "py-16 md:py-24"
      }`}
      style={{ background }}
    >
      <div className="section-container relative w-full">
        <div
          // flex-col-reverse on mobile puts the text ABOVE the phone, so the
          // value proposition is read first instead of being pushed below a
          // tall phone mockup. md+ restores the alternating side-by-side row.
          className={`flex flex-col-reverse items-center gap-12 md:gap-16 ${
            phoneRight ? "md:flex-row-reverse" : "md:flex-row"
          }`}
        >
          <motion.div
            className="md:w-1/2 flex justify-center"
            variants={phoneVariants}
            {...motionProps}
          >
            <PhoneShell panel={panel} scale={DESKTOP_SCALE} ariaLabel={phoneAria} />
          </motion.div>
          <motion.div
            // Centre the copy on mobile (the phone stacks centred below it, so
            // left-aligned text reads as lopsided); restore left-align from md+
            // where the side-by-side layout returns. Matches HowItWorks.
            className="md:w-1/2 w-full text-center md:text-left"
            variants={textVariants}
            {...motionProps}
          >
            <PanelText panel={panel} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── Component ─────────────────────────────────────────────────── */

export function Hero() {
  return <FeatureSection panel={PANELS[0]} index={0} />;
}

export default function Features() {
  return (
    <>
      {PANELS.slice(1).map((panel, i) => (
        <FeatureSection key={panel.id} panel={panel} index={i} />
      ))}
    </>
  );
}
