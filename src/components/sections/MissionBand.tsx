/**
 * MissionBand — short "why we exist" statement on the landing page.
 * Region-neutral: speaks to who we build for, not where we launch.
 * Pure render, no interactivity. Copy lives in messages (mission.*).
 */

import { useTranslations } from "next-intl";

export default function MissionBand() {
  const t = useTranslations("mission");

  return (
    <section
      className="relative overflow-hidden py-20 md:py-28"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="section-container relative text-center max-w-3xl mx-auto">
        <p className="section-label mb-4">{t("eyebrow")}</p>
        <h2
          className="text-display text-3xl md:text-4xl tracking-tight mb-6"
          style={{ color: "var(--text-primary)" }}
        >
          {t.rich("headline", {
            gradient: (chunks) => <span className="text-gradient">{chunks}</span>,
          })}
        </h2>
        <p
          className="text-base md:text-lg leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          {t("body")}
        </p>
        <figure className="mt-10 max-w-2xl mx-auto">
          <blockquote
            className="text-lg md:text-xl leading-relaxed"
            style={{ color: "var(--text-primary)" }}
          >
            &ldquo;{t("quote")}&rdquo;
          </blockquote>
          <figcaption
            className="mt-4 text-sm font-medium"
            style={{ color: "var(--text-tertiary)" }}
          >
            {t("attribution")}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
