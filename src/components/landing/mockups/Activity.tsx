/**
 * Mirrors monietally/design-mockups/11-activity.html (Activity, both variants).
 * Update both files when the design changes.
 *
 * Theming: this port follows the ambient theme via the --m-fg-XX tokens
 * and --phone-screen-fg / --phone-screen / --m-income tokens defined in
 * globals.css. Wrap in <PhoneFrame forceDark> or <PhoneFrame forceLight>
 * to lock the variant.
 *
 * Used by: ScrollShowcase panel 2 (SPEC.md §7.2).
 */

import { MONTH_LABEL } from "@/lib/sampleData";

const FG_72 = "var(--m-fg-72)";
const FG_70 = "var(--m-fg-70)";
const FG_55 = "var(--m-fg-55)";
const FG_50 = "var(--m-fg-50)";
const FG_45 = "var(--m-fg-45)";
const FG_40 = "var(--m-fg-40)";
const FG_85 = "var(--m-fg-85)";
const FG_06 = "var(--m-fg-06)";
const FG_10 = "var(--m-fg-10)";
const FG_08 = "var(--m-fg-08)";
const FG_04 = "var(--m-fg-04)";

export function Activity() {
  return (
    <>
      {/* Topbar — title + period chip + filter button with gold dot */}
      <div
        className="absolute flex items-center justify-between"
        style={{ top: 64, left: 24, right: 24 }}
      >
        <div style={{ fontSize: 18, fontWeight: 500, letterSpacing: -0.2 }}>
          Activity
        </div>
        <div className="flex items-center" style={{ gap: 10 }}>
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
            {MONTH_LABEL} ▾
          </span>
          {/* Filter button with gold dot indicator */}
          <div
            className="relative flex items-center justify-center"
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              color: FG_72,
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
              <line x1="4" y1="6" x2="9" y2="6" />
              <line x1="13" y1="6" x2="20" y2="6" />
              <circle cx="11" cy="6" r="2" />
              <line x1="4" y1="12" x2="14" y2="12" />
              <line x1="18" y1="12" x2="20" y2="12" />
              <circle cx="16" cy="12" r="2" />
              <line x1="4" y1="18" x2="9" y2="18" />
              <line x1="13" y1="18" x2="20" y2="18" />
              <circle cx="11" cy="18" r="2" />
            </svg>
            <span
              className="absolute"
              style={{
                top: 6,
                right: 6,
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--gold)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div
        className="absolute flex items-center"
        style={{
          top: 110,
          left: 24,
          right: 24,
          gap: 10,
          height: 40,
          borderRadius: 12,
          padding: "0 14px",
          background: FG_04,
          border: `1px solid ${FG_10}`,
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke={FG_50}
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        <span style={{ fontSize: 13, color: FG_45 }}>
          Search transactions
        </span>
      </div>

      {/* List */}
      <div
        className="absolute"
        style={{ top: 168, bottom: 80, left: 24, right: 24, overflow: "hidden" }}
      >
        <DayHead label="Thursday, May 14" />
        <Txn
          first
          name="Groceries"
          cat="Food"
          amount="−€67.20"
          icon={
            <>
              <circle cx="9" cy="20" r="1.4" />
              <circle cx="18" cy="20" r="1.4" />
              <path d="M3 4h2l3 12h11l2-8H6" />
            </>
          }
        />
        <Txn
          name="Coffee shop"
          cat="Food"
          amount="−€4.50"
          icon={
            <path d="M17 8h1a3 3 0 010 6h-1M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z" />
          }
        />

        <DayHead label="Wednesday, May 13" />
        <Txn
          first
          name="Rent"
          cat="Bills"
          amount="−€1,200.00"
          icon={
            <>
              <path d="M3 10v10h18V10" />
              <path d="M2 7l10-4 10 4" />
              <path d="M9 22V12h6v10" />
            </>
          }
        />

        <DayHead label="Sunday, May 1" />
        <Txn
          first
          income
          name="Salary"
          cat="Income"
          amount="+€3,200.00"
          icon={<path d="M12 4v16M5 13l7 7 7-7" />}
        />
        <Txn
          name="Spotify"
          cat="Subscriptions"
          amount="−€9.99"
          icon={
            <>
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </>
          }
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

      {/* Bottom nav (Activity active) */}
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
        <NavItem label="Home" icon={<path d="M3 12l9-9 9 9M5 10v10h14V10" />} />
        <NavItem
          active
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
        <NavItem label="Insights" icon={<path d="M3 17l6-6 4 4 8-8" />} />
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

function DayHead({ label }: { label: string }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 500,
        letterSpacing: 2.2,
        textTransform: "uppercase",
        padding: "16px 0 8px",
        color: FG_55,
      }}
    >
      {label}
    </div>
  );
}

function Txn({
  first = false,
  income = false,
  name,
  cat,
  amount,
  icon,
}: {
  first?: boolean;
  income?: boolean;
  name: string;
  cat: string;
  amount: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center justify-between"
      style={{
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
            {cat}
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

export default Activity;
