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

export default function PricingPage() {
  return (
    <>
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
                href="/contact?intent=demo"
                className="inline-flex items-center justify-center rounded-full bg-apricot px-8 py-3 text-sm font-semibold font-sans text-teal-dark transition-all duration-200 ease-out hover:bg-apricot-light hover:scale-[1.04] active:scale-[0.98]"
              >
                Book a Demo
              </Link>
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
