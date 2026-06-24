import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { localizedAlternates } from "@/lib/seo";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("terms.title"),
    description: t("terms.description"),
    alternates: localizedAlternates(locale, "/terms"),
    openGraph: { title: t("terms.title"), description: t("terms.description") },
    twitter: { title: t("terms.title"), description: t("terms.description") },
  };
}

// Anchor ids stay in code; titles + content come from messages (termsPage.sections).
// TODO: confirm exact data-flow wording with legal counsel and finalise the open-banking provider before launch
const SECTION_IDS = [
  "acceptance",
  "description",
  "responsibilities",
  "ip",
  "disclaimer",
  "liability",
  "bank-disclaimer",
  "third-party-services",
  "termination",
  "governing-law",
  "changes",
  "contact",
] as const;

export default function TermsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = useTranslations("termsPage");
  const sections = t.raw("sections") as ReadonlyArray<{ title: string; content: string }>;

  return (
    <>
      <Navbar />
      <main
        className="pt-24 pb-16 md:pt-32 md:pb-24"
        style={{ background: "var(--bg-primary)" }}
      >
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-12">
              <h1
                className="text-display text-4xl tracking-tight mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                {t("title")}
              </h1>
              <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                {t("effectiveLine")}
              </p>
            </div>

            {/* Table of contents */}
            <div
              className="rounded-xl p-6 mb-12"
              style={{
                background: "var(--surface-elevated)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <h2
                className="text-sm font-semibold mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                {t("contents")}
              </h2>
              <ol className="space-y-2">
                {SECTION_IDS.map((id, i) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      className="text-sm transition-colors hover:text-brand-blue"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {sections[i].title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>

            {/* Sections */}
            <div className="space-y-10">
              {SECTION_IDS.map((id, i) => (
                <div key={id} id={id} style={{ scrollMarginTop: 80 }}>
                  <h2
                    className="text-lg font-semibold mb-3"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {sections[i].title}
                  </h2>
                  <div
                    className="text-sm leading-relaxed whitespace-pre-line"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {sections[i].content}
                  </div>
                </div>
              ))}
              <div className="pt-8 text-center">
                <a
                  href="#"
                  className="text-xs font-medium transition-colors hover:text-brand-blue"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {t("backToTop")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
