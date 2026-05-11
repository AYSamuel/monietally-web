/**
 * Mirrors monietally/design-mockups/13-budgets.html (Populated, both variants).
 * Update both files when the design changes.
 *
 * Theming: follows the ambient theme via the --m-fg-XX, --phone-screen,
 * --phone-screen-fg, --m-expense, --gold tokens defined in globals.css.
 *
 * Used by: ScrollShowcase panel 4 (SPEC.md §7.2).
 *
 * State semantics:
 *   "normal" → screen-fg fill, neutral pct color
 *   "warn"   → gold fill, gold pct color (close to limit)
 *   "over"   → expense-tinted fill + pct color (over budget)
 */

import {
  MONTH_LABEL,
  BUDGETS,
  formatRound,
  formatAmount,
} from "@/lib/sampleData";

const FG_78 = "var(--m-fg-78)";
const FG_85 = "var(--m-fg-85)";
const FG_70 = "var(--m-fg-70)";
const FG_55 = "var(--m-fg-55)";
const FG_50 = "var(--m-fg-50)";
const FG_45 = "var(--m-fg-45)";
const FG_40 = "var(--m-fg-40)";
const FG_06 = "var(--m-fg-06)";
const FG_08 = "var(--m-fg-08)";
const FG_10 = "var(--m-fg-10)";

type CatState = "normal" | "warn" | "over";

const FILL_BG: Record<CatState, string> = {
  normal: "var(--phone-screen-fg)",
  warn: "var(--gold)",
  over: "var(--m-expense)",
};

export function Budgets() {
  return (
    <>
      {/* Topbar */}
      <div
        className="absolute flex items-center justify-between"
        style={{ top: 64, left: 24, right: 24 }}
      >
        <span style={{ fontSize: 18, fontWeight: 500, letterSpacing: -0.2 }}>
          Budgets
        </span>
        <span
          className="inline-flex items-center"
          style={{
            gap: 6,
            padding: "6px 12px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 500,
            background: FG_06,
            color: FG_85,
            border: `1px solid ${FG_10}`,
          }}
        >
          {MONTH_LABEL}
          <span style={{ fontSize: 9, opacity: 0.7 }}>▾</span>
        </span>
      </div>

      {/* Hero — total spent across budgets */}
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
          Across your budgets
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
          {formatRound(BUDGETS.reduce((s, b) => s + b.spent, 0))}
          <span
            style={{
              fontSize: 18,
              fontWeight: 400,
              opacity: 0.5,
              marginLeft: 4,
            }}
          >
            of {formatRound(BUDGETS.reduce((s, b) => s + b.cap, 0))}
          </span>
        </div>
        {/* Top-level progress bar — 8px (per source's inline override). */}
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
              borderRadius: 2,
              width: `${Math.round((BUDGETS.reduce((s, b) => s + b.spent, 0) / BUDGETS.reduce((s, b) => s + b.cap, 0)) * 100)}%`,
              background: "var(--phone-screen-fg)",
            }}
          />
        </div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 400,
            marginTop: 10,
            color: FG_55,
          }}
        >
          {formatRound(BUDGETS.reduce((s, b) => s + b.cap, 0) - BUDGETS.reduce((s, b) => s + b.spent, 0))} left across {BUDGETS.length} budgets · {Math.round((BUDGETS.reduce((s, b) => s + b.spent, 0) / BUDGETS.reduce((s, b) => s + b.cap, 0)) * 100)}%
        </div>
      </div>

      {/* Section label */}
      <div
        className="absolute"
        style={{
          top: 300,
          left: 24,
          right: 24,
          fontSize: 11,
          letterSpacing: 2.2,
          textTransform: "uppercase",
          fontWeight: 500,
          color: FG_50,
        }}
      >
        Categories
      </div>

      {/* Category list — driven by sampleData BUDGETS */}
      <div className="absolute" style={{ top: 328, left: 24, right: 24 }}>
        <CatRow
          first
          name={BUDGETS[0].label}
          right={formatRound(BUDGETS[0].spent)}
          ofText={` of ${formatRound(BUDGETS[0].cap)}`}
          fillPct={Math.round((BUDGETS[0].spent / BUDGETS[0].cap) * 100)}
          state={BUDGETS[0].spent / BUDGETS[0].cap >= 1 ? "over" : BUDGETS[0].spent / BUDGETS[0].cap >= 0.8 ? "warn" : "normal"}
          pctText={BUDGETS[0].spent / BUDGETS[0].cap >= 1 ? `${formatRound(BUDGETS[0].spent - BUDGETS[0].cap)} over · ${Math.round((BUDGETS[0].spent / BUDGETS[0].cap) * 100)}%` : BUDGETS[0].spent / BUDGETS[0].cap >= 0.8 ? `${Math.round((BUDGETS[0].spent / BUDGETS[0].cap) * 100)}% · close to limit` : `${Math.round((BUDGETS[0].spent / BUDGETS[0].cap) * 100)}%`}
          icon={
            <>
              <circle cx="9" cy="20" r="1.4" />
              <circle cx="18" cy="20" r="1.4" />
              <path d="M3 4h2l3 12h11l2-8H6" />
            </>
          }
        />
        <CatRow
          name={BUDGETS[1].label}
          right={formatRound(BUDGETS[1].spent)}
          ofText={` of ${formatRound(BUDGETS[1].cap)}`}
          fillPct={Math.round((BUDGETS[1].spent / BUDGETS[1].cap) * 100)}
          state={BUDGETS[1].spent / BUDGETS[1].cap >= 1 ? "over" : BUDGETS[1].spent / BUDGETS[1].cap >= 0.8 ? "warn" : "normal"}
          pctText={BUDGETS[1].spent / BUDGETS[1].cap >= 1 ? `${formatRound(BUDGETS[1].spent - BUDGETS[1].cap)} over · ${Math.round((BUDGETS[1].spent / BUDGETS[1].cap) * 100)}%` : BUDGETS[1].spent / BUDGETS[1].cap >= 0.8 ? `${Math.round((BUDGETS[1].spent / BUDGETS[1].cap) * 100)}% · close to limit` : `${Math.round((BUDGETS[1].spent / BUDGETS[1].cap) * 100)}%`}
          icon={
            <path d="M17 8h1a3 3 0 010 6h-1M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z" />
          }
        />
        <CatRow
          name={BUDGETS[2].label}
          right={formatRound(BUDGETS[2].spent)}
          ofText={` of ${formatRound(BUDGETS[2].cap)}`}
          fillPct={Math.round((BUDGETS[2].spent / BUDGETS[2].cap) * 100)}
          state={BUDGETS[2].spent / BUDGETS[2].cap >= 1 ? "over" : BUDGETS[2].spent / BUDGETS[2].cap >= 0.8 ? "warn" : "normal"}
          pctText={BUDGETS[2].spent / BUDGETS[2].cap >= 1 ? `${formatRound(BUDGETS[2].spent - BUDGETS[2].cap)} over · ${Math.round((BUDGETS[2].spent / BUDGETS[2].cap) * 100)}%` : BUDGETS[2].spent / BUDGETS[2].cap >= 0.8 ? `${Math.round((BUDGETS[2].spent / BUDGETS[2].cap) * 100)}% · close to limit` : `${Math.round((BUDGETS[2].spent / BUDGETS[2].cap) * 100)}%`}
          icon={
            <>
              <path d="M5 17h14M7 17l-3-9h16l-3 9" />
              <circle cx="12" cy="6" r="2" />
            </>
          }
        />
        <CatRow
          name={BUDGETS[3].label}
          right={formatRound(BUDGETS[3].spent)}
          ofText={` of ${formatRound(BUDGETS[3].cap)}`}
          fillPct={Math.round((BUDGETS[3].spent / BUDGETS[3].cap) * 100)}
          state={BUDGETS[3].spent / BUDGETS[3].cap >= 1 ? "over" : BUDGETS[3].spent / BUDGETS[3].cap >= 0.8 ? "warn" : "normal"}
          pctText={BUDGETS[3].spent / BUDGETS[3].cap >= 1 ? `${formatRound(BUDGETS[3].spent - BUDGETS[3].cap)} over · ${Math.round((BUDGETS[3].spent / BUDGETS[3].cap) * 100)}%` : BUDGETS[3].spent / BUDGETS[3].cap >= 0.8 ? `${Math.round((BUDGETS[3].spent / BUDGETS[3].cap) * 100)}% · close to limit` : `${Math.round((BUDGETS[3].spent / BUDGETS[3].cap) * 100)}%`}
          icon={
            <>
              <path d="M3 10v10h18V10" />
              <path d="M2 7l10-4 10 4" />
              <path d="M9 22V12h6v10" />
            </>
          }
        />

        {/* Unbudgeted footer */}
        <div
          className="flex items-center"
          style={{ marginTop: 14, padding: "10px 0" }}
        >
          <div style={{ flex: 1, fontSize: 13, color: FG_55 }}>
            4 categories without budgets
          </div>
          <div style={{ fontSize: 13, fontWeight: 500, color: FG_78 }}>
            Set one
          </div>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke={FG_78}
            strokeWidth="2"
            style={{ marginLeft: 4 }}
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </div>
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
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </div>

      {/* Bottom nav (Budgets active) */}
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
        <NavItem active label="Budgets" icon={<><circle cx="12" cy="12" r="9" /><path d="M12 3v9l6 3" /></>} />
        <NavItem label="Insights" icon={<path d="M3 17l6-6 4 4 8-8" />} />
        <NavItem label="Profile"  icon={<><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-7 8-7s8 3 8 7" /></>} />
      </div>
    </>
  );
}

// ── Internals ──────────────────────────────────────────────────────────

function CatRow({
  first = false,
  name,
  right,
  ofText,
  fillPct,
  state,
  pctText,
  icon,
}: {
  first?: boolean;
  name: string;
  right: string;
  ofText: string;
  fillPct: number;
  state: CatState;
  pctText: string;
  icon: React.ReactNode;
}) {
  const pctColor =
    state === "over"
      ? "var(--m-expense)"
      : state === "warn"
        ? "var(--gold)"
        : FG_45;
  const pctWeight = state === "normal" ? 400 : 500;

  return (
    <div
      style={{
        padding: "14px 0",
        borderTop: first ? "none" : `1px solid ${FG_06}`,
      }}
    >
      <div
        className="flex items-center justify-between"
        style={{ marginBottom: 8 }}
      >
        <div className="flex items-center" style={{ gap: 12 }}>
          <div
            className="flex items-center justify-center"
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: FG_06,
              color: FG_70,
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {icon}
            </svg>
          </div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>{name}</div>
        </div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: -0.1,
            color: "var(--phone-screen-fg)",
          }}
        >
          {right}
          <span style={{ opacity: 0.5, fontWeight: 400 }}>{ofText}</span>
        </div>
      </div>
      {/* Track + fill (track sits inset by the icon column) */}
      <div
        style={{
          height: 3,
          borderRadius: 2,
          overflow: "hidden",
          marginLeft: 44,
          background: FG_08,
        }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: 2,
            width: `${fillPct}%`,
            background: FILL_BG[state],
          }}
        />
      </div>
      <div
        style={{
          fontSize: 11,
          marginTop: 6,
          marginLeft: 44,
          color: pctColor,
          fontWeight: pctWeight,
        }}
      >
        {pctText}
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

export default Budgets;
