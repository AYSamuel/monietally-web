import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Features, { Hero } from "@/components/landing/ScrollExperience";
import HowItWorks from "@/components/sections/HowItWorks";
import MissionBand from "@/components/sections/MissionBand";
import TrustBar from "@/components/sections/TrustBar";
import FAQ from "@/components/sections/FAQ";
import WaitlistCTA from "@/components/sections/WaitlistCTA";
import { localizedAlternates } from "@/lib/seo";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("home.title"),
    description: t("home.description"),
    alternates: localizedAlternates(locale, ""),
    openGraph: { title: t("home.title"), description: t("home.description") },
    twitter: { title: t("home.title"), description: t("home.description") },
  };
}

export default function Home({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <MissionBand />
        <Features />
        <TrustBar />
        <WaitlistCTA />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
