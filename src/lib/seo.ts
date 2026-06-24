import { routing } from "@/i18n/routing";
import type { Metadata } from "next";

// Builds canonical + hreflang alternates for a route, derived from the single
// locale list in routing.ts. Paths are locale-less (e.g. "/about", "" for home);
// the locale prefix is added here. x-default points at the default locale.
export function localizedAlternates(
  locale: string,
  path = "",
): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = `/${l}${path}`;
  }
  languages["x-default"] = `/${routing.defaultLocale}${path}`;
  return {
    canonical: `/${locale}${path}`,
    languages,
  };
}
