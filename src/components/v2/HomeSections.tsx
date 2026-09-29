import Link from "next/link";
import HeroGradient from "@/components/v2/HeroGradient";
import Reveal from "@/components/v2/Reveal";
import CountUp from "@/components/v2/CountUp";

// v2 homepage: ShaderGradient hero, basement-style editorial grid below.
// Copy follows the claims rule: Refleo surfaces and shows; it never
// analyzes, detects, assesses, or predicts.

const PORTAL_HREF = "https://app.refleohealth.com/?choose=1";
const APP_STORE_HREF = "https://apps.apple.com/us/app/refleo/id6807892935";
const CONTACT_HREF = "mailto:support@refleohealth.com?subject=Contact";
const INVEST_HREF = "/contact?intent=invest";
const TRIAL_LINE = "Free to try for 2 months, then $100 a month. Your clients never pay.";

const FILL_BTN =
  "inline-flex items-center justify-center gap-2 rounded-full bg-apricot px-7 py-3 text-sm font-semibold text-ink transition-colors duration-200 ease-out hover:bg-apricot-light";
const GHOST_BTN =
  "inline-flex items-center justify-center gap-2 rounded-full border border-cream/25 px-7 py-3 text-sm font-semibold text-cream transition-colors duration-200 ease-out hover:border-cream/60";

function Label({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-cream/50">
      <span className="text-apricot">[{index}]</span> {children}
    </p>
  );
}

/* ── Hero ─────────────────────────────────────────────────────────────── */

const FACTS = [
  "HIPAA business associate",
  "Parental consent built in",
  "$100/mo · 2 months free",
  "Clients never pay",
];

export function HeroV2() {
  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden">
      <HeroGradient />
      {/* Settle the gradient into the page ground so the type always reads. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-ink/55 via-ink/10 to-transparent"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-6 pt-32 pb-10 lg:px-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-cream/70">
          Between-session intelligence for behavioral health
        </p>

        <h1 className="mt-6 max-w-[14ch] font-serif text-[clamp(3.25rem,9.5vw,9.5rem)] font-medium leading-[0.9] tracking-[-0.035em] text-cream">
          Helping clinicians capture life{" "}
          <em className="italic text-apricot-light">outside the session</em>
        </h1>

        <div className="mt-10 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <p className="max-w-md text-lg text-cream/80">
            Patients talk through their week in short voice notes. Their therapist
            walks into the next session already caught up.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href={PORTAL_HREF} className={FILL_BTN}>
              Start free trial <span aria-hidden="true">→</span>
            </Link>
            <a href={CONTACT_HREF} className={GHOST_BTN}>
              Get in touch
            </a>
          </div>
        </div>
      </div>

      <ul className="relative z-10 grid grid-cols-2 border-t border-cream/10 md:grid-cols-4">
        {FACTS.map((fact, i) => (
          <li
            key={fact}
            className="border-cream/10 px-6 py-5 font-mono text-[11px] uppercase tracking-[0.14em] text-cream/70 odd:border-r md:border-r md:last:border-r-0 [&:nth-child(-n+2)]:border-b md:[&:nth-child(-n+2)]:border-b-0 lg:px-12"
          >
            <span className="mr-2 text-cream/35">0{i + 1}</span>
            {fact}
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ── 02 · How it works ────────────────────────────────────────────────── */

const STEPS = [
  {
    who: "Client",
    title: "Records short voice or text entries between sessions",
    body: "Lightweight and private. No prompts to perform. A place to talk through the week as it happens.",
  },
  {
    who: "Refleo",
    title: "Surfaces themes and the keywords the clinician set",
    body: "Brings recurring topics forward in the client's own words. Keyword matches are exact, and the clinician chooses them. It never counsels.",
  },
  {
    who: "Clinician",
    title: "Receives a pre-session brief before each appointment",
    body: "Walks in informed. Spends the session on the work, not the recap.",
  },
];

export function HowV2() {
  return (
    <section className="border-t border-cream/10">
      <div className="mx-auto max-w-7xl px-6 pt-24 lg:px-12 lg:pt-32">
        <Reveal>
          <Label index="02">How it works</Label>
          <h2 className="mt-6 font-serif text-[clamp(2.5rem,6vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.03em]">
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
  );
}

/* ── 03 · Product ─────────────────────────────────────────────────────── */

export function ProductV2() {
  return (
    <section className="mt-24 border-t border-cream/10 lg:mt-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[1fr_1.1fr] lg:gap-20 lg:px-12 lg:py-32">
        <Reveal className="lg:sticky lg:top-32 lg:self-start">
          <Label index="03">Product</Label>
          <h2 className="mt-6 font-serif text-[clamp(2.25rem,4.5vw,4rem)] font-medium leading-[0.98] tracking-[-0.03em]">
            The week, organized before the session starts.
          </h2>
          <p className="mt-6 max-w-sm text-lg text-cream/70">
            Voice notes in. One-screen brief out.
          </p>
          <Link
            href="/product"
            className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-apricot hover:text-apricot-light"
          >
            See it in action <span aria-hidden="true">→</span>
          </Link>
        </Reveal>

        <Reveal delay={120}>
          <figure className="overflow-hidden rounded-xl border border-cream/15 bg-ink shadow-[0_40px_120px_-40px_rgba(232,168,124,0.35)]">
            <div className="flex items-center justify-between border-b border-cream/10 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-cream/45">
              <span>Pre-session brief</span>
              <span>Synthetic data</span>
            </div>
            <div className="max-h-[640px] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/demo-brief.png"
                alt="Clinician pre-session brief showing recurring themes and keyword matches"
                width={1000}
                height={1685}
                className="w-full"
              />
            </div>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

/* ── 04 · Proof ───────────────────────────────────────────────────────── */

const STATS = [
  { value: 100, suffix: "+", label: "Clinician conversations across 8 states" },
  { value: 6, suffix: "+", label: "Clinics interested in piloting" },
  { value: 90, suffix: "%", label: "Of clinicians reported missing critical between-session events" },
];

const QUOTES = [
  {
    text: "What you're describing is exactly what I need. I lose so much of what happens between sessions.",
    who: "LCSW, Adolescent Practice",
  },
  {
    text: "I'd want to set the keywords myself for each client. Every patient's signal is different.",
    who: "LPC, Private Practice",
  },
];

export function ProofV2() {
  return (
    <section className="border-t border-cream/10">
      <div className="mx-auto max-w-7xl px-6 pt-24 lg:px-12 lg:pt-32">
        <Reveal>
          <Label index="04">Validation</Label>
          <h2 className="mt-6 max-w-[20ch] font-serif text-[clamp(2.25rem,4.5vw,4rem)] font-medium leading-[0.98] tracking-[-0.03em]">
            We asked the clinicians we&rsquo;re building for.
          </h2>
        </Reveal>
      </div>
      <div className="mx-auto mt-16 max-w-7xl lg:px-12">
        <div className="grid border-t border-cream/10 sm:grid-cols-3 lg:border-x">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="border-b border-cream/10 px-6 py-10 sm:border-r sm:last:border-r-0 lg:px-8"
            >
              <p className="font-serif text-6xl font-medium leading-none tracking-tight text-apricot lg:text-7xl">
                <CountUp value={s.value} suffix={s.suffix} delay={i * 200} />
              </p>
              <p className="mt-4 max-w-[26ch] text-sm text-cream/60">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="grid border-b border-cream/10 md:grid-cols-2 lg:border-x">
          {QUOTES.map((q) => (
            <figure
              key={q.who}
              className="border-b border-cream/10 px-6 py-10 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 lg:px-8"
            >
              <blockquote className="font-serif text-2xl leading-snug text-cream/90 lg:text-3xl">
                &ldquo;{q.text}&rdquo;
              </blockquote>
              <figcaption className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-cream/45">
                {q.who}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CTA ──────────────────────────────────────────────────────────────── */

export function CtaV2() {
  return (
    <section className="relative mt-24 overflow-hidden border-t border-cream/10 lg:mt-32">
      {/* Static cousin of the hero gradient: one WebGL canvas per page. */}
      <div aria-hidden="true" className="absolute inset-0 v2-cta-glow" />
      <div aria-hidden="true" className="absolute inset-0 v2-grain" />
      <div className="relative mx-auto max-w-7xl px-6 py-32 text-center lg:px-12 lg:py-44">
        <Reveal>
          <h2 className="mx-auto max-w-[16ch] text-balance font-serif text-[clamp(2.75rem,7vw,6.5rem)] font-medium leading-[0.92] tracking-[-0.035em]">
            Walk into the next session{" "}
            <em className="italic text-apricot-light">already caught up.</em>
          </h2>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <Link href={PORTAL_HREF} className={FILL_BTN}>
              Start free trial <span aria-hidden="true">→</span>
            </Link>
            <Link href={INVEST_HREF} className={GHOST_BTN}>
              Invest in Refleo
            </Link>
          </div>
          <p className="mt-6 text-sm text-cream/65">
            {TRIAL_LINE}{" "}
            <a href={APP_STORE_HREF} className="underline underline-offset-4 hover:text-cream">
              Get the iPhone app
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
