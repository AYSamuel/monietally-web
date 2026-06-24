const BANKS = [
  "Sparkasse",
  "N26",
  "DKB",
  "Commerzbank",
  "ING",
  "Volksbank",
];

export default function TrustBar() {
  return (
    <section
      className="py-10"
      style={{
        background: "var(--bg-secondary)",
        borderTop: "1px solid var(--border-subtle)",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      <div className="section-container text-center">
        <p
          className="text-xs font-medium uppercase mb-6"
          style={{ letterSpacing: "0.18em", color: "var(--text-tertiary)" }}
        >
          Built to connect the banks you already use
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {BANKS.map((bank) => (
            <span
              key={bank}
              className="text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              {bank}
            </span>
          ))}
        </div>
        <p
          className="text-xs mt-6"
          style={{ color: "var(--text-muted)" }}
        >
          Bank connections go live as we launch. More banks and countries to follow.
        </p>
      </div>
    </section>
  );
}
