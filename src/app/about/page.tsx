import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Story from "@/components/sections/about/Story";
import Team from "@/components/sections/about/Team";
import Mission from "@/components/sections/about/Mission";

const TITLE = "About";
const DESCRIPTION =
  "Meet the team behind Refleo and what we believe: continuity between sessions makes adolescent therapy work better.";
const URL = "https://www.refleohealth.com/about";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    url: URL,
    siteName: "Refleo",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Refleo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <Story />
        <Team />
        <Mission />
      </main>
      <Footer />
    </>
  );
}
