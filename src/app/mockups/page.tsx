/**
 * Dev preview for the landing-page mockup ports.
 *
 * Why this exists: SPEC.md §19 PR 2 acceptance asks us to verify each port
 * matches its source HTML in dark + light. This page renders every mockup
 * twice — once in <PhoneFrame forceDark>, once in <PhoneFrame forceLight> —
 * so both variants can be eyeballed against monietally/design-mockups/*.html
 * without spinning up the showcase or wiring it into the site.
 *
 * Not linked from the live site. Visit /mockups directly. Safe to delete
 * once PR 3 lands and the ScrollShowcase covers the same surface area.
 */

import { PhoneFrame } from "@/components/landing/PhoneFrame";
import { Activity } from "@/components/landing/mockups/Activity";
import { AddTransaction } from "@/components/landing/mockups/AddTransaction";
import { Budgets } from "@/components/landing/mockups/Budgets";
import { HomePopulated } from "@/components/landing/mockups/HomePopulated";
import { Insights } from "@/components/landing/mockups/Insights";
import { Onboarding2 } from "@/components/landing/mockups/Onboarding2";
import { Savings } from "@/components/landing/mockups/Savings";

const MOCKUPS: ReadonlyArray<{
  label: string;
  source: string;
  Component: () => JSX.Element;
}> = [
  { label: "Home (populated)",     source: "10-home.html",                 Component: HomePopulated },
  { label: "Activity",             source: "11-activity.html",             Component: Activity },
  { label: "Insights",             source: "14-insights.html",             Component: Insights },
  { label: "Budgets",              source: "13-budgets.html",              Component: Budgets },
  { label: "Savings",              source: "15-savings.html",              Component: Savings },
  { label: "Add transaction",     source: "12-add-edit-transaction.html", Component: AddTransaction },
  { label: "Onboarding · slide 2", source: "02-onboarding.html",           Component: Onboarding2 },
];

export default function MockupsPreview() {
  return (
    <div
      style={{
        minHeight: "100vh",
        // Mid-tone canvas so dark and light phones both have visible
        // contrast against the page background.
        background: "#1F2026",
        color: "#F5F1E8",
        padding: "56px 24px 96px",
      }}
    >
      <header style={{ maxWidth: 1400, margin: "0 auto 48px" }}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: 2.2,
            textTransform: "uppercase",
            fontWeight: 500,
            opacity: 0.55,
          }}
        >
          Mockup port preview
        </div>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 500,
            marginTop: 8,
            letterSpacing: -0.2,
          }}
        >
          Landing-page phone ports, dark and light variants.
        </h1>
        <p
          style={{
            fontSize: 13,
            marginTop: 8,
            opacity: 0.55,
            lineHeight: 1.55,
            maxWidth: 720,
          }}
        >
          Each row pairs the React port with its source filename. Dark on the
          left, light on the right. Compare to monietally/design-mockups/*.html
          to verify fidelity.
        </p>
      </header>

      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 56,
        }}
      >
        {MOCKUPS.map(({ label, source, Component }) => (
          <section
            key={source}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                paddingBottom: 8,
                borderBottom: "1px solid rgba(245,241,232,0.08)",
              }}
            >
              <h2 style={{ fontSize: 18, fontWeight: 500 }}>{label}</h2>
              <span
                style={{
                  fontFamily: "ui-monospace, SFMono-Regular, monospace",
                  fontSize: 11,
                  opacity: 0.4,
                }}
              >
                {source}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                gap: 56,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <ThemedPair label={label} Component={Component} variant="dark" />
              <ThemedPair label={label} Component={Component} variant="light" />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function ThemedPair({
  label,
  Component,
  variant,
}: {
  label: string;
  Component: () => JSX.Element;
  variant: "dark" | "light";
}) {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}
    >
      <div
        style={{
          fontSize: 10,
          letterSpacing: 2,
          textTransform: "uppercase",
          fontWeight: 500,
          opacity: 0.55,
        }}
      >
        {variant === "dark" ? "Dark" : "Light"}
      </div>
      <PhoneFrame
        forceDark={variant === "dark"}
        forceLight={variant === "light"}
        ariaLabel={`${label} preview, ${variant} variant`}
      >
        <Component />
      </PhoneFrame>
    </div>
  );
}
