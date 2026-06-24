import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Features, { Hero } from "../components/landing/ScrollExperience";
import HowItWorks from "../components/sections/HowItWorks";
import MissionBand from "../components/sections/MissionBand";
import TrustBar from "../components/sections/TrustBar";
import FAQ from "../components/sections/FAQ";
import WaitlistCTA from "../components/sections/WaitlistCTA";

export default function Home() {
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
