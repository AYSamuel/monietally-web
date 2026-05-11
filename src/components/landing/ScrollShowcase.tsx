"use client";

/**
 * ScrollShowcase — sticky CSS3D phone glides through 5 panels.
 *
 * Architecture:
 *   - A tall scroll container (PANEL_COUNT × 100vh).
 *   - A sticky PHONE layer (z-50) hosting the CSS3D Phone3DScene.
 *     Phone position + rotateY are driven by spring-smoothed
 *     scrollYProgress so it glides between panels with buttery
 *     physics. The mockup INSIDE the phone crossfades between the
 *     5 screens via AnimatePresence keyed off the active panel.
 *   - A SINGLE sticky TEXT layer below it, holding all panels
 *     overlaid; each panel's opacity & y are driven by the same
 *     scrollYProgress so text and phone arrive together. The text
 *     layer's background lerps through cream tones (or ink tones
 *     in dark mode) per panel — the "moving across sections" feel.
 *
 * Mobile: standard stacked cards, no sticky behavior.
 */

import { useRef, useState, type ComponentType, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  AnimatePresence,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { useTheme } from "next-themes";
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

interface PanelDef {
  id: string;
  label: string;
  /** Which side the PHONE sits on. Text goes on the other side. */
  phoneSide: "right" | "left";
  Mockup: ComponentType;
  ariaLabel: string;
  headline: string;
  subhead: string;
  support: string;
}

const PANELS: ReadonlyArray<PanelDef> = [
  {
    id: "home",
    label: "Home",
    phoneSide: "right",
    Mockup: HomePopulated,
    ariaLabel: "Home dashboard showing $2,847 left this month",
    headline: "See where you stand, instantly.",
    subhead:
      "One screen tells you what's left, what's coming up, and where it went.",
    support: "No charts to decode. No menus to dig through.",
  },
  {
    id: "activity",
    label: "Activity",
    phoneSide: "left",
    Mockup: Activity,
    ariaLabel: "Activity log of recent transactions",
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
    ariaLabel:
      "Insights screen showing category breakdown and weekly trend",
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
    headline: "Save toward what matters.",
    subhead:
      "Name your goals, set a target, and watch the runway shrink as you go.",
    support:
      "Encrypted on your device, synced privately to your other devices.",
  },
];

const PANEL_COUNT = PANELS.length;
/** Horizontal slide distance, in CSS pixels. ~340 lands the phone at
 *  roughly the same column position as the Hero's phone (col 8-12 of
 *  a 12-col grid in a max-w-7xl container). */
const PHONE_SLIDE_PX = 340;
/** Inward tilt at each rest position, in radians (~5.7°). */
const PHONE_TILT_RAD = 0.10;
/** Constant rear tilt for editorial depth (~2.3°). */
const PHONE_BASE_TILT_X = -0.04;
/** Phone scale — matches the Hero's pose.scale so the two phones feel
 *  visually continuous as you scroll from one section into the other. */
const PHONE_SCALE = 1.05;

const xForSide = (side: "left" | "right") =>
  side === "right" ? PHONE_SLIDE_PX : -PHONE_SLIDE_PX;
const ryForSide = (side: "left" | "right") =>
  side === "right" ? PHONE_TILT_RAD : -PHONE_TILT_RAD;

export function ScrollShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion() ?? false;
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Raw scroll → spring-smoothed for buttery glide.
  const { scrollYProgress: rawProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  // Tighter than the previous 110/24 — much faster spring response so
  // a single scroll input visibly progresses panels, no "scroll twice"
  // feel. Still smooth, no overshoot.
  const scrollYProgress = useSpring(rawProgress, {
    stiffness: 140,
    damping: 22,
    restDelta: 0.0005,
  });

  // ── Build keyframes for phone X + rotateY tied to panel boundaries ─
  // Transition window of ±0.03 around each boundary so the slide is
  // tight but not abrupt.
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
      xInputs.push(start - 0.03); xOutputs.push(prevX);
      xInputs.push(start + 0.03); xOutputs.push(x);
      ryInputs.push(start - 0.03); ryOutputs.push(prevRY);
      ryInputs.push(start + 0.03); ryOutputs.push(ry);
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

  // ── Stable pose ref. Mutated on every motion-value change.
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

  // ── Active panel (drives mockup crossfade). Detected on the spring,
  //    so the mockup swap aligns with the phone's arrival, not raw scroll.
  const [activePanel, setActivePanel] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const idx = Math.min(
      PANEL_COUNT - 1,
      Math.max(0, Math.floor(p * PANEL_COUNT)),
    );
    setActivePanel((prev) => (prev === idx ? prev : idx));
  });

  // ── Per-panel surface color. Subtle steps within the cream/ink family
  //    so it feels like moving across distinct sections without breaking
  //    the editorial palette.
  const lightColors = ["#FAF8F1", "#F5F1E8", "#ECE7D7", "#F2EDE2", "#F8F3E8", "#F8F3E8"];
  const darkColors  = ["#0F1117", "#15171F", "#1B1E27", "#15171F", "#0F1117", "#0F1117"];
  const surfaceColor = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    isDark ? darkColors : lightColors,
  );

  const ActiveMockup = PANELS[activePanel].Mockup;

  return (
    <section
      id="showcase"
      aria-label="Product showcase"
      className="relative"
    >
      {/* ── Desktop ──────────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="hidden md:block relative"
        style={{ height: `${PANEL_COUNT * 100}vh` }}
      >
        {/* PHONE layer */}
        <div
          className="sticky top-0 h-screen pointer-events-none"
          style={{ zIndex: 50 }}
        >
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

        {/* TEXT layer — single sticky container with all panels overlaid */}
        <div
          style={{
            marginTop: "-100vh",
            height: `${PANEL_COUNT * 100}vh`,
            position: "relative",
            pointerEvents: "none",
          }}
        >
          <motion.div
            className="sticky top-0 h-screen"
            style={{
              zIndex: 1,
              background: surfaceColor,
              pointerEvents: "auto",
              transition: "background-color 60ms linear",
            }}
          >
            <div className="section-container relative w-full h-full">
              {PANELS.map((panel, idx) => (
                <PanelText
                  key={panel.id}
                  panel={panel}
                  idx={idx}
                  totalPanels={PANEL_COUNT}
                  scrollYProgress={scrollYProgress}
                  reducedMotion={reducedMotion}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Mobile ───────────────────────────────────────────── */}
      <div className="md:hidden py-16">
        <MobileStack />
      </div>
    </section>
  );
}

/* ── PanelText: one panel's text content, opacity/y driven by scroll. ── */
function PanelText({
  panel,
  idx,
  totalPanels,
  scrollYProgress,
  reducedMotion,
}: {
  panel: PanelDef;
  idx: number;
  totalPanels: number;
  scrollYProgress: MotionValue<number>;
  reducedMotion: boolean;
}) {
  const start = idx / totalPanels;
  const end = (idx + 1) / totalPanels;
  const fade = 0.03;

  const isFirst = idx === 0;
  const isLast = idx === totalPanels - 1;

  let inputs: number[];
  let opacityOutputs: number[];
  let yOutputs: number[];

  if (isFirst) {
    inputs = [0, 0.0001, end - fade, end + fade];
    opacityOutputs = [1, 1, 1, 0];
    yOutputs = reducedMotion ? [0, 0, 0, 0] : [0, 0, 0, -24];
  } else if (isLast) {
    inputs = [start - fade, start + fade, 0.9999, 1];
    opacityOutputs = [0, 1, 1, 1];
    yOutputs = reducedMotion ? [0, 0, 0, 0] : [24, 0, 0, 0];
  } else {
    inputs = [start - fade, start + fade, end - fade, end + fade];
    opacityOutputs = [0, 1, 1, 0];
    yOutputs = reducedMotion ? [0, 0, 0, 0] : [24, 0, 0, -24];
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
      <div
        className="grid grid-cols-2 items-center gap-8 w-full"
        style={{ minHeight: "60vh" }}
      >
        <div
          className={`max-w-md ${panel.phoneSide === "right" ? "col-start-1" : "col-start-2 ml-auto"}`}
          style={{
            gridRow: 1,
            textAlign: panel.phoneSide === "right" ? "left" : "right",
            pointerEvents: "auto",
          }}
        >
          <div
            className="text-xs font-medium uppercase mb-4"
            style={{
              letterSpacing: "0.18em",
              color: "var(--gold)",
            }}
          >
            {String(idx + 1).padStart(2, "0")} / {panel.label}
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
    </motion.div>
  );
}

/* ── MobileStack: simple stacked cards on small screens. ─────── */
function MobileStack() {
  const SCALE = 0.7;
  const SCALED_W = Math.round(PHONE_FRAME_WIDTH * SCALE);
  const SCALED_H = Math.round(PHONE_FRAME_HEIGHT * SCALE);

  return (
    <div className="section-container flex flex-col" style={{ gap: 64 }}>
      {PANELS.map((panel, idx) => {
        const Mockup = panel.Mockup;
        return (
          <motion.article
            key={panel.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
            className="flex flex-col items-center text-left"
          >
            <div
              style={{
                width: SCALED_W,
                height: SCALED_H,
                position: "relative",
              }}
            >
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

            <div className="mt-8 max-w-md">
              <div
                className="text-xs font-medium uppercase mb-3"
                style={{ letterSpacing: "0.18em", color: "var(--gold)" }}
              >
                {String(idx + 1).padStart(2, "0")} / {panel.label}
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
              <p
                className="text-base leading-relaxed"
                style={{
                  color: "var(--text-secondary)",
                  marginBottom: 10,
                }}
              >
                {panel.subhead}
              </p>
              <p
                className="text-sm"
                style={{ color: "var(--text-tertiary)" }}
              >
                {panel.support}
              </p>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}

export default ScrollShowcase;
