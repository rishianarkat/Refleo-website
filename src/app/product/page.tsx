import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductHero from "@/components/sections/product/ProductHero";
import HowItWorks from "@/components/sections/product/HowItWorks";
import Callouts from "@/components/sections/product/Callouts";
import ProductCta from "@/components/sections/product/ProductCta";

export const metadata: Metadata = {
  title: "Product",
  description:
    "Patients record short voice entries. Refleo turns them into a one-screen pre-session brief for their clinician.",
  alternates: { canonical: "https://www.refleohealth.com/product" },
  openGraph: {
    type: "website",
    url: "https://www.refleohealth.com/product",
    siteName: "Refleo",
    title: "Product · Refleo",
    description:
      "Patients record short voice entries. Refleo turns them into a one-screen pre-session brief for their clinician.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Refleo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Product · Refleo",
    description:
      "Patients record short voice entries. Refleo turns them into a one-screen pre-session brief for their clinician.",
    images: ["/og.png"],
  },
};

export default function ProductPage() {
  return (
    <>
      <Navbar />
      <main>
        <ProductHero />
        <HowItWorks />
        <Callouts />
        <ProductCta />
      </main>
      <Footer />
    </>
  );
}
