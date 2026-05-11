"use client";

/**
 * Vertical dot rail showing which ScrollShowcase panel is active.
 *
 * Lives on the right edge of the sticky container (SPEC.md §7.1). Dots are
 * real `<button>` elements so they're keyboard-focusable and screen-readers
 * can announce them. The active dot carries `aria-current="true"` and a
 * meaningful label like "Jump to panel 3: Insights".
 *
 * Hidden on screens narrower than `md` (SPEC.md §7.3): the mobile fallback
 * stacks panels vertically, so native scroll position already conveys
 * which panel you're in.
 */

import { useCallback } from "react";

interface PanelIndicatorProps {
  /** Index of the currently visible panel (0-based). */
  active: number;
  /** Short human label per panel, e.g. ["Home", "Activity", ...]. */
  labels: ReadonlyArray<string>;
  /** Called when the user clicks/keys onto a dot. */
  onJump: (index: number) => void;
}

export function PanelIndicator({ active, labels, onJump }: PanelIndicatorProps) {
  const handleClick = useCallback(
    (idx: number) => () => onJump(idx),
    [onJump],
  );

  return (
    <nav
      aria-label="Showcase panels"
      // Hidden under md per SPEC §7.3. The dots add no signal on mobile
      // because vertical scroll position already tells you where you are.
      className="hidden md:flex"
      style={{
        position: "absolute",
        right: 32,
        top: "50%",
        transform: "translateY(-50%)",
        flexDirection: "column",
        gap: 14,
        zIndex: 5,
      }}
    >
      {labels.map((label, idx) => {
        const isActive = idx === active;
        return (
          <button
            key={label}
            type="button"
            aria-label={`Jump to panel ${idx + 1}: ${label}`}
            aria-current={isActive ? "true" : undefined}
            onClick={handleClick(idx)}
            style={{
              width: 10,
              height: 10,
              padding: 0,
              borderRadius: 9999,
              border: "1px solid var(--gold)",
              background: isActive ? "var(--gold)" : "transparent",
              opacity: isActive ? 1 : 0.55,
              transition: "background 200ms ease, opacity 200ms ease, transform 200ms ease",
              cursor: "pointer",
              transform: isActive ? "scale(1.2)" : "scale(1)",
            }}
          />
        );
      })}
    </nav>
  );
}

export default PanelIndicator;
