"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Tunables ────────────────────────────────────────────────────────────
const FLIPS_PER_DIGIT = 4;    // random flips before landing on the real digit
const FLIP_DURATION = 0.11;   // seconds per flip
const DIGIT_STAGGER = 0.07;   // seconds between digit cascades (left to right)
const STAT_STAGGER = 0.2;     // seconds between sibling stats (via delayIndex)
const TILT_START_DEG = 26;    // whole-number 3D perspective tilt-in
// ──────────────────────────────────────────────────────────────────────────

interface AnimatedStatProps {
  value: number;
  suffix?: string;
  useLocale?: boolean;
  delayIndex?: number;
  className?: string;
}

export default function AnimatedStat({
  value,
  suffix = "",
  useLocale = true,
  delayIndex = 0,
  className = "",
}: AnimatedStatProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const finalText =
    (useLocale ? value.toLocaleString("en-US") : String(value)) + suffix;

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return; // SSR markup already shows the final value

    const ctx = gsap.context(() => {
      const digitEls = Array.from(
        root.querySelectorAll<HTMLElement>("[data-digit]")
      );

      gsap.set(root, { autoAlpha: 0 });

      ScrollTrigger.create({
        trigger: root,
        start: "top 85%",
        once: true,
        onEnter: () => {
          const delay = delayIndex * STAT_STAGGER;

          gsap.fromTo(
            root,
            { autoAlpha: 0, rotationX: TILT_START_DEG, transformPerspective: 600 },
            { autoAlpha: 1, rotationX: 0, duration: 0.7, delay, ease: "power2.out" }
          );

          digitEls.forEach((span, idx) => {
            const finalChar = span.dataset.digit || "0";
            const tl = gsap.timeline({ delay: delay + 0.1 + idx * DIGIT_STAGGER });
            for (let f = 0; f < FLIPS_PER_DIGIT; f++) {
              tl.call(() => {
                span.textContent = String(Math.floor(Math.random() * 10));
              });
              tl.fromTo(
                span,
                { rotationX: -80 },
                { rotationX: 0, duration: FLIP_DURATION, ease: "power1.out" }
              );
            }
            tl.call(() => {
              span.textContent = finalChar;
            });
            tl.fromTo(
              span,
              { rotationX: -80 },
              { rotationX: 0, duration: 0.15, ease: "back.out(1.7)" }
            );
          });
        },
      });
    }, root);

    return () => ctx.revert();
  }, [delayIndex]);

  return (
    <span
      ref={rootRef}
      className={className}
      style={{ display: "inline-block" }}
    >
      {finalText.split("").map((ch, i) =>
        /[0-9]/.test(ch) ? (
          <span
            key={i}
            data-digit={ch}
            style={{ display: "inline-block", backfaceVisibility: "hidden" }}
          >
            {ch}
          </span>
        ) : (
          <span key={i} style={{ display: "inline-block" }}>
            {ch}
          </span>
        )
      )}
    </span>
  );
}
