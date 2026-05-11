"use client";

/**
 * Section: "Underneath the surface" — feature breadth in editorial cream/ink.
 *
 * Layout: editorial numbered-row spread, magazine-style. Each capability
 * is its own row with a large Playfair numeral on the left, headline +
 * body on the right, separated by a thin gold rule. No boxed cards.
 *
 * The ScrollShowcase already walks through the five user-facing screens
 * (Home, Activity, Insights, Budgets, Savings). This section covers
 * capabilities that aren't obvious from a screen tour.
 */

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Capability {
  headline: string;
  body: string;
}

const CAPABILITIES: ReadonlyArray<Capability> = [
  {
    headline: "Bank sync, when you want it.",
    body: "Connect your accounts and every transaction lands in MonieTally within minutes. Categorised, deduplicated, ready to act on. Manual entry is still one tap away when you'd rather drive.",
  },
  {
    headline: "Encrypted cloud sync.",
    body: "Your phone, laptop, and tablet stay in step. Everything is encrypted on device with a key your phone holds. The server stores ciphertext it cannot read.",
  },
  {
    headline: "Patterns, not paperwork.",
    body: "MonieTally watches for recurring charges, unusual weeks, and category drift. You get a quiet nudge when something's worth noticing. No dashboards to babysit.",
  },
  {
    headline: "Yours to leave.",
    body: "Export everything as CSV in a tap. No lock-in, no hostage data. If MonieTally ever stops working for you, you walk out with every byte you put in.",
  },
];

export default function MoreThanTracking() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="capabilities"
      className="bg-cream-soft text-ink py-24 md:py-36"
      style={{ borderTop: "1px solid var(--cream-line)" }}
    >
      <div className="section-container">
        {/* ── Eyebrow + headline ─────────────────────────────────── */}
        <motion.div
          className="max-w-3xl mb-20 md:mb-28"
          initial={reducedMotion ? undefined : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <p
            className="text-xs font-medium uppercase mb-4"
            style={{ letterSpacing: "0.22em", color: "var(--gold)" }}
          >
            Underneath the surface
          </p>
          <h2
            className="text-display"
            style={{
              fontSize: "clamp(34px, 4.8vw, 64px)",
              color: "var(--ink)",
              lineHeight: 1.05,
            }}
          >
            Built for real life,
            <br />
            not for spreadsheets.
          </h2>
        </motion.div>

        {/* ── Editorial numbered rows ────────────────────────────── */}
        <div role="list">
          {CAPABILITIES.map((cap, i) => {
            const isLast = i === CAPABILITIES.length - 1;
            return (
              <motion.div
                role="listitem"
                key={cap.headline}
                initial={reducedMotion ? undefined : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{
                  duration: 0.55,
                  delay: i * 0.05,
                  ease: [0.22, 0.61, 0.36, 1],
                }}
                style={{
                  borderTop: "1px solid var(--cream-line)",
                  borderBottom: isLast ? "1px solid var(--cream-line)" : undefined,
                }}
              >
                <div className="grid grid-cols-12 gap-6 md:gap-10 py-10 md:py-14 items-start">
                  {/* Numeral column */}
                  <div className="col-span-2 md:col-span-2">
                    <span
                      className="text-display block"
                      style={{
                        fontSize: "clamp(28px, 3vw, 44px)",
                        color: "var(--gold)",
                        lineHeight: 1,
                        fontVariationSettings: '"opsz" 96',
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Content column */}
                  <div className="col-span-10 md:col-span-10 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-baseline">
                    <h3
                      className="text-display md:col-span-5"
                      style={{
                        fontSize: "clamp(22px, 2.4vw, 32px)",
                        color: "var(--ink)",
                        lineHeight: 1.15,
                      }}
                    >
                      {cap.headline}
                    </h3>
                    <p
                      className="text-sm md:text-base leading-relaxed md:col-span-7"
                      style={{
                        color: "rgba(15,17,23,0.62)",
                        maxWidth: "52ch",
                      }}
                    >
                      {cap.body}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
