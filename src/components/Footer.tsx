import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SITE } from "@/lib/constants";

export default function Footer() {
  const t = useTranslations("footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "var(--bg-secondary)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div className="section-container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-x-10">
          {/* ── Brand + tagline ──────────────────────────────────── */}
          <div className="md:col-span-6">
            <span
              className="text-display"
              style={{
                fontSize: 28,
                color: "var(--text-primary)",
                fontVariationSettings: '"opsz" 96',
              }}
            >
              MonieTally
            </span>
            <p
              className="text-sm mt-4 max-w-md leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {t("tagline")}
            </p>

            <div
              className="mt-6 inline-flex items-center gap-2 text-xs"
              style={{ color: "var(--text-tertiary)" }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 9999,
                  background: "var(--gold)",
                }}
              />
              {t("euNote")}
            </div>

            {/* Social links */}
            <div className="mt-6 flex items-center gap-4">
              <a
                href="#"
                aria-label={t("instagramAria")}
                className="transition-opacity hover:opacity-100"
                style={{ color: "var(--text-secondary)", opacity: 0.7 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="#"
                aria-label={t("linkedinAria")}
                className="transition-opacity hover:opacity-100"
                style={{ color: "var(--text-secondary)", opacity: 0.7 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>

          {/* ── Product links ────────────────────────────────────── */}
          <div className="md:col-span-3">
            <h4
              className="text-xs font-medium uppercase mb-5"
              style={{
                letterSpacing: "0.18em",
                color: "var(--eyebrow)",
              }}
            >
              {t("product")}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/#how-it-works"
                  className="text-sm transition-opacity hover:opacity-100"
                  style={{ color: "var(--text-secondary)", opacity: 0.85 }}
                >
                  {t("howItWorks")}
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="text-sm transition-opacity hover:opacity-100"
                  style={{ color: "var(--text-secondary)", opacity: 0.85 }}
                >
                  {t("faq")}
                </Link>
              </li>
            </ul>
          </div>

          {/* ── Legal + contact ──────────────────────────────────── */}
          <div className="md:col-span-3">
            <h4
              className="text-xs font-medium uppercase mb-5"
              style={{
                letterSpacing: "0.18em",
                color: "var(--eyebrow)",
              }}
            >
              {t("company")}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm transition-opacity hover:opacity-100"
                  style={{ color: "var(--text-secondary)", opacity: 0.85 }}
                >
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm transition-opacity hover:opacity-100"
                  style={{ color: "var(--text-secondary)", opacity: 0.85 }}
                >
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm transition-opacity hover:opacity-100"
                  style={{ color: "var(--text-secondary)", opacity: 0.85 }}
                >
                  {t("terms")}
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-sm transition-opacity hover:opacity-100"
                  style={{ color: "var(--text-secondary)", opacity: 0.85 }}
                >
                  {SITE.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ────────────────────────────────────────── */}
        <div
          className="mt-16 pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {t("rights", { year: currentYear })}
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {t("signoff")}
          </p>
        </div>
      </div>
    </footer>
  );
}
