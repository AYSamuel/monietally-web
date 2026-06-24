import { ImageResponse } from "next/og";
import { routing } from "@/i18n/routing";

export const runtime = "edge";
export const alt = "MonieTally. The finance app that does not track you.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Prerender the OG card for each locale.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Only the few strings on the card need localizing; inlined here so the edge
// bundle stays tiny instead of importing the full message catalog.
const OG_COPY: Record<string, { tagline: string; pill: string }> = {
  en: { tagline: "Your money, finally clear.", pill: "Wherever you bank." },
  de: { tagline: "Dein Geld, endlich klar.", pill: "Egal, bei welcher Bank du bist." },
};

export default function Image({ params }: { params: { locale: string } }) {
  const copy = OG_COPY[params.locale] ?? OG_COPY[routing.defaultLocale];

  return new ImageResponse(
    (
      <div
        style={{
          background: "#04140F",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Green glow, top left */}
        <div
          style={{
            position: "absolute",
            top: -150,
            left: -150,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(17,166,117,0.30) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Gold glow, bottom right */}
        <div
          style={{
            position: "absolute",
            bottom: -150,
            right: -150,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(244,184,96,0.18) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          {/* App name */}
          <div
            style={{
              fontSize: 104,
              fontWeight: 800,
              background: "linear-gradient(135deg, #14B881 0%, #5DDDA8 100%)",
              backgroundClip: "text",
              color: "transparent",
              letterSpacing: "-4px",
              lineHeight: 1,
            }}
          >
            MonieTally
          </div>

          {/* Tagline */}
          <div style={{ fontSize: 30, color: "#9CA3AF", letterSpacing: "-0.5px" }}>
            {copy.tagline}
          </div>

          {/* Privacy pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "12px",
              background: "rgba(17,166,117,0.12)",
              border: "1px solid rgba(17,166,117,0.30)",
              borderRadius: "100px",
              padding: "10px 28px",
            }}
          >
            <div style={{ fontSize: 20, color: "#6FE9B6" }}>{copy.pill}</div>
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 44,
            fontSize: 20,
            color: "#374151",
            letterSpacing: "0.5px",
          }}
        >
          monietally.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
