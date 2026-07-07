"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ConcentricArcs } from "@/components/ripples/RippleArt";

gsap.registerPlugin(ScrollTrigger);

const HERO_EYEBROW = "About Refleo";
const HERO_HEADLINE =
  "Refleo exists so a teen's therapist never has to wonder what they missed.";
const HERO_SUB =
  "We build continuity between sessions. Teens get a private place to talk through the week. Clinicians get the context to make fifty minutes count.";

const BELIEFS_EYEBROW = "What we believe";
const BELIEFS = [
  {
    title: "Therapy works. Context makes it work better.",
    body: "A session is fifty minutes. A week is 10,080. The work goes deeper when the clinician can see more of it.",
  },
  {
    title: "Privacy is the product.",
    body: "Teens choose what they share. Refleo listens for what the clinician flagged, surfaces patterns, and never counsels.",
  },
  {
    title: "Built with clinicians, not just for them.",
    body: "More than a hundred clinician conversations across 8 states have shaped every screen. We keep asking.",
  },
];

export default function Story() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const heroTargets = gsap.utils.toArray<HTMLElement>(
        "[data-story-hero-animate]"
      );
      gsap.from(heroTargets, {
        opacity: 0,
        y: 28,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: heroTargets[0],
          start: "top 80%",
          once: true,
        },
      });

      const beliefTargets = gsap.utils.toArray<HTMLElement>(
        "[data-belief-animate]"
      );
      gsap.from(beliefTargets, {
        opacity: 0,
        y: 28,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: beliefTargets[0],
          start: "top 80%",
          once: true,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section
        ref={rootRef}
        className="relative overflow-hidden bg-transparent pt-36 pb-16 md:pb-20"
      >
        <ConcentricArcs
          className="pointer-events-none absolute -right-10 bottom-0 w-72 text-teal-light/30 md:w-[28rem]"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-6xl px-6 lg:px-12">
          <div data-story-hero-animate>
            <span className="mb-4 inline-block h-px w-8 bg-apricot/40 align-middle" />
            <span className="ml-3 font-sans text-xs font-medium uppercase tracking-widest text-apricot">
              {HERO_EYEBROW}
            </span>
          </div>

          <h1
            className="mt-6 max-w-4xl text-balance font-serif text-4xl tracking-tight text-cream sm:text-5xl lg:text-6xl"
            data-story-hero-animate
          >
            {HERO_HEADLINE}
          </h1>

          <p
            className="mt-6 max-w-2xl font-sans text-lg leading-relaxed text-cream/70"
            data-story-hero-animate
          >
            {HERO_SUB}
          </p>
        </div>
      </section>

      <section className="bg-teal-deep/60 py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-12">
          <div data-belief-animate>
            <span className="mb-4 inline-block h-px w-8 bg-apricot/40 align-middle" />
            <span className="ml-3 font-sans text-xs font-medium uppercase tracking-widest text-apricot">
              {BELIEFS_EYEBROW}
            </span>
          </div>

          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {BELIEFS.map((belief) => (
              <div key={belief.title} data-belief-animate>
                <p className="font-serif text-xl text-cream sm:text-2xl">
                  {belief.title}
                </p>
                <p className="mt-3 font-sans text-base leading-relaxed text-cream/70">
                  {belief.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
