import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollExperience from "../components/landing/ScrollExperience";
import TrustBar from "../components/sections/TrustBar";
import SocialProof from "../components/sections/SocialProof";
import FAQ from "../components/sections/FAQ";
import WaitlistCTA from "../components/sections/WaitlistCTA";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <ScrollExperience />
        <TrustBar />
        <SocialProof />
        <WaitlistCTA />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
