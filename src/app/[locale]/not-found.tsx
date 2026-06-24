import { Link } from "@/i18n/navigation";

// Localized 404. Rendered within app/[locale]/layout.tsx, so it inherits
// <html>, providers, and design tokens, and links stay in-locale.
export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-primary)",
        textAlign: "center",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: 420 }}>
        <div
          style={{
            fontSize: 13,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--eyebrow)",
            marginBottom: 16,
          }}
        >
          404
        </div>
        <h1
          className="text-display"
          style={{ fontSize: 32, fontWeight: 600, margin: "0 0 12px", color: "var(--text-primary)" }}
        >
          Page not found
        </h1>
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.6,
            color: "var(--text-secondary)",
            margin: "0 0 28px",
          }}
        >
          The page you’re looking for doesn’t exist or has moved.
        </p>
        <Link href="/" className="btn-primary text-sm" style={{ padding: "10px 22px" }}>
          Back to MonieTally
        </Link>
      </div>
    </main>
  );
}
