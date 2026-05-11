import Link from "next/link";

export default function Footer() {
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
              A finance app that respects your privacy by default. Your money,
              clearly seen. Encrypted with a key your phone holds, not ours.
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
              Hosted in the EU (Frankfurt). GDPR by design.
            </div>
          </div>

          {/* ── Product links ────────────────────────────────────── */}
          <div className="md:col-span-3">
            <h4
              className="text-xs font-medium uppercase mb-5"
              style={{
                letterSpacing: "0.18em",
                color: "var(--gold)",
              }}
            >
              Product
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/#hero"
                  className="text-sm transition-opacity hover:opacity-100"
                  style={{ color: "var(--text-secondary)", opacity: 0.85 }}
                >
                  Why MonieTally
                </Link>
              </li>
              <li>
                <Link
                  href="/#social-proof"
                  className="text-sm transition-opacity hover:opacity-100"
                  style={{ color: "var(--text-secondary)", opacity: 0.85 }}
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="text-sm transition-opacity hover:opacity-100"
                  style={{ color: "var(--text-secondary)", opacity: 0.85 }}
                >
                  FAQ
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
                color: "var(--gold)",
              }}
            >
              Company
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm transition-opacity hover:opacity-100"
                  style={{ color: "var(--text-secondary)", opacity: 0.85 }}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm transition-opacity hover:opacity-100"
                  style={{ color: "var(--text-secondary)", opacity: 0.85 }}
                >
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm transition-opacity hover:opacity-100"
                  style={{ color: "var(--text-secondary)", opacity: 0.85 }}
                >
                  Terms of service
                </Link>
              </li>
              <li>
                <a
                  href="mailto:hello@monietally.com"
                  className="text-sm transition-opacity hover:opacity-100"
                  style={{ color: "var(--text-secondary)", opacity: 0.85 }}
                >
                  hello@monietally.com
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
            &copy; {currentYear} MonieTally. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Designed for clarity. Built for privacy.
          </p>
        </div>
      </div>
    </footer>
  );
}
