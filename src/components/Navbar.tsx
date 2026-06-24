"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import ThemeToggle from "./ThemeToggle";
import LocaleSwitcher from "./LocaleSwitcher";

export default function Navbar() {
  const t = useTranslations("nav");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "backdrop-blur-xl" : ""}`}
      style={{
        background: scrolled
          ? "var(--nav-bg, color-mix(in srgb, var(--cream) 85%, transparent))"
          : "transparent",
      }}
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-14">
          {/* Logo wordmark — Fraunces */}
          <Link
            href="/"
            className="font-display text-xl tracking-tight transition-colors"
            style={{
              color: "var(--text-primary)",
              fontVariationSettings: '"opsz" 72',
            }}
          >
            MonieTally
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm transition-colors duration-200"
              style={{ color: "var(--text-secondary)" }}
            >
              {t("home")}
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm transition-colors duration-200"
              style={{ color: "var(--text-secondary)" }}
            >
              {t("howItWorks")}
            </Link>
            <Link
              href="/about"
              className="text-sm transition-colors duration-200"
              style={{ color: "var(--text-secondary)" }}
            >
              {t("about")}
            </Link>
            <Link
              href="/#faq"
              className="text-sm transition-colors duration-200"
              style={{ color: "var(--text-secondary)" }}
            >
              {t("faq")}
            </Link>
            <Link
              href="/#waitlist"
              className="btn-primary text-sm"
              style={{ padding: "8px 18px" }}
            >
              {t("joinWaitlist")}
            </Link>
            <LocaleSwitcher />
            <ThemeToggle />
          </div>

          {/* Mobile hamburger (locale switcher lives inside the dropdown to
              keep the compact top bar from overflowing on small phones) */}
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-10 h-10 flex items-center justify-center"
              aria-label={t("toggleMenu")}
              aria-expanded={mobileOpen}
            >
              <svg
                aria-hidden="true"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                style={{ color: "var(--text-primary)" }}
              >
                {mobileOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="4" y1="7" x2="20" y2="7" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="17" x2="20" y2="17" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden animate-fade-in"
          style={{
            background: "var(--nav-bg, color-mix(in srgb, var(--cream) 90%, transparent))",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          <div className="section-container py-4 space-y-1">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              {t("home")}
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              {t("howItWorks")}
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              {t("about")}
            </Link>
            <Link
              href="/#faq"
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              {t("faq")}
            </Link>
            <Link
              href="/#waitlist"
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 text-sm font-medium"
              style={{ color: "var(--gold)" }}
            >
              {t("joinWaitlistMobile")}
            </Link>
            <div
              className="pt-3 mt-2"
              style={{ borderTop: "1px solid var(--border-subtle)" }}
            >
              <LocaleSwitcher />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
