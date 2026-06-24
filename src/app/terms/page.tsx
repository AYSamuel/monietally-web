import type { Metadata } from "next";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service | MonieTally",
  description: "MonieTally's terms of service.",
};

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of terms",
    content: `By downloading, installing, or using the MonieTally app or visiting monietally.com, you agree to be bound by these Terms of Service. If you do not agree, do not use MonieTally.

Effective date: April 30, 2026.`,
  },
  {
    id: "description",
    title: "2. Description of service",
    // TODO: confirm exact data-flow wording with legal counsel and finalise the open-banking provider before launch
    content: `MonieTally is a personal finance application that helps users track spending, visualise financial data, and manage budgets. Users can enter transactions manually or connect to financial institutions via a regulated open-banking provider (such as GoCardless Bank Account Data or finAPI; provider to be finalised) to sync transaction data automatically using read-only access.

Financial data is hosted on servers in the EU, encrypted in transit and at rest, and synced across the user's devices. MonieTally never receives or stores the user's bank login. MonieTally does not provide banking services, investment advice, or any regulated financial service.`,
  },
  {
    id: "responsibilities",
    title: "3. User responsibilities",
    content: `You agree to:
• Use MonieTally only for lawful personal finance management purposes.
• Not attempt to reverse-engineer, decompile, or tamper with the app.
• Not use MonieTally to commit fraud or any illegal financial activity.
• Keep your device and app access secure. MonieTally is not responsible for unauthorised access resulting from your failure to secure your device.
• Provide accurate information when joining the waitlist.`,
  },
  {
    id: "ip",
    title: "4. Intellectual property",
    content: `All rights, title, and interest in MonieTally (including the app, website, design, code, and branding) are owned by MonieTally. Nothing in these terms transfers any intellectual property rights to you.

You are granted a limited, non-exclusive, non-transferable licence to use the app for personal, non-commercial purposes.`,
  },
  {
    id: "disclaimer",
    title: "5. Disclaimer of warranties",
    content: `MonieTally is provided "as is" and "as available" without warranty of any kind, express or implied.

We do not warrant that:
• The app will be error-free or uninterrupted.
• Transaction data retrieved via bank aggregators will be complete, accurate, or current.
• The app will meet your specific requirements.

Use MonieTally at your own risk.`,
  },
  {
    id: "liability",
    title: "6. Limitation of liability",
    content: `To the fullest extent permitted by applicable law, MonieTally and its developers shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of data, loss of profits, or financial decisions made based on app data.

Our total liability for any claim related to MonieTally shall not exceed the amount you paid for the app, if any.`,
  },
  {
    id: "bank-disclaimer",
    title: "7. Bank sync disclaimer",
    content: `MonieTally is not a bank, financial institution, or registered financial advisor. We do not hold, move, or custody any funds.

If you choose to enable bank sync, it is provided via regulated third-party bank-connection providers. Bank sync is optional. The app is fully functional with manual entry. MonieTally is not responsible for:
• Errors, delays, or interruptions in data from these providers.
• Changes to provider APIs that affect sync functionality.
• Your relationship with your financial institution.

Always verify your financial data with your bank directly before making financial decisions.`,
  },
  {
    id: "third-party-services",
    title: "8. Third-party services",
    content: `MonieTally integrates with regulated third-party bank-connection providers. Your use of these services is subject to their respective terms of service and privacy policies. MonieTally is not responsible for the practices of these third parties.`,
  },
  {
    id: "termination",
    title: "9. Termination",
    content: `You may stop using MonieTally at any time by deleting the app. Deleting the app removes all locally stored financial data from your device.

We reserve the right to terminate or suspend access to the waitlist or future services for users who violate these terms.`,
  },
  {
    id: "governing-law",
    title: "10. Governing law",
    content: `These terms are governed by and construed in accordance with applicable law. Any disputes shall be resolved in the courts of the jurisdiction where MonieTally is registered.`,
  },
  {
    id: "changes",
    title: "11. Changes to terms",
    content: `We may update these terms from time to time. We will update the effective date at the top of this page and, for material changes, notify waitlist subscribers by email. Continued use of MonieTally after changes take effect constitutes your acceptance of the new terms.`,
  },
  {
    id: "contact",
    title: "12. Contact",
    content: `Questions about these terms? Email us at hello@monietally.com.`,
  },
];

export default function TermsPage() {
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
                Terms of Service
              </h1>
              <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                Effective date: April 30, 2026 · Version 1.0
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
                      className="text-sm transition-colors hover:text-brand-blue"
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
