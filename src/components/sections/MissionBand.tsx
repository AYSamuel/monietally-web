/**
 * MissionBand — short "why we exist" statement on the landing page.
 * Region-neutral: speaks to who we build for, not where we launch.
 * Pure render, no interactivity.
 */
export default function MissionBand() {
  return (
    <section
      className="relative overflow-hidden py-20 md:py-28"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="section-container relative text-center max-w-3xl mx-auto">
        <p className="section-label mb-4">Why we built this</p>
        <h2
          className="text-display text-3xl md:text-4xl tracking-tight mb-6"
          style={{ color: "var(--text-primary)" }}
        >
          Built for the people big finance apps{" "}
          <span className="text-gradient">overlook.</span>
        </h2>
        <p
          className="text-base md:text-lg leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          Internationals, newcomers, and anyone the system leaves guessing.
          We&apos;re building the money app for them, and we won&apos;t stop at
          the first border.
        </p>
        <figure className="mt-10 max-w-2xl mx-auto">
          <blockquote
            className="text-lg md:text-xl leading-relaxed"
            style={{ color: "var(--text-primary)" }}
          >
            &ldquo;I&apos;m an international living in Germany, and I built
            MonieTally because I couldn&apos;t make sense of my own bank app.
            This is the tool I wished existed.&rdquo;
          </blockquote>
          <figcaption
            className="mt-4 text-sm font-medium"
            style={{ color: "var(--text-tertiary)" }}
          >
            Ayo, Founder
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
