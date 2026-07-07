"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { WaveLines } from "@/components/ripples/RippleArt";

gsap.registerPlugin(ScrollTrigger);

// --- Copy constants (apostrophes safe inside JS strings) ---
const EYEBROW = "How it works";

const STEPS = [
  {
    number: "1",
    title: "A teen records a short entry",
    body: "Thirty seconds, voice or text, whenever it happens.",
  },
  {
    number: "2",
    title: "Refleo listens for what the clinician flagged",
    body: "Themes, shifts, and keywords set per client.",
  },
  {
    number: "3",
    title: "The clinician gets a brief before the session",
    body: "One screen. The week, organized.",
  },
] as const;

export default function HowItWorks() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(".hiw-eyebrow", {
        opacity: 0,
        y: 28,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 80%",
          once: true,
        },
      });

      gsap.from(".hiw-step", {
        opacity: 0,
        y: 28,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: ".hiw-steps",
          start: "top 80%",
          once: true,
        },
      });

      gsap.from(".hiw-waves", {
        opacity: 0,
        y: 28,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".hiw-waves",
          start: "top 85%",
          once: true,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="bg-teal-deep/60 py-20 md:py-24">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="hiw-eyebrow mb-6 flex items-center gap-3">
          <span
            aria-hidden="true"
            className="inline-block h-px w-8 bg-apricot/40"
          />
          <span className="text-xs uppercase tracking-widest text-apricot font-medium font-sans">
            {EYEBROW}
          </span>
        </div>

        <div className="hiw-steps grid md:grid-cols-3 gap-10">
          {STEPS.map((step) => (
            <div key={step.number} className="hiw-step">
              <span className="font-serif text-6xl text-apricot/60 leading-none">
                {step.number}
              </span>
              <h3 className="font-sans font-semibold text-cream text-lg mt-4">
                {step.title}
              </h3>
              <p className="text-cream/70 mt-2">{step.body}</p>
            </div>
          ))}
        </div>

        <WaveLines
          className="hiw-waves text-teal-light/25 w-full max-w-md mt-16 mx-auto"
        />
      </div>
    </section>
  );
}
