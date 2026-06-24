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
 */

import { motion, useReducedMotion, type Variants } from "framer-motion";
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

/* ── Panel definitions ─────────────────────────────────────────── */

interface BasePanelDef {
  id: string;
  phoneSide: "right" | "left";
  Mockup: ComponentType;
  ariaLabel: string;
}

interface HeroPanelDef extends BasePanelDef {
  type: "hero";
  eyebrow: string;
  headlinePrimary: string;
  headlineAccent: string;
  subline: string;
  body: string;
  trust: ReadonlyArray<{ icon: ReactNode; label: string }>;
}

interface ShowcasePanelDef extends BasePanelDef {
  type: "showcase";
  number: string;
  headline: string;
  subhead: string;
  support: string;
}

type PanelDef = HeroPanelDef | ShowcasePanelDef;

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

const TRUST_ICONS: Record<string, ReactNode> = {
  lock: icon(
    <>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </>,
  ),
  globe: icon(
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </>,
  ),
  tag: icon(
    <>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </>,
  ),
};

const PANELS: ReadonlyArray<PanelDef> = [
  {
    id: "hero",
    phoneSide: "right",
    Mockup: HomePopulated,
    ariaLabel: "Home dashboard showing your month at a glance",
    type: "hero",
    eyebrow: "Now in private beta · Built for internationals",
    headlinePrimary: "Understand your money,",
    headlineAccent: "wherever you bank.",
    subline:
      "A money app built for internationals: connect your bank and finally make sense of your spending, automatically.",
    body:
      "Living abroad is hard enough. Your money shouldn't feel foreign too.",
    trust: [
      { icon: TRUST_ICONS.tag, label: "Free to start, no card needed" },
      { icon: TRUST_ICONS.globe, label: "Hosted in the EU" },
      { icon: TRUST_ICONS.lock, label: "Read-only bank access, never sold" },
    ],
  },
  {
    id: "activity",
    phoneSide: "left",
    Mockup: Activity,
    ariaLabel: "Activity log of recent transactions",
    type: "showcase",
    number: "01",
    headline: "Every transaction, accounted for.",
    subhead:
      "Transactions flow in automatically from your bank, the moment they happen, tidied up and easy to read. Add cash by hand whenever you need to.",
    support: "Tap any entry to see the full story behind it.",
  },
  {
    id: "insights",
    phoneSide: "right",
    Mockup: Insights,
    ariaLabel: "Insights screen with categories and weekly trend",
    type: "showcase",
    number: "02",
    headline: "Patterns you'd miss in a bank statement.",
    subhead:
      "Where your money actually went, by category and trend, with your bank's merchant names made readable.",
    support: "The shape of your real life with money.",
  },
  {
    id: "budgets",
    phoneSide: "left",
    Mockup: Budgets,
    ariaLabel: "Budgets screen with category caps and progress",
    type: "showcase",
    number: "03",
    headline: "Budgets that breathe with you.",
    subhead:
      "Set monthly limits, watch progress fill in real time, get a quiet nudge before you cross a line.",
    support: "No guilt-trip notifications. Just calm awareness.",
  },
];

const DESKTOP_SCALE = 0.82;
const ease = [0.22, 0.61, 0.36, 1] as const;

/* ── Scaled phone (fixed 336x712 frame, scaled to fit a column) ──── */

function PhoneShell({
  panel,
  scale,
}: {
  panel: PanelDef;
  scale: number;
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
        <PhoneFrame ariaLabel={panel.ariaLabel}>
          <Mockup />
        </PhoneFrame>
      </div>
    </div>
  );
}

/* ── Text block ────────────────────────────────────────────────── */

function PanelText({ panel }: { panel: PanelDef }) {
  if (panel.type === "hero") {
    return (
      <>
        <p className="section-label mb-4">{panel.eyebrow}</p>
        <h1
          className="text-display text-4xl md:text-5xl lg:text-6xl tracking-tight mb-5"
          style={{ color: "var(--text-primary)" }}
        >
          {panel.headlinePrimary}{" "}
          <span className="text-gradient">{panel.headlineAccent}</span>
        </h1>
        <p
          className="text-lg md:text-xl leading-relaxed mb-4 max-w-md"
          style={{ color: "var(--text-primary)" }}
        >
          {panel.subline}
        </p>
        <p
          className="text-base md:text-lg leading-relaxed mb-7 max-w-md"
          style={{ color: "var(--text-secondary)" }}
        >
          {panel.body}
        </p>
        <div className="mb-8 max-w-md">
          <WaitlistForm source="hero" />
        </div>
        <ul className="space-y-2.5">
          {panel.trust.map((t) => (
            <li
              key={t.label}
              className="flex items-center gap-2.5 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              <span style={{ color: "var(--eyebrow)" }}>{t.icon}</span>
              {t.label}
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
        {panel.number}
      </p>
      <h2
        className="text-display text-3xl md:text-4xl lg:text-5xl tracking-tight mb-5"
        style={{ color: "var(--text-primary)" }}
      >
        {panel.headline}
      </h2>
      <p
        className="text-base md:text-lg leading-relaxed mb-3 max-w-md"
        style={{ color: "var(--text-secondary)" }}
      >
        {panel.subhead}
      </p>
      <p className="text-sm max-w-md" style={{ color: "var(--text-tertiary)" }}>
        {panel.support}
      </p>
    </>
  );
}

/* ── One alternating section ───────────────────────────────────── */

function FeatureSection({
  panel,
  index,
}: {
  panel: PanelDef;
  index: number;
}) {
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

  return (
    <section
      aria-label={isHero ? "MonieTally hero" : `Feature: ${panel.id}`}
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
            <PhoneShell panel={panel} scale={DESKTOP_SCALE} />
          </motion.div>
          <motion.div
            className="md:w-1/2 w-full"
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
