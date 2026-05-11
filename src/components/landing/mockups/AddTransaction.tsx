/**
 * Mirrors monietally/design-mockups/12-add-edit-transaction.html (Idle, both variants).
 * Update both files when the design changes.
 *
 * Theming: follows the ambient theme via the --m-fg-XX, --phone-screen,
 * --phone-screen-fg tokens defined in globals.css.
 *
 * Used by: HowItWorks step 2 (SPEC.md §12).
 *
 * "Idle" state = no input yet. Big $0.00 dimmed at 32% opacity.
 * Save button is disabled (42% opacity) until the form has both an
 * amount and a category.
 */

const FG_78 = "var(--m-fg-78)";
const FG_70 = "var(--m-fg-70)";
const FG_60 = "var(--m-fg-60)";
const FG_40 = "var(--m-fg-40)";
const FG_06 = "var(--m-fg-06)";
const FG_04 = "var(--m-fg-04)";
const FG_10 = "var(--m-fg-10)";

export function AddTransaction() {
  return (
    <>
      {/* Header — back chevron + title */}
      <div
        className="absolute flex items-center"
        style={{ top: 60, left: 12, right: 12, gap: 4 }}
      >
        <div
          className="flex items-center justify-center"
          style={{ width: 36, height: 36, color: FG_78 }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 6L9 12L15 18" />
          </svg>
        </div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: 0.1,
            color: FG_78,
          }}
        >
          New transaction
        </div>
      </div>

      {/* Type toggle (Expense / Income) */}
      <div
        className="absolute flex"
        style={{
          top: 110,
          left: 24,
          right: 24,
          height: 36,
          borderRadius: 999,
          padding: 3,
          background: FG_06,
          border: `1px solid ${FG_10}`,
        }}
      >
        <div
          className="flex items-center justify-center"
          style={{
            flex: 1,
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: 0.2,
            background: "var(--phone-screen-fg)",
            color: "var(--phone-screen)",
          }}
        >
          Expense
        </div>
        <div
          className="flex items-center justify-center"
          style={{
            flex: 1,
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: 0.2,
            color: FG_60,
          }}
        >
          Income
        </div>
      </div>

      {/* Amount hero — big tappable number, dimmed in idle state */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          top: 168,
          left: 24,
          right: 24,
          height: 80,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 500,
            letterSpacing: -1.6,
            lineHeight: 1,
            color: "var(--phone-screen-fg)",
            opacity: 0.32,
          }}
        >
          <span
            style={{
              fontSize: 26,
              fontWeight: 400,
              verticalAlign: 18,
              marginRight: 2,
              opacity: 0.7,
            }}
          >
            $
          </span>
          0.00
        </div>
      </div>

      {/* Description placeholder */}
      <div
        className="absolute flex items-center"
        style={{
          top: 270,
          left: 24,
          right: 24,
          height: 56,
          borderRadius: 14,
          padding: "0 16px",
          fontSize: 15,
          fontWeight: 400,
          background: FG_04,
          border: `1px solid ${FG_10}`,
          color: FG_40,
        }}
      >
        What&apos;s this for?
      </div>

      {/* Form rows */}
      <div className="absolute" style={{ top: 350, left: 24, right: 24 }}>
        <FormRow first label="Category" valueText="Pick one" placeholder />
        <FormRow label="Date" valueText="Today" />
        <FormRow label="Notes" valueText="Optional" placeholder />
      </div>

      {/* Save CTA — disabled in idle */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          bottom: 28,
          left: 24,
          right: 24,
          height: 50,
          borderRadius: 14,
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: 0.2,
          background: "var(--phone-screen-fg)",
          color: "var(--phone-screen)",
          opacity: 0.42,
        }}
      >
        Save
      </div>
    </>
  );
}

// ── Internals ──────────────────────────────────────────────────────────

function FormRow({
  first = false,
  label,
  valueText,
  placeholder = false,
}: {
  first?: boolean;
  label: string;
  valueText: string;
  placeholder?: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between"
      style={{
        height: 48,
        borderTop: first ? "none" : `1px solid ${FG_06}`,
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 400, color: FG_70 }}>
        {label}
      </span>
      <div className="flex items-center" style={{ gap: 6 }}>
        <span
          style={{
            fontSize: 13,
            fontWeight: placeholder ? 400 : 500,
            color: placeholder ? FG_40 : "var(--phone-screen-fg)",
          }}
        >
          {valueText}
        </span>
        <span style={{ fontSize: 13, opacity: 0.4 }}>›</span>
      </div>
    </div>
  );
}

export default AddTransaction;
