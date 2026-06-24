import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { SITE } from "../lib/constants";
import { SmoothScroll } from "../components/SmoothScroll";
import "./globals.css";

// Inter for body text (Linear/Arc family).
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

export const metadata: Metadata = {
  title: "MonieTally | Your money, finally clear.",
  description: SITE.description,
  metadataBase: new URL(SITE.url),
  openGraph: {
    title: "MonieTally | Your money, finally clear.",
    description: SITE.description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MonieTally | Your money, finally clear.",
    description: SITE.description,
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${fraunces.variable}`}
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SmoothScroll>{children}</SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
