import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CountUp from "@/components/v2/CountUp";
import ModeToggle from "@/components/v2/ModeToggle";
import Reveal from "@/components/v2/Reveal";
import { CtaV2 } from "@/components/v2/HomeSections";
import { H2, Label, PageHero } from "@/components/v2/ui";

const TITLE = "About: the founders and why we built it";
const DESCRIPTION =
  "Meet the team behind Refleo and what we believe: continuity between sessions makes therapy work better, starting with adolescent care.";
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

const BELIEFS = [
  {
    title: "Therapy works. Context makes it work better.",
    body: "A session is fifty minutes. A week is 10,080. The work goes deeper when the clinician can see more of it.",
  },
  {
    title: "Privacy is the product.",
    body: "Patients choose what they share. Refleo brings forward the keywords the clinician set, surfaces recurring themes, and never counsels.",
  },
  {
    title: "Built with clinicians, not just for them.",
    body: "More than a hundred clinician conversations across 8 states have shaped every screen. We keep asking.",
  },
];

const TEAM = [
  {
    name: "Vishwas Vijayan",
    role: "Co-Founder",
    affiliation: "Rice University · Finance / BBA",
    photo: "/images/vishwas.jpg",
    // The two portraits are framed differently (portrait vs. wide), so each
    // gets its own crop to put both faces at the same size in a square.
    crop: { objectPosition: "50% 28%" },
    alt: "Portrait of Vishwas Vijayan",
    linkedin: "https://www.linkedin.com/in/vishwasvijayan/",
    bullets: [
      "Finance/BBA @ Rice building the commercial and go-to-market side of Refleo",
      "Junior Associate at a $55M Houston VC fund; AI analyst at AfterQuery (YC W'25)",
    ],
  },
  {
    name: "Rishi Anarkat",
    role: "Co-Founder",
    affiliation: "Rice University · AI / Entrepreneurship",
    photo: "/images/rishi.jpg",
    crop: { objectPosition: "50% 30%", transform: "scale(1.12)", transformOrigin: "50% 36%" },
    alt: "Portrait of Rishi Anarkat",
    linkedin: "https://www.linkedin.com/in/rishianarkat/",
    bullets: [
      "AI/Entrepreneurship @ Rice architecting Refleo's voice journaling and clinical continuity platform",
      "Healthcare and AI/ML researcher at M.D. Anderson, Baylor College of Medicine, and McGovern School of Medicine",
    ],
  },
];

export default function AboutPage() {
  return (
    <div className="bg-ink">
      <Navbar />
      <main>
        <PageHero
          label="About Refleo"
          title={
            <>
              So a therapist never has to wonder{" "}
              <em className="italic text-apricot-light">what they missed.</em>
            </>
          }
          sub="We build continuity between sessions, starting with adolescent therapists, where it matters most, and expanding across behavioral health. Patients get a private place to talk through the week. Clinicians get the context to make fifty minutes count."
        />

        {/* 01 · Beliefs */}
        <section className="border-t border-cream/10">
          <div className="mx-auto max-w-7xl px-6 pt-24 lg:px-12 lg:pt-32">
            <Reveal>
              <Label index="01">What we believe</Label>
              <h2 className={`mt-6 max-w-[16ch] ${H2}`}>Three things we won&rsquo;t trade.</h2>
            </Reveal>
          </div>
          <div className="mx-auto mt-16 max-w-7xl lg:px-12">
            <ol className="grid border-y border-cream/10 md:grid-cols-3 lg:border-x">
              {BELIEFS.map((b, i) => (
                <li
                  key={b.title}
                  className="group border-b border-cream/10 px-6 py-10 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 lg:px-8"
                >
                  <Reveal delay={i * 100}>
                    <span className="font-serif text-6xl font-medium tracking-tight text-cream/20 transition-colors duration-300 group-hover:text-apricot">
                      0{i + 1}
                    </span>
                    <h3 className="mt-10 font-serif text-2xl font-medium leading-snug">{b.title}</h3>
                    <p className="mt-3 text-cream/65">{b.body}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 02 · Team */}
        <section className="mt-24 border-t border-cream/10 lg:mt-32">
          <div className="mx-auto max-w-7xl px-6 pt-24 lg:px-12 lg:pt-32">
            <Reveal>
              <Label index="02">Team</Label>
              <h2 className={`mt-6 ${H2}`}>Meet the team.</h2>
            </Reveal>
          </div>
          <div className="mx-auto mt-16 max-w-7xl lg:px-12">
            <ul className="grid border-y border-cream/10 md:grid-cols-2 lg:border-x">
              {TEAM.map((m, i) => (
                <li
                  key={m.name}
                  className="border-b border-cream/10 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
                >
                  <Reveal delay={i * 120}>
                    <div className="aspect-square overflow-hidden border-b border-cream/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={m.photo}
                        alt={m.alt}
                        loading="lazy"
                        style={m.crop}
                        className="h-full w-full object-cover grayscale-[35%] transition-[filter] duration-500 hover:grayscale-0"
                      />
                    </div>
                    <div className="px-6 py-8 lg:px-8">
                      <div className="flex flex-wrap items-baseline justify-between gap-3">
                        <h3 className="font-serif text-3xl font-medium tracking-tight">{m.name}</h3>
                        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-apricot">
                          {m.role}
                        </span>
                      </div>
                      <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-cream/45">
                        {m.affiliation}
                      </p>
                      <ul className="mt-6 space-y-3 text-cream/70">
                        {m.bullets.map((b) => (
                          <li key={b} className="flex gap-3">
                            <span aria-hidden="true" className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-apricot" />
                            {b}
                          </li>
                        ))}
                      </ul>
                      <a
                        href={m.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${m.name} on LinkedIn`}
                        className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-cream/60 hover:text-apricot"
                      >
                        LinkedIn <span aria-hidden="true">↗</span>
                      </a>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 03 · Mission */}
        <section className="mt-24 border-t border-cream/10 lg:mt-32">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[auto_1fr] lg:gap-20 lg:px-12 lg:py-32">
            <Reveal>
              <Label index="03">Why it matters</Label>
              <p className="mt-6 font-serif text-[clamp(5rem,12vw,10rem)] font-medium leading-none tracking-[-0.04em] text-apricot">
                <CountUp value={60} suffix="M" />
              </p>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-cream/50">
                Americans in treatment
              </p>
            </Reveal>
            <Reveal delay={120} className="lg:self-end">
              <p className="max-w-[24ch] font-serif text-[clamp(2rem,3.6vw,3.25rem)] font-medium leading-[1.05] tracking-[-0.02em]">
                Every one of them has a therapist entering a session with{" "}
                <em className="italic text-apricot-light">incomplete information.</em>
              </p>
              <p className="mt-10 flex items-center gap-4 font-serif text-2xl text-cream/90 sm:text-3xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/svg/refleo-icon.svg" alt="" aria-hidden="true" className="h-10 w-10" />
                Refleo fixes that.
              </p>
            </Reveal>
          </div>
        </section>

        <CtaV2 />
      </main>
      <Footer />
      <ModeToggle active="human" />
    </div>
  );
}
