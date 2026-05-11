/**
 * Shared phone chrome for landing-page mockups.
 *
 * Mirrors the editorial frame used in monietally/design-mockups/*.html:
 *   - Inner screen is a fixed 320×696 surface. The mockup ports use
 *     absolute positioning that depends on those exact dimensions
 *     (e.g. `.txn-1 { top: 384px }`), so we never reflow the contents.
 *   - 8px frame padding + 46px outer radius + 38px inner radius.
 *   - Theme-aware shell tokens (`--phone-shell`, `--phone-border`, etc.)
 *     swap with next-themes. Dark = #18181C shell, Light = #E2E2E7.
 *
 * Sizing: the frame renders at its intrinsic 336×712 px footprint. To
 * make it fit a layout slot, wrap it in a parent that applies CSS
 * `transform: scale(N)` (per APP_MOCKUPS_USAGE.md, never reflow contents).
 *
 * Forcing dark: the five ScrollShowcase phones are spec'd dark regardless
 * of the ambient site theme (SPEC.md §7.2). Pass `forceDark` to lock the
 * dark palette via a nested `.dark` wrapper, which redefines the relevant
 * CSS variables for descendants.
 *
 * Source: monietally/design-mockups/10-home.html (frame definition).
 */

import type { CSSProperties, ReactNode } from "react";

/** Intrinsic inner-screen dimensions. All mockup ports assume these. */
export const PHONE_SCREEN_WIDTH = 320;
export const PHONE_SCREEN_HEIGHT = 696;

/** Outer footprint including the 8px frame padding on each side. */
export const PHONE_FRAME_WIDTH = PHONE_SCREEN_WIDTH + 16;
export const PHONE_FRAME_HEIGHT = PHONE_SCREEN_HEIGHT + 16;

interface PhoneFrameProps {
  children: ReactNode;
  /** Lock the dark palette regardless of the ambient `dark` class. */
  forceDark?: boolean;
  /** Lock the light palette regardless of the ambient `dark` class. */
  forceLight?: boolean;
  className?: string;
  /** Accessible label describing the screen contents. */
  ariaLabel?: string;
  /** Style passthrough for parent-driven animation (e.g. Framer Motion). */
  style?: CSSProperties;
}

export function PhoneFrame({
  children,
  forceDark = false,
  forceLight = false,
  className = "",
  ariaLabel = "MonieTally app preview",
  style,
}: PhoneFrameProps) {
  // Adding `dark` to a descendant wrapper redefines the CSS vars declared
  // under `.dark { ... }` in globals.css for descendants, and Tailwind's
  // class-strategy dark: variant matches via ancestor.
  // `force-light` is the inverse: declared in globals.css to re-set the
  // dark-overridden tokens back to their :root (light) values, so a phone
  // can render light even when an ancestor is .dark. Both classes can't
  // be active at once; forceDark wins if both are passed.
  const themeClass = forceDark ? "dark" : forceLight ? "force-light" : "";

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={`${themeClass} ${className}`}
      style={{
        width: PHONE_FRAME_WIDTH,
        height: PHONE_FRAME_HEIGHT,
        // Prevent the fixed pixel size from breaking parent flex layouts.
        flexShrink: 0,
        ...style,
      }}
    >
      <div
        className="relative w-full h-full"
        style={{
          background: "var(--phone-shell)",
          border: "1px solid var(--phone-border)",
          borderRadius: 46,
          padding: 8,
          boxShadow: "var(--phone-shell-shadow)",
        }}
      >
        <div
          className="relative w-full h-full overflow-hidden"
          style={{
            borderRadius: 38,
            background: "var(--phone-screen)",
            color: "var(--phone-screen-fg)",
            // tnum + ss01 to match the design canon's tabular numerics.
            fontFeatureSettings: '"tnum", "ss01"',
          }}
        >
          {/* Dynamic island */}
          <div
            className="absolute"
            style={{
              top: 11,
              left: "50%",
              transform: "translateX(-50%)",
              width: 114,
              height: 32,
              background: "#000",
              borderRadius: 16,
              zIndex: 4,
            }}
          />
          {/* Status bar (top:16, fontSize:14, weight:500). The 5-dot glyph
              stands in for signal/wifi/battery in the editorial mocks. */}
          <div
            className="absolute flex items-center justify-between"
            style={{
              top: 16,
              left: 0,
              right: 0,
              padding: "0 30px",
              zIndex: 5,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            <span>9:41</span>
            <span style={{ fontSize: 12, letterSpacing: 2 }}>
              {"●●●●●"}
            </span>
          </div>
          {/* Mockup content lives here, inside the 320×696 surface. */}
          {children}
          {/* Home indicator */}
          <div
            className="absolute"
            style={{
              bottom: 6,
              left: "50%",
              transform: "translateX(-50%)",
              width: 134,
              height: 5,
              borderRadius: 3,
              background: "var(--phone-home-indicator)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default PhoneFrame;
