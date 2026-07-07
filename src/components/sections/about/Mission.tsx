"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STATEMENT_LEAD =
  "8 million teens are in treatment. Every one of them has a therapist entering a session with ";
const STATEMENT_EMPHASIS = "incomplete information.";
const PUNCH = "fixes that.";

export default function Mission() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-mission-statement]", {
        opacity: 0,
        y: 28,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 80%",
          once: true,
          onEnter: () => {
            window.dispatchEvent(
              new CustomEvent("refleo:pulse", {
                detail: { x: 0.5, y: 0.5, strength: 1.6 },
              })
            );
          },
        },
      });

      gsap.from("[data-mission-punch]", {
        opacity: 0,
        y: 28,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 70%",
          once: true,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="bg-transparent py-24 text-center md:py-28"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-12">
        <p
          className="mx-auto max-w-4xl text-balance font-serif text-3xl text-cream sm:text-5xl lg:text-6xl"
          data-mission-statement
        >
          {STATEMENT_LEAD}
          <span className="text-apricot">{STATEMENT_EMPHASIS}</span>
        </p>

        <div
          className="mt-12 flex items-center justify-center gap-4"
          data-mission-punch
        >
          <svg
            aria-hidden="true"
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="24" cy="24" r="22" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" className="text-teal-light" />
            <circle cx="24" cy="24" r="15" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.5" className="text-teal-light" />
            <circle cx="24" cy="24" r="8" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.5" className="text-teal-light" />
            <circle cx="24" cy="24" r="3" fill="#E8A87C" />
          </svg>
          <p className="font-serif text-2xl text-cream sm:text-3xl">{PUNCH}</p>
        </div>
      </div>
    </section>
  );
}
