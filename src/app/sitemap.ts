import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import { routing } from "@/i18n/routing";

// Public, indexable routes (locale-less). auth/callback and mockups are
// intentionally excluded.
const PATHS = ["", "/about", "/privacy", "/terms", "/delete-account"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return PATHS.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${SITE.url}/${locale}${path}`,
      lastModified,
      alternates: {
        languages: Object.fromEntries([
          ...routing.locales.map((l) => [l, `${SITE.url}/${l}${path}`]),
          ["x-default", `${SITE.url}/${routing.defaultLocale}${path}`],
        ]),
      },
    })),
  );
}
