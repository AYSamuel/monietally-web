import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollExperience from "../components/landing/ScrollExperience";
import SocialProof from "../components/sections/SocialProof";
import FAQ from "../components/sections/FAQ";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <ScrollExperience />
        <SocialProof />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
