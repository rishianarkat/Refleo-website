import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Single source of truth for the displayed subscription price.
// Update this one value to change the price shown on this page.
const MONTHLY_PRICE_USD = 100;

const TITLE = "Pricing";
const DESCRIPTION =
  "One plan for individual clinicians: $100/month with a two-month free trial. See what's included, how billing works, and our refund and non-payment terms.";
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
    answer: `Everything. Your first two months are free with no card needed. When those end, you add a card and get one more month free before your first $${MONTHLY_PRICE_USD} charge.`,
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

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Navbar />
      <main className="pt-32 pb-24 md:pt-40 md:pb-28">
        <div className="mx-auto max-w-3xl px-6 lg:px-12">
          {/* Heading */}
          <p className="font-sans text-xs uppercase tracking-widest text-teal-light">
            Pricing
          </p>
          <h1 className="mt-4 font-serif text-4xl text-cream sm:text-5xl">
            One plan for individual clinicians.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-cream/70">
            Refleo is built for individual clinicians who want continuity
            between sessions. One plan, one price, and two months to try it
            before you pay anything.
          </p>

          {/* Price card */}
          <div className="mt-12 rounded-2xl border border-white/10 bg-teal-deep/60 p-8 sm:p-10">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-5xl text-cream sm:text-6xl">
                ${MONTHLY_PRICE_USD}
              </span>
              <span className="font-sans text-base text-cream/60">
                / month
              </span>
            </div>
            <p className="mt-3 font-sans text-sm text-cream/50">
              Per clinician, billed monthly in U.S. dollars, exclusive of
              taxes.
            </p>

            <div className="mt-8 border-t border-white/10 pt-8">
              <h2 className="font-sans text-xs uppercase tracking-widest text-cream/50">
                Free trial
              </h2>
              <p className="mt-3 text-base leading-relaxed text-cream/80">
                Every new account starts with a free trial of two consecutive
                months, beginning the day the account is activated. The trial
                is available once per clinician and once per practice.
              </p>
              <p className="mt-4 text-base leading-relaxed text-cream/80">
                You will not be charged at the end of your trial, and it does
                not convert automatically into a paid subscription. Your
                access continues only if you affirmatively choose a paid plan
                and add a payment method. We&apos;ll send a reminder to your
                account email at least seven days before your trial ends,
                describing your options and the then-current price.
              </p>
            </div>

            <div className="mt-8">
              <Link
                href="https://app.refleohealth.com/?choose=1"
                className="inline-flex items-center justify-center rounded-full bg-apricot px-8 py-3 text-sm font-semibold font-sans text-teal-dark transition-all duration-200 ease-out hover:bg-apricot-light hover:scale-[1.04] active:scale-[0.98]"
              >
                Start free trial
              </Link>
              <p className="mt-4 text-sm font-sans text-cream/70">
                Also on iPhone:{" "}
                <a
                  href="https://apps.apple.com/us/app/refleo/id6807892935"
                  className="underline underline-offset-4 text-cream/90 hover:text-cream transition-colors"
                >
                  get the app
                </a>
              </p>
            </div>
          </div>

          {/* What's included */}
          <section className="mt-16">
            <h2 className="font-serif text-2xl text-cream">
              What&apos;s included
            </h2>
            <p className="mt-4 text-base leading-relaxed text-cream/80">
              Your patients record short voice or text entries between
              appointments. Refleo organizes those entries, identifies
              recurring themes, and highlights the words and topics
              you&apos;ve chosen to track. The result is a brief summary,
              always presented alongside the underlying entries, for you to
              review before the next session.
            </p>
          </section>

          {/* Billing details */}
          <section className="mt-16">
            <h2 className="font-serif text-2xl text-cream">
              Billing details
            </h2>
            <ul className="mt-4 space-y-4 text-base leading-relaxed text-cream/80">
              <li>
                Fees are stated in U.S. dollars and are exclusive of taxes.
              </li>
              <li>
                <span className="text-cream">Refunds.</span> Fees already
                paid are non-refundable, except where required by applicable
                law or where we state otherwise in writing.
              </li>
              <li>
                <span className="text-cream">Non-payment.</span> If a
                payment is more than fifteen (15) days past due, we may
                suspend access after notice and an opportunity to cure.
              </li>
            </ul>
          </section>

          {/* FAQ */}
          <section className="mt-16" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="font-serif text-2xl text-cream">
              Common questions
            </h2>
            <dl className="mt-6 divide-y divide-white/10">
              {FAQ.map(({ question, answer }) => (
                <div key={question} className="py-6 first:pt-0 last:pb-0">
                  <dt className="font-sans text-base font-semibold text-cream">
                    {question}
                  </dt>
                  <dd className="mt-2 text-base leading-relaxed text-cream/80">
                    {answer}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Links */}
          <p className="mt-16 border-t border-white/10 pt-8 text-sm leading-relaxed text-cream/60">
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
        </div>
      </main>
      <Footer />
    </>
  );
}
