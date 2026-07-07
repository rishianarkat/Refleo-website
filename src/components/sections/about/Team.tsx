"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HEADLINE = "Meet the team";

const TEAM = [
  {
    name: "Vishwas Vijayan",
    role: "Co-Founder",
    affiliation: "Rice University · Finance / BBA",
    photo: "/images/vishwas.jpg",
    alt: "Portrait of Vishwas Vijayan",
    bullets: [
      "Finance/BBA @ Rice building the commercial and go-to-market side of Refleo",
      "Junior Associate at a $55M Houston VC fund; AI analyst at AfterQuery (YC W'25)",
    ],
  },
  {
    name: "Rishi Anarkat",
    role: "Co-Founder",
    affiliation: "Rice University · AI / Pre-Med",
    photo: "/images/rishi.jpg",
    alt: "Portrait of Rishi Anarkat",
    bullets: [
      "AI/Pre-Med @ Rice architecting Refleo's voice journaling and clinical continuity platform",
      "Healthcare and AI/ML researcher at M.D. Anderson, Baylor College of Medicine, and McGovern School of Medicine",
    ],
  },
];

const TAGLINE =
  "We're here because we went out instead of staying in on a Friday night during a hackathon. We won first place anyway.";

export default function Team() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-team-heading]", {
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

      const cards = gsap.utils.toArray<HTMLElement>("[data-team-card]");
      gsap.from(cards, {
        opacity: 0,
        y: 28,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 75%",
          once: true,
        },
      });

      gsap.from("[data-team-tagline]", {
        opacity: 0,
        y: 28,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-team-tagline]",
          start: "top 85%",
          once: true,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="bg-teal-deep py-28 md:py-40">
      <div className="mx-auto max-w-6xl px-6 lg:px-12">
        <h2
          className="font-serif text-3xl tracking-tight text-cream sm:text-5xl lg:text-6xl"
          data-team-heading
        >
          {HEADLINE}
        </h2>

        <div className="mt-16 grid gap-10 md:grid-cols-2 md:items-start md:gap-14">
          {TEAM.map((member) => (
            <div key={member.name} data-team-card>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={member.photo}
                alt={member.alt}
                loading="lazy"
                decoding="async"
                className="aspect-[4/5] w-full rounded-2xl object-cover"
              />

              <p className="mt-6 font-serif text-2xl text-cream">
                {member.name}
              </p>
              <p className="mt-1 text-sm text-cream/60">
                {member.role} &middot; {member.affiliation}
              </p>

              <ul className="mt-4 space-y-3">
                {member.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex gap-3 text-base leading-relaxed text-cream/75"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-apricot"
                    />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p
          className="mt-16 text-center font-serif text-lg italic text-cream/80 sm:text-xl"
          data-team-tagline
        >
          {TAGLINE}
        </p>
      </div>
    </section>
  );
}
