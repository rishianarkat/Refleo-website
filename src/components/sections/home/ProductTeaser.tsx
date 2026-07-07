"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// --- Copy constants (apostrophes safe inside JS strings) ---
const EYEBROW = "Product";
const HEADLINE = "The week, organized before the session starts.";
const SUB = "Voice notes in. One-screen brief out.";
const CTA_LABEL = "See it in action";
const CTA_HREF = "/product";

const BRIEF_ALT =
  "Clinician pre-session brief showing recurring themes and keyword matches";

export default function ProductTeaser() {
  const rootRef = useRef<HTMLElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.from(".pt-eyebrow, .pt-h2, .pt-sub, .pt-cta", {
        opacity: 0,
        y: 28,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 80%",
          once: true,
        },
      });

      gsap.from(".pt-mockup", {
        opacity: 0,
        y: 28,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".pt-mockup",
          start: "top 80%",
          once: true,
        },
      });

      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top 70%",
        once: true,
        onEnter: () => {
          window.dispatchEvent(
            new CustomEvent("refleo:pulse", {
              detail: { x: 0.6, y: 0.5, strength: 1.1 },
            })
          );
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches;

    if (reduced || !fine) return;

    const container = rootRef.current?.querySelector(
      ".pt-tilt-wrap"
    ) as HTMLElement | null;
    const mockup = mockupRef.current;
    if (!container || !mockup) return;

    function handleMouseMove(e: MouseEvent) {
      const rect = container!.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(mockup, {
        rotationY: nx * 7,
        rotationX: -ny * 5,
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });
    }

    function handleMouseLeave() {
      gsap.to(mockup, {
        rotationY: 0,
        rotationX: 0,
        duration: 0.8,
        ease: "elastic.out(1,0.5)",
      });
    }

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section ref={rootRef} className="bg-transparent py-20 md:py-24">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          <div>
            <div className="pt-eyebrow mb-6 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="inline-block h-px w-8 bg-apricot/40"
              />
              <span className="text-xs uppercase tracking-widest text-apricot font-semibold font-sans">
                {EYEBROW}
              </span>
            </div>

            <h2 className="pt-h2 font-serif tracking-tight text-cream text-3xl sm:text-5xl max-w-2xl">
              {HEADLINE}
            </h2>

            <p className="pt-sub mt-4 text-cream/70 max-w-xl">{SUB}</p>

            <div className="pt-cta mt-8">
              <Link
                href={CTA_HREF}
                className="inline-flex items-center justify-center rounded-full bg-apricot px-8 py-3 text-sm font-semibold font-sans text-teal-dark transition-all duration-200 ease-out hover:bg-apricot-light hover:scale-[1.04] hover:shadow-[0_0_24px_-4px_rgba(232,168,124,0.55)] active:scale-[0.98]"
              >
                {CTA_LABEL}
              </Link>
            </div>
          </div>

          <div
            className="pt-mockup pt-tilt-wrap mt-16 lg:mt-0"
            style={{ perspective: "1000px" }}
          >
            <div
              ref={mockupRef}
              className="relative w-full rounded-xl overflow-hidden border border-teal-light/20 shadow-2xl shadow-black/40 bg-[#1a2e2e]"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Chrome bar */}
              <div className="flex items-center gap-1.5 px-3 py-2.5 bg-[#243636] border-b border-teal-light/10 shrink-0">
                <span
                  className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]"
                  aria-hidden="true"
                />
                <span
                  className="w-2.5 h-2.5 rounded-full bg-[#FFBC2E]"
                  aria-hidden="true"
                />
                <span
                  className="w-2.5 h-2.5 rounded-full bg-[#28C840]"
                  aria-hidden="true"
                />
                <div
                  className="ml-3 flex-1 bg-teal-dark/60 rounded-md h-4"
                  aria-hidden="true"
                />
              </div>

              <div className="relative w-full aspect-[16/10] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/demo-brief.png"
                  alt={BRIEF_ALT}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
