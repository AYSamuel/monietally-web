import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Open MonieTally on your phone | MonieTally",
  description:
    "Open this link on the phone where you installed MonieTally to finish confirming your email or resetting your password.",
  robots: { index: false, follow: false },
};

// Content-agnostic fallback page reached when a Supabase auth email
// (verification or password-reset) is opened on a device other than
// the phone with the MonieTally app installed.
//
// Body copy stays English (SPEC-i18n Q3): it is opened from links in emails
// sent by the mobile app, which don't currently carry a locale. The page lives
// under [locale] so it gets <html>/providers and a valid lang; the middleware
// prefixes the bare /auth/callback email link to the detected/default locale.
// Revisit with the app team once email links can carry a locale.
//
// Why one page instead of /auth/callback + /auth/reset:
//   The instructional message is identical for both flows ("open
//   this on your phone"), so a single static landing page keeps
//   the marketing site simpler and avoids drift between two
//   nearly-identical templates. Supabase rewrites unmatched
//   redirects to the Site URL anyway, so even users coming from
//   a /auth/reset link land here.
//
// Phase A1 scope:
//   - No code-exchange logic. The Flutter app handles the PKCE
//     exchange via supabase_flutter's built-in app_links integration.
//   - No QR code or deep-link button. Both stay deferred per
//     docs/auth-and-sync/99-deferred-until-production.md.
//
// Tag: SPEC-phase-a1 §2.1.
export default function AuthCallbackPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  return (
    <>
      <Navbar />
      <main
        className="pt-24 pb-16 md:pt-32 md:pb-24"
        style={{ background: "var(--bg-primary)" }}
      >
        <div className="section-container">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-10 text-center">
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
                style={{
                  background: "var(--surface-elevated)",
                  border: "1px solid var(--border-subtle)",
                }}
                aria-hidden="true"
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ color: "var(--text-primary)" }}
                >
                  <rect x="7" y="2" width="10" height="20" rx="2.5" ry="2.5" />
                  <line x1="11" y1="18" x2="13" y2="18" />
                </svg>
              </div>
              <h1
                className="text-display text-3xl md:text-4xl tracking-tight mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Open MonieTally on your phone.
              </h1>
              <p
                className="text-base leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                The link you tapped from your inbox uses a custom URL
                that only works on the device where MonieTally is
                installed.
              </p>
            </div>

            {/* What to do */}
            <div
              className="rounded-xl p-6 md:p-8 mb-8"
              style={{
                background: "var(--surface-elevated)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <h2
                className="text-sm font-semibold mb-4 uppercase tracking-wider"
                style={{ color: "var(--text-tertiary)" }}
              >
                What to do
              </h2>
              <ol className="space-y-4">
                <li
                  className="flex gap-3 text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-semibold"
                    style={{
                      background: "var(--bg-primary)",
                      border: "1px solid var(--border-subtle)",
                      color: "var(--text-primary)",
                    }}
                  >
                    1
                  </span>
                  <span>
                    Open the inbox of the email address you used to sign
                    up on the phone with MonieTally installed.
                  </span>
                </li>
                <li
                  className="flex gap-3 text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-semibold"
                    style={{
                      background: "var(--bg-primary)",
                      border: "1px solid var(--border-subtle)",
                      color: "var(--text-primary)",
                    }}
                  >
                    2
                  </span>
                  <span>
                    Tap the same link again from that inbox. MonieTally
                    will open automatically and finish the rest.
                  </span>
                </li>
                <li
                  className="flex gap-3 text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-semibold"
                    style={{
                      background: "var(--bg-primary)",
                      border: "1px solid var(--border-subtle)",
                      color: "var(--text-primary)",
                    }}
                  >
                    3
                  </span>
                  <span>
                    If the link has expired by the time you get to your
                    phone, request a fresh one from inside the app.
                  </span>
                </li>
              </ol>
            </div>

            {/* Don't have the app */}
            <div className="text-center">
              <p
                className="text-sm mb-3"
                style={{ color: "var(--text-tertiary)" }}
              >
                Don&apos;t have the app yet?
              </p>
              <a
                href="/"
                className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
                style={{ color: "var(--text-primary)" }}
              >
                Download MonieTally
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
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
