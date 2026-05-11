"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
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
              href="/#hero"
              className="text-sm transition-colors duration-200"
              style={{ color: "var(--text-secondary)" }}
            >
              Why MonieTally
            </Link>
            <Link
              href="/#social-proof"
              className="text-sm transition-colors duration-200"
              style={{ color: "var(--text-secondary)" }}
            >
              Community
            </Link>
            <Link
              href="/#faq"
              className="text-sm transition-colors duration-200"
              style={{ color: "var(--text-secondary)" }}
            >
              FAQ
            </Link>
            <ThemeToggle />
            <Link
              href="/#social-proof"
              className="btn-primary text-sm"
              style={{ padding: "8px 18px" }}
            >
              Join waitlist
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-10 h-10 flex items-center justify-center"
              aria-label="Toggle menu"
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
            background: "var(--nav-bg, color-mix(in srgb, var(--cream) 95%, transparent))",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          <div className="section-container py-4 space-y-1">
            <Link
              href="/#hero"
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              Why MonieTally
            </Link>
            <Link
              href="/#social-proof"
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              Community
            </Link>
            <Link
              href="/#faq"
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              FAQ
            </Link>
            <Link
              href="/#social-proof"
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 text-sm font-medium"
              style={{ color: "var(--gold)" }}
            >
              Join the waitlist
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
