/**
 * Mirrors monietally/design-mockups/10-home.html (populated variant).
 * Update both files when the design changes.
 *
 * The screen is a fixed 320×696 surface inside <PhoneFrame>. Every child
 * is absolutely positioned at the exact pixel coordinates from the source
 * CSS (`.topbar { top: 64px }`, `.txn-1 { top: 384px }`, etc.) so the
 * port reads at the same layout as the design canon.
 *
 * Theming: this port follows the ambient theme via the --m-fg-XX tokens
 * and --phone-screen-fg / --phone-screen / --m-income tokens defined in
 * globals.css. Wrap in <PhoneFrame forceDark> or <PhoneFrame forceLight>
 * to lock the variant.
 *
 * Used by: ScrollShowcase panel 1 (SPEC.md §7.2), HowItWorks step 3
 * (SPEC.md §12).
 */

import {
  MONTH_LABEL,
  NET_LEFT,
  TOTAL_INCOME,
  TOTAL_SPENT,
  RECENT_TRANSACTIONS,
  formatAmount,
} from "@/lib/sampleData";

const FG_50 = "var(--m-fg-50)";
const FG_55 = "var(--m-fg-55)";
const FG_70 = "var(--m-fg-70)";
const FG_85 = "var(--m-fg-85)";
const FG_06 = "var(--m-fg-06)";
const FG_08 = "var(--m-fg-08)";
const FG_10 = "var(--m-fg-10)";
const FG_45 = "var(--m-fg-45)";
const FG_40 = "var(--m-fg-40)";

export function HomePopulated() {
  return (
    <>
      {/* Topbar — greeting + period chip. No wordmark on home (intentional). */}
      <div
        className="absolute flex items-center justify-between"
        style={{ top: 64, left: 24, right: 24 }}
      >
        <span style={{ fontSize: 14, fontWeight: 400, color: FG_70 }}>
          Hi, Vick.
        </span>
        <span
          className="inline-flex items-center"
          style={{
            gap: 6,
            padding: "6px 12px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: 0.2,
            background: FG_06,
            color: FG_85,
            border: `1px solid ${FG_10}`,
          }}
        >
          {MONTH_LABEL}
          <span style={{ fontSize: 9, opacity: 0.7 }}>▾</span>
        </span>
      </div>

      {/* Hero — Left this month */}
      <div className="absolute" style={{ top: 124, left: 24, right: 24 }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: 2.2,
            textTransform: "uppercase",
            color: FG_50,
          }}
        >
          Left this month
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 46,
            fontWeight: 500,
            letterSpacing: -0.8,
            lineHeight: 1,
            color: "var(--phone-screen-fg)",
          }}
        >
          +{formatAmount(NET_LEFT)}
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 12,
            fontWeight: 400,
            letterSpacing: 0.1,
            color: FG_55,
          }}
        >
          <span
            style={{
              display: "inline-block",
              fontSize: 10,
              marginRight: 4,
              transform: "translateY(-1px)",
              color: "var(--m-income)",
            }}
          >
            ▲
          </span>
          €340 vs April
        </div>
      </div>

      {/* Divider 1 */}
      <div
        className="absolute"
        style={{ top: 240, left: 24, right: 24, height: 1, background: FG_08 }}
      />

      {/* Income / Spent split */}
      <div
        className="absolute flex"
        style={{ top: 258, left: 24, right: 24, gap: 24 }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: 2.2,
              textTransform: "uppercase",
              color: FG_50,
            }}
          >
            Income
          </div>
          <div
            style={{
              marginTop: 6,
              fontSize: 18,
              fontWeight: 500,
              letterSpacing: -0.2,
              lineHeight: 1.2,
              color: "var(--m-income)",
            }}
          >
            {formatAmount(TOTAL_INCOME)}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: 2.2,
              textTransform: "uppercase",
              color: FG_50,
            }}
          >
            Spent
          </div>
          <div
            style={{
              marginTop: 6,
              fontSize: 18,
              fontWeight: 500,
              letterSpacing: -0.2,
              lineHeight: 1.2,
              color: "var(--phone-screen-fg)",
            }}
          >
            {formatAmount(TOTAL_SPENT)}
          </div>
        </div>
      </div>

      {/* Divider 2 */}
      <div
        className="absolute"
        style={{ top: 320, left: 24, right: 24, height: 1, background: FG_08 }}
      />

      {/* Recent header */}
      <div
        className="absolute flex items-center justify-between"
        style={{ top: 346, left: 24, right: 24 }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: 2.2,
            textTransform: "uppercase",
            color: FG_50,
          }}
        >
          Recent
        </span>
        <span style={{ fontSize: 12, fontWeight: 500, color: FG_70 }}>
          View all →
        </span>
      </div>

      {/* Transactions — first 4 from sampleData */}
      <Txn
        top={384}
        first
        income={RECENT_TRANSACTIONS[2].amount > 0}
        name={RECENT_TRANSACTIONS[2].merchant}
        date="May 8"
        amount={formatAmount(RECENT_TRANSACTIONS[2].amount)}
        icon={<path d="M12 4v16M5 13l7 7 7-7" />}
      />
      <Txn
        top={432}
        name={RECENT_TRANSACTIONS[0].merchant}
        date="May 9"
        amount={formatAmount(RECENT_TRANSACTIONS[0].amount)}
        icon={
          <path d="M17 8h1a3 3 0 010 6h-1M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z" />
        }
      />
      <Txn
        top={480}
        name={RECENT_TRANSACTIONS[1].merchant}
        date="May 9"
        amount={formatAmount(RECENT_TRANSACTIONS[1].amount)}
        icon={
          <>
            <circle cx="9" cy="20" r="1.4" />
            <circle cx="18" cy="20" r="1.4" />
            <path d="M3 4h2l3 12h11l2-8H6" />
          </>
        }
      />
      <Txn
        top={528}
        name={RECENT_TRANSACTIONS[6].merchant}
        date="May 5"
        amount={formatAmount(RECENT_TRANSACTIONS[6].amount)}
        icon={
          <>
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </>
        }
      />

      {/* FAB — quick add. The bg/color invert vs the screen, so they read
          as the foreground/screen tokens (cream FAB on ink in dark, ink
          FAB on cream-soft in light). */}
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

      {/* Bottom nav */}
      <div
        className="absolute flex items-start justify-around"
        style={{
          bottom: 0,
          left: 0,
          right: 0,
          height: 76,
          paddingTop: 14,
          paddingBottom: 12,
          borderTop: `1px solid ${FG_08}`,
          background: "var(--phone-screen)",
        }}
      >
        <NavItem
          active
          label="Home"
          icon={<path d="M3 12l9-9 9 9M5 10v10h14V10" />}
        />
        <NavItem
          label="Activity"
          icon={<path d="M4 7h16M4 12h16M4 17h10" />}
        />
        <NavItem
          label="Budgets"
          icon={
            <>
              <circle cx="12" cy="12" r="9" />
              <path d="M12 3v9l6 3" />
            </>
          }
        />
        <NavItem
          label="Insights"
          icon={<path d="M3 17l6-6 4 4 8-8" />}
        />
        <NavItem
          label="Profile"
          icon={
            <>
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
            </>
          }
        />
      </div>
    </>
  );
}

// ── Internals ──────────────────────────────────────────────────────────

function Txn({
  top,
  income = false,
  first = false,
  name,
  date,
  amount,
  icon,
}: {
  top: number;
  income?: boolean;
  first?: boolean;
  name: string;
  date: string;
  amount: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      className="absolute flex items-center justify-between"
      style={{
        top,
        left: 24,
        right: 24,
        padding: "12px 0",
        borderTop: first ? "none" : `1px solid ${FG_06}`,
      }}
    >
      <div className="flex items-center" style={{ gap: 12, flex: 1, minWidth: 0 }}>
        <div
          className="flex items-center justify-center"
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            flexShrink: 0,
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
        <div className="flex flex-col" style={{ gap: 2, minWidth: 0 }}>
          <span
            style={{
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: 0.05,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {name}
          </span>
          <span style={{ fontSize: 11, fontWeight: 400, color: FG_45 }}>
            {date}
          </span>
        </div>
      </div>
      <span
        style={{
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: -0.1,
          marginLeft: 12,
          flexShrink: 0,
          color: income ? "var(--m-income)" : "var(--phone-screen-fg)",
        }}
      >
        {amount}
      </span>
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
        letterSpacing: 0.4,
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

export default HomePopulated;
