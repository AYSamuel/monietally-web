import type { Metadata } from "next";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export const metadata: Metadata = {
  title: "Delete your account | MonieTally",
  description:
    "How to delete your MonieTally account and what we remove. Account deletion is permanent; encrypted data is wiped from our servers within 60 seconds.",
};

const sections = [
  {
    id: "in-app",
    title: "1. Delete from inside the app",
    content: `The fastest way to delete your account is from inside MonieTally:

1. Open the MonieTally app.
2. Tap the Profile tab.
3. Tap your name (the identity row at the top).
4. Tap Delete account.
5. Follow the two-step confirmation.

You will be asked to type DELETE to confirm. The action is permanent and cannot be undone.`,
  },
  {
    id: "what-gets-deleted",
    title: "2. What gets deleted",
    content: `Tapping Delete account permanently removes:

- Your account on our servers (your auth identity).
- Every encrypted transaction, category, budget, savings goal, and template synced from your devices.
- Your encrypted preferences blob (currency, theme, etc.).

Removal from our servers happens within 60 seconds. The MonieTally app itself is not uninstalled, and any data that lives only on the device you are using stays there until you sign back in (or use Clear all data in Privacy & data).

After deletion, MonieTally falls back to local-only mode on the device. You can keep using it offline, sign up again later with the same or a different email, or uninstall the app entirely. Your choice.`,
  },
  {
    id: "what-we-briefly-keep",
    title: "3. What we briefly keep, and why",
    content: `For 30 days after deletion we retain:

- A salted hash of your email address. This prevents someone from immediately re-registering the same address and inheriting a partially-deleted account during the cleanup window. We cannot reverse the hash to recover the original email.
- Anonymised log entries that mention your account ID, used solely to debug the deletion itself if anything goes wrong.

After 30 days, even those records are wiped. We never retain any financial data past the 60-second deletion. Every transaction, balance, and budget is gone immediately and irreversibly.`,
  },
  {
    id: "no-access",
    title: "4. If you can't access the app",
    content: `If you can't reach the in-app flow (lost your phone, forgot your password, signed in with an OAuth provider you no longer use, etc.), email support@monietally.com from the address linked to your account.

We will verify your identity (typically by sending a verification link to the address on file) and process the deletion within 7 days. There is no separate web form because the email-based path is simpler and gives you a written confirmation when the deletion completes.`,
  },
  {
    id: "third-parties",
    title: "5. Third-party providers and bank sync",
    content: `If you connected MonieTally to your bank via a third-party aggregator (Plaid, Tink, or Mono, depending on region), deleting your MonieTally account revokes our access token with that provider. The aggregator may retain logs of past sync activity per their own policies. To purge any data the aggregator separately holds about you, contact them directly.

Transactions that were already synced to your devices are encrypted under your key. Once your account is deleted from our servers, those encrypted blobs become unreadable on every other device as well, because the auth check fails before the decryption ever runs.`,
  },
  {
    id: "questions",
    title: "6. Questions",
    content: `If something on this page is unclear or you ran into an issue mid-deletion, email support@monietally.com and we'll help. Deletion is meant to be a clean, no-friction exit; if it isn't, that's a bug on our side.`,
  },
];

export default function DeleteAccountPage() {
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
                Delete your account
              </h1>
              <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                Permanent. Wipes synced data within 60 seconds.
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
                Contents
              </h2>
              <ol className="space-y-2">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="text-sm transition-colors"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>

            {/* Sections */}
            <div className="space-y-10">
              {sections.map((s) => (
                <div key={s.id} id={s.id} style={{ scrollMarginTop: 80 }}>
                  <h2
                    className="text-lg font-semibold mb-3"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {s.title}
                  </h2>
                  <div
                    className="text-sm leading-relaxed whitespace-pre-line"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {s.content}
                  </div>
                </div>
              ))}
              <div className="pt-8 text-center">
                <a
                  href="#"
                  className="text-xs font-medium transition-colors hover:text-brand-blue"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Back to top
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
