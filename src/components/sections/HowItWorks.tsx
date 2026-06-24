/**
 * HowItWorks — a quick three-step orientation so a first-time visitor
 * grasps the mechanic before the deeper feature sections.
 * Theme-responsive, token-based, no animation needed.
 * Copy lives in messages (howItWorks.*); only the step order lives here.
 */

import { useTranslations } from "next-intl";

const STEPS = [
  { n: "1", key: "connect" },
  { n: "2", key: "arrive" },
  { n: "3", key: "plan" },
] as const;

export default function HowItWorks() {
  const t = useTranslations("howItWorks");

  return (
    <section
      id="how-it-works"
      className="relative py-20 md:py-28"
      style={{ background: "var(--bg-secondary)", scrollMarginTop: 72 }}
    >
      <div className="section-container">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <p className="section-label mb-4">{t("eyebrow")}</p>
          <h2
            className="text-display text-3xl md:text-4xl tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {t("headline")}
          </h2>
        </div>
        <div className="grid gap-10 md:grid-cols-3 md:gap-12">
          {STEPS.map((step) => (
            <div key={step.n} className="text-center md:text-left">
              <div
                className="text-display mb-4"
                style={{ fontSize: 44, lineHeight: 1, color: "var(--eyebrow)" }}
              >
                {step.n}
              </div>
              <h3
                className="text-xl font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                {t(`steps.${step.key}.title`)}
              </h3>
              <p
                className="text-base leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {t(`steps.${step.key}.body`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
