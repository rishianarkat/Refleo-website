"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE_SELECTORS = "a, button, [data-cursor]";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // SSR / non-fine-pointer guard
    if (typeof window === "undefined") return;
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!isFinePointer || prefersReducedMotion) return;

    // Hide native cursor
    document.documentElement.classList.add("has-custom-cursor");

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Current mouse position (updated instantly)
    let mouseX = -100;
    let mouseY = -100;

    // Ring position (lerps toward mouse)
    let ringX = -100;
    let ringY = -100;

    // Scale target for ring
    let ringScale = 1;

    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest(INTERACTIVE_SELECTORS)) {
        ringScale = 1.6;
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest(INTERACTIVE_SELECTORS)) {
        ringScale = 1;
      }
    };

    const tick = () => {
      // Dot tracks exactly
      dot.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`;

      // Ring lerps with factor 0.12 (subtle lag)
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.transform = `translate(${ringX - 15}px, ${ringY - 15}px) scale(${ringScale})`;

      rafId = requestAnimationFrame(tick);
    };

    // Show cursors once mouse first moves
    const onFirstMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      ringX = e.clientX;
      ringY = e.clientY;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
      document.removeEventListener("mousemove", onFirstMove);
    };

    document.addEventListener("mousemove", onFirstMove);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    rafId = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      document.removeEventListener("mousemove", onFirstMove);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Dot — small precise tracker */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: "#E8A87C",
          pointerEvents: "none",
          zIndex: 99999,
          opacity: 0,
          willChange: "transform",
          transition: "opacity 0.2s ease",
        }}
      />
      {/* Ring — larger lagging follower */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 30,
          height: 30,
          borderRadius: "50%",
          border: "1px solid rgba(127,179,179,0.65)",
          pointerEvents: "none",
          zIndex: 99998,
          opacity: 0,
          willChange: "transform",
          transition: "opacity 0.2s ease, border-color 0.2s ease",
        }}
      />
    </>
  );
}
