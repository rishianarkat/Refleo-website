"use client";

import { useRef, useLayoutEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// --- Copy constants (apostrophes safe inside JS strings) ---
const LINE = "See how Refleo fits into the way you already work.";
const CTA_LABEL = "Book a Demo";
const CTA_HREF = "/contact?intent=demo";

export default function ProductCta() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(".pc-content", {
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
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="bg-teal-deep py-24 md:py-32 text-center"
    >
      <div className="pc-content max-w-6xl mx-auto px-6 lg:px-12">
        <p className="font-serif text-2xl sm:text-3xl text-cream max-w-2xl mx-auto">
          {LINE}
        </p>

        <div className="mt-8">
          <Link
            href={CTA_HREF}
            className="inline-flex items-center justify-center rounded-full bg-apricot px-8 py-3 text-sm font-semibold font-sans text-teal-dark transition-all duration-200 ease-out hover:bg-apricot-light hover:scale-[1.04] hover:shadow-[0_0_24px_-4px_rgba(232,168,124,0.55)] active:scale-[0.98]"
          >
            {CTA_LABEL}
          </Link>
        </div>
      </div>
    </section>
  );
}
