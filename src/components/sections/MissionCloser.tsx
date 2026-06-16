"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STATEMENT_PART_1 = "8 million teens are in treatment. Every one of them has a therapist entering a session with";
const STATEMENT_HIGHLIGHT = "incomplete information.";
const FIXES_THAT = "fixes that.";
const COPYRIGHT = "© 2026 Refleo Health";
const SITE_URL = "https://www.refleohealth.com";
const SITE_LABEL = "www.refleohealth.com";

export default function MissionCloser() {
  const rootRef = useRef<HTMLElement>(null);
  const statementRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;

      gsap.fromTo(
        statementRef.current,
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: statementRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="mission"
      ref={rootRef}
      className="bg-teal-dark text-cream py-40 md:py-56"
    >
      <div className="mx-auto max-w-4xl px-6 text-center lg:px-12">
        {/* Mission statement + resolution */}
        <div ref={statementRef}>
          {/* Big statement */}
          <p className="text-4xl font-semibold leading-relaxed sm:text-5xl lg:text-6xl lg:leading-snug text-balance text-cream">
            {STATEMENT_PART_1}{" "}
            <span className="text-apricot">{STATEMENT_HIGHLIGHT}</span>
          </p>

          {/* Resolution row: logo + "fixes that." */}
          <div className="mt-16 inline-flex items-center justify-center gap-4 md:mt-20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/svg/refleo-logo-dark.svg"
              alt="Refleo"
              style={{ height: 44, width: "auto" }}
            />
            <span className="text-2xl font-medium text-cream sm:text-3xl">
              {FIXES_THAT}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-28 border-t border-white/10 pt-10 md:mt-36">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
            <span className="text-cream/50">{COPYRIGHT}</span>
            <a
              href={SITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-apricot transition-colors duration-200 hover:text-apricot-light"
            >
              {SITE_LABEL}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
