"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SECTION_LABEL = "Contact";
const SECTION_NUMBER = "07";
const HEADLINE = "Let’s Talk.";

const DEMO_TITLE = "Book a Demo";
const DEMO_COPY = "See how Refleo fits into the way you already work.";
const DEMO_LABEL = "Book a Demo";

const INVEST_TITLE = "Invest in Refleo";
const INVEST_COPY = "We’d love to share where we’re headed.";
const INVEST_LABEL = "Invest in Refleo";

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;

      gsap.fromTo(
        headerRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        cardsRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.1,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative overflow-hidden bg-teal-dark py-28 text-cream md:py-40"
    >
      {/* Ripple background rings */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        style={{ zIndex: 0 }}
      >
        <span
          className="ripple-ring ripple-ring--accent"
          style={{ width: 280, height: 280, animationDelay: "0s" }}
        />
        <span
          className="ripple-ring"
          style={{ width: 440, height: 440, animationDelay: "1.6s" }}
        />
        <span
          className="ripple-ring"
          style={{ width: 620, height: 620, animationDelay: "3.2s" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 lg:px-12">
        {/* Header */}
        <div ref={headerRef}>
          <div className="mb-4 flex items-baseline gap-3">
            <span className="text-5xl font-bold leading-none text-apricot sm:text-6xl">
              {SECTION_NUMBER}
            </span>
            <span className="text-xs font-medium uppercase tracking-widest text-apricot">
              {SECTION_LABEL}
            </span>
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-cream sm:text-5xl lg:text-6xl">
            {HEADLINE}
          </h2>
        </div>

        {/* Two cards */}
        <div
          ref={cardsRef}
          className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8"
        >
          {/* Left card — Book a Demo */}
          <div className="flex flex-col gap-6 rounded-2xl border border-teal-light/20 bg-white/5 p-8">
            <div className="flex flex-col gap-3">
              <h3 className="text-xl font-semibold text-cream sm:text-2xl">
                {DEMO_TITLE}
              </h3>
              <p className="text-base text-cream/70">{DEMO_COPY}</p>
            </div>
            <div>
              <Link
                href="/contact?intent=demo"
                className="inline-flex items-center justify-center rounded-full bg-apricot px-8 py-3 text-base font-semibold text-teal-dark transition-all duration-200 ease-out hover:bg-apricot-light hover:scale-[1.04] active:scale-[0.98] hover:shadow-[0_0_24px_-4px_rgba(232,168,124,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apricot min-h-[44px]"
              >
                {DEMO_LABEL}
              </Link>
            </div>
          </div>

          {/* Right card — Invest in Refleo */}
          <div className="flex flex-col gap-6 rounded-2xl border border-teal-light/20 bg-white/5 p-8">
            <div className="flex flex-col gap-3">
              <h3 className="text-xl font-semibold text-cream sm:text-2xl">
                {INVEST_TITLE}
              </h3>
              <p className="text-base text-cream/70">{INVEST_COPY}</p>
            </div>
            <div>
              <a
                href="mailto:info@refleohealth.com?subject=Investment Inquiry"
                className="inline-flex items-center justify-center rounded-full border border-apricot bg-transparent px-8 py-3 text-base font-semibold text-apricot transition-all duration-200 ease-out hover:bg-apricot/10 hover:scale-[1.04] active:scale-[0.98] hover:shadow-[0_0_24px_-4px_rgba(232,168,124,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apricot min-h-[44px]"
              >
                {INVEST_LABEL}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
