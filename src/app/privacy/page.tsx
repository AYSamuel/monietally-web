import type { Metadata } from "next";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | MonieTally",
  description:
    "How MonieTally handles your data. Short version: your financial data is encrypted on your device. We only ever see ciphertext.",
};

const sections = [
  {
    id: "introduction",
    title: "1. Introduction",
    content: `MonieTally ("we", "our", "the app") is a personal finance application built around end-to-end encryption. This Privacy Policy explains how we handle information in connection with the MonieTally app and this website (monietally.com).

Effective date: May 10, 2026.

Our core principle: your financial data is encrypted on your device before it leaves your phone. The server stores only ciphertext it cannot decrypt. We could not read your records if a court asked us to.`,
  },
  {
    id: "what-we-collect",
    title: "2. Information we collect",
    content: `Website only: if you submit your email address via our waitlist form, we store that email address to notify you when MonieTally launches. Emails are stored securely in our database, hosted in the EU (Hetzner, Frankfurt). We do not share your address with third parties.

The app: MonieTally syncs transactions from your bank via third-party aggregators (Plaid, Tink, Mono). Once received, all financial data (transactions, balances, budgets, goals, and analytics) is encrypted on your device using AES-256-GCM before being stored or synced. What reaches our servers is ciphertext. We cannot decrypt it. The encryption key is generated on your device and synced to your other devices through your OS keychain (iCloud Keychain or Google Block Store). It never passes through our servers.`,
  },
  {
    id: "how-we-use",
    title: "3. How we use information",
    content: `Waitlist emails are used solely to send you a launch notification and critical product updates. We will not send marketing emails, share your address with third parties, or contact you for any other reason without your explicit consent.

Encrypted app data passes through our sync server as opaque blobs. We use it only to deliver those blobs to your other authenticated devices. We do not process, index, analyse, or monetise your data in any form.`,
  },
  {
    id: "encryption",
    title: "4. Encryption architecture",
    content: `MonieTally uses end-to-end encryption for all financial data:

1. A Data Encryption Key (DEK) is generated on your device at account creation.
2. All records are encrypted locally with AES-256-GCM before leaving the device.
3. Encrypted blobs are synced to our server for storage and delivery to your other devices.
4. The DEK is stored in your OS keychain (iCloud Keychain on Apple, Google Block Store on Android) and syncs between your devices through those platform mechanisms. It never touches our servers.
5. Decryption happens only on your authenticated devices.

The server stores ciphertext and metadata needed for sync (timestamps, blob sizes). It cannot derive plaintext from what it holds.`,
  },
  {
    id: "bank-sync",
    title: "5. Bank sync and third-party aggregators",
    content: `MonieTally connects to your bank via third-party aggregators (Plaid, Tink, or Mono, depending on your region). These providers retrieve your transaction data using read-only access. MonieTally never stores your bank login credentials.

Once transactions reach your device, they are immediately encrypted with your local key before being stored or synced. The aggregator connection is used solely to fetch transaction data — we do not use it to initiate payments, transfers, or any other banking action.

Your use of these bank sync services is also subject to their respective privacy policies and terms of service.`,
  },
  {
    id: "data-storage",
    title: "6. Data storage and hosting",
    content: `Encrypted data: stored on servers hosted by Hetzner in Frankfurt, Germany (EU). Subject to GDPR.

Waitlist emails: stored in our PostgreSQL database, also hosted in the EU (Frankfurt).

Local data: your device holds both the plaintext and the encrypted form. Local storage is managed by the app's database engine.`,
  },
  {
    id: "cookies",
    title: "7. Cookies and tracking",
    content: `This website does not use cookies, analytics, ad tracking, or session recording. We do not run any third-party trackers on monietally.com.`,
  },
  {
    id: "childrens-privacy",
    title: "8. Children's privacy",
    content: `MonieTally is not directed at children under 13. We do not knowingly collect information from children. If you believe a child has submitted their email to our waitlist, please contact us and we will delete it promptly.`,
  },
  {
    id: "data-deletion",
    title: "9. Data deletion",
    content: `You can delete your account and all associated encrypted data at any time from the app settings. Once deleted, the ciphertext blobs are permanently removed from our servers within 30 days. We retain no backups of user-encrypted data beyond this window.

To remove your email from the waitlist, reply to any email from us or contact hello@monietally.com.`,
  },
  {
    id: "changes",
    title: "10. Changes to this policy",
    content: `If we make material changes to this policy, we will update the effective date at the top of this page. For significant changes, we will notify waitlist subscribers by email.`,
  },
  {
    id: "contact",
    title: "11. Contact",
    content: `Questions about this policy? Email us at hello@monietally.com.`,
  },
];

export default function PrivacyPage() {
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
                Privacy Policy
              </h1>
              <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                Effective date: May 10, 2026
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
                <div key={s.id} id={s.id}>
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
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
