import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/home/Hero";
import WeekBand from "@/components/sections/home/WeekBand";
import Solution from "@/components/sections/home/Solution";
import ProductTeaser from "@/components/sections/home/ProductTeaser";
import Validation from "@/components/sections/home/Validation";
import CtaBand from "@/components/sections/home/CtaBand";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <WeekBand />
        <Solution />
        <ProductTeaser />
        <Validation />
        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
