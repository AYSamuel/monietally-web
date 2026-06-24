import type { Metadata } from "next";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | MonieTally",
  description:
    "How MonieTally handles your data. Your bank connection is read-only, your data is hosted in the EU under GDPR, encrypted in transit and at rest, and never sold.",
};

// TODO: confirm exact data-flow wording with legal counsel and finalise the open-banking provider before launch

const sections = [
  {
    id: "introduction",
    title: "1. Introduction",
    content: `MonieTally ("we", "our", "the app") is a personal finance application built around data protection by default. This Privacy Policy explains how we handle information in connection with the MonieTally app and this website (monietally.com).

Effective date: May 10, 2026.

Our core principle: your bank connection is read-only via a regulated open-banking provider. Your data is hosted in the EU under GDPR, encrypted in transit and at rest, and never sold. We never receive or store your bank login.`,
  },
  {
    id: "what-we-collect",
    title: "2. Information we collect",
    content: `Website only: if you submit your email address via our waitlist form, we store that email address to notify you when MonieTally launches. You can optionally tell us which bank or banks you use and your country, so we can prioritise which banks to support first. This is the bank's name only, never your login, balance, or account details. Your email and any details you provide are stored securely in our database, hosted in the EU. We do not share them with third parties.

The app: MonieTally lets you add transactions by hand, and you may connect your bank via a regulated open-banking provider (such as GoCardless Bank Account Data or finAPI; provider to be finalised) to sync transactions automatically. The provider retrieves your transaction data using read-only access; we never receive or store your bank login. Your financial data (transactions, balances, budgets, goals, and analytics) is hosted on our servers in the EU, encrypted in transit and at rest, and never sold.`,
  },
  {
    id: "how-we-use",
    title: "3. How we use information",
    content: `Waitlist emails are used solely to send you a launch notification and critical product updates. We will not send marketing emails, share your address with third parties, or contact you for any other reason without your explicit consent.

Your app data is stored on our EU servers to sync it across your authenticated devices and show you your spending. We do not sell, rent, or monetise your data, and we do not build advertising profiles from it.`,
  },
  {
    id: "encryption",
    title: "4. Data protection",
    content: `MonieTally protects your financial data with industry-standard safeguards:

1. Your bank connection is read-only via a regulated open-banking provider. We never receive or store your bank login.
2. Your data is hosted on servers in the EU, under GDPR.
3. Data is encrypted in transit (TLS) and at rest.
4. Access is limited to your authenticated devices and the systems needed to deliver the service.
5. We do not sell your data, run ads, or build advertising profiles from it.`,
  },
  {
    id: "bank-sync",
    title: "5. Bank sync and open-banking providers",
    content: `If you choose to enable bank sync, MonieTally connects to your bank via a regulated open-banking provider (such as GoCardless Bank Account Data or finAPI; provider to be finalised). The provider retrieves your transaction data using read-only access. MonieTally never receives or stores your bank login credentials. Bank sync is optional. The app is fully functional with manual entry alone.

Transaction data fetched by the provider is then stored on our EU servers, encrypted in transit and at rest. The connection is used solely to fetch transaction data. We do not use it to initiate payments, transfers, or any other banking action.

Your use of these bank sync services is also subject to their respective privacy policies and terms of service.`,
  },
  {
    id: "data-storage",
    title: "6. Data storage and hosting",
    content: `Financial data: hosted on servers in the EU, encrypted in transit and at rest. Subject to GDPR.

Waitlist emails: stored in our database, also hosted in the EU.

On-device data: a copy may be cached on your device so the app works offline, managed by the app's local database engine.`,
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
    content: `You can delete your account and all associated data at any time from the app settings. Once deleted, your data is permanently removed from our servers within 30 days. We retain no backups of your financial data beyond this window.

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
                Effective date: May 10, 2026 · Version 1.0
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
