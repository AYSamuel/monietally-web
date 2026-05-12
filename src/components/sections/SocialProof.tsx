"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getWaitlistCount } from "@/app/actions/waitlistCount";

/* ── Stat data ─────────────────────────────────────────────────── */

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

const STATIC_STATS: ReadonlyArray<Stat> = [
  { value: 12, suffix: "", label: "Countries waiting" },
  { value: 256, suffix: "-bit", label: "End-to-end encrypted" },
];

/* ── Testimonials ──────────────────────────────────────────────── */

interface Testimonial {
  quote: string;
  attribution: string;
}

const TESTIMONIALS: ReadonlyArray<Testimonial> = [
  {
    quote:
      "Finally, a finance app that doesn’t want to sell my data.",
    attribution: "Early tester",
  },
  {
    quote:
      "I actually look forward to logging my spending now. That’s never happened before.",
    attribution: "Beta user",
  },
];

/* ── Animated counter ──────────────────────────────────────────── */

function AnimatedCounter({
  target,
  suffix,
  inView,
  reducedMotion,
}: {
  target: number;
  suffix: string;
  inView: boolean;
  reducedMotion: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reducedMotion) {
      setCount(target);
      return;
    }

    let start = 0;
    const duration = 1800;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * target);
      setCount(start);
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [inView, target, reducedMotion]);

  const formatted =
    target >= 1000 ? count.toLocaleString("en-US") : String(count);

  return (
    <span>
      {formatted}
      {suffix}
    </span>
  );
}

/* ── Component ─────────────────────────────────────────────────── */

export default function SocialProof() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const statsInView = useInView(sectionRef, { once: true, margin: "-15% 0px" });
  const [waitlistCount, setWaitlistCount] = useState(300);

  useEffect(() => {
    getWaitlistCount().then(setWaitlistCount);
  }, []);

  const stats: ReadonlyArray<Stat> = [
    { value: waitlistCount, suffix: "", label: "On the waitlist" },
    ...STATIC_STATS,
  ];

  const ease = [0.22, 0.61, 0.36, 1] as const;

  return (
    <section
      ref={sectionRef}
      id="social-proof"
      className="relative overflow-hidden"
      style={{ background: "var(--ink)", scrollMarginTop: 72 }}
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          top: -200,
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(1200px, 200vw)",
          height: 700,
          background:
            "radial-gradient(ellipse at center, rgba(201,169,97,0.14) 0%, transparent 60%)",
          filter: "blur(40px)",
        }}
      />

      <div className="section-container relative py-20 md:py-28">
        {/* ── Eyebrow + headline ───────────────────────────── */}
        <motion.div
          className="text-center mb-14 md:mb-20"
          initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 0.6, ease }}
        >
          <p
            className="text-xs font-medium uppercase mb-5"
            style={{ letterSpacing: "0.24em", color: "var(--gold)" }}
          >
            Momentum
          </p>
          <h2
            className="text-display mx-auto"
            style={{
              fontSize: "clamp(34px, 4.8vw, 64px)",
              color: "var(--cream)",
              lineHeight: 1.08,
              maxWidth: 680,
            }}
          >
            People are paying
            <br />
            attention.
          </h2>
        </motion.div>

        {/* ── Stats row ────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-0 mb-16 md:mb-20">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center relative"
              initial={reducedMotion ? undefined : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.55, delay: i * 0.1, ease }}
            >
              {/* Vertical divider between stats (desktop only) */}
              {i > 0 && (
                <div
                  aria-hidden="true"
                  className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2"
                  style={{
                    width: 1,
                    height: 56,
                    background: "rgba(245, 241, 232, 0.10)",
                  }}
                />
              )}

              <div
                className="text-display"
                style={{
                  fontSize: "clamp(42px, 5.5vw, 72px)",
                  color: "var(--gold)",
                  lineHeight: 1,
                  marginBottom: 10,
                  fontVariationSettings: '"opsz" 96',
                }}
              >
                <AnimatedCounter
                  target={stat.value}
                  suffix={stat.suffix}
                  inView={statsInView}
                  reducedMotion={reducedMotion}
                />
              </div>
              <p
                className="text-sm font-medium uppercase"
                style={{
                  letterSpacing: "0.12em",
                  color: "rgba(245, 241, 232, 0.55)",
                }}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ── Testimonials ─────────────────────────────────── */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16 md:mb-20 max-w-4xl mx-auto"
          initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.6, delay: 0.15, ease }}
        >
          {TESTIMONIALS.map((t) => (
            <div
              key={t.quote}
              className="relative rounded-2xl p-8 md:p-10"
              style={{
                background: "rgba(245, 241, 232, 0.04)",
                border: "1px solid rgba(245, 241, 232, 0.08)",
                backdropFilter: "blur(12px)",
              }}
            >
              {/* Decorative quote mark */}
              <span
                aria-hidden="true"
                className="text-display block mb-4"
                style={{
                  fontSize: 36,
                  lineHeight: 1,
                  color: "var(--gold)",
                  opacity: 0.5,
                }}
              >
                &ldquo;
              </span>
              <blockquote
                className="text-base md:text-lg leading-relaxed mb-6"
                style={{ color: "rgba(245, 241, 232, 0.88)" }}
              >
                {t.quote}
              </blockquote>
              <cite
                className="text-xs font-medium uppercase not-italic"
                style={{
                  letterSpacing: "0.14em",
                  color: "rgba(245, 241, 232, 0.45)",
                }}
              >
                - {t.attribution}
              </cite>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
