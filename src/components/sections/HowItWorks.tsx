"use client";

/**
 * "How it works" three-step strip, editorial direction.
 * See SPEC.md §12 for the locked copy and intent.
 *
 * Visual: cream surface (matches Hero), generous whitespace, large
 * Fraunces step numerals, phone mockups in a relaxed horizontal rhythm.
 * No surface-card boxes, no SaaS chrome. Each step reads like a column
 * in an editorial spread. Soft fade-in-up on scroll-into-view.
 */

import { motion } from "framer-motion";
import {
  PhoneFrame,
  PHONE_FRAME_WIDTH,
  PHONE_FRAME_HEIGHT,
} from "../landing/PhoneFrame";
import { Onboarding2 } from "../landing/mockups/Onboarding2";
import { AddTransaction } from "../landing/mockups/AddTransaction";
import { HomePopulated } from "../landing/mockups/HomePopulated";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const SCALE = 240 / PHONE_FRAME_WIDTH;

interface Step {
  Mockup: () => JSX.Element;
  ariaLabel: string;
  headline: string;
  subtext: string;
}

const steps: ReadonlyArray<Step> = [
  {
    Mockup: Onboarding2,
    ariaLabel: "Onboarding screen showing currency and PIN setup",
    headline: "Set up in seconds.",
    subtext:
      "Pick your currency, set a PIN, you're in. No bank login form, no questionnaire.",
  },
  {
    Mockup: AddTransaction,
    ariaLabel: "Add transaction screen with amount input",
    headline: "Or connect your bank.",
    subtext:
      "Plug in the accounts you want, and every transaction lands in MonieTally within minutes. Manual entry stays one tap away.",
  },
  {
    Mockup: HomePopulated,
    ariaLabel: "Home dashboard showing your month at a glance",
    headline: "See your month at a glance.",
    subtext:
      "One screen for what's left, where it went, and what's coming up. Budgets, goals, and insights pick up from there.",
  },
];

export default function HowItWorks() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="how-it-works"
      className="bg-cream text-ink py-24 md:py-36"
      style={{ borderTop: "1px solid var(--cream-line)" }}
    >
      <div className="section-container">
        {/* ── Eyebrow + headline ─────────────────────────────────── */}
        <div className="max-w-2xl mb-16 md:mb-24">
          <p
            className="text-xs font-medium uppercase mb-4"
            style={{ letterSpacing: "0.22em", color: "var(--gold)" }}
          >
            How it works
          </p>
          <h2
            className="text-display"
            style={{
              fontSize: "clamp(34px, 4.6vw, 60px)",
              color: "var(--ink)",
            }}
          >
            Three steps in, and you're seeing your money clearly.
          </h2>
        </div>

        {/* ── Step grid ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-20 md:gap-y-0 md:gap-x-10">
          {steps.map((step, i) => {
            const Mockup = step.Mockup;
            return (
              <motion.article
                key={step.headline}
                className="flex flex-col items-center md:items-start text-center md:text-left"
                initial={reducedMotion ? undefined : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-12% 0px" }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.08,
                  ease: [0.22, 0.61, 0.36, 1],
                }}
              >
                {/* Phone mockup, scaled. Fixed wrapper width so the
                    scaled inner doesn't break the column layout. */}
                <div
                  className="mx-auto md:mx-0"
                  style={{
                    width: PHONE_FRAME_WIDTH * SCALE,
                    height: PHONE_FRAME_HEIGHT * SCALE,
                    position: "relative",
                    marginBottom: 32,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      transform: `scale(${SCALE})`,
                      transformOrigin: "top left",
                    }}
                  >
                    <PhoneFrame ariaLabel={step.ariaLabel}>
                      <Mockup />
                    </PhoneFrame>
                  </div>
                </div>

                {/* Step numeral, large Fraunces, gold. Editorial spread vibe. */}
                <div
                  className="text-display flex items-baseline gap-3 mb-4"
                  style={{
                    fontSize: 28,
                    color: "var(--gold)",
                  }}
                >
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <span
                    aria-hidden="true"
                    style={{
                      flex: 1,
                      height: 1,
                      background: "var(--cream-line)",
                      transform: "translateY(-6px)",
                    }}
                  />
                </div>

                <h3
                  className="text-display"
                  style={{
                    fontSize: "clamp(22px, 2vw, 28px)",
                    marginBottom: 10,
                    color: "var(--ink)",
                  }}
                >
                  {step.headline}
                </h3>
                <p
                  className="text-sm md:text-base leading-relaxed max-w-[36ch]"
                  style={{ color: "rgba(15,17,23,0.65)" }}
                >
                  {step.subtext}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
