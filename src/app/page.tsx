import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ModeToggle from "@/components/v2/ModeToggle";
import {
  HeroV2,
  WeekV2,
  HowV2,
  ProductV2,
  ProofV2,
  CtaV2,
} from "@/components/v2/HomeSections";

export default function Home() {
  return (
    <div className="bg-ink">
      <Navbar />
      <main>
        <HeroV2 />
        <WeekV2 />
        <HowV2 />
        <ProductV2 />
        <ProofV2 />
        <CtaV2 />
      </main>
      <Footer />
      <ModeToggle active="human" />
    </div>
  );
}
