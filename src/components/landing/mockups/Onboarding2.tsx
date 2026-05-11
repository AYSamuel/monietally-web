/**
 * Mirrors monietally/design-mockups/02-onboarding.html (Slide 2 · Control, both variants).
 * Update both files when the design changes.
 *
 * Theming: follows the ambient theme via the --m-fg-XX, --phone-screen-fg
 * tokens defined in globals.css. Gold stays gold across themes (per source).
 *
 * Used by: HowItWorks step 1 (SPEC.md §12).
 *
 * Note: the source mockup uses a 300×650 frame with slightly tighter
 * island/status-bar padding. The web ports use the canonical 320×696
 * <PhoneFrame>; the inner layout (wordmark, illustration, copy block,
 * pagination, next link) is positioned identically and reads correctly
 * at the larger frame size.
 */

const FG_55 = "var(--m-fg-55)";
const FG_50 = "var(--m-fg-50)";
const FG_30 = "var(--m-fg-30)";
const FG_12 = "var(--m-fg-12)";

export function Onboarding2() {
  return (
    <>
      {/* Wordmark — sits where the topbar would in non-onboarding screens */}
      <div
        className="absolute"
        style={{
          top: 64,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 13,
          letterSpacing: 4,
          fontWeight: 500,
          color: FG_50,
        }}
      >
        monietally
      </div>

      {/* Illustration — gauge showing $620 spent of $1,000 limit */}
      <div
        className="absolute flex items-center justify-center"
        style={{ top: 130, left: 0, right: 0, height: 130, padding: "0 32px" }}
      >
        <div style={{ width: "100%", maxWidth: 230 }}>
          {/* Gauge track */}
          <div
            className="relative"
            style={{
              height: 8,
              borderRadius: 4,
              marginTop: 10,
              background: FG_12,
            }}
          >
            {/* Filled portion (62% spent) */}
            <div
              className="absolute"
              style={{
                left: 0,
                top: 0,
                height: 8,
                borderRadius: 4,
                width: "62%",
                background: "var(--phone-screen-fg)",
              }}
            />
            {/* "Now" tick at 62% */}
            <div
              className="absolute"
              style={{
                left: "62%",
                top: -8,
                width: 1,
                height: 24,
                background: "var(--phone-screen-fg)",
              }}
            />
            {/* "Limit" tick at 100% in gold */}
            <div
              className="absolute"
              style={{
                left: "100%",
                top: -8,
                transform: "translateX(-1px)",
                width: 1,
                height: 24,
                background: "var(--gold)",
              }}
            />
          </div>
          {/* Labels under the gauge */}
          <div
            className="flex justify-between"
            style={{
              marginTop: 22,
              fontSize: 10,
              letterSpacing: 1.2,
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            <span style={{ color: "var(--phone-screen-fg)" }}>Spent $620</span>
            <span style={{ color: "var(--gold)" }}>Limit $1,000</span>
          </div>
        </div>
      </div>

      {/* Copy block */}
      <div
        className="absolute"
        style={{ top: 296, left: 0, right: 0, padding: "0 32px", textAlign: "center" }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 500,
            lineHeight: 1.2,
            letterSpacing: 0.2,
          }}
        >
          Stay on plan.
        </div>
        <div
          style={{
            fontSize: 14,
            marginTop: 18,
            lineHeight: 1.55,
            fontWeight: 400,
            color: FG_55,
          }}
        >
          Tell us what each part of life should cost. We do the math.
        </div>
      </div>

      {/* Pagination dots — 3 slides, slide 2 active */}
      <div
        className="absolute flex justify-center"
        style={{ bottom: 116, left: 0, right: 0, gap: 7 }}
      >
        <span
          style={{ width: 7, height: 4, borderRadius: 2.5, background: FG_30 }}
        />
        <span
          style={{
            width: 22,
            height: 4,
            borderRadius: 2.5,
            background: "var(--phone-screen-fg)",
          }}
        />
        <span
          style={{ width: 7, height: 4, borderRadius: 2.5, background: FG_30 }}
        />
      </div>

      {/* Next link */}
      <div
        className="absolute"
        style={{
          bottom: 50,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 15,
          fontWeight: 500,
          letterSpacing: 0.5,
          color: "var(--phone-screen-fg)",
        }}
      >
        Next ›
      </div>
    </>
  );
}

export default Onboarding2;
