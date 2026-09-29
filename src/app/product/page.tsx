import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import ModeToggle from "@/components/v2/ModeToggle";
import Reveal from "@/components/v2/Reveal";
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

const STEPS = [
  {
    who: "Client",
    title: "A patient records a short entry",
    body: "Thirty seconds, voice or text, whenever it happens.",
  },
  {
    who: "Refleo",
    title: "Refleo surfaces what the clinician flagged",
    body: "Themes and the keywords set per client, in the client's own words.",
  },
  {
    who: "Clinician",
    title: "The clinician gets a brief before the session",
    body: "One screen. The week, organized.",
  },
];

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

function Window({
  caption,
  note,
  children,
}: {
  caption: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="flex h-full flex-col overflow-hidden rounded-xl border border-cream/15 bg-ink shadow-[0_40px_120px_-40px_rgba(232,168,124,0.3)]">
      <div className="flex items-center justify-between border-b border-cream/10 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-cream/45">
        <span>{caption}</span>
        <span>{note}</span>
      </div>
      {children}
    </figure>
  );
}

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
              <Label index="01">Two screens, one week</Label>
              <h2 className={`mt-6 max-w-[20ch] ${H2}`}>
                Clients talk. Clinicians read one page.
              </h2>
            </Reveal>
            <div className="mt-16 grid gap-6 md:grid-cols-[1.7fr_1fr]">
              <Reveal>
                <Window caption="Clinician · pre-session brief" note="Synthetic data">
                  <div className="max-h-[560px] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/demo-brief.png"
                      alt="Clinician pre-session brief showing recurring themes and keyword matches"
                      width={1000}
                      height={1685}
                      className="w-full"
                    />
                  </div>
                </Window>
              </Reveal>
              <Reveal delay={120}>
                <Window caption="Client · check-in" note="iPhone">
                  <div className="flex flex-1 items-start justify-center bg-black/30 px-6 pt-8">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/demo-journaling.png"
                      alt="Patient voice journaling screen with mood picker and audio entry"
                      width={462}
                      height={1000}
                      loading="lazy"
                      className="w-full max-w-[240px] rounded-t-[2rem] border-x-[3px] border-t-[3px] border-cream/15"
                    />
                  </div>
                </Window>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 02 · How it works */}
        <section className="border-t border-cream/10">
          <div className="mx-auto max-w-7xl px-6 pt-24 lg:px-12 lg:pt-32">
            <Reveal>
              <Label index="02">How it works</Label>
              <h2 className={`mt-6 ${H2}`}>
                Patients share. <em className="italic text-apricot-light">Refleo surfaces.</em>
              </h2>
            </Reveal>
          </div>
          <div className="mx-auto mt-16 max-w-7xl lg:px-12">
            <ol className="grid border-y border-cream/10 md:grid-cols-3 lg:border-x">
              {STEPS.map((s, i) => (
                <li
                  key={s.who}
                  className="group border-b border-cream/10 px-6 py-10 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 lg:px-8"
                >
                  <Reveal delay={i * 100}>
                    <div className="flex items-baseline justify-between">
                      <span className="font-serif text-6xl font-medium tracking-tight text-cream/20 transition-colors duration-300 group-hover:text-apricot">
                        0{i + 1}
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cream/50">
                        {s.who}
                      </span>
                    </div>
                    <h3 className="mt-10 text-xl font-semibold leading-snug">{s.title}</h3>
                    <p className="mt-3 text-cream/65">{s.body}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>

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
