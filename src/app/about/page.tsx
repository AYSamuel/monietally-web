import type { Metadata } from "next";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import WaitlistCTA from "../../components/sections/WaitlistCTA";

export const metadata: Metadata = {
  title: "About | MonieTally",
  description:
    "Why we built a finance app for people the big finance apps overlook. Clear, in your language, wherever you bank.",
};

const principles = [
  {
    title: "Built for the overlooked",
    description:
      "For internationals, newcomers and emerging markets, not just locals who fit the mould.",
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
    title: "Clear, in your language",
    description:
      "Your money in plain language, never a wall of jargon or a foreign tongue. More languages on the way.",
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
    title: "Connected to your banks",
    description:
      "Link your bank once and your spending arrives automatically, read-only, no password stored. Rolling out market by market.",
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
    title: "Private by default",
    description:
      "Read-only access, hosted in the EU under GDPR, never sold. Your money is yours.",
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
              Clarity for everyone{" "}
              <span className="text-gradient">the big apps overlook.</span>
            </h1>
            <p
              className="text-base md:text-lg leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              Most finance apps are built for locals who fit the mould. If you&apos;re an international, a newcomer, or you live somewhere the big apps ignore, your own money can feel like a foreign document.
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
                We know the feeling. MonieTally is built by a Nigerian living in Germany, someone who has managed money across borders, banks and languages, and found that no app made it simple.
              </p>
              <p>
                So we are building one that does. MonieTally brings your accounts into one clear picture and explains your money in plain language, wherever you bank.
              </p>
              <p>
                We&apos;re starting in Germany, where internationals are locked out of local-language apps. Nearby countries follow, and Africa is next, our home market, where millions still have no clean way to see their money.
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
                <span className="text-gradient">More countries.</span>
              </h2>
              <p
                className="text-base md:text-lg leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                After Germany, we&apos;re bringing MonieTally to Africa, starting with Nigeria, and on to more places the big apps overlook. More banks, more languages, the same simple promise: your money, finally clear.
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
