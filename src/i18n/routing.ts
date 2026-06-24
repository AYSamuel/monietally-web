import { defineRouting } from "next-intl/routing";

// Single source of truth for the locale set. Add a locale here and the
// middleware, navigation helpers, sitemap, and hreflang alternates all pick
// it up. The brand promises "more languages on the way", so this list is
// deliberately the only place a locale is named.
export const routing = defineRouting({
  locales: ["en", "de"],
  defaultLocale: "en",
  // Symmetric, prefixed URLs: /en/... and /de/...; bare / is resolved by the
  // middleware (cookie -> Accept-Language -> defaultLocale).
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
