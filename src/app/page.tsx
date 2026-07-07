import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/home/Hero";
import Problem from "@/components/sections/home/Problem";
import Solution from "@/components/sections/home/Solution";
import Validation from "@/components/sections/home/Validation";
import CtaBand from "@/components/sections/home/CtaBand";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Validation />
        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
