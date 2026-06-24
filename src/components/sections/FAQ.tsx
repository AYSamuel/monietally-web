"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface FAQItem {
  q: string;
  a: string;
}

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
          {item.q}
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
            style={{ color: isOpen ? "var(--eyebrow)" : "var(--text-tertiary)" }}
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
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const t = useTranslations("faq");
  const items = t.raw("items") as ReadonlyArray<FAQItem>;
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
              style={{ letterSpacing: "0.24em", color: "var(--eyebrow)" }}
            >
              {t("eyebrow")}
            </p>
            <h2
              className="text-display"
              style={{
                fontSize: "clamp(28px, 3.6vw, 48px)",
                color: "var(--text-primary)",
                lineHeight: 1.1,
              }}
            >
              {t.rich("headline", { br: () => <br /> })}
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
            <div style={{ borderTop: "1px solid var(--border)" }}>
              {items.map((item, i) => (
                <FAQAccordionItem
                  key={i}
                  item={item}
                  index={i}
                  isOpen={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? null : i)}
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
