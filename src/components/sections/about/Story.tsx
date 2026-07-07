"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ConcentricArcs } from "@/components/ripples/RippleArt";

gsap.registerPlugin(ScrollTrigger);

const EYEBROW = "Our Story";
const HEADLINE = "Built from what we couldn't unsee";
const BODY =
  "During a health policy hackathon in February 2026, we went out on a Friday night instead of staying in the dorm. Away from our screens, we watched how easily someone's hardest moments slip past the people who care most. Within 24 hours we built PRISM, a predictive platform to help Harris County allocate harm reduction resources. It took first place. The question that stuck with us was harder: why does it take a crisis for someone to notice?";
const CLOSING =
  "Refleo exists so the therapist already in a teen's life never has to wonder what they missed.";

export default function Story() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray<HTMLElement>("[data-story-animate]");
      targets.forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 28,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            once: true,
          },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden bg-teal-dark pt-40 pb-28 md:pb-40"
    >
      <ConcentricArcs
        className="absolute -right-10 bottom-0 w-72 text-teal-light/30 pointer-events-none md:w-[28rem]"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-6xl px-6 lg:px-12">
        <div data-story-animate>
          <span className="mb-4 inline-block h-px w-8 bg-apricot/40 align-middle" />
          <span className="ml-3 font-sans text-xs font-medium uppercase tracking-widest text-apricot">
            {EYEBROW}
          </span>
        </div>

        <h1
          className="mt-6 max-w-3xl font-serif text-5xl tracking-tight text-cream sm:text-6xl lg:text-7xl"
          data-story-animate
        >
          {HEADLINE}
        </h1>

        <p
          className="mt-8 max-w-2xl text-lg leading-relaxed text-cream/75"
          data-story-animate
        >
          {BODY}
        </p>

        <p
          className="mt-12 max-w-2xl font-serif text-2xl text-cream sm:text-3xl"
          data-story-animate
        >
          {CLOSING}
        </p>
      </div>
    </section>
  );
}
