import type { Metadata } from "next";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import WaitlistCTA from "../../components/sections/WaitlistCTA";

export const metadata: Metadata = {
  title: "About | MonieTally",
  description:
    "Why we built a finance app that doesn't want your data. Our mission, principles, and the architecture behind privacy-first personal finance.",
};

const principles = [
  {
    title: "Privacy by architecture",
    description:
      "We did not bolt privacy on. The whole architecture starts with one question: does this keep data on the device? If the answer is no, we don't build it.",
    color: "#11A675",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: "Local-first",
    description:
      "Your phone, your data, your call. MonieTally runs fully offline. The internet exists only to fetch transactions from your bank. Then it gets out of the way.",
    color: "#00C98B",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
  },
  {
    title: "Beautiful clarity",
    description:
      "Numbers belong in a story, not a spreadsheet. MonieTally turns your transactions into charts and insights you'll actually want to look at.",
    color: "#0A6E4D",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    title: "Works where you bank",
    description:
      "Finance is universal. Banking is not. MonieTally connects across Europe, Africa, and North America so your money works wherever you do.",
    color: "#F4B860",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
];

export default function AboutPage() {
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
            <p className="section-label mb-4">Why we exist</p>
            <h1 className="text-display text-4xl md:text-5xl tracking-tight mb-6">
              Why we don&apos;t want{" "}
              <span className="text-gradient">your data.</span>
            </h1>
            <p
              className="text-base md:text-lg leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              Most finance apps treat your transactions as a product to sell. We chose differently.
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
              <p>
                Most finance apps are working against you. They harvest your transaction data, profile your spending habits, and sell those insights to advertisers and lenders. The price of using them is your dignity.
              </p>
              <p>
                We started MonieTally with one rule: your money is yours to count, not ours to collect. So we built an app that physically cannot see your data, because there is nowhere for it to go. No servers. No accounts. No cloud.
              </p>
              <p>
                MonieTally counts your transactions on your phone, encrypts them on your phone, and shows you the picture on your phone. We never see a single dollar. We don&apos;t want to.
              </p>
            </div>
          </div>
        </section>

        {/* Principles */}
        <section className="py-16 md:py-20">
          <div className="section-container">
            <div className="text-center mb-12">
              <p className="section-label mb-3">How we build</p>
              <h2 className="section-heading">
                Four rules.{" "}
                <span className="text-gradient">No exceptions.</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
              {principles.map((p) => (
                <div
                  key={p.title}
                  className="surface-card p-6"
                  style={{ boxShadow: "var(--shadow-sm)" }}
                >
                  <div
                    aria-hidden="true"
                    className="feature-icon mb-4"
                    style={{
                      background: `${p.color}18`,
                      color: p.color,
                    }}
                  >
                    {p.icon}
                  </div>
                  <h3
                    className="text-base font-semibold mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {p.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {p.description}
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
              <p className="section-label mb-3">What&apos;s next</p>
              <h2 className="section-heading mb-6">
                More banks.{" "}
                <span className="text-gradient">Same rules.</span>
              </h2>
              <p
                className="text-base md:text-lg leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                We&apos;re expanding to more regions, deepening bank integrations, and building optional community features. All within the same privacy-first architecture. More banks. More insight. Zero compromise on whose data this is.
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
