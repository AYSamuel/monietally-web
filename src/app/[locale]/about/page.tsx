import type { Metadata } from "next";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WaitlistCTA from "@/components/sections/WaitlistCTA";
import { localizedAlternates } from "@/lib/seo";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("about.title"),
    description: t("about.description"),
    alternates: localizedAlternates(locale, "/about"),
    openGraph: { title: t("about.title"), description: t("about.description") },
    twitter: { title: t("about.title"), description: t("about.description") },
  };
}

// Icon + accent stay in code (visual identity); copy comes from messages,
// keyed by the principle id under about.principles.items.
const PRINCIPLES: ReadonlyArray<{ id: string; color: string; icon: ReactNode }> = [
  {
    id: "overlooked",
    color: "#11A675",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    id: "language",
    color: "#00C98B",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
  },
  {
    id: "banks",
    color: "#0A6E4D",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    id: "private",
    color: "#F4B860",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
];

export default function AboutPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = useTranslations("about");
  const gradient = (chunks: ReactNode) => <span className="text-gradient">{chunks}</span>;

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section
          className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-24"
          style={{ background: "var(--bg-primary)" }}
        >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(17,166,117,0.10) 0%, transparent 70%)",
            }}
          />
          <div className="section-container relative text-center max-w-3xl mx-auto">
            <p className="section-label mb-4">{t("hero.eyebrow")}</p>
            <h1 className="text-display text-4xl md:text-5xl tracking-tight mb-6">
              {t.rich("hero.headline", { gradient })}
            </h1>
            <p
              className="text-base md:text-lg leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {t("hero.body")}
            </p>
          </div>
        </section>

        {/* Mission statement */}
        <section className="py-16 md:py-20">
          <div className="section-container">
            <div
              className="max-w-3xl mx-auto space-y-6 text-base md:text-lg leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              <p>{t("mission.p1")}</p>
              <p>{t("mission.p2")}</p>
              <p>{t("mission.p3")}</p>
            </div>
          </div>
        </section>

        {/* Principles */}
        <section className="py-16 md:py-20">
          <div className="section-container">
            <div className="text-center mb-12">
              <p className="section-label mb-3">{t("principles.eyebrow")}</p>
              <h2 className="section-heading">
                {t.rich("principles.headline", { gradient })}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
              {PRINCIPLES.map((p) => (
                <div
                  key={p.id}
                  className="surface-card p-6"
                  style={{ boxShadow: "var(--shadow-sm)" }}
                >
                  <div
                    aria-hidden="true"
                    className="feature-icon mb-4"
                    style={{ background: `${p.color}18`, color: p.color }}
                  >
                    {p.icon}
                  </div>
                  <h3
                    className="text-base font-semibold mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {t(`principles.items.${p.id}.title`)}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {t(`principles.items.${p.id}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Looking ahead */}
        <section className="py-16 md:py-20">
          <div className="section-container">
            <div className="max-w-3xl mx-auto text-center">
              <p className="section-label mb-3">{t("next.eyebrow")}</p>
              <h2 className="section-heading mb-6">
                {t.rich("next.headline", { gradient })}
              </h2>
              <p
                className="text-base md:text-lg leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {t("next.body")}
              </p>
            </div>
          </div>
        </section>

        <WaitlistCTA />
      </main>
      <Footer />
    </>
  );
}
