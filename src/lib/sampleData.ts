/**
 * Shared sample dataset for landing-page phone mockups.
 *
 * Why this exists: the ScrollShowcase pins one phone and morphs it through
 * five screens (Home → Activity → Insights → Budgets → Savings). For the
 * effect to feel like one consistent product, every phone has to render
 * the same numbers. If Home says "$2,847 left this month" and Activity
 * shows transactions that sum to a different total, the illusion breaks.
 *
 * One file, one story:
 *   month       = May 2026
 *   income      = $4,694.50
 *   spent       = $1,847.00
 *   net         = $2,847.50  ← anchor number, see SPEC.md §1, §9
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
export const MONTH_LABEL = "May 2026";
export const SHORT_MONTH = "May";
export const CURRENCY = "USD";
export const CURRENCY_SYMBOL = "$";

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
  { id: "tx-01", date: "2026-05-09", time: "9:14 AM",  merchant: "Blue Bottle",   category: "Coffee",    amount: -5.40,    icon: "coffee",   color: "#A8723F" },
  { id: "tx-02", date: "2026-05-09", time: "8:02 AM",  merchant: "Whole Foods",   category: "Groceries", amount: -48.21,   icon: "cart",     color: "#2D8B5C" },
  { id: "tx-03", date: "2026-05-08", time: "6:30 PM",  merchant: "Stripe payout", category: "Income",    amount: 1240.00,  icon: "bolt",     color: "#2D8B5C" },
  { id: "tx-04", date: "2026-05-08", time: "12:48 PM", merchant: "Tube",          category: "Transport", amount: -2.90,    icon: "bus",      color: "#7A8FA8" },
  { id: "tx-05", date: "2026-05-07", time: "8:20 PM",  merchant: "Curio Tapas",   category: "Dining",    amount: -42.10,   icon: "coffee",   color: "#B8503C" },
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
  { id: "i-recurring", headline: "5 recurring charges this month", body: "$78 across subscriptions." },
];

// ── Formatting helpers (kept tiny and dependency-free) ──────────────────

/** Format a number as a currency string. Negative spend reads as "-$48.21". */
export function formatAmount(value: number, opts?: { showCents?: boolean }): string {
  const showCents = opts?.showCents ?? true;
  const abs = Math.abs(value);
  const formatted = showCents
    ? abs.toFixed(2)
    : Math.round(abs).toLocaleString("en-US");
  const withCommas = showCents
    ? Number(formatted).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : formatted;
  const sign = value < 0 ? "-" : "";
  return `${sign}${CURRENCY_SYMBOL}${withCommas}`;
}

/** Format like "$2,847" (no cents) for display headlines. */
export function formatRound(value: number): string {
  return formatAmount(value, { showCents: false });
}
