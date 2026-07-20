"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// --- Copy constants (apostrophes safe inside JS strings) ---
const EYEBROW = "What's inside";

const CALLOUTS = [
  {
    id: "voice",
    title: "Voice-first entries",
    body: "30-second journaling on phone, no prompts",
  },
  {
    id: "custom",
    title: "Clinician-tuned and patient customized",
    body: "Each clinician adjusts settings per client",
  },
  {
    id: "brief",
    title: "Pre-session brief",
    body: "One-screen narrative summary before the appointment",
  },
  {
    id: "guardrails",
    title: "Built-in scope guardrails",
    body: "No automated triage. No direct patient support. No SaMD territory.",
  },
] as const;

export default function Callouts() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(".co-eyebrow", {
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

      gsap.from(".co-item", {
        opacity: 0,
        y: 28,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: ".co-grid",
          start: "top 80%",
          once: true,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="bg-transparent py-20 md:py-24">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="co-eyebrow mb-6 flex items-center gap-3">
          <span
            aria-hidden="true"
            className="inline-block h-px w-8 bg-apricot/40"
          />
          <span className="text-xs uppercase tracking-widest text-apricot font-medium font-sans">
            {EYEBROW}
          </span>
        </div>

        <div className="co-grid grid sm:grid-cols-2 gap-x-12 gap-y-10 max-w-4xl">
          {CALLOUTS.map((callout) => (
            <div key={callout.id} className="co-item">
              <p className="font-sans font-semibold text-cream mb-1">
                <span
                  aria-hidden="true"
                  className="inline-block w-1.5 h-1.5 rounded-full bg-apricot mr-2 align-middle"
                />
                {callout.title}
              </p>
              <p className="text-cream/70 text-base">{callout.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
