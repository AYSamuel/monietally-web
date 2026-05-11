import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { SITE } from "../lib/constants";
import { SmoothScroll } from "../components/SmoothScroll";
import "./globals.css";

// Single Inter face for both body and display — Linear/Arc family.
// Inter handles -0.03em letter-spacing in display weights cleanly.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const interDisplay = Inter({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "MonieTally | Money on your mind. Not on our servers.",
  description: SITE.description,
  metadataBase: new URL(SITE.url),
  openGraph: {
    title: "MonieTally | Money on your mind. Not on our servers.",
    description: SITE.description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MonieTally | Money on your mind. Not on our servers.",
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
      className={`${inter.variable} ${interDisplay.variable}`}
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <SmoothScroll>{children}</SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
