/**
 * Mirrors monietally/design-mockups/14-insights.html (Insights overview, both variants).
 * Update both files when the design changes.
 *
 * Theming: follows the ambient theme via the --m-fg-XX tokens and
 * --phone-screen-fg / --m-income tokens defined in globals.css.
 *
 * i18n: chrome + category labels come from the "mockups" namespace; amounts
 * and the period chip format in the active locale (useLocale).
 *
 * Chart palette is the locked Phase 5.5 set from the source mockup:
 *   slate #5A7BB8, clay #B5715A, plum #8E6F8B, sage #8FA88F, gold #C9A66B.
 * These encode category identity in the donut + legend, so they're inlined
 * here rather than living in globals.css. They read on both themes.
 */

import { useLocale, useTranslations } from "next-intl";
import {
  MONTH_DATE,
  PREV_MONTH_DATE,
  TOTAL_SPENT,
  CATEGORIES,
  formatRound,
  formatMonthYear,
  formatMonthLong,
} from "@/lib/sampleData";

const FG_90 = "var(--m-fg-90)";
const FG_85 = "var(--m-fg-85)";
const FG_78 = "var(--m-fg-78)";
const FG_55 = "var(--m-fg-55)";
const FG_50 = "var(--m-fg-50)";
const FG_40 = "var(--m-fg-40)";
const FG_06 = "var(--m-fg-06)";
const FG_08 = "var(--m-fg-08)";
const FG_10 = "var(--m-fg-10)";
const FG_05 = "var(--m-fg-05)";

const CHART = {
  slate: "#5A7BB8",
  clay: "#B5715A",
  plum: "#8E6F8B",
  sage: "#8FA88F",
  gold: "#C9A66B",
};

export function Insights() {
  const locale = useLocale();
  const t = useTranslations("mockups");
  const pct = (spent: number) => `${Math.round((spent / TOTAL_SPENT) * 100)}%`;

  return (
    <>
      {/* Topbar */}
      <div
        className="absolute flex items-center justify-between"
        style={{ top: 64, left: 24, right: 24 }}
      >
        <span style={{ fontSize: 18, fontWeight: 500, letterSpacing: -0.2 }}>
          {t("insights.title")}
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
          {formatMonthYear(MONTH_DATE, locale)}
          <span style={{ fontSize: 9, opacity: 0.7 }}>▾</span>
        </span>
      </div>

      {/* Hero section — donut + stacked legend */}
      <div
        className="absolute"
        style={{ top: 116, left: 24, right: 24, textAlign: "center" }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: 2.2,
            textTransform: "uppercase",
            color: FG_50,
          }}
        >
          {t("insights.whereItWent")}
        </div>

        {/* Donut */}
        <div
          className="relative"
          style={{ width: 180, height: 180, margin: "14px auto 0" }}
        >
          <svg
            viewBox="0 0 100 100"
            style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}
          >
            {/* Track */}
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              strokeWidth="26"
              stroke={FG_05}
            />
            {/* Segments. Circumference 2π·42 ≈ 263.89. */}
            <circle cx="50" cy="50" r="42" fill="none" strokeWidth="26" stroke={CHART.slate} strokeDasharray="103.0 264.1" strokeDashoffset="0" />
            <circle cx="50" cy="50" r="42" fill="none" strokeWidth="26" stroke={CHART.clay}  strokeDasharray="73.9 264.1"  strokeDashoffset="-103.0" />
            <circle cx="50" cy="50" r="42" fill="none" strokeWidth="26" stroke={CHART.plum}  strokeDasharray="39.6 264.1"  strokeDashoffset="-176.9" />
            <circle cx="50" cy="50" r="42" fill="none" strokeWidth="26" stroke={CHART.sage}  strokeDasharray="26.4 264.1"  strokeDashoffset="-216.5" />
            <circle cx="50" cy="50" r="42" fill="none" strokeWidth="26" stroke={CHART.gold}  strokeDasharray="10.6 264.1"  strokeDashoffset="-242.9" />
            <circle cx="50" cy="50" r="42" fill="none" strokeWidth="26" stroke={FG_55}        strokeDasharray="10.6 264.1"  strokeDashoffset="-253.5" />
          </svg>
          {/* Center label */}
          <div
            className="absolute flex flex-col items-center justify-center"
            style={{ inset: 0 }}
          >
            <div
              style={{
                fontSize: 9,
                letterSpacing: 1.6,
                textTransform: "uppercase",
                fontWeight: 500,
                color: FG_50,
              }}
            >
              {t("insights.spent")}
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 500,
                letterSpacing: -0.6,
              }}
            >
              {formatRound(TOTAL_SPENT, locale)}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div
          className="flex flex-col"
          style={{ marginTop: 18, gap: 8, textAlign: "left" }}
        >
          <LegendRow color={CHART.slate} name={t(`categories.${CATEGORIES[0].id}`)} amount={formatRound(CATEGORIES[0].spent, locale)} pct={pct(CATEGORIES[0].spent)} />
          <LegendRow color={CHART.clay}  name={t(`categories.${CATEGORIES[2].id}`)} amount={formatRound(CATEGORIES[2].spent, locale)} pct={pct(CATEGORIES[2].spent)} />
          <LegendRow color={CHART.plum}  name={t(`categories.${CATEGORIES[7].id}`)} amount={formatRound(CATEGORIES[7].spent, locale)} pct={pct(CATEGORIES[7].spent)} />
        </div>

        {/* View all categories link */}
        <div
          className="flex items-center"
          style={{
            marginTop: 10,
            padding: "6px 0",
            fontSize: 12,
            fontWeight: 500,
            gap: 4,
            color: FG_78,
          }}
        >
          {t("insights.viewAllCategories", { count: 6 })}
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </div>
      </div>

      {/* Divider */}
      <div
        className="absolute"
        style={{ top: 498, left: 24, right: 24, height: 1, background: FG_08 }}
      />

      {/* Trend module */}
      <div className="absolute" style={{ top: 516, left: 24, right: 24 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: 2.2,
            textTransform: "uppercase",
            color: FG_50,
          }}
        >
          {t("insights.trend")}
          <span style={{ float: "right" }}>{t("insights.view")}</span>
        </div>
        <div
          className="flex items-center justify-between"
          style={{ marginTop: 8 }}
        >
          <div>
            <div style={{ fontSize: 18, fontWeight: 500, letterSpacing: -0.2 }}>
              {t("insights.thisMonth", { amount: formatRound(TOTAL_SPENT, locale) })}
            </div>
            <div
              style={{
                fontSize: 12,
                marginTop: 2,
                opacity: 0.7,
                color: "var(--m-income)",
              }}
            >
              {t("insights.vsPrev", { pct: "8%", month: formatMonthLong(PREV_MONTH_DATE, locale) })}
            </div>
          </div>
          {/* Sparkline */}
          <svg
            viewBox="0 0 120 36"
            style={{ width: 120, height: 36 }}
            preserveAspectRatio="none"
          >
            <path
              d="M 0 24 L 20 18 L 40 26 L 60 14 L 80 22 L 100 8 L 120 16 L 120 36 L 0 36 Z"
              fill={FG_08}
              stroke="none"
            />
            <path
              d="M 0 24 L 20 18 L 40 26 L 60 14 L 80 22 L 100 8 L 120 16"
              fill="none"
              stroke="var(--phone-screen-fg)"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Bottom nav (Insights active) */}
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
        <NavItem label={t("nav.home")}     icon={<path d="M3 12l9-9 9 9M5 10v10h14V10" />} />
        <NavItem label={t("nav.activity")} icon={<path d="M4 7h16M4 12h16M4 17h10" />} />
        <NavItem label={t("nav.budgets")}  icon={<><circle cx="12" cy="12" r="9" /><path d="M12 3v9l6 3" /></>} />
        <NavItem active label={t("nav.insights")} icon={<path d="M3 17l6-6 4 4 8-8" />} />
        <NavItem label={t("nav.profile")}  icon={<><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-7 8-7s8 3 8 7" /></>} />
      </div>
    </>
  );
}

// ── Internals ──────────────────────────────────────────────────────────

function LegendRow({
  color,
  name,
  amount,
  pct,
}: {
  color: string;
  name: string;
  amount: string;
  pct: string;
}) {
  return (
    <div className="flex items-center" style={{ gap: 10, fontSize: 13 }}>
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: 2,
          flexShrink: 0,
          background: color,
        }}
      />
      <div style={{ flex: 1, fontWeight: 500, color: FG_90 }}>{name}</div>
      <div style={{ fontWeight: 500 }}>{amount}</div>
      <div
        style={{
          minWidth: 36,
          textAlign: "right",
          fontSize: 11,
          fontWeight: 400,
          color: FG_50,
        }}
      >
        {pct}
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

export default Insights;
