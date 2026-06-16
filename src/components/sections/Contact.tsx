"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SECTION_LABEL = "Contact";
const SECTION_NUMBER = "07";
const HEADLINE = "Let's Talk";

const DEMO_TITLE = "Book a Demo";
const DEMO_DESC =
  "See how Refleo fits into the way you already work — we'll walk you through it.";
const DEMO_HREF = "mailto:info@refleohealth.com?subject=Demo Request";

const INVEST_TITLE = "Invest in Refleo";
const INVEST_DESC =
  "We'd love to share where we're headed and how you can be part of it.";
const INVEST_HREF = "mailto:info@refleohealth.com?subject=Investment Inquiry";

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

      const cards = cardsRef.current
        ? Array.from(cardsRef.current.children)
        : [];
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.15,
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative overflow-hidden bg-teal-dark py-28 text-cream md:py-40"
    >
      {/* Ripple background — global classes from globals.css */}
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

        {/* Two-path cards */}
        <div
          ref={cardsRef}
          className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8"
        >
          {/* LEFT — Book a Demo */}
          <div className="rounded-2xl border border-teal-light/20 bg-white/5 p-8">
            <h3 className="mb-2 text-xl font-semibold text-cream">
              {DEMO_TITLE}
            </h3>
            <p className="mb-6 text-cream/70">{DEMO_DESC}</p>
            <a
              href={DEMO_HREF}
              className="inline-block rounded-full bg-apricot px-7 py-3 text-sm font-semibold text-teal-dark transition-all duration-200 ease-out hover:bg-apricot-light hover:scale-[1.04] active:scale-[0.98] hover:shadow-[0_0_24px_-4px_rgba(232,168,124,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apricot"
            >
              {DEMO_TITLE}
            </a>
          </div>

          {/* RIGHT — Invest in Refleo */}
          <div className="rounded-2xl border border-teal-light/20 bg-white/5 p-8">
            <h3 className="mb-2 text-xl font-semibold text-cream">
              {INVEST_TITLE}
            </h3>
            <p className="mb-6 text-cream/70">{INVEST_DESC}</p>
            <a
              href={INVEST_HREF}
              className="inline-block rounded-full border border-apricot px-7 py-3 text-sm font-semibold text-apricot transition-all duration-200 ease-out hover:bg-apricot/10 hover:scale-[1.04] active:scale-[0.98] hover:shadow-[0_0_24px_-4px_rgba(232,168,124,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apricot"
            >
              {INVEST_TITLE}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
