"use client";

import { useState, FormEvent } from "react";
import { useTranslations } from "next-intl";
import { submitWaitlist, type WaitlistSource } from "@/app/actions/waitlist";
import { validateEmail } from "@/lib/emailValidation";

interface WaitlistFormProps {
  source?: WaitlistSource;
  inverted?: boolean;
}

type Status = "idle" | "loading" | "success" | "duplicate" | "no_mx" | "error";

export default function WaitlistForm({ source = "hero", inverted = false }: WaitlistFormProps) {
  const t = useTranslations("waitlist");
  const [email, setEmail] = useState("");
  const [bank, setBank] = useState("");
  const [country, setCountry] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [inlineError, setInlineError] = useState<string | null>(null);

  function validateOnBlur() {
    if (!email) return;
    const result = validateEmail(email);
    if (!result.valid) {
      setInlineError(t(`errors.${result.reason}`));
    }
  }

  function handleChange(value: string) {
    setEmail(value);
    // Clear inline error as soon as the user starts correcting
    if (inlineError) setInlineError(null);
    if (status !== "idle" && status !== "loading") setStatus("idle");
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;

    // Client-side gate, same logic as the server, instant feedback
    const clientResult = validateEmail(email);
    if (!clientResult.valid) {
      setInlineError(t(`errors.${clientResult.reason}`));
      return;
    }

    setInlineError(null);
    setStatus("loading");

    const result = await submitWaitlist(email, source, { bank, country });

    if (result.success) {
      setStatus("success");
      setEmail("");
      setBank("");
      setCountry("");
    } else if (result.error === "duplicate") {
      setStatus("duplicate");
    } else if (result.error === "no_mx") {
      setStatus("no_mx");
    } else if (result.error === "invalid") {
      setInlineError(t("errors.format"));
      setStatus("idle");
    } else {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div
        role="status"
        className="px-4 py-4 rounded-xl space-y-2"
        style={{ background: "rgba(0, 201, 139, 0.1)", border: "1px solid rgba(0, 201, 139, 0.2)" }}
      >
        <div className="flex items-center gap-2">
          <svg
            aria-hidden="true"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#00C98B"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span className="text-sm font-medium" style={{ color: "#00C98B" }}>
            {t("successTitle")}
          </span>
        </div>
        <p
          className="text-xs"
          style={{ color: inverted ? "var(--inv-text-secondary)" : "var(--text-secondary)" }}
        >
          {t("successBody")}
        </p>
      </div>
    );
  }

  const hasError = !!inlineError || status === "no_mx" || status === "error" || status === "duplicate";

  return (
    <div className="w-full max-w-md space-y-2">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
        <div
          className={`flex flex-col gap-3 w-full ${source === "hero" ? "lg:flex-row" : "sm:flex-row"}`}
        >
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={validateOnBlur}
          placeholder={t("emailPlaceholder")}
          aria-label={t("emailLabel")}
          aria-describedby={hasError ? "email-error" : undefined}
          aria-invalid={hasError}
          required
          disabled={status === "loading"}
          className="flex-1 px-4 py-3 min-h-[44px] rounded-xl text-sm outline-none transition-all duration-200 focus:ring-2 disabled:opacity-60"
          style={{
            background: inverted ? "var(--inv-surface)" : "var(--surface)",
            border: `1px solid ${hasError ? "var(--accent-pink)" : inverted ? "var(--inv-border-subtle)" : "var(--border)"}`,
            color: inverted ? "var(--inv-text-primary)" : "var(--text-primary)",
            boxShadow: hasError ? "0 0 0 2px rgba(var(--accent-pink-rgb, 236,72,153),0.15)" : undefined,
          }}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="btn-primary whitespace-nowrap disabled:opacity-60 min-h-[44px]"
          style={inverted ? { background: "var(--inv-text-primary)", color: "var(--inv-bg)" } : undefined}
        >
          {status === "loading" ? (
            <>
              <svg
                aria-hidden="true"
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="sr-only">{t("submitting")}</span>
            </>
          ) : (
            t("submit")
          )}
        </button>
        </div>

        {source === "cta" && (
          <>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                placeholder={t("bankPlaceholder")}
                aria-label={t("bankLabel")}
                disabled={status === "loading"}
                className="flex-1 px-4 py-3 min-h-[44px] rounded-xl text-sm outline-none transition-all duration-200 focus:ring-2 disabled:opacity-60"
                style={{
                  background: inverted ? "var(--inv-surface)" : "var(--surface)",
                  border: `1px solid ${inverted ? "var(--inv-border-subtle)" : "var(--border)"}`,
                  color: inverted ? "var(--inv-text-primary)" : "var(--text-primary)",
                }}
              />
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder={t("countryPlaceholder")}
                aria-label={t("countryLabel")}
                disabled={status === "loading"}
                className="flex-1 px-4 py-3 min-h-[44px] rounded-xl text-sm outline-none transition-all duration-200 focus:ring-2 disabled:opacity-60"
                style={{
                  background: inverted ? "var(--inv-surface)" : "var(--surface)",
                  border: `1px solid ${inverted ? "var(--inv-border-subtle)" : "var(--border)"}`,
                  color: inverted ? "var(--inv-text-primary)" : "var(--text-primary)",
                }}
              />
            </div>

            <p
              className="text-xs"
              style={{ color: inverted ? "var(--inv-text-secondary)" : "var(--text-secondary)" }}
            >
              {t("helper")}
            </p>
          </>
        )}
      </form>

      {/* Inline validation error (format / disposable / suspicious) */}
      {inlineError && (
        <p id="email-error" role="alert" className="text-xs" style={{ color: "var(--accent-pink)" }}>
          {inlineError}
        </p>
      )}

      {/* Server-returned errors */}
      {!inlineError && status === "no_mx" && (
        <p id="email-error" role="alert" className="text-xs" style={{ color: "var(--accent-pink)" }}>
          {t("errors.no_mx")}
        </p>
      )}
      {!inlineError && status === "duplicate" && (
        <p role="alert" className="text-xs" style={{ color: inverted ? "var(--inv-text-secondary)" : "var(--text-secondary)" }}>
          {t("errors.duplicate")}
        </p>
      )}
      {!inlineError && status === "error" && (
        <p id="email-error" role="alert" className="text-xs" style={{ color: "var(--accent-pink)" }}>
          {t("errors.generic")}
        </p>
      )}
    </div>
  );
}
