"use client";

import { motion, useReducedMotion } from "framer-motion";

const pillars = [
  {
    headline: "End-to-end encrypted",
    body: "Your transactions, budgets, and goals are encrypted on your device with AES-256-GCM before sync. The server stores blobs it cannot decrypt.",
  },
  {
    headline: "Your key, your devices",
    body: "The encryption key is generated on your phone and synced to your other devices through your OS keychain (iCloud or Google Block Store). It never passes through our servers.",
  },
  {
    headline: "No bank login, ever",
    body: "MonieTally does not connect to your bank. No screen scraping. No Plaid. Nothing in our system has read access to your accounts.",
  },
];

export default function PrivacySection() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="privacy"
      className="py-20 md:py-28"
      style={{ background: "var(--inv-bg)" }}
    >
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <p
            className="text-xs font-medium uppercase tracking-[0.2em] mb-3"
            style={{ color: "var(--gold)" }}
          >
            How privacy actually works
          </p>
          <h2
            className="text-display text-3xl md:text-4xl tracking-tight mb-5"
            style={{ color: "var(--inv-text-primary)" }}
          >
            Encrypted with a key your phone holds. Not ours.
          </h2>
          <p
            className="text-base leading-relaxed"
            style={{ color: "var(--inv-text-secondary)" }}
          >
            MonieTally syncs across your devices, but the server only ever sees
            ciphertext. Your data is encrypted before it leaves your phone, with
            a key that lives in your OS keychain. We could not read your records
            if a court asked us to.
          </p>
        </div>

        {/* Conceptual SVG diagram */}
        <motion.div
          className="flex justify-center mb-16"
          initial={reducedMotion ? undefined : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6 }}
        >
          <EncryptionDiagram reducedMotion={!!reducedMotion} />
        </motion.div>

        {/* Pillar cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.headline}
              className="rounded-2xl p-6"
              style={{
                background: "var(--inv-surface)",
                border: "1px solid var(--inv-border-subtle)",
              }}
              initial={reducedMotion ? undefined : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <h3
                className="text-base font-semibold mb-2"
                style={{ color: "var(--inv-text-primary)" }}
              >
                {pillar.headline}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--inv-text-secondary)" }}
              >
                {pillar.body}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Closing line */}
        <p
          className="text-center text-sm"
          style={{ color: "var(--inv-text-tertiary)" }}
        >
          Built on the architecture in our public spec. Hosted in the EU
          (Frankfurt) for GDPR. Audited before v1 release.
        </p>
      </div>
    </section>
  );
}

function EncryptionDiagram({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <svg
      viewBox="0 0 480 260"
      className="w-full max-w-lg"
      role="img"
      aria-label="Diagram showing data encrypted on your phone, stored as ciphertext on the server, and decrypted on your other devices using the same key"
    >
      {/* Phone 1 (top left) */}
      <rect
        x="20"
        y="20"
        width="120"
        height="80"
        rx="12"
        fill="none"
        stroke="var(--inv-text-primary)"
        strokeWidth="1.5"
        opacity="0.4"
      />
      <text
        x="80"
        y="50"
        textAnchor="middle"
        fontSize="11"
        fill="var(--inv-text-primary)"
        opacity="0.9"
      >
        Your phone
      </text>
      <text
        x="80"
        y="70"
        textAnchor="middle"
        fontSize="10"
        fill="var(--inv-text-secondary)"
      >
        data + key
      </text>
      <text
        x="80"
        y="87"
        textAnchor="middle"
        fontSize="12"
        fill="var(--gold)"
      >
        🔑
      </text>

      {/* Arrow: phone → server */}
      <motion.path
        d="M 140 60 L 220 130"
        fill="none"
        stroke="var(--gold)"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        initial={reducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
      />
      <text
        x="155"
        y="82"
        fontSize="9"
        fill="var(--inv-text-tertiary)"
        transform="rotate(35, 155, 82)"
      >
        encrypts on device
      </text>

      {/* Server (center) */}
      <rect
        x="195"
        y="110"
        width="150"
        height="60"
        rx="8"
        fill="var(--inv-border-subtle)"
        opacity="0.5"
        stroke="var(--inv-border-subtle)"
        strokeWidth="1"
      />
      <text
        x="270"
        y="138"
        textAnchor="middle"
        fontSize="11"
        fontWeight="500"
        fill="var(--inv-text-primary)"
        opacity="0.8"
      >
        MonieTally server
      </text>
      <text
        x="270"
        y="156"
        textAnchor="middle"
        fontSize="10"
        fill="var(--inv-text-tertiary)"
      >
        ciphertext blobs only
      </text>

      {/* Arrow: server → phone 2 */}
      <motion.path
        d="M 220 170 L 140 210"
        fill="none"
        stroke="var(--gold)"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        initial={reducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.6 }}
      />
      <text
        x="148"
        y="203"
        fontSize="9"
        fill="var(--inv-text-tertiary)"
        transform="rotate(-30, 148, 203)"
      >
        decrypts with same key
      </text>

      {/* Phone 2 (bottom left) */}
      <rect
        x="20"
        y="190"
        width="120"
        height="60"
        rx="12"
        fill="none"
        stroke="var(--inv-text-primary)"
        strokeWidth="1.5"
        opacity="0.4"
      />
      <text
        x="80"
        y="215"
        textAnchor="middle"
        fontSize="11"
        fill="var(--inv-text-primary)"
        opacity="0.9"
      >
        Your other device
      </text>
      <text
        x="80"
        y="235"
        textAnchor="middle"
        fontSize="10"
        fill="var(--inv-text-secondary)"
      >
        data + key
      </text>
      <text
        x="125"
        y="236"
        fontSize="10"
        fill="var(--gold)"
      >
        🔑
      </text>

      {/* Side annotation */}
      <text
        x="370"
        y="145"
        fontSize="9"
        fill="var(--inv-text-tertiary)"
      >
        ← server only sees this
      </text>
    </svg>
  );
}
