import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import { routing } from "@/i18n/routing";

export default function robots(): MetadataRoute.Robots {
  // Keep the email-link fallback and the dev-only mockup preview out of the
  // index, across every locale prefix.
  const disallow = routing.locales.flatMap((l) => [`/${l}/auth/`, `/${l}/mockups`]);

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow,
    },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
