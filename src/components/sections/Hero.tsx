"use client";

/**
 * Hero — Linear/Arc-coded redesign with a real 3D phone.
 *
 * Layout: split. Left column has eyebrow, gradient-accented headline,
 * sub-copy, primary + secondary CTAs. Right column hosts a Three.js
 * <Canvas> with the procedural Phone3D, mouse-parallax tilting and
 * idle drift.
 *
 * Background: layered aurora gradient mesh + subtle dot grid +
 * floating glow orbs. Works in light and dark mode.
 */

import Link from "next/link";
import { motion, useReducedMotion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import Phone3DSceneLoader from "../landing/Phone3DSceneLoader";
import { HomePopulated } from "../landing/mockups/HomePopulated";
import type { PhonePose } from "../landing/Phone3DScene";

export default function Hero() {
  const reducedMotion = useReducedMotion() ?? false;

  // Mouse-parallax: track normalized mouse position, drive a small
  // rotation on the phone via PhonePose. Spring-smoothed for silk.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 80, damping: 18 });
  const smy = useSpring(my, { stiffness: 80, damping: 18 });
  const rotY = useTransform(smx, [-1, 1], [-0.18, 0.18]);
  const rotX = useTransform(smy, [-1, 1], [0.10, -0.10]);

  useEffect(() => {
    if (reducedMotion) return;
    const onMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      mx.set((e.clientX - w / 2) / (w / 2));
      my.set((e.clientY - h / 2) / (h / 2));
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my, reducedMotion]);

  // Live PhonePose — this object is read each frame inside Phone3DScene.
  // We mutate it via subscriptions instead of new objects to avoid GC.
  // Scale 1.05 makes the 336×712 PhoneFrame visually substantial in
  // the hero. The container is sized to accommodate it on tall viewports.
  const pose: PhonePose = {
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: 1.05,
  };

  // Subscribe rotation springs into the pose object.
  useEffect(() => {
    const unsubX = rotX.on("change", (v) => {
      pose.rotation = [v, pose.rotation[1], pose.rotation[2]];
    });
    const unsubY = rotY.on("change", (v) => {
      pose.rotation = [pose.rotation[0], v, pose.rotation[2]];
    });
    return () => {
      unsubX();
      unsubY();
    };
    // pose is stable per render; we want this once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      id="hero"
      className="relative overflow-hidden"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* ── Aurora gradient mesh background ───────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 aurora-bg animate-aurora"
        style={{ opacity: 0.9, pointerEvents: "none" }}
      />

      {/* Subtle dot grid overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 grid-bg"
        style={{ opacity: 0.4, pointerEvents: "none" }}
      />

      {/* Floating glow orbs (decorative) — emerald + mint + gold */}
      <FloatingOrb className="left-[8%] top-[18%]" color="emerald" delay={0} />
      <FloatingOrb className="right-[6%] top-[60%]" color="gold" delay={2.4} />
      <FloatingOrb className="left-[40%] bottom-[10%]" color="mint" delay={1.2} />

      <div className="section-container relative pt-28 md:pt-36 pb-24 md:pb-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-center" style={{ minHeight: "78vh" }}>
          {/* ── Left: copy ───────────────────────────────── */}
          <motion.div
            className="md:col-span-7 relative z-10"
            initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
            >
              <span
                aria-hidden="true"
                className="w-1.5 h-1.5 rounded-full animate-pulse-glow"
                style={{ background: "var(--brand-emerald)", boxShadow: "0 0 12px var(--brand-emerald)" }}
              />
              <span style={{ color: "var(--text-secondary)" }}>Now in private beta</span>
            </div>

            <h1
              className="text-display"
              style={{
                fontSize: "clamp(44px, 6.4vw, 96px)",
                marginBottom: 24,
                lineHeight: 1.02,
                letterSpacing: "-0.035em",
              }}
            >
              Your money,{" "}
              <span className="text-gradient">finally legible.</span>
            </h1>

            <p
              className="text-base md:text-lg leading-relaxed max-w-xl mb-10"
              style={{ color: "var(--text-secondary)" }}
            >
              MonieTally turns every spend into clarity. Beautifully designed,
              quietly private, and genuinely useful from the first transaction.
              Encrypted with a key your phone holds — not ours.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link href="#waitlist" className="btn-primary">
                Join the waitlist
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>

              <Link href="#showcase" className="btn-ghost">
                See the app
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </Link>
            </div>

            {/* Mini trust row */}
            <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs" style={{ color: "var(--text-tertiary)" }}>
              <span className="inline-flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                End-to-end encrypted
              </span>
              <span className="inline-flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                Hosted in the EU
              </span>
              <span className="inline-flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                No data resale, ever
              </span>
            </div>
          </motion.div>

          {/* ── Right: 3D phone canvas ───────────────────── */}
          <motion.div
            className="md:col-span-5 relative"
            initial={reducedMotion ? undefined : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 0.61, 0.36, 1] }}
            style={{ height: "min(86vh, 820px)" }}
          >
            {/* Soft halo behind the phone (emerald → gold, app-aligned) */}
            <div
              aria-hidden="true"
              className="absolute pointer-events-none"
              style={{
                top: "50%",
                left: "50%",
                width: 560,
                height: 560,
                transform: "translate(-50%, -50%)",
                background:
                  "radial-gradient(ellipse at center, rgba(17, 166, 117, 0.32) 0%, rgba(201, 169, 97, 0.18) 45%, transparent 72%)",
                filter: "blur(28px)",
              }}
            />
            <Phone3DSceneLoader
              Mockup={HomePopulated}
              pose={pose}
              idleRotation={!reducedMotion}
              ariaLabel="Home dashboard showing your month at a glance"
              className="absolute inset-0"
            />
          </motion.div>
        </div>
      </div>

      {/* Soft fade into the section below for a clean visual handoff. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32"
        style={{
          background: "linear-gradient(to bottom, transparent, var(--bg-primary))",
        }}
      />
    </section>
  );
}

/* ── Floating orb (decorative glow) ─────────────────────────────── */
function FloatingOrb({
  className,
  color,
  delay = 0,
}: {
  className?: string;
  color: "emerald" | "mint" | "gold";
  delay?: number;
}) {
  const palette = {
    emerald: "rgba(17, 166, 117, 0.50)",
    mint:    "rgba(93, 221, 168, 0.42)",
    gold:    "rgba(201, 169, 97, 0.45)",
  };
  return (
    <div
      aria-hidden="true"
      className={`absolute pointer-events-none animate-float ${className ?? ""}`}
      style={{
        width: 220,
        height: 220,
        background: `radial-gradient(circle at 35% 35%, ${palette[color]} 0%, transparent 65%)`,
        filter: "blur(36px)",
        animationDelay: `${delay}s`,
        opacity: 0.85,
      }}
    />
  );
}
