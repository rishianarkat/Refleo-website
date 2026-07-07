"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const H2_TEXT = "Walk into your next session already caught up.";
const CTA_DEMO_LABEL = "Book a Demo";
const CTA_DEMO_HREF = "/contact?intent=demo";
const CTA_INVEST_LABEL = "Invest in Refleo";
const CTA_INVEST_HREF = "/contact?intent=invest";

const FILL_BTN =
  "inline-flex items-center justify-center rounded-full bg-apricot px-8 py-3 text-sm font-semibold font-sans text-teal-dark transition-all duration-200 ease-out hover:bg-apricot-light hover:scale-[1.04] hover:shadow-[0_0_24px_-4px_rgba(232,168,124,0.55)] active:scale-[0.98]";
const OUTLINE_BTN =
  "inline-flex items-center justify-center rounded-full border border-apricot bg-transparent px-8 py-3 text-sm font-semibold font-sans text-apricot transition-all duration-200 ease-out hover:bg-apricot/10 hover:scale-[1.04] hover:shadow-[0_0_24px_-4px_rgba(232,168,124,0.55)] active:scale-[0.98]";

export default function CtaBand() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) return;

    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const ctx = gsap.context(() => {
      gsap.from("[data-animate]", {
        opacity: 0,
        y: 28,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 80%",
          once: true,
        },
      });

      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top 70%",
        once: true,
        onEnter: () => {
          const pulses = [
            { x: 0.5, y: 0.5, strength: 1.9 },
            { x: 0.42, y: 0.55, strength: 1.3 },
            { x: 0.58, y: 0.45, strength: 1.3 },
          ];
          pulses.forEach((detail, i) => {
            timeouts.push(
              setTimeout(() => {
                window.dispatchEvent(
                  new CustomEvent("refleo:pulse", { detail })
                );
              }, i * 350)
            );
          });
        },
      });
    }, rootRef);

    return () => {
      timeouts.forEach((t) => clearTimeout(t));
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="bg-transparent py-20 md:py-28 text-center"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <h2
          data-animate
          className="font-serif tracking-tight text-cream text-4xl sm:text-6xl lg:text-7xl max-w-4xl mx-auto text-balance"
        >
          {H2_TEXT}
        </h2>

        <div
          data-animate
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href={CTA_DEMO_HREF} className={FILL_BTN}>
            {CTA_DEMO_LABEL}
          </Link>
          <Link href={CTA_INVEST_HREF} className={OUTLINE_BTN}>
            {CTA_INVEST_LABEL}
          </Link>
        </div>
      </div>
    </section>
  );
}
