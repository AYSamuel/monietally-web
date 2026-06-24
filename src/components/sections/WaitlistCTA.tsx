"use client";

/**
 * WaitlistCTA — closing call to action, editorial ink direction.
 *
 * Layout: ink surface (the visual peak after the cream sections), centred
 * editorial frame with a small gold asterism above the eyebrow, large
 * Playfair headline split across two lines, the inverted WaitlistForm,
 * and two reassurance rows under the form. A softer gold glow sits behind
 * the headline. Thin gold rules above and below the headline frame the
 * type like an editorial pull-quote.
 */

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import WaitlistForm from "../WaitlistForm";

export default function WaitlistCTA() {
  const t = useTranslations("waitlistCta");
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="waitlist"
      className="relative overflow-hidden text-cream"
      style={{ background: "var(--ink)" }}
    >
      {/* Soft gold radial glow behind the headline. */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 1000,
          height: 620,
          background:
            "radial-gradient(ellipse at center, rgba(201,169,97,0.20) 0%, transparent 65%)",
          filter: "blur(20px)",
        }}
      />

      <div className="section-container relative py-20 md:py-28 text-center">
        <motion.div
          initial={reducedMotion ? undefined : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
        >
          {/* Decorative asterism above the eyebrow */}
          <div
            aria-hidden="true"
            className="mb-7 inline-flex items-center justify-center text-display"
            style={{
              fontSize: 22,
              color: "var(--gold)",
              letterSpacing: "0.4em",
              opacity: 0.85,
            }}
          >
            ✻
          </div>

          <p
            className="text-xs font-medium uppercase mb-7"
            style={{ letterSpacing: "0.28em", color: "var(--gold)" }}
          >
            {t("eyebrow")}
          </p>

          {/* Headline framed with thin gold rules */}
          <div
            className="mx-auto"
            style={{ maxWidth: 760 }}
          >
            <div
              aria-hidden="true"
              className="mx-auto mb-8"
              style={{
                width: 56,
                height: 1,
                background: "rgba(201, 169, 97, 0.55)",
              }}
            />

            <h2
              className="text-display mx-auto"
              style={{
                fontSize: "clamp(40px, 5.6vw, 80px)",
                color: "var(--cream)",
                marginBottom: 28,
                lineHeight: 1.04,
                fontVariationSettings: '"opsz" 96',
              }}
            >
              {t.rich("headline", { br: () => <br /> })}
            </h2>

            <p
              className="text-base md:text-lg mx-auto leading-relaxed mb-14"
              style={{
                color: "rgba(245, 241, 232, 0.72)",
                maxWidth: 540,
              }}
            >
              {t("subline")}
            </p>
          </div>
        </motion.div>

        <motion.div
          className="flex justify-center"
          initial={reducedMotion ? undefined : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.12 }}
        >
          <WaitlistForm source="cta" />
        </motion.div>

        {/* Reassurance row — two short proofs side by side. */}
        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-x-8 gap-y-3 text-xs"
          style={{ color: "rgba(245, 241, 232, 0.55)" }}
          initial={reducedMotion ? undefined : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <span className="inline-flex items-center gap-2">
            <span
              aria-hidden="true"
              style={{
                width: 6,
                height: 6,
                borderRadius: 9999,
                background: "var(--gold)",
              }}
            />
            {t("reassurance1")}
          </span>
          <span
            aria-hidden="true"
            className="hidden sm:inline-block"
            style={{
              width: 1,
              height: 12,
              background: "rgba(245, 241, 232, 0.18)",
            }}
          />
          <span className="inline-flex items-center gap-2">
            <span
              aria-hidden="true"
              style={{
                width: 6,
                height: 6,
                borderRadius: 9999,
                background: "var(--gold)",
              }}
            />
            {t("reassurance2")}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
