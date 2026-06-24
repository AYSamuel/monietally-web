/**
 * HowItWorks — a quick three-step orientation so a first-time visitor
 * grasps the mechanic before the deeper feature sections.
 * Theme-responsive, token-based, no animation needed.
 */

const STEPS = [
  {
    n: "1",
    title: "Connect your bank",
    body: "Link your bank once through a secure, read-only connection. We never see or store your bank login.",
  },
  {
    n: "2",
    title: "Transactions arrive",
    body: "Every payment shows up on its own, sorted and easy to read, automatically.",
  },
  {
    n: "3",
    title: "Understand and plan",
    body: "See where your money goes, set budgets, and save toward what matters.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative py-20 md:py-28"
      style={{ background: "var(--bg-secondary)", scrollMarginTop: 72 }}
    >
      <div className="section-container">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <p className="section-label mb-4">How it works</p>
          <h2
            className="text-display text-3xl md:text-4xl tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Up and running in minutes.
          </h2>
        </div>
        <div className="grid gap-10 md:grid-cols-3 md:gap-12">
          {STEPS.map((step) => (
            <div key={step.n} className="text-center md:text-left">
              <div
                className="text-display mb-4"
                style={{ fontSize: 44, lineHeight: 1, color: "var(--eyebrow)" }}
              >
                {step.n}
              </div>
              <h3
                className="text-xl font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                {step.title}
              </h3>
              <p
                className="text-base leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
