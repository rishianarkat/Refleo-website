import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import ModeToggle from "@/components/v2/ModeToggle";
import Reveal from "@/components/v2/Reveal";
import Shot from "@/components/v2/Shot";
import ProductStory from "@/components/sections/product/ProductStory";
import { CtaV2 } from "@/components/v2/HomeSections";
import {
  FILL_BTN,
  GHOST_BTN,
  H2,
  Label,
  PageHero,
  PORTAL_HREF,
  TRIAL_LINE,
} from "@/components/v2/ui";

export const metadata: Metadata = {
  title: "Product: check-ins that become a pre-session brief",
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

const CALLOUTS = [
  { title: "Voice-first entries", body: "30-second journaling on phone, no prompts." },
  {
    title: "Clinician-tuned and patient customized",
    body: "Each clinician adjusts settings per client.",
  },
  {
    title: "Pre-session brief",
    body: "One-screen narrative summary before the appointment.",
  },
  {
    title: "Built-in scope guardrails",
    body: "No automated triage. No direct patient support. No SaMD territory.",
    accent: true,
  },
];

// Real screens from the Refleo web app, rendered with synthetic data.
const SHOTS = [
  {
    src: "/images/product/dashboard.jpg",
    alt: "Clinician dashboard listing clients with their last check-in and next session",
    title: "Your clients.",
    caption: "Who checked in, and when you see them next.",
  },
  {
    src: "/images/product/brief.jpg",
    alt: "Pre-session brief showing recurring themes with the client's own quoted words",
    title: "The pre-session brief.",
    caption: "Recurring themes, in the client's own words.",
  },
  {
    src: "/images/product/client.jpg",
    alt: "Client profile with mood over time, recent entries, and the clinician's keywords",
    title: "The client view.",
    caption: "Mood over time, entries, and your keywords.",
  },
  {
    src: "/images/product/checkin.jpg",
    alt: "Client check-in screen on iPhone with a mood picker and a record button",
    title: "The client check-in.",
    caption: "Voice or text, thirty seconds, whenever it happens.",
    phone: true,
  },
];

export default function ProductPage() {
  return (
    <div className="bg-ink">
      <Navbar />
      <main>
        <PageHero
          label="Product"
          title={
            <>
              See it <em className="italic text-apricot-light">in action.</em>
            </>
          }
          sub="A patient's voice notes become a one-screen brief their clinician reads before the session."
        >
          <div className="flex flex-wrap gap-3">
            <Link href={PORTAL_HREF} className={FILL_BTN}>
              Start free trial <span aria-hidden="true">→</span>
            </Link>
            <Link href="/contact?intent=demo" className={GHOST_BTN}>
              Book a demo
            </Link>
          </div>
          <p className="mt-5 text-sm text-cream/60">{TRIAL_LINE}</p>
        </PageHero>

        {/* 01 · Both sides of the product */}
        <section className="border-t border-cream/10">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
            <Reveal>
              <Label index="01">The product</Label>
              <h2 className={`mt-6 max-w-[20ch] ${H2}`}>
                Clients talk. Clinicians read one page.
              </h2>
            </Reveal>
            <div className="mt-16 grid gap-x-6 gap-y-12 md:grid-cols-2">
              {SHOTS.map((shot, i) => (
                <Reveal key={shot.src} delay={(i % 2) * 120}>
                  <Shot {...shot} index={`0${i + 1}`} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 02 · How it works: the scroll story */}
        <ProductStory />

        {/* 03 · What's inside */}
        <section className="mt-24 border-t border-cream/10 lg:mt-32">
          <div className="mx-auto max-w-7xl px-6 pt-24 lg:px-12 lg:pt-32">
            <Reveal>
              <Label index="03">What&rsquo;s inside</Label>
              <h2 className={`mt-6 max-w-[18ch] ${H2}`}>
                Built for the clinician. Scoped on purpose.
              </h2>
            </Reveal>
          </div>
          <div className="mx-auto mt-16 max-w-7xl lg:px-12">
            <ul className="grid border-t border-cream/10 sm:grid-cols-2 lg:border-x">
              {CALLOUTS.map((c, i) => (
                <li
                  key={c.title}
                  className="border-b border-cream/10 px-6 py-10 sm:odd:border-r lg:px-8"
                >
                  <Reveal delay={(i % 2) * 100}>
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cream/35">
                      0{i + 1}
                    </span>
                    <h3
                      className={`mt-6 font-serif text-3xl font-medium tracking-tight ${
                        c.accent ? "text-apricot-light" : "text-cream"
                      }`}
                    >
                      {c.title}
                    </h3>
                    <p className="mt-3 max-w-md text-cream/65">{c.body}</p>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <CtaV2
          lead="See how Refleo fits into"
          emphasis="the way you already work."
          secondary={{ label: "Book a demo", href: "/contact?intent=demo" }}
        />
      </main>
      <Footer />
      <ModeToggle active="human" />
    </div>
  );
}
