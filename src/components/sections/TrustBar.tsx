"use client";

import { motion, useReducedMotion } from "framer-motion";

const stats = [
  { value: "Encrypted", label: "Your data, unreadable to us" },
  { value: "Zero access", label: "We never see your finances" },
  { value: "EU hosted", label: "GDPR-compliant servers" },
];

export default function TrustBar() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      className="py-10"
      style={{
        background: "var(--bg-secondary)",
        borderTop: "1px solid var(--border-subtle)",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={reducedMotion ? undefined : { opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <p
                className="text-xl md:text-2xl font-semibold mb-1"
                style={{ color: "var(--gold)" }}
              >
                {stat.value}
              </p>
              <p
                className="text-xs"
                style={{ color: "var(--text-tertiary)" }}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
