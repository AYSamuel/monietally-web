import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Handles bare `/` (cookie -> Accept-Language -> defaultLocale) and keeps the
// NEXT_LOCALE cookie in sync when a user switches language.
export default createMiddleware(routing);

export const config = {
  // Run on everything EXCEPT:
  //   api, _next, _vercel        framework internals
  //   anything with a dot        static files, sitemap.xml, robots.txt, og image
  // /auth/callback and /mockups now live under [locale]; the middleware
  // prefixes the bare paths (e.g. an emailed /auth/callback -> /<locale>/auth/callback).
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
