"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import Waveform from "@/components/Waveform";

const H1_PRE_WORDS = ["Helping", "clinicians", "capture", "life"];
const H1_EM_WORDS = ["outside", "the", "session"];
const SUB_TEXT =
  "Teens talk through their week in short voice notes. Their therapist walks into the next session already caught up.";
const CTA_DEMO_LABEL = "Book a Demo";
const CTA_DEMO_HREF = "/contact?intent=demo";
const CTA_CONTACT_LABEL = "Get in Touch";
const CTA_CONTACT_HREF = "mailto:info@refleohealth.com?subject=Contact";
const SCROLL_HINT_LABEL = "Scroll";

const FILL_BTN =
  "inline-flex items-center justify-center rounded-full bg-apricot px-8 py-3 text-sm font-semibold font-sans text-teal-dark transition-all duration-200 ease-out hover:bg-apricot-light hover:scale-[1.04] hover:shadow-[0_0_24px_-4px_rgba(232,168,124,0.55)] active:scale-[0.98]";
const OUTLINE_BTN =
  "inline-flex items-center justify-center rounded-full border border-apricot bg-transparent px-8 py-3 text-sm font-semibold font-sans text-apricot transition-all duration-200 ease-out hover:bg-apricot/10 hover:scale-[1.04] hover:shadow-[0_0_24px_-4px_rgba(232,168,124,0.55)] active:scale-[0.98]";

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const waveRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) return;

    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>("[data-word]");

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(words, {
        y: 34,
        opacity: 1,
        duration: 0.9,
        stagger: 0.06,
      })
        .from(
          subRef.current,
          { opacity: 0, y: 28, duration: 0.8 },
          "-=0.5"
        )
        .from(
          waveRef.current,
          { opacity: 0, y: 28, duration: 0.8 },
          "-=0.5"
        )
        .from(
          ctaRef.current,
          { opacity: 0, y: 28, duration: 0.8 },
          "-=0.5"
        );
    }, rootRef);

    const timeoutId = setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("refleo:pulse", {
          detail: { x: 0.5, y: 0.5, strength: 1.8 },
        })
      );
    }, 400);

    return () => {
      ctx.revert();
      clearTimeout(timeoutId);
    };
  }, []);

  function handleScrollHint() {
    document.getElementById("problem")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section
      id="top"
      ref={rootRef}
      className="relative flex min-h-[92vh] items-center justify-center overflow-hidden bg-transparent px-6 pt-24 pb-16 text-center"
    >
      <div className="relative max-w-5xl flex flex-col items-center gap-8">
        <h1
          ref={h1Ref}
          className="font-serif tracking-tight text-cream text-5xl sm:text-7xl lg:text-8xl text-balance"
          style={{ maxWidth: "16ch", lineHeight: 1.05 }}
        >
          {H1_PRE_WORDS.map((word, i) => (
            <span key={`pre-${i}`} data-word className="inline-block mr-[0.25em]">
              {word}
            </span>
          ))}
          {H1_EM_WORDS.map((word, i) => (
            <span key={`em-${i}`} data-word className="inline-block mr-[0.25em]">
              <em className="italic text-apricot">{word}</em>
            </span>
          ))}
        </h1>

        <p
          ref={subRef}
          className="text-lg sm:text-xl text-cream/70 max-w-xl"
        >
          {SUB_TEXT}
        </p>

        <div ref={waveRef} className="w-full flex justify-center">
          <Waveform className="max-w-md opacity-90" />
        </div>

        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link href={CTA_DEMO_HREF} className={FILL_BTN}>
            {CTA_DEMO_LABEL}
          </Link>
          <a href={CTA_CONTACT_HREF} className={OUTLINE_BTN}>
            {CTA_CONTACT_LABEL}
          </a>
        </div>

        <button
          type="button"
          onClick={handleScrollHint}
          aria-label={SCROLL_HINT_LABEL}
          className="mt-8 flex flex-col items-center gap-2 text-cream/60 hover:text-cream transition-colors duration-200 animate-bounce"
        >
          <span className="text-xs uppercase tracking-widest font-sans">
            {SCROLL_HINT_LABEL}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>
    </section>
  );
}
