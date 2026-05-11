/**
 * Mirrors monietally/design-mockups/15-savings.html (Savings populated, both variants).
 * Update both files when the design changes.
 *
 * Theming: follows the ambient theme via the --m-fg-XX, --phone-screen,
 * --phone-screen-fg, --m-income tokens defined in globals.css.
 *
 * Used by: ScrollShowcase panel 5 (SPEC.md §7.2).
 *
 * Inverted progress tone (vs Budgets):
 *   "mono"     → screen-fg fill = on-track, default state
 *   "complete" → income-tinted fill = goal reached
 * No "warning" tone — being close to a savings goal is good news.
 *
 * Bottom nav has Profile active because Savings lives under the Profile
 * tab in the IA, not as its own root tab. Preserved from source.
 */

import { GOALS, formatRound } from "@/lib/sampleData";

const FG_95 = "var(--m-fg-95)";
const FG_90 = "var(--m-fg-90)";
const FG_55 = "var(--m-fg-55)";
const FG_50 = "var(--m-fg-50)";
const FG_40 = "var(--m-fg-40)";
const FG_06 = "var(--m-fg-06)";
const FG_08 = "var(--m-fg-08)";

type GoalState = "mono" | "complete";

export function Savings() {
  return (
    <>
      {/* Topbar — title + goal count (no period chip; savings span time) */}
      <div
        className="absolute flex items-center justify-between"
        style={{ top: 64, left: 24, right: 24 }}
      >
        <span style={{ fontSize: 18, fontWeight: 500, letterSpacing: -0.2 }}>
          Savings
        </span>
        <span style={{ fontSize: 12, color: FG_55 }}>{GOALS.length} goals</span>
      </div>

      {/* Hero — across your goals */}
      <div className="absolute" style={{ top: 124, left: 24, right: 24 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: 2.2,
            textTransform: "uppercase",
            color: FG_50,
          }}
        >
          Across your goals
        </div>
        <div
          style={{
            fontSize: 38,
            fontWeight: 500,
            letterSpacing: -0.8,
            marginTop: 10,
            lineHeight: 1,
            color: "var(--phone-screen-fg)",
          }}
        >
          {formatRound(GOALS.reduce((s, g) => s + g.saved, 0))}
          <span
            style={{
              fontSize: 18,
              fontWeight: 400,
              opacity: 0.5,
              marginLeft: 4,
            }}
          >
            of {formatRound(GOALS.reduce((s, g) => s + g.target, 0))}
          </span>
        </div>
        <div
          style={{
            height: 8,
            borderRadius: 4,
            marginTop: 16,
            overflow: "hidden",
            background: FG_08,
          }}
        >
          <div
            style={{
              height: "100%",
              borderRadius: 4,
              width: `${Math.round((GOALS.reduce((s, g) => s + g.saved, 0) / GOALS.reduce((s, g) => s + g.target, 0)) * 100)}%`,
              background: "var(--phone-screen-fg)",
            }}
          />
        </div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 400,
            marginTop: 10,
            color: FG_55,
          }}
        >
          {formatRound(GOALS.reduce((s, g) => s + g.target, 0) - GOALS.reduce((s, g) => s + g.saved, 0))} left across {GOALS.length} goals · {Math.round((GOALS.reduce((s, g) => s + g.saved, 0) / GOALS.reduce((s, g) => s + g.target, 0)) * 100)}%
        </div>
      </div>

      {/* Goal rows — driven by sampleData GOALS */}
      <div className="absolute" style={{ top: 266, left: 24, right: 24 }}>
        <GoalRow
          first
          name={GOALS[0].label}
          saved={formatRound(GOALS[0].saved)}
          target={formatRound(GOALS[0].target)}
          fillPct={Math.round((GOALS[0].saved / GOALS[0].target) * 100)}
          state={GOALS[0].saved >= GOALS[0].target ? "complete" : "mono"}
          targetLabel="Target Dec 2026"
          pctText={`${Math.round((GOALS[0].saved / GOALS[0].target) * 100)}%`}
        />
        <GoalRow
          name={GOALS[1].label}
          saved={formatRound(GOALS[1].saved)}
          target={formatRound(GOALS[1].target)}
          fillPct={Math.round((GOALS[1].saved / GOALS[1].target) * 100)}
          state={GOALS[1].saved >= GOALS[1].target ? "complete" : "mono"}
          targetLabel="Target Aug 2026"
          pctText={`${Math.round((GOALS[1].saved / GOALS[1].target) * 100)}%`}
        />
        <GoalRow
          name={GOALS[2].label}
          saved={formatRound(GOALS[2].saved)}
          target={formatRound(GOALS[2].target)}
          fillPct={Math.round((GOALS[2].saved / GOALS[2].target) * 100)}
          state={GOALS[2].saved >= GOALS[2].target ? "complete" : "mono"}
          targetLabel="Target Oct 2026"
          pctText={`${Math.round((GOALS[2].saved / GOALS[2].target) * 100)}%`}
        />
      </div>

      {/* FAB */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          bottom: 92,
          right: 22,
          width: 52,
          height: 52,
          borderRadius: 26,
          background: "var(--phone-screen-fg)",
          color: "var(--phone-screen)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </div>

      {/* Bottom nav (Profile active — Savings lives under Profile in the IA) */}
      <div
        className="absolute flex justify-around"
        style={{
          bottom: 0,
          left: 0,
          right: 0,
          height: 76,
          paddingTop: 14,
          borderTop: `1px solid ${FG_08}`,
          background: "var(--phone-screen)",
        }}
      >
        <NavItem label="Home"     icon={<path d="M3 12l9-9 9 9M5 10v10h14V10" />} />
        <NavItem label="Activity" icon={<path d="M4 7h16M4 12h16M4 17h10" />} />
        <NavItem label="Budgets"  icon={<><circle cx="12" cy="12" r="9" /><path d="M12 3v9l6 3" /></>} />
        <NavItem label="Insights" icon={<path d="M3 17l6-6 4 4 8-8" />} />
        <NavItem active label="Profile" icon={<><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-7 8-7s8 3 8 7" /></>} />
      </div>
    </>
  );
}

// ── Internals ──────────────────────────────────────────────────────────

function GoalRow({
  first = false,
  name,
  saved,
  target,
  fillPct,
  state,
  targetLabel,
  pctText,
}: {
  first?: boolean;
  name: string;
  saved: string;
  target: string;
  fillPct: number;
  state: GoalState;
  targetLabel: string;
  pctText: string;
}) {
  const fillBg =
    state === "complete" ? "var(--m-income)" : "var(--phone-screen-fg)";
  const pctColor = state === "complete" ? "var(--m-income)" : FG_50;

  return (
    <div
      style={{
        padding: "14px 0",
        borderTop: first ? "none" : `1px solid ${FG_06}`,
      }}
    >
      <div className="flex items-baseline justify-between">
        <span style={{ fontSize: 14, fontWeight: 500, color: FG_95 }}>
          {name}
        </span>
        <span style={{ fontSize: 13, fontWeight: 500, color: FG_90 }}>
          {saved}
          <span style={{ opacity: 0.5 }}> / {target}</span>
        </span>
      </div>
      <div
        style={{
          height: 3,
          borderRadius: 2,
          marginTop: 10,
          overflow: "hidden",
          background: FG_08,
        }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: 2,
            width: `${fillPct}%`,
            background: fillBg,
          }}
        />
      </div>
      <div
        className="flex justify-between"
        style={{
          marginTop: 6,
          fontSize: 11,
          fontWeight: 400,
          color: FG_50,
        }}
      >
        <span>{targetLabel}</span>
        <span style={{ color: pctColor }}>{pctText}</span>
      </div>
    </div>
  );
}

function NavItem({
  active = false,
  label,
  icon,
}: {
  active?: boolean;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      className="flex flex-col items-center"
      style={{
        gap: 4,
        fontSize: 10,
        fontWeight: 500,
        color: active ? "var(--phone-screen-fg)" : FG_40,
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {icon}
      </svg>
      <span>{label}</span>
    </div>
  );
}

export default Savings;
