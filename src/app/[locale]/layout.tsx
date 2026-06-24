import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import { notFound } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { SITE } from "@/lib/constants";
import { SmoothScroll } from "@/components/SmoothScroll";
import { routing } from "@/i18n/routing";
import "../globals.css";

// Canonical next-intl root layout: it owns <html>/<body> and re-renders per
// locale, so switching language updates <html lang> and the intl context
// (a single non-localized root cannot — it would go stale on client nav).
// Everything (incl. the otherwise-non-localized /auth/callback and /mockups)
// lives under [locale]; the middleware prefixes bare paths.

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// Fraunces: editorial serif for display and headlines. It's a variable font
// carrying the optical-size (opsz) axis, so the `fontVariationSettings: "opsz" N`
// the headlines set actually takes effect (Inter silently ignored it).
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    metadataBase: new URL(SITE.url),
    icons: { icon: "/favicon.svg" },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: locale === "de" ? "de_DE" : "en_US",
    },
    twitter: { card: "summary_large_image" },
    other: { "og:image:alt": t("ogAlt") },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${inter.variable} ${fraunces.variable}`}
    >
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SmoothScroll>{children}</SmoothScroll>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
