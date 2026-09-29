import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ModeToggle from "@/components/v2/ModeToggle";
import Reveal from "@/components/v2/Reveal";
import { CtaV2 } from "@/components/v2/HomeSections";
import {
  APP_STORE_HREF,
  FILL_BTN,
  H2,
  Label,
  PageHero,
  PORTAL_HREF,
} from "@/components/v2/ui";

// Single source of truth for the displayed subscription price.
// Update this one value to change the price shown on this page.
const MONTHLY_PRICE_USD = 100;

const TITLE = "Pricing: $100 a month, first two months free";
const DESCRIPTION =
  "One plan for clinicians: $100 a month, with the first two months free during our launch offer, no card required. Billing, refund, and non-payment terms.";
const URL = "https://www.refleohealth.com/pricing";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    url: URL,
    siteName: "Refleo",
    title: "Pricing · Refleo",
    description: DESCRIPTION,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Refleo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing · Refleo",
    description: DESCRIPTION,
    images: ["/og.png"],
  },
};

// Rendered as the FAQ section below AND emitted as FAQPage structured data,
// so the visible answers and the machine-readable ones can never drift.
// Answers state what the product does today (trial, card, cancellation);
// if billing behaviour changes, change it here in the same commit.
const FAQ: { question: string; answer: string }[] = [
  {
    question: "Who pays for Refleo?",
    answer: "Clinicians do. Clients never pay.",
  },
  {
    question: "What does the free trial include?",
    answer: `Everything. As a launch promotion, your first two months are completely free, with no credit card required. To keep using Refleo after that, you add a card and your plan starts at $${MONTHLY_PRICE_USD} a month. Nothing is charged automatically.`,
  },
  {
    question: "Is Refleo HIPAA compliant?",
    answer:
      "Refleo is a HIPAA business associate. Every clinician signs our Business Associate Agreement at sign-up, and the full agreement is published on this site.",
  },
  {
    question: "Can I use it with clients under 18?",
    answer:
      "Yes. A parent or guardian signs a Parental Consent and Authorization before a minor's account can be used, and the minor sees a plain-language acknowledgment of their own.",
  },
  {
    question: "What do my clients see?",
    answer:
      "A simple check-in: voice or text, whenever they want between sessions. They do not see your brief or your notes.",
  },
  {
    question: "Can I cancel?",
    answer:
      "Any time from Settings. You will not be charged again, and you keep access through the end of the month you have already paid for. The current month is not refunded.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};

const INCLUDED = [
  "HIPAA · BAA included",
  "Parental consent built in",
  "Free for your clients",
  "iPhone and web",
];

export default function PricingPage() {
  return (
    <div className="bg-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Navbar />
      <main>
        <PageHero
          label="Pricing"
          title={
            <>
              One plan <em className="italic text-apricot-light">for clinicians.</em>
            </>
          }
          sub="Refleo is built for clinicians who want continuity between sessions. One plan, one price, and for our launch, two months free before you pay anything."
        />

        {/* 01 · The plan */}
        <section className="border-t border-cream/10">
          <div className="mx-auto max-w-7xl lg:px-12">
            <div className="grid border-b border-cream/10 lg:grid-cols-[1fr_1.3fr] lg:border-x">
              <Reveal className="border-b border-cream/10 px-6 py-12 lg:border-b-0 lg:border-r lg:px-10 lg:py-16">
                <Label index="01">The plan</Label>
                <div className="mt-8 flex items-baseline gap-3">
                  <span className="font-serif text-[clamp(5rem,10vw,8rem)] font-medium leading-none tracking-[-0.04em] text-cream">
                    ${MONTHLY_PRICE_USD}
                  </span>
                  <span className="font-mono text-sm uppercase tracking-[0.14em] text-cream/55">
                    / month
                  </span>
                </div>
                <p className="mt-4 text-sm text-cream/55">
                  Per clinician, billed monthly in U.S. dollars, exclusive of taxes.
                </p>
                <ul className="mt-10 grid grid-cols-2 border-t border-cream/10">
                  {INCLUDED.map((item, i) => (
                    <li
                      key={item}
                      className="border-b border-cream/10 py-4 pr-4 font-mono text-[11px] uppercase tracking-[0.14em] text-cream/70 odd:border-r odd:pr-4 even:pl-4"
                    >
                      <span className="mr-2 text-cream/30">0{i + 1}</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-10">
                  <Link href={PORTAL_HREF} className={FILL_BTN}>
                    Start free trial <span aria-hidden="true">→</span>
                  </Link>
                  <p className="mt-4 text-sm text-cream/65">
                    Also on iPhone:{" "}
                    <a
                      href={APP_STORE_HREF}
                      className="underline underline-offset-4 text-cream/90 transition-colors hover:text-cream"
                    >
                      get the app
                    </a>
                  </p>
                </div>
              </Reveal>

              <Reveal delay={120} className="px-6 py-12 lg:px-10 lg:py-16">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-apricot">
                  Launch offer
                </p>
                <p className="mt-6 font-serif text-3xl font-medium leading-snug tracking-tight">
                  Your first two months are free. No credit card required.
                </p>
                <p className="mt-6 leading-relaxed text-cream/75">
                  For our launch, new accounts get their first two months
                  completely free, with no credit card required. The two months
                  begin the day the account is activated, and the offer is
                  available once per clinician and once per practice. This is a
                  launch promotion and may end for new sign-ups.
                </p>
                <p className="mt-4 leading-relaxed text-cream/75">
                  You will not be charged at the end of your trial, and it does
                  not convert automatically into a paid subscription. Your
                  access continues only if you affirmatively choose a paid plan
                  and add a payment method. We&apos;ll send a reminder to your
                  account email at least seven days before your trial ends,
                  describing your options and the then-current price.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 02 · Included + billing */}
        <section className="mt-24 border-t border-cream/10 lg:mt-32">
          <div className="mx-auto grid max-w-7xl gap-16 px-6 py-24 lg:grid-cols-2 lg:gap-20 lg:px-12 lg:py-32">
            <Reveal>
              <Label index="02">What&apos;s included</Label>
              <p className="mt-6 text-lg leading-relaxed text-cream/80">
                Your patients record short voice or text entries between
                appointments. Refleo organizes those entries, identifies
                recurring themes, and highlights the words and topics
                you&apos;ve chosen to track. The result is a brief summary,
                always presented alongside the underlying entries, for you to
                review before the next session.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <Label index="03">Billing details</Label>
              <ul className="mt-6 border-t border-cream/10 text-cream/80">
                <li className="border-b border-cream/10 py-4 leading-relaxed">
                  Fees are stated in U.S. dollars and are exclusive of taxes.
                </li>
                <li className="border-b border-cream/10 py-4 leading-relaxed">
                  <span className="text-cream">Refunds.</span> Fees already
                  paid are non-refundable, except where required by applicable
                  law or where we state otherwise in writing.
                </li>
                <li className="border-b border-cream/10 py-4 leading-relaxed">
                  <span className="text-cream">Non-payment.</span> If a
                  payment is more than fifteen (15) days past due, we may
                  suspend access after notice and an opportunity to cure.
                </li>
              </ul>
            </Reveal>
          </div>
        </section>

        {/* 04 · FAQ */}
        <section className="border-t border-cream/10" aria-labelledby="faq-heading">
          <div className="mx-auto max-w-7xl px-6 pt-24 lg:px-12 lg:pt-32">
            <Reveal>
              <Label index="04">FAQ</Label>
              <h2 id="faq-heading" className={`mt-6 ${H2}`}>
                Common questions
              </h2>
            </Reveal>
          </div>
          <div className="mx-auto mt-16 max-w-7xl lg:px-12">
            <dl className="grid border-t border-cream/10 md:grid-cols-2 lg:border-x">
              {FAQ.map(({ question, answer }, i) => (
                <div
                  key={question}
                  className="border-b border-cream/10 px-6 py-10 md:odd:border-r lg:px-8"
                >
                  <dt className="flex gap-4 font-serif text-2xl font-medium leading-snug">
                    <span className="mt-2 font-mono text-[11px] tracking-[0.14em] text-cream/35">
                      0{i + 1}
                    </span>
                    {question}
                  </dt>
                  <dd className="mt-4 pl-10 leading-relaxed text-cream/70">{answer}</dd>
                </div>
              ))}
            </dl>
          </div>
          <p className="mx-auto max-w-7xl px-6 pt-10 text-sm leading-relaxed text-cream/55 lg:px-12">
            This page describes the price, billing period, and included
            features referenced in our{" "}
            <Link href="/terms" className="underline hover:text-cream">
              Terms of Service
            </Link>
            . See also our{" "}
            <Link href="/privacy" className="underline hover:text-cream">
              Privacy Policy
            </Link>{" "}
            for how we handle your information.
          </p>
        </section>

        <CtaV2 />
      </main>
      <Footer />
      <ModeToggle active="human" />
    </div>
  );
}
