"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ConcentricArcs } from "@/components/ripples/RippleArt";

gsap.registerPlugin(ScrollTrigger);

const EYEBROW = "01 · The Problem";
const H2_TEXT = "Fifty minutes a week is not the whole story.";
const STAT_FINAL = 10030;
const STAT_CAPTION = "minutes every week the clinician can't see";
const BODY_TEXT =
  "Sessions start cold. The first ten minutes go to reconstructing the week from memory. Crises fade, breakthroughs blur, and small moments disappear before the next appointment. People forget. Some never had the words in the first place. Others aren't ready to say it out loud.";
const QUOTE_TEXT =
  "By the time they're in my office, I've lost the week. I'm building a picture from what they happen to remember in the first five minutes.";
const QUOTE_ATTRIBUTION = "LPC, Private Practice";

export default function Problem() {
  const rootRef = useRef<HTMLElement>(null);
  const statRef = useRef<HTMLSpanElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const [displayStat, setDisplayStat] = useState(STAT_FINAL);

  useLayoutEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setDisplayStat(STAT_FINAL);
      return;
    }

    setDisplayStat(0);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-animate]").forEach((el) => {
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

      gsap.set(captionRef.current, { opacity: 0 });
      gsap.set(statRef.current, { scale: 0.92, y: 20 });

      const counter = { value: 0 };
      ScrollTrigger.create({
        trigger: statRef.current,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(counter, {
            value: STAT_FINAL,
            duration: 2,
            ease: "power2.out",
            onUpdate: () => {
              setDisplayStat(Math.round(counter.value));
            },
          });
          gsap.to(statRef.current, {
            scale: 1,
            y: 0,
            duration: 2,
            ease: "power2.out",
          });
          gsap.to(captionRef.current, {
            opacity: 1,
            duration: 0.6,
            delay: 1.8,
          });
        },
      });

      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top 70%",
        once: true,
        onEnter: () => {
          window.dispatchEvent(
            new CustomEvent("refleo:pulse", {
              detail: { x: 0.3, y: 0.4, strength: 1.2 },
            })
          );
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="problem" ref={rootRef} className="relative bg-transparent overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-6 lg:px-12 py-20 md:py-24">
        <div data-animate className="mb-6 inline-flex items-center gap-4">
          <span
            aria-hidden="true"
            className="inline-block h-px w-8 bg-apricot/40"
          />
          <span className="text-xs uppercase tracking-widest text-apricot font-medium font-sans">
            {EYEBROW}
          </span>
        </div>

        <h2
          data-animate
          className="font-serif tracking-tight text-cream text-3xl sm:text-5xl lg:text-6xl max-w-3xl"
        >
          {H2_TEXT}
        </h2>

        <div data-animate className="mt-16">
          <span
            ref={statRef}
            className="inline-block font-serif text-8xl sm:text-9xl lg:text-[11rem] text-apricot tabular-nums leading-none"
          >
            {displayStat.toLocaleString("en-US")}
          </span>
          <p ref={captionRef} className="mt-4 text-cream/70 text-lg">
            {STAT_CAPTION}
          </p>
        </div>

        <p
          data-animate
          className="mt-16 text-cream/70 text-lg leading-relaxed max-w-2xl"
        >
          {BODY_TEXT}
        </p>

        <div data-animate className="mt-20 max-w-3xl">
          <span
            aria-hidden="true"
            className="block font-serif text-7xl leading-none text-apricot select-none"
          >
            &ldquo;
          </span>
          <p className="font-serif italic text-2xl sm:text-3xl lg:text-4xl text-cream leading-snug">
            {QUOTE_TEXT}
          </p>
          <p className="mt-6 text-sm uppercase tracking-widest text-cream/50 font-sans">
            {QUOTE_ATTRIBUTION}
          </p>
        </div>
      </div>

      <ConcentricArcs className="pointer-events-none absolute bottom-0 right-0 w-64 md:w-96 text-teal-light/40 translate-x-1/4 translate-y-1/4" />
    </section>
  );
}
