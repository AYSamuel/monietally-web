/**
 * Shared sample dataset for landing-page phone mockups.
 *
 * Why this exists: the ScrollShowcase pins one phone and morphs it through
 * five screens (Home → Activity → Insights → Budgets → Savings). For the
 * effect to feel like one consistent product, every phone has to render
 * the same numbers. If Home says "€2,847 left this month" and Activity
 * shows transactions that sum to a different total, the illusion breaks.
 *
 * One file, one story:
 *   month       = May 2026
 *   income      = €4,694.50
 *   spent       = €1,847.00
 *   net         = €2,847.50  ← anchor number, see SPEC.md §1, §9
 *
 * All categories, transactions, budgets, and goals derive from those four
 * anchors. If you change a number here, run a sanity check that the totals
 * in CATEGORIES still match `spent`, and that BUDGETS still reflect the
 * same monthly slice.
 *
 * Privacy: this is fake data. No real user information lives here.
 */

export type SampleCategory = {
  id: string;
  label: string;
  spent: number;
  /** Hex color for the slice/dot. Kept as raw hex because the mockup ports
   * mirror the in-app palette (which is hex-defined in app_colors.dart),
   * not the website's theme tokens. */
  color: string;
  /** Lucide-style icon hint. The mockup ports map this to inline SVG. */
  icon:
    | "cart"
    | "coffee"
    | "bus"
    | "home"
    | "bolt"
    | "phone"
    | "shopping"
    | "more";
};

export type SampleTransaction = {
  id: string;
  /** ISO date (YYYY-MM-DD). The mockup ports format for display. */
  date: string;
  time: string;
  merchant: string;
  category: string;
  /** Negative for spend, positive for income. */
  amount: number;
  icon: SampleCategory["icon"];
  color: string;
};

export type SampleBudget = {
  id: string;
  label: string;
  cap: number;
  spent: number;
  color: string;
};

export type SampleGoal = {
  id: string;
  label: string;
  target: number;
  saved: number;
  color: string;
};

// ── Anchors ──────────────────────────────────────────────────────────────
export const CURRENCY = "EUR";

/** The sample month every phone renders (May 2026). Built from explicit parts
 * so Intl date formatting is timezone-stable (no UTC midnight drift). */
export const MONTH_DATE = new Date(2026, 4, 1);
/** Previous month, used by the "vs <month>" deltas on Home/Insights. */
export const PREV_MONTH_DATE = new Date(2026, 3, 1);

export const TOTAL_INCOME = 4694.5;
export const TOTAL_SPENT = 1847.0;
export const NET_LEFT = 2847.5; // TOTAL_INCOME - TOTAL_SPENT

// ── Category breakdown (sums to TOTAL_SPENT) ────────────────────────────
// 412 + 268 + 324 + 241 + 183 + 78 + 52 + 289 = 1847
// Colors pulled from MONIETALLY_DESIGN.md §2.1 + §2.2 (muted editorial palette).
// Functional reds/greens are reserved for income/expense; categories use
// muted accents: gold, slate, ink-line, expense-tinted, etc.
export const CATEGORIES: SampleCategory[] = [
  { id: "groceries",     label: "Groceries",     spent: 412, color: "#2D8B5C", icon: "cart" },
  { id: "dining",        label: "Dining",        spent: 268, color: "#B8503C", icon: "coffee" },
  { id: "bills",         label: "Bills",         spent: 324, color: "#5A7BB8", icon: "bolt" },
  { id: "shopping",      label: "Shopping",      spent: 241, color: "#C9A66B", icon: "shopping" },
  { id: "transport",     label: "Transport",     spent: 183, color: "#7A8FA8", icon: "bus" },
  { id: "subscriptions", label: "Subscriptions", spent: 78,  color: "#9C7CB8", icon: "phone" },
  { id: "coffee",        label: "Coffee",        spent: 52,  color: "#A8723F", icon: "coffee" },
  { id: "other",         label: "Other",         spent: 289, color: "#6B7280", icon: "more" },
];

// ── Recent transactions (newest first) ──────────────────────────────────
// Mix of the most recent days. The ones tagged with their category color
// match CATEGORIES so colors are consistent across phones.
export const RECENT_TRANSACTIONS: SampleTransaction[] = [
  { id: "tx-01", date: "2026-05-09", time: "9:14 AM",  merchant: "The Barn",      category: "Coffee",    amount: -5.40,    icon: "coffee",   color: "#A8723F" },
  { id: "tx-02", date: "2026-05-09", time: "8:02 AM",  merchant: "REWE",          category: "Groceries", amount: -48.21,   icon: "cart",     color: "#2D8B5C" },
  { id: "tx-03", date: "2026-05-08", time: "6:30 PM",  merchant: "Stripe payout", category: "Income",    amount: 1240.00,  icon: "bolt",     color: "#2D8B5C" },
  { id: "tx-04", date: "2026-05-08", time: "12:48 PM", merchant: "BVG",           category: "Transport", amount: -2.90,    icon: "bus",      color: "#7A8FA8" },
  { id: "tx-05", date: "2026-05-07", time: "8:20 PM",  merchant: "Trattoria Roma",category: "Dining",    amount: -42.10,   icon: "coffee",   color: "#B8503C" },
  { id: "tx-06", date: "2026-05-06", time: "2:15 PM",  merchant: "Uniqlo",        category: "Shopping",  amount: -68.00,   icon: "shopping", color: "#C9A66B" },
  { id: "tx-07", date: "2026-05-05", time: "9:00 AM",  merchant: "Spotify",       category: "Subscriptions", amount: -11.99, icon: "phone",  color: "#9C7CB8" },
  { id: "tx-08", date: "2026-05-01", time: "9:00 AM",  merchant: "Rent",          category: "Housing",   amount: -1850.00, icon: "home",     color: "#5A7BB8" },
];

// ── Budgets (slice of the monthly story, not all categories) ────────────
export const BUDGETS: SampleBudget[] = [
  { id: "b-groceries", label: "Groceries", cap: 500, spent: 412, color: "#2D8B5C" },
  { id: "b-dining",    label: "Dining",    cap: 300, spent: 268, color: "#B8503C" },
  { id: "b-transport", label: "Transport", cap: 200, spent: 183, color: "#7A8FA8" },
  { id: "b-shopping",  label: "Shopping",  cap: 250, spent: 241, color: "#C9A66B" },
];

// ── Savings goals ───────────────────────────────────────────────────────
export const GOALS: SampleGoal[] = [
  { id: "g-emergency", label: "Emergency fund", target: 5000, saved: 3200, color: "#2D8B5C" },
  { id: "g-lisbon",    label: "Trip to Lisbon", target: 1500, saved: 620,  color: "#C9A66B" },
  { id: "g-camera",    label: "New camera",     target: 1200, saved: 280,  color: "#B8503C" },
];

// ── Spending trend (last 7 weekly buckets, oldest → newest) ─────────────
// Used by the Insights phone for the trend sparkline. Newest bucket is the
// running total for the current week, intentionally lower than its peers.
export const WEEKLY_TREND: number[] = [486, 512, 398, 564, 471, 442, 318];

// ── Insight callouts (Insights screen) ──────────────────────────────────
export const INSIGHT_CALLOUTS = [
  { id: "i-dining",    headline: "You spent 12% less on dining",    body: "Compared with last month." },
  { id: "i-recurring", headline: "5 recurring charges this month", body: "€78 across subscriptions." },
];

// ── Formatting helpers (locale-aware via Intl) ──────────────────────────
// `locale` defaults to "en" so the dev-only /mockups preview keeps working
// without threading a locale; the live mockups pass the active locale.

/** Currency string in the active locale: en "€48.21", de "48,21 €".
 * signDisplay defaults to Intl's "auto" (sign only for negatives); pass
 * "exceptZero" for income rows that want a leading "+". */
export function formatAmount(
  value: number,
  locale = "en",
  opts?: {
    showCents?: boolean;
    signDisplay?: Intl.NumberFormatOptions["signDisplay"];
  },
): string {
  const showCents = opts?.showCents ?? true;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
    signDisplay: opts?.signDisplay ?? "auto",
  }).format(value);
}

/** No-cents currency for headlines: en "€2,847", de "2.847 €". */
export function formatRound(value: number, locale = "en"): string {
  return formatAmount(value, locale, { showCents: false });
}

// ── Date helpers (locale-aware via Intl) ────────────────────────────────

/** Parse an ISO "YYYY-MM-DD" into a timezone-stable local Date. */
function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Month + year: en "May 2026", de "Mai 2026". */
export function formatMonthYear(date: Date, locale = "en"): string {
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(date);
}

/** Month name only: en "April", de "April". */
export function formatMonthLong(date: Date, locale = "en"): string {
  return new Intl.DateTimeFormat(locale, { month: "long" }).format(date);
}

/** From an ISO date: en "May 8", de "8. Mai". */
export function formatMonthDay(iso: string, locale = "en"): string {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
  }).format(parseISODate(iso));
}

/** From an ISO date: en "Thursday, May 14", de "Donnerstag, 14. Mai". */
export function formatWeekdayDate(iso: string, locale = "en"): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(parseISODate(iso));
}
