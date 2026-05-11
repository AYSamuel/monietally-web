"use client";

/**
 * ScrollExperience — single continuous scroll-driven hero + showcase.
 *
 * One phone exists. It starts in the Hero (right side, showing the Home
 * dashboard), then visibly slides left↔right between panels as the
 * user scrolls. The screen content crossfades between mockups. Text
 * for each panel fades in/out around the phone.
 *
 * Architecture (FIXED overlay, not sticky):
 *   - A scroll-distance container (PANEL_COUNT × PANEL_HEIGHT_VH).
 *     Empty box that just provides scroll runway.
 *   - The phone + text layers are FIXED to the viewport (not sticky).
 *     This eliminates the ~100vh "post-sticky exit phase" that comes
 *     with position:sticky — there's no dead-scroll where the phone
 *     slowly slides up while the next section waits its turn.
 *   - useScroll uses offset ["start start", "end start"] so progress
 *     spans the full container height. The overlay opacity fades to 0
 *     as scroll progress nears 1, so by the time the user reaches the
 *     bottom of the container, the overlay is invisible and the next
 *     section (which starts immediately after) is fully revealed.
 *   - Five panels: Hero (intro), Activity, Insights, Budgets, Savings.
 *     Each panel = 30vh of scroll → total 150vh.
 *
 * Mobile: standard stacked cards.
 */

import Link from "next/link";
import {
  useRef,
  useState,
  useEffect,
  type ComponentType,
  type ReactNode,
} from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  AnimatePresence,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { useTheme } from "next-themes";
import { useLenis } from "@/components/SmoothScroll";
import {
  PhoneFrame,
  PHONE_FRAME_WIDTH,
  PHONE_FRAME_HEIGHT,
} from "./PhoneFrame";
import Phone3DSceneLoader from "./Phone3DSceneLoader";
import type { PhonePose } from "./Phone3DScene";
import { HomePopulated } from "./mockups/HomePopulated";
import { Activity } from "./mockups/Activity";
import { Insights } from "./mockups/Insights";
import { Budgets } from "./mockups/Budgets";
import { Savings } from "./mockups/Savings";

/* ── Panel definitions ─────────────────────────────────────────── */

interface BasePanelDef {
  id: string;
  label: string;
  phoneSide: "right" | "left";
  Mockup: ComponentType;
  ariaLabel: string;
}

interface HeroPanelDef extends BasePanelDef {
  type: "hero";
  eyebrow: string;
  headlinePrimary: string;
  headlineAccent: string;
  body: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  trust: ReadonlyArray<{ icon: ReactNode; label: string }>;
}

interface ShowcasePanelDef extends BasePanelDef {
  type: "showcase";
  number: string;
  headline: string;
  subhead: string;
  support: string;
}

type PanelDef = HeroPanelDef | ShowcasePanelDef;

const TRUST_ICONS: Record<string, ReactNode> = {
  lock: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  globe: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  message: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
};

const PANELS: ReadonlyArray<PanelDef> = [
  {
    id: "hero",
    label: "Hero",
    phoneSide: "right",
    Mockup: HomePopulated,
    ariaLabel: "Home dashboard showing your month at a glance",
    type: "hero",
    eyebrow: "Now in private beta",
    headlinePrimary: "Your money,",
    headlineAccent: "finally legible.",
    body:
      "MonieTally turns every spend into clarity. Beautifully designed, quietly private, and genuinely useful from the first transaction. Encrypted with a key your phone holds — not ours.",
    primaryCta: { label: "Join the waitlist", href: "#waitlist" },
    secondaryCta: { label: "See the app", href: "#social-proof" },
    trust: [
      { icon: TRUST_ICONS.lock, label: "End-to-end encrypted" },
      { icon: TRUST_ICONS.globe, label: "Hosted in the EU" },
      { icon: TRUST_ICONS.message, label: "No data resale, ever" },
    ],
  },
  {
    id: "activity",
    label: "Activity",
    phoneSide: "left",
    Mockup: Activity,
    ariaLabel: "Activity log of recent transactions",
    type: "showcase",
    number: "01",
    headline: "Every spend, accounted for.",
    subhead:
      "A clean log of every transaction. Searchable, filterable, yours.",
    support: "Tap any entry to see the full story behind it.",
  },
  {
    id: "insights",
    label: "Insights",
    phoneSide: "right",
    Mockup: Insights,
    ariaLabel: "Insights screen with categories and weekly trend",
    type: "showcase",
    number: "02",
    headline: "Patterns you'd miss in a bank statement.",
    subhead:
      "Where your money actually went, by category and by trend. The recurring drips. The unusual weeks.",
    support: "The shape of your real life with money.",
  },
  {
    id: "budgets",
    label: "Budgets",
    phoneSide: "left",
    Mockup: Budgets,
    ariaLabel: "Budgets screen with category caps and progress",
    type: "showcase",
    number: "03",
    headline: "Budgets that breathe with you.",
    subhead:
      "Set monthly limits, watch progress fill in real time, get a quiet nudge before you cross a line.",
    support: "No guilt-trip notifications. Just calm awareness.",
  },
  {
    id: "savings",
    label: "Savings",
    phoneSide: "right",
    Mockup: Savings,
    ariaLabel: "Savings goals with target and saved amounts",
    type: "showcase",
    number: "04",
    headline: "Save toward what matters.",
    subhead:
      "Name your goals, set a target, and watch the runway shrink as you go.",
    support:
      "Encrypted on your device, synced privately to your other devices.",
  },
];

const PANEL_COUNT = PANELS.length;
/** Per-panel scroll distance in vh. With offset ["start start", "end start"],
 *  scroll progress 0→1 spans exactly this × PANEL_COUNT vh (= 150vh total).
 *  No sticky-exit dead-scroll: the container is the scroll distance. */
const PANEL_HEIGHT_VH = 30;
/** Phone slide distance from container center, in CSS pixels. */
const PHONE_SLIDE_PX = 370;
/** Inward tilt at each rest position, in radians (~5.7°). */
const PHONE_TILT_RAD = 0.10;
/** Constant rear tilt for editorial depth (~2.3°). */
const PHONE_BASE_TILT_X = -0.04;
/** Phone scale across all panels — keeps visual continuity. */
const PHONE_SCALE = 1.05;
/** Half-width of the panel-boundary transition window, in scroll progress.
 *  0.025 = transition occupies 5% of scroll progress, which on a 250vh
 *  container is ~12vh of scroll, roughly one wheel tick. Wide enough that
 *  the phone glides rather than snaps, but tight enough that the
 *  midpoint moment is brief. */
const TRANSITION_HALF = 0.025;

const xForSide = (side: "left" | "right") =>
  side === "right" ? PHONE_SLIDE_PX : -PHONE_SLIDE_PX;
// Tilt INWARD toward the text. Phone on right (X > 0) needs its left
// edge forward (toward the text on the left), which is negative rotateY
// in CSS3D. Phone on left mirrors the other way.
const ryForSide = (side: "left" | "right") =>
  side === "right" ? -PHONE_TILT_RAD : PHONE_TILT_RAD;

/* ══════════════════════════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════════════════════════ */

export default function ScrollExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion() ?? false;
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Lenis already smooths raw wheel input. With offset
  // ["start start", "end start"], progress=0 maps to scrollY=0 (section
  // top at viewport top) and progress=1 maps to scrollY=container.height
  // (section bottom at viewport top). So progress 0→1 spans the FULL
  // container height — no sticky exit phase, no wasted scroll.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Overlay opacity — visible during the experience (progress < 0.95),
  // fades out over the last 5% of progress. By the time the user reaches
  // progress=1 (= scrollY=container.height = end of section), the overlay
  // is fully transparent and the next section (rendered immediately after)
  // is in view.
  const overlayOpacity = useTransform(scrollYProgress, [0.97, 0.99], [1, 0]);

  // ── Phone X / rotateY keyframes tied to panel boundaries ──
  const xInputs: number[] = [];
  const xOutputs: number[] = [];
  const ryInputs: number[] = [];
  const ryOutputs: number[] = [];
  for (let i = 0; i < PANEL_COUNT; i++) {
    const start = i / PANEL_COUNT;
    const x = xForSide(PANELS[i].phoneSide);
    const ry = ryForSide(PANELS[i].phoneSide);
    if (i === 0) {
      xInputs.push(start); xOutputs.push(x);
      ryInputs.push(start); ryOutputs.push(ry);
    } else {
      const prevX = xForSide(PANELS[i - 1].phoneSide);
      const prevRY = ryForSide(PANELS[i - 1].phoneSide);
      xInputs.push(start - TRANSITION_HALF); xOutputs.push(prevX);
      xInputs.push(start + TRANSITION_HALF); xOutputs.push(x);
      ryInputs.push(start - TRANSITION_HALF); ryOutputs.push(prevRY);
      ryInputs.push(start + TRANSITION_HALF); ryOutputs.push(ry);
    }
  }
  xInputs.push(1); xOutputs.push(xForSide(PANELS[PANEL_COUNT - 1].phoneSide));
  ryInputs.push(1); ryOutputs.push(ryForSide(PANELS[PANEL_COUNT - 1].phoneSide));

  const phoneX = useTransform(
    scrollYProgress,
    reducedMotion ? [0, 1] : xInputs,
    reducedMotion ? [0, 0] : xOutputs,
  );
  const phoneRY = useTransform(
    scrollYProgress,
    reducedMotion ? [0, 1] : ryInputs,
    reducedMotion ? [0, 0] : ryOutputs,
  );
  // (Removed Y-drift: it was decoupled from panel transitions, causing
  // the phone to descend/ascend even when text wasn't changing yet, and
  // overshooting beyond the last panel. The side rail indicator is the
  // "going down" cue now.)

  // Stable pose ref — mutated every frame by the motion value subscriptions.
  const poseRef = useRef<PhonePose>({
    position: [xForSide(PANELS[0].phoneSide), 0, 0],
    rotation: [reducedMotion ? 0 : PHONE_BASE_TILT_X, ryForSide(PANELS[0].phoneSide), 0],
    scale: PHONE_SCALE,
  });
  useMotionValueEvent(phoneX, "change", (v) => {
    poseRef.current.position = [v, 0, 0];
  });
  useMotionValueEvent(phoneRY, "change", (v) => {
    poseRef.current.rotation = [reducedMotion ? 0 : PHONE_BASE_TILT_X, v, 0];
  });

  // Active panel for mockup crossfade — derived from the spring.
  const [activePanel, setActivePanel] = useState(0);
  const [scrolledPast, setScrolledPast] = useState(false);
  const [forceHidden, setForceHidden] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const idx = Math.min(
      PANEL_COUNT - 1,
      Math.max(0, Math.floor(p * PANEL_COUNT)),
    );
    setActivePanel((prev) => (prev === idx ? prev : idx));
    setScrolledPast(p >= 0.99);
    if (forceHidden && p < 0.5) setForceHidden(false);
  });

  useEffect(() => {
    const hide = () => setForceHidden(true);
    window.addEventListener("scrollexperience:hide", hide);
    return () => window.removeEventListener("scrollexperience:hide", hide);
  }, []);

  // Panel-locked scrolling: each wheel/touch gesture moves exactly one panel.
  // Uses capture-phase listeners + stopImmediatePropagation to fully block
  // Lenis from seeing wheel events while inside the section.
  const lenis = useLenis();
  const targetPanelRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const exitCooldownRef = useRef(false);

  const animateScrollTo = (target: number, duration: number, onDone?: () => void) => {
    const start = window.scrollY;
    const distance = target - start;
    if (Math.abs(distance) < 1) { onDone?.(); return; }
    const startTime = performance.now();
    isAnimatingRef.current = true;

    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      window.scrollTo(0, start + distance * eased);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        isAnimatingRef.current = false;
        onDone?.();
      }
    }
    requestAnimationFrame(step);
  };

  const getPanelScroll = (panel: number) => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    const containerTop = rect.top + window.scrollY;
    const centerProgress = (panel + 0.5) / PANEL_COUNT;
    return containerTop + centerProgress * rect.height;
  };

  const getExitScroll = () => {
    if (!containerRef.current) return 0;
    // containerRef is the spacer div. Its bottom edge is where the next
    // section starts in the DOM. With useScroll offset ["start start",
    // "end start"], progress=1 means spacer bottom = viewport top.
    // So scrollY = containerTop + containerHeight puts the next section
    // right at the viewport top.
    const rect = containerRef.current.getBoundingClientRect();
    return rect.top + window.scrollY + rect.height;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const isInSection = () => {
      if (exitCooldownRef.current) return false;
      if (!containerRef.current) return false;
      const rect = containerRef.current.getBoundingClientRect();
      return rect.top <= 10 && rect.bottom > window.innerHeight * 0.5;
    };

    const handleScroll = (direction: 1 | -1) => {
      if (isAnimatingRef.current) return;
      const p = scrollYProgress.get();

      if (p <= 0 && direction < 0) return;
      if (p >= 0.99) return;
      if (!isInSection()) return;

      if (p <= 0.01 && direction > 0) {
        targetPanelRef.current = 0;
      }

      const next = targetPanelRef.current + direction;

      if (next < 0) {
        // Scroll to the very top of the section so normal scrolling resumes
        if (!containerRef.current) return;
        const containerTop = containerRef.current.getBoundingClientRect().top + window.scrollY;
        animateScrollTo(Math.max(0, containerTop - 1), 400);
        return;
      }

      if (next >= PANEL_COUNT) {
        setForceHidden(true);
        exitCooldownRef.current = true;
        animateScrollTo(getExitScroll(), 500, () => {
          setTimeout(() => { exitCooldownRef.current = false; }, 600);
        });
        return;
      }

      targetPanelRef.current = next;
      animateScrollTo(getPanelScroll(next), 500);
    };

    const onWheel = (e: WheelEvent) => {
      const p = scrollYProgress.get();
      if (p <= 0 && e.deltaY < 0) return;
      if (p >= 0.99) return;
      if (!isInSection()) return;

      e.preventDefault();
      e.stopImmediatePropagation();

      if (Math.abs(e.deltaY) < 4) return;
      handleScroll(e.deltaY > 0 ? 1 : -1);
    };

    let touchStartY = 0;
    let touchHandled = false;

    const onTouchStart = (e: TouchEvent) => {
      if (!isInSection()) return;
      touchStartY = e.touches[0].clientY;
      touchHandled = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      const p = scrollYProgress.get();
      if (p <= 0 && e.touches[0].clientY > touchStartY) return;
      if (p >= 0.99) return;
      if (!isInSection()) return;

      e.preventDefault();
      e.stopImmediatePropagation();

      if (touchHandled) return;
      const deltaY = touchStartY - e.touches[0].clientY;
      if (Math.abs(deltaY) < 30) return;

      touchHandled = true;
      handleScroll(deltaY > 0 ? 1 : -1);
    };

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true, capture: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });
    return () => {
      window.removeEventListener("wheel", onWheel, { capture: true });
      window.removeEventListener("touchstart", onTouchStart, { capture: true });
      window.removeEventListener("touchmove", onTouchMove, { capture: true });
    };
  }, [lenis, scrollYProgress]);

  // Per-panel surface color. 6 stops for 5 panels (one stop per panel
  // boundary + final). Subtle within the cream/ink family.
  const lightColors = ["#FAF8F1", "#F5F1E8", "#ECE7D7", "#F2EDE2", "#F8F3E8", "#F8F3E8"];
  const darkColors  = ["#0F1117", "#15171F", "#1B1E27", "#15171F", "#0F1117", "#0F1117"];
  const surfaceColor = useTransform(
    scrollYProgress,
    [0, 1 / PANEL_COUNT, 2 / PANEL_COUNT, 3 / PANEL_COUNT, 4 / PANEL_COUNT, 1],
    isDark ? darkColors : lightColors,
  );

  // Aurora opacity — visible in the Hero panel, fades out by panel 1.
  const auroraOpacity = useTransform(
    scrollYProgress,
    [0, 0.5 / PANEL_COUNT, 1.0 / PANEL_COUNT],
    [1, 0.85, 0],
  );

  const ActiveMockup = PANELS[activePanel].Mockup;

  return (
    <section
      id="hero"
      aria-label="MonieTally — your money, finally legible"
      className="relative"
    >
      {/* ══════ Side scroll progress rail (fades with overlay) ══════ */}
      <ScrollProgressRail
        scrollYProgress={scrollYProgress}
        activePanel={activePanel}
        totalPanels={PANEL_COUNT}
        opacity={overlayOpacity}
      />

      {/* ══════ Desktop scroll-distance container (empty) ══════
          This box exists only to provide the scroll runway. The
          phone + text are rendered as a FIXED overlay below, not
          inside this container, so there's no sticky exit dead-scroll. */}
      <div
        ref={containerRef}
        className="hidden md:block"
        style={{ height: `${PANEL_COUNT * PANEL_HEIGHT_VH}vh`, position: "relative" }}
        aria-hidden="true"
      />

      {/* ══════ Desktop FIXED overlay (phone + text, full viewport) ══════
          Fixed to viewport, so it appears regardless of where the user
          has scrolled. Opacity is driven by scroll progress: 1 during
          the experience, fading to 0 as the user reaches the bottom of
          the scroll container so the next section reveals cleanly. */}
      <motion.div
        className="hidden md:block fixed inset-x-0 top-0 pointer-events-none"
        style={{
          height: "100vh",
          opacity: overlayOpacity,
          zIndex: 30,
          visibility: scrolledPast || forceHidden ? "hidden" : "visible",
        }}
      >
        {/* TEXT + BG LAYER (z-1, full viewport, surfaceColor bg) */}
        <motion.div
          className="absolute inset-0 overflow-hidden"
          style={{
            zIndex: 1,
            background: surfaceColor,
          }}
        >
          {/* Aurora layer — only visible during the Hero panel */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 aurora-bg animate-aurora pointer-events-none"
            style={{ opacity: auroraOpacity }}
          />
          {/* Subtle dot grid (Hero feel) */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 grid-bg pointer-events-none"
            style={{ opacity: useTransform(auroraOpacity, [0, 1], [0, 0.4]) }}
          />

          <div className="section-container relative w-full h-full">
            {PANELS.map((panel, idx) => (
              <PanelText
                key={panel.id}
                panel={panel}
                idx={idx}
                isActive={idx === activePanel}
                totalPanels={PANEL_COUNT}
                scrollYProgress={scrollYProgress}
                reducedMotion={reducedMotion}
              />
            ))}
          </div>
        </motion.div>

        {/* PHONE LAYER (z-50, above text, only the phone is opaque) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 50 }}
        >
          {/* Soft halo behind the phone, follows it via translateX */}
          <motion.div
            aria-hidden="true"
            className="absolute pointer-events-none"
            style={{
              top: "50%",
              left: "50%",
              width: 600,
              height: 600,
              x: phoneX,
              translateY: "-50%",
              translateX: "-50%",
              background:
                "radial-gradient(ellipse at center, rgba(17, 166, 117, 0.32) 0%, rgba(201, 169, 97, 0.18) 45%, transparent 72%)",
              filter: "blur(28px)",
            }}
          />
          <Phone3DSceneLoader
            pose={poseRef.current}
            idleRotation={false}
            ariaLabel={PANELS[activePanel].ariaLabel}
            className="w-full h-full"
          >
            <AnimatePresence mode="sync" initial={false}>
              <motion.div
                key={PANELS[activePanel].id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.3 }}
                style={{ position: "absolute", inset: 0 }}
              >
                <ActiveMockup />
              </motion.div>
            </AnimatePresence>
          </Phone3DSceneLoader>
        </div>
      </motion.div>

      {/* ══════ Mobile ══════ */}
      <div className="md:hidden">
        <MobileStack panels={PANELS} />
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ScrollProgressRail — vertical rail with a sliding emerald dot
   that descends as the user scrolls. The visual signal that you
   ARE going down the page, not just watching things switch.
   ══════════════════════════════════════════════════════════════════ */

/** Total rail height in CSS px. */
const RAIL_HEIGHT = 220;
/** Dot diameter. */
const RAIL_DOT = 10;

function ScrollProgressRail({
  scrollYProgress,
  activePanel,
  totalPanels,
  opacity,
}: {
  scrollYProgress: MotionValue<number>;
  activePanel: number;
  totalPanels: number;
  opacity?: MotionValue<number>;
}) {
  const showcasePanels = totalPanels - 1;
  const firstShowcaseStart = 1 / totalPanels;
  const lastPanelStart = (totalPanels - 1) / totalPanels;
  const dotTop = useTransform(scrollYProgress, [firstShowcaseStart, lastPanelStart], [0, RAIL_HEIGHT - RAIL_DOT]);
  const fillHeight = useTransform(scrollYProgress, [firstShowcaseStart, lastPanelStart], [0, RAIL_HEIGHT - RAIL_DOT / 2]);
  const railOpacity = useTransform(scrollYProgress, [firstShowcaseStart - 0.02, firstShowcaseStart], [0, 1]);

  const displayPanel = Math.max(0, activePanel - 1);

  return (
    <motion.div
      className="hidden md:flex flex-col items-center gap-3 fixed right-6 top-1/2 -translate-y-1/2 pointer-events-none"
      style={{ zIndex: 60, opacity: opacity ?? 1 }}
      aria-hidden="true"
    >
      <motion.div style={{ opacity: railOpacity }}>
      {/* Panel label, current / total */}
      <div
        className="text-[10px] uppercase font-medium"
        style={{
          letterSpacing: "0.22em",
          color: "var(--text-tertiary)",
          fontFeatureSettings: '"tnum"',
        }}
      >
        {String(displayPanel + 1).padStart(2, "0")} / {String(showcasePanels).padStart(2, "0")}
      </div>

      {/* Vertical rail */}
      <div
        className="relative"
        style={{
          width: 2,
          height: RAIL_HEIGHT,
          background: "var(--border)",
          borderRadius: 2,
          overflow: "visible",
        }}
      >
        {/* Filled portion (above the dot) */}
        <motion.div
          className="absolute left-0 right-0 top-0 rounded-full"
          style={{
            background: "linear-gradient(to bottom, var(--brand-emerald), var(--brand-emerald-light))",
            height: fillHeight,
            opacity: 0.65,
          }}
        />
        {/* Sliding dot */}
        <motion.div
          className="absolute rounded-full"
          style={{
            left: "50%",
            x: "-50%",
            width: RAIL_DOT,
            height: RAIL_DOT,
            top: dotTop,
            background: "var(--brand-emerald)",
            boxShadow: "0 0 16px rgba(17, 166, 117, 0.7), 0 0 4px rgba(17, 166, 117, 1)",
          }}
        />
      </div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PanelText — renders either the Hero panel or a Showcase panel
   ══════════════════════════════════════════════════════════════════ */

function PanelText({
  panel,
  idx,
  isActive,
  totalPanels,
  scrollYProgress,
  reducedMotion,
}: {
  panel: PanelDef;
  idx: number;
  isActive: boolean;
  totalPanels: number;
  scrollYProgress: MotionValue<number>;
  reducedMotion: boolean;
}) {
  const start = idx / totalPanels;
  const end = (idx + 1) / totalPanels;
  // Match the phone's TRANSITION_HALF so text and phone share timing.
  const fade = TRANSITION_HALF;

  const isFirst = idx === 0;
  const isLast = idx === totalPanels - 1;

  let inputs: number[];
  let opacityOutputs: number[];
  let yOutputs: number[];

  // Stronger Y motion (60px in/out) makes the text panels feel like
  // they're actually scrolling through the viewport — rolling in from
  // below, rolling out to above — instead of just fading in place.
  if (isFirst) {
    inputs = [0, 0.0001, end - fade, end + fade];
    opacityOutputs = [1, 1, 1, 0];
    yOutputs = reducedMotion ? [0, 0, 0, 0] : [0, 0, 0, -64];
  } else if (isLast) {
    inputs = [start - fade, start + fade, 0.9999, 1];
    opacityOutputs = [0, 1, 1, 1];
    yOutputs = reducedMotion ? [0, 0, 0, 0] : [64, 0, 0, 0];
  } else {
    inputs = [start - fade, start + fade, end - fade, end + fade];
    opacityOutputs = [0, 1, 1, 0];
    yOutputs = reducedMotion ? [0, 0, 0, 0] : [64, 0, 0, -64];
  }

  const opacity = useTransform(scrollYProgress, inputs, opacityOutputs);
  const y = useTransform(scrollYProgress, inputs, yOutputs);

  return (
    <motion.div
      style={{
        opacity,
        y,
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        pointerEvents: "none",
        willChange: "opacity, transform",
      }}
    >
      {panel.type === "hero"
        ? <HeroPanelContent panel={panel} isActive={isActive} />
        : <ShowcasePanelContent panel={panel} isActive={isActive} />}
    </motion.div>
  );
}

function HeroPanelContent({ panel, isActive }: { panel: HeroPanelDef; isActive: boolean }) {
  return (
    <div className="grid grid-cols-12 gap-6 lg:gap-10 items-center w-full" style={{ minHeight: "70vh" }}>
      <div
        className="col-span-12 md:col-span-7 relative z-10"
        style={{ pointerEvents: isActive ? "auto" : "none" }}
      >
        {/* Eyebrow pill */}
        <div
          className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
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
          <span style={{ color: "var(--text-secondary)" }}>{panel.eyebrow}</span>
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
          {panel.headlinePrimary}{" "}
          <span className="text-gradient">{panel.headlineAccent}</span>
        </h1>

        <p
          className="text-base md:text-lg leading-relaxed max-w-xl mb-10"
          style={{ color: "var(--text-secondary)" }}
        >
          {panel.body}
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Link href={panel.primaryCta.href} className="btn-primary">
            {panel.primaryCta.label}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
          <Link href={panel.secondaryCta.href} className="btn-ghost">
            {panel.secondaryCta.label}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs" style={{ color: "var(--text-tertiary)" }}>
          {panel.trust.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2">
              {item.icon}
              {item.label}
            </span>
          ))}
        </div>
      </div>

      {/* col 8-12 reserved for the sticky phone visually */}
      <div className="hidden md:block md:col-span-5" aria-hidden="true" />
    </div>
  );
}

function ShowcasePanelContent({ panel, isActive }: { panel: ShowcasePanelDef; isActive: boolean }) {
  return (
    <div
      className="grid grid-cols-12 gap-6 lg:gap-10 items-center w-full"
      style={{ minHeight: "60vh" }}
    >
      <div
        className={`max-w-md col-span-12 ${panel.phoneSide === "right" ? "md:col-start-1 md:col-span-7" : "md:col-start-6 md:col-span-7 md:ml-auto"}`}
        style={{
          textAlign: panel.phoneSide === "right" ? "left" : "right",
          pointerEvents: isActive ? "auto" : "none",
        }}
      >
        <div
          className="text-xs font-medium uppercase mb-4"
          style={{
            letterSpacing: "0.18em",
            color: "var(--gold)",
          }}
        >
          {panel.number} / {panel.label}
        </div>
        <h2
          className="text-display"
          style={{
            fontSize: "clamp(38px, 4.6vw, 64px)",
            color: "var(--text-primary)",
            marginBottom: 18,
          }}
        >
          {panel.headline}
        </h2>
        <p
          className="text-lg md:text-xl leading-relaxed"
          style={{
            color: "var(--text-secondary)",
            marginBottom: 16,
          }}
        >
          {panel.subhead}
        </p>
        <p
          className="text-base md:text-lg"
          style={{ color: "var(--text-tertiary)" }}
        >
          {panel.support}
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MobileStack
   ══════════════════════════════════════════════════════════════════ */

function MobileStack({ panels }: { panels: ReadonlyArray<PanelDef> }) {
  const SCALE = 0.7;
  const SCALED_W = Math.round(PHONE_FRAME_WIDTH * SCALE);
  const SCALED_H = Math.round(PHONE_FRAME_HEIGHT * SCALE);

  return (
    <div className="section-container py-16 flex flex-col" style={{ gap: 64 }}>
      {panels.map((panel, idx) => {
        const Mockup = panel.Mockup;
        return (
          <motion.article
            key={panel.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
            className="flex flex-col items-start text-left"
          >
            <div style={{ width: SCALED_W, height: SCALED_H, position: "relative", marginBottom: 24 }}>
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  transform: `scale(${SCALE})`,
                  transformOrigin: "top left",
                }}
              >
                <PhoneFrame ariaLabel={panel.ariaLabel}>
                  <Mockup />
                </PhoneFrame>
              </div>
            </div>

            {panel.type === "hero" ? (
              <div className="max-w-md">
                <div
                  className="mb-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{
                    background: "var(--surface-card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--brand-emerald)" }} />
                  <span style={{ color: "var(--text-secondary)" }}>{panel.eyebrow}</span>
                </div>
                <h1
                  className="text-display"
                  style={{
                    fontSize: "clamp(36px, 9vw, 48px)",
                    color: "var(--text-primary)",
                    marginBottom: 16,
                    lineHeight: 1.04,
                  }}
                >
                  {panel.headlinePrimary}{" "}
                  <span className="text-gradient">{panel.headlineAccent}</span>
                </h1>
                <p className="text-base leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>
                  {panel.body}
                </p>
                <div className="flex flex-col gap-3">
                  <Link href={panel.primaryCta.href} className="btn-primary">
                    {panel.primaryCta.label}
                  </Link>
                  <Link href={panel.secondaryCta.href} className="btn-ghost">
                    {panel.secondaryCta.label}
                  </Link>
                </div>
              </div>
            ) : (
              <div className="max-w-md">
                <div className="text-xs font-medium uppercase mb-3" style={{ letterSpacing: "0.18em", color: "var(--gold)" }}>
                  {panel.number} / {panel.label}
                </div>
                <h2
                  className="text-display"
                  style={{
                    fontSize: "clamp(28px, 7vw, 36px)",
                    color: "var(--text-primary)",
                    marginBottom: 12,
                  }}
                >
                  {panel.headline}
                </h2>
                <p className="text-base leading-relaxed mb-2" style={{ color: "var(--text-secondary)" }}>
                  {panel.subhead}
                </p>
                <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                  {panel.support}
                </p>
              </div>
            )}
          </motion.article>
        );
      })}
    </div>
  );
}
