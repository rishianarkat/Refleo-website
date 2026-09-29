"use client";

// Counts a stat up from zero the first time it scrolls into view, easing out
// so it settles rather than overshoots. The server markup carries the final
// value, so crawlers and reduced-motion visitors only ever see the real number.

import { useEffect, useRef, useState } from "react";

const DURATION_MS = 2000;

export default function CountUp({
  value,
  prefix = "",
  suffix = "",
  delay = 0,
  className = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);
  const [landed, setLanded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setShown(0);
    let raf = 0;
    let timer = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        timer = window.setTimeout(() => {
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / DURATION_MS);
            const eased = 1 - Math.pow(1 - t, 3);
            setShown(Math.round(eased * value));
            if (t < 1) raf = requestAnimationFrame(tick);
            else setLanded(true);
          };
          raf = requestAnimationFrame(tick);
        }, delay);
      },
      { rootMargin: "0px 0px -15% 0px" }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [value, delay]);

  return (
    <span ref={ref} className={`relative inline-block tabular-nums ${className}`}>
      {prefix}
      {shown.toLocaleString("en-US")}
      {suffix}
      {/* One soft ring when the number lands, the brand's ripple in miniature. */}
      {landed && (
        <span
          aria-hidden="true"
          className="v2-ping pointer-events-none absolute -right-3 top-1 h-3 w-3 rounded-full border border-apricot"
        />
      )}
    </span>
  );
}
