"use client";

/**
 * Scroll-driven motion values for the landing-page ScrollShowcase.
 *
 * Wraps `useScroll` + `useTransform` from framer-motion and exposes the
 * single source of truth for the pinned-scroll choreography described in
 * SPEC.md §7. The component layer never reaches into framer-motion
 * directly, it just consumes what this hook returns.
 *
 * Mechanic in plain English:
 *   The section is 5×100vh tall. As the user scrolls through it, the
 *   phone slides left and right between five resting positions, alternating
 *   sides for each panel: right → left → right → left → right.
 *
 * Output mapping (linear between keypoints). Panel 0 sits on the RIGHT
 * (+18%), panel 1 on the LEFT, alternating — matching PANELS[].side.
 * The phone starts at +18% creating seamless continuity with the hero
 * section (which has no phone on desktop; the showcase phone IS the hero
 * phone).
 *
 *     scrollYProgress  0    0.16  0.24  0.36  0.44  0.56  0.64  0.76  0.84  1.0
 *     phoneX (vw)    +22   +22   -22   -22   +22   +22   -22   -22   +22   +22
 *     phoneRotateY     4     4    -4    -4    +4    +4    -4    -4    +4    +4
 *
 *   Within each panel the phone holds at its resting position; transitions
 *   happen in tight ~0.08-wide windows around panel boundaries.
 *
 * Reduced motion (SPEC.md §7.4):
 *   When `prefers-reduced-motion: reduce` is set, phoneX and phoneRotateY
 *   collapse to constant 0% / 0deg. The discrete `activePanel` still
 *   updates so panel content can hard-swap at boundaries.
 */

import { useEffect, useState, type RefObject } from "react";
import {
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";

export const PANEL_COUNT = 5;

/**
 * Phone-X keypoints. The phone stays at +18% (right) for panel 0,
 * creating seamless continuity with the hero section above. It then
 * alternates sides for subsequent panels, matching each panel's `side`
 * field in the component.
 *
 * Panel resting positions (aligned with PANELS[].side):
 *   panel 0 (Home)     side:"right" → +18%
 *   panel 1 (Activity) side:"left"  → -18%
 *   panel 2 (Insights) side:"right" → +18%
 *   panel 3 (Budgets)  side:"left"  → -18%
 *   panel 4 (Savings)  side:"right" → +18%
 *
 * Transitions happen in ~0.08-wide windows around panel boundaries.
 */
const PHONE_X_INPUT = [
  0, 0.16, 0.24, 0.36, 0.44, 0.56, 0.64, 0.76, 0.84, 1,
];
const PHONE_X_OUTPUT = [
  "22vw",   // 0     panel 0 start (RIGHT, continuous from hero)
  "22vw",   // 0.16  panel 0 hold
  "-22vw",  // 0.24  slide complete into panel 1 (LEFT)
  "-22vw",  // 0.36  panel 1 hold
  "22vw",   // 0.44  slide complete into panel 2 (RIGHT)
  "22vw",   // 0.56  panel 2 hold
  "-22vw",  // 0.64  slide complete into panel 3 (LEFT)
  "-22vw",  // 0.76  panel 3 hold
  "22vw",   // 0.84  slide complete into panel 4 (RIGHT)
  "22vw",   // 1     panel 4 final
];

const PHONE_ROTATE_INPUT = PHONE_X_INPUT;
const PHONE_ROTATE_OUTPUT = [4, 4, -4, -4, 4, 4, -4, -4, 4, 4];

const REDUCED_INPUT = [0, 1] as const;
const REDUCED_X_OUTPUT = ["0vw", "0vw"] as const;
const REDUCED_ROTATE_OUTPUT = [0, 0] as const;

export interface ShowcaseProgress {
  /** Discrete index of the currently active panel (0..PANEL_COUNT-1). */
  activePanel: number;
  /** Raw 0..1 scroll progress through the showcase section. */
  scrollYProgress: MotionValue<number>;
  /** CSS `translateX` value for the phone. Bound to a `motion` element. */
  phoneX: MotionValue<string>;
  /** Y-axis rotation in degrees. Bound to a `motion` element. */
  phoneRotateY: MotionValue<number>;
  /** True if the user has requested reduced motion. */
  reducedMotion: boolean;
}

export function useScrollShowcaseProgress(
  ref: RefObject<HTMLElement>,
): ShowcaseProgress {
  const reducedMotionRaw = useReducedMotion();
  const reducedMotion = reducedMotionRaw ?? false;

  const { scrollYProgress } = useScroll({
    target: ref,
    // Section progress is "start of section at top of viewport" → 0,
    // "end of section at bottom of viewport" → 1. With the inner sticky
    // pinned for the full duration, this maps cleanly to the panel range.
    offset: ["start start", "end end"],
  });

  // Discrete active panel. Initialised once, then updated on scroll
  // changes only when the floor index actually moves (avoids re-render
  // churn while scrolling within a single panel).
  const [activePanel, setActivePanel] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const idx = Math.floor(p * PANEL_COUNT);
    const clamped = Math.min(PANEL_COUNT - 1, Math.max(0, idx));
    setActivePanel((prev) => (prev === clamped ? prev : clamped));
  });

  // Belt-and-suspenders: on mount, sync once from the current scroll
  // position so refresh-mid-section starts on the right panel.
  useEffect(() => {
    const p = scrollYProgress.get();
    const idx = Math.min(
      PANEL_COUNT - 1,
      Math.max(0, Math.floor(p * PANEL_COUNT)),
    );
    setActivePanel(idx);
    // Run once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const phoneX = useTransform(
    scrollYProgress,
    reducedMotion ? [...REDUCED_INPUT] : PHONE_X_INPUT,
    reducedMotion ? [...REDUCED_X_OUTPUT] : PHONE_X_OUTPUT,
  );
  const phoneRotateY = useTransform(
    scrollYProgress,
    reducedMotion ? [...REDUCED_INPUT] : PHONE_ROTATE_INPUT,
    reducedMotion ? [...REDUCED_ROTATE_OUTPUT] : PHONE_ROTATE_OUTPUT,
  );

  return {
    activePanel,
    scrollYProgress,
    phoneX,
    phoneRotateY,
    reducedMotion,
  };
}

export default useScrollShowcaseProgress;
