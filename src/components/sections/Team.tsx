"use client";

import { useLayoutEffect, useRef, useState, useCallback, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// --- Copy constants (apostrophes/special chars must live here, not in JSX text) ---
const SECTION_NUMBER = "06";
const SECTION_LABEL = "Team";
const HEADLINE = "Meet the Team";

const VISHWAS_NAME = "Vishwas Vijayan";
const VISHWAS_ROLE = "Co-Founder";
const VISHWAS_AFFILIATION = "Rice University · Finance / BBA";
const VISHWAS_BULLET_1 =
  "Finance/BBA @ Rice building the commercial and go-to-market side of Refleo";
const VISHWAS_BULLET_2 =
  "Junior Associate at a $55M Houston VC fund; AI analyst at AfterQuery (YC W'25)";

const RISHI_NAME = "Rishi Anarkat";
const RISHI_ROLE = "Co-Founder";
const RISHI_AFFILIATION = "Rice University · AI / Pre-Med";
const RISHI_BULLET_1 =
  "AI/Pre-Med @ Rice architecting Refleo's voice journaling and clinical continuity platform";
const RISHI_BULLET_2 =
  "Healthcare and AI/ML researcher at M.D. Anderson, Baylor College of Medicine, and McGovern School of Medicine";

const TAGLINE_PREFIX =
  "We're here because we decided to go out instead of staying in on a Friday during a Hackathon";
const TAGLINE_SUFFIX = "— And won 1st";

const READ_BIO_LABEL = "Read bio";
const CLOSE_BIO_LABEL = "Close bio";

// ---------------------------------------------------------------------------

interface ExpandableCardProps {
  cardRef: RefObject<HTMLDivElement>;
  photo: string;
  photoAlt: string;
  name: string;
  role: string;
  affiliation: string;
  bullet1: string;
  bullet2: string;
  bioId: string;
  prefersReducedMotion: boolean;
}

function ExpandableCard({
  cardRef,
  photo,
  photoAlt,
  name,
  role,
  affiliation,
  bullet1,
  bullet2,
  bioId,
  prefersReducedMotion,
}: ExpandableCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const bioWrapperRef = useRef<HTMLDivElement>(null);
  const activeTweenRef = useRef<gsap.core.Tween | null>(null);

  const toggle = useCallback(() => {
    const wrapper = bioWrapperRef.current;
    if (!wrapper) return;

    if (prefersReducedMotion) {
      // Under reduced motion: instant toggle, no GSAP animation
      setIsOpen((prev) => !prev);
      return;
    }

    // Kill any in-progress tween before starting the new one
    if (activeTweenRef.current) {
      activeTweenRef.current.kill();
      activeTweenRef.current = null;
    }

    if (!isOpen) {
      // Opening: ensure visible, then animate height + opacity to natural size
      gsap.set(wrapper, { height: 0, opacity: 0, overflow: "hidden", display: "block" });
      activeTweenRef.current = gsap.to(wrapper, {
        height: "auto",
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
        clearProps: "height",
      });
      setIsOpen(true);
    } else {
      // Closing: animate height + opacity to 0, then hide
      activeTweenRef.current = gsap.to(wrapper, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(wrapper, { display: "none" });
        },
      });
      setIsOpen(false);
    }
  }, [isOpen, prefersReducedMotion]);

  return (
    <div
      ref={cardRef}
      className="group flex flex-col rounded-2xl bg-white/5 border border-teal-light/15 p-6 transition-all duration-300 hover:bg-white/10 hover:-translate-y-1.5 hover:shadow-2xl"
    >
      {/* Photo */}
      <div className="relative mb-6 aspect-[4/5] w-full overflow-hidden rounded-xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo}
          alt={photoAlt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Name + role + affiliation */}
      <p className="mb-0.5 text-xl font-semibold text-cream">{name}</p>
      <p className="mb-1 text-sm font-medium text-apricot">{role}</p>
      <p className="mb-4 text-xs font-medium text-cream/60">{affiliation}</p>

      {/* Toggle button */}
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-controls={bioId}
        className="mt-auto flex min-h-[44px] items-center gap-2 self-start rounded-lg px-4 py-2.5 text-sm font-medium text-cream/80 ring-1 ring-teal-light/20 transition-all duration-200 hover:bg-white/10 hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-apricot"
      >
        <span>{isOpen ? CLOSE_BIO_LABEL : READ_BIO_LABEL}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          className={`h-4 w-4 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Expandable bio region */}
      <div
        id={bioId}
        ref={bioWrapperRef}
        role="region"
        aria-label={`${name} bio`}
        style={
          prefersReducedMotion
            ? undefined
            : { height: 0, opacity: 0, overflow: "hidden", display: "none" }
        }
        className={
          prefersReducedMotion
            ? isOpen
              ? "mt-4 overflow-hidden"
              : "hidden"
            : "overflow-hidden"
        }
      >
        <ul className="mt-4 space-y-2">
          <li className="flex gap-2.5 text-base leading-relaxed text-cream/80 sm:text-sm">
            <span
              className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-apricot"
              aria-hidden="true"
            />
            {bullet1}
          </li>
          <li className="flex gap-2.5 text-base leading-relaxed text-cream/80 sm:text-sm">
            <span
              className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-apricot"
              aria-hidden="true"
            />
            {bullet2}
          </li>
        </ul>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

export default function Team() {
  const rootRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);

    const ctx = gsap.context(() => {
      if (mq.matches) return;

      // Header fades + slides in
      gsap.fromTo(
        headerRef.current,
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // Cards stagger in
      gsap.fromTo(
        [card1Ref.current, card2Ref.current],
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: card1Ref.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // Tagline fades in
      gsap.fromTo(
        taglineRef.current,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: taglineRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="team"
      ref={rootRef}
      className="bg-teal-dark text-cream py-28 md:py-40"
    >
      <div className="mx-auto max-w-5xl px-6 lg:px-12">
        {/* Section header */}
        <div ref={headerRef} className="mb-16 md:mb-20">
          {/* Dragonfly-style numbered label */}
          <div className="mb-4 flex items-baseline gap-4">
            <span
              className="font-semibold leading-none text-apricot"
              style={{ fontSize: "clamp(3rem, 8vw, 5.5rem)" }}
              aria-hidden="true"
            >
              {SECTION_NUMBER}
            </span>
            <span className="text-xs font-medium uppercase tracking-widest text-cream/50">
              {SECTION_LABEL}
            </span>
          </div>

          <h2 className="text-3xl font-semibold tracking-tight text-cream text-balance sm:text-5xl lg:text-6xl">
            {HEADLINE}
          </h2>
        </div>

        {/* Founder cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
          <ExpandableCard
            cardRef={card1Ref}
            photo="/images/vishwas.jpg"
            photoAlt={VISHWAS_NAME}
            name={VISHWAS_NAME}
            role={VISHWAS_ROLE}
            affiliation={VISHWAS_AFFILIATION}
            bullet1={VISHWAS_BULLET_1}
            bullet2={VISHWAS_BULLET_2}
            bioId="vishwas-bio"
            prefersReducedMotion={prefersReducedMotion}
          />
          <ExpandableCard
            cardRef={card2Ref}
            photo="/images/rishi.jpg"
            photoAlt={RISHI_NAME}
            name={RISHI_NAME}
            role={RISHI_ROLE}
            affiliation={RISHI_AFFILIATION}
            bullet1={RISHI_BULLET_1}
            bullet2={RISHI_BULLET_2}
            bioId="rishi-bio"
            prefersReducedMotion={prefersReducedMotion}
          />
        </div>

        {/* Bottom tagline */}
        <p
          ref={taglineRef}
          className="mt-16 text-center text-lg font-medium text-cream sm:text-xl md:mt-20"
        >
          {TAGLINE_PREFIX}{" "}
          <span className="text-apricot">{TAGLINE_SUFFIX}</span>
        </p>
      </div>
    </section>
  );
}
