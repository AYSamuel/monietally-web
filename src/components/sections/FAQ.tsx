"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: ReadonlyArray<FAQItem> = [
  {
    question: "Is MonieTally free?",
    answer:
      "The core app is free. Track transactions, set budgets, save toward goals, and see your spending patterns without paying a thing. We may introduce optional premium features later, but the fundamentals will always be free.",
  },
  {
    question: "How does encryption work?",
    answer:
      "Your data is encrypted on your device with a key that never leaves your phone. When it syncs to the cloud, only ciphertext travels. Our servers store data they physically cannot read. Even if someone broke in, they'd get noise.",
  },
  {
    question: "What data do you collect?",
    answer:
      "Your email when you join the waitlist. That's it for now. Once you're using the app, your financial data stays encrypted on your device. We don't sell data, don't run ads, and don't build profiles.",
  },
  {
    question: "Can I export my data?",
    answer:
      "Yes, everything, anytime. One tap gives you a full CSV export of your transactions, budgets, and savings goals. No lock-in, no hostage data. If you ever leave, you walk out with every byte you put in.",
  },
  {
    question: "When does it launch?",
    answer:
      "We're in private beta right now and rolling out invites from the waitlist. Join and you'll get an email the moment it's your turn. No spam in between, just the one notification that matters.",
  },
];

function FAQAccordionItem({
  item,
  index,
  isOpen,
  onToggle,
  reducedMotion,
}: {
  item: FAQItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  reducedMotion: boolean;
}) {
  const panelId = `faq-panel-${index}`;
  return (
    <div
      style={{
        borderBottom: "1px solid var(--border)",
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-6 md:py-7 text-left transition-colors duration-200"
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <span
          className="text-base md:text-lg font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          {item.question}
        </span>
        <span
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300"
          style={{
            background: isOpen
              ? "rgba(201, 169, 97, 0.12)"
              : "var(--surface-card)",
            border: `1px solid ${isOpen ? "rgba(201, 169, 97, 0.25)" : "var(--border)"}`,
            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
            style={{ color: isOpen ? "var(--gold)" : "var(--text-tertiary)" }}
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            initial={reducedMotion ? { height: "auto" } : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reducedMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p
              className="text-sm md:text-base leading-relaxed pb-6 md:pb-7"
              style={{
                color: "var(--text-secondary)",
                maxWidth: "62ch",
              }}
            >
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const reducedMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const ease = [0.22, 0.61, 0.36, 1] as const;

  return (
    <section
      id="faq"
      className="relative"
      style={{
        background: "var(--bg-primary)",
        scrollMarginTop: 72,
      }}
    >
      <div className="section-container py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
          {/* Left column — eyebrow + headline */}
          <motion.div
            className="md:col-span-4"
            initial={reducedMotion ? undefined : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12% 0px" }}
            transition={{ duration: 0.6, ease }}
          >
            <p
              className="text-xs font-medium uppercase mb-5"
              style={{ letterSpacing: "0.24em", color: "var(--gold)" }}
            >
              Questions
            </p>
            <h2
              className="text-display"
              style={{
                fontSize: "clamp(28px, 3.6vw, 48px)",
                color: "var(--text-primary)",
                lineHeight: 1.1,
              }}
            >
              You asked.
              <br />
              Here&apos;s the short version.
            </h2>
          </motion.div>

          {/* Right column — accordion */}
          <motion.div
            className="md:col-span-8"
            initial={reducedMotion ? undefined : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.6, delay: 0.08, ease }}
          >
            <div
              style={{ borderTop: "1px solid var(--border)" }}
            >
              {FAQS.map((item, i) => (
                <FAQAccordionItem
                  key={item.question}
                  item={item}
                  index={i}
                  isOpen={openIndex === i}
                  onToggle={() =>
                    setOpenIndex(openIndex === i ? null : i)
                  }
                  reducedMotion={reducedMotion}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
