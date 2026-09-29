"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroGradient from "@/components/v2/HeroGradient";
import ModeToggle from "@/components/v2/ModeToggle";

// String consts to avoid raw JSX text with apostrophes / special chars
const HEADLINE = "Let's talk";
const SUBLINE =
  "Tell us a bit about yourself and we'll get back to you within one business day.";
const SUCCESS_MSG = "Thanks. We'll be in touch shortly.";
const ERROR_PREFIX = "Something went wrong. Email us directly at ";
const ERROR_EMAIL = "support@refleohealth.com";
const FORM_SUBJECT = "New Refleo website inquiry";

// Launch-day sign-up (LinkedIn teaser links to /contact?intent=launch).
// Same Formspree form, same fields; only the framing and the email subject
// change, so the inbox can tell a launch sign-up from a demo request.
const LAUNCH_HEADLINE = "Refleo opens September 18";
const LAUNCH_SUBLINE =
  "Leave your name and email and we'll send you the link the morning it opens, with the free trial ready to go.";
const LAUNCH_FORM_SUBJECT = "Refleo launch sign-up";
const LAUNCH_SUCCESS_MSG = "You're on the list. See you on the 18th.";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactPageClient() {
  const [role, setRole] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [launch, setLaunch] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Read intent from URL client-side (static-export safe - no useSearchParams)
  useEffect(() => {
    const intent = new URLSearchParams(window.location.search).get("intent");
    if (intent === "demo") {
      setRole("Clinician");
    } else if (intent === "invest") {
      setRole("Investor");
    } else if (intent === "launch") {
      setRole("Clinician");
      setLaunch(true);
    }
  }, []);

  // Subtle fade-in on mount, reduced-motion safe
  useLayoutEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(containerRef.current, {
        opacity: 0,
        y: 16,
        duration: 0.7,
        ease: "power3.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("submitting");
    try {
      const res = await fetch("https://formspree.io/f/xzdqwkyp", {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
        setRole("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const fieldBase =
    "w-full rounded-none bg-black/30 border border-cream/15 px-4 py-3 text-base text-cream placeholder-cream/35 focus:outline-none focus:border-apricot focus:ring-1 focus:ring-apricot/60 transition-colors duration-150";
  const labelBase =
    "block font-mono text-[11px] uppercase tracking-[0.16em] text-cream/55 mb-2";

  return (
    <div className="min-h-screen flex flex-col bg-ink">
      <Navbar />
      <div ref={containerRef} className="relative flex-1 overflow-hidden">
        <HeroGradient />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-ink via-ink/60 to-ink/20"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent"
        />
      <div className="relative z-10 mx-auto grid max-w-7xl gap-14 px-6 pt-36 pb-24 lg:grid-cols-[1fr_minmax(0,520px)] lg:gap-20 lg:px-12 lg:pt-44 lg:pb-32">
        {/* Headline + subline */}
        <div className="lg:self-start">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-cream/70">
            Contact
          </p>
          <h1 className="mt-6 font-serif text-[clamp(3rem,7vw,6.5rem)] font-medium leading-[0.92] tracking-[-0.035em] text-cream">
            {launch ? LAUNCH_HEADLINE : HEADLINE}
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-cream/75">
            {launch ? LAUNCH_SUBLINE : SUBLINE}
          </p>
          <dl className="mt-12 max-w-md border-t border-cream/10 font-mono text-[11px] uppercase tracking-[0.14em]">
            <div className="flex justify-between gap-6 border-b border-cream/10 py-4">
              <dt className="text-cream/40">Email</dt>
              <dd>
                <a href={`mailto:${ERROR_EMAIL}`} className="text-cream/80 hover:text-apricot">
                  {ERROR_EMAIL}
                </a>
              </dd>
            </div>
            <div className="flex justify-between gap-6 border-b border-cream/10 py-4">
              <dt className="text-cream/40">Reply</dt>
              <dd className="text-cream/80">Within one business day</dd>
            </div>
          </dl>
        </div>

        <div className="border border-cream/15 bg-ink/70 p-6 backdrop-blur-md sm:p-8">
        {/* Success state */}
        {status === "success" ? (
          <div
            aria-live="polite"
            className="w-full flex flex-col items-center gap-4 text-center py-10"
          >
            {/* Apricot check icon */}
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="24" cy="24" r="23" stroke="#E8A87C" strokeWidth="2" />
              <path
                d="M14 24.5l7 7 13-13"
                stroke="#E8A87C"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="font-sans text-xl sm:text-2xl text-cream font-medium">
              {launch ? LAUNCH_SUCCESS_MSG : SUCCESS_MSG}
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex items-center justify-center rounded-full border border-apricot bg-transparent px-8 py-3 text-sm font-semibold font-sans text-apricot transition-all duration-200 ease-out hover:bg-apricot/10 hover:scale-[1.04] hover:shadow-[0_0_24px_-4px_rgba(232,168,124,0.55)] active:scale-[0.98]"
            >
              Back to home
            </Link>
          </div>
        ) : (
          /* Form */
          <form
            onSubmit={handleSubmit}
            noValidate
            className="w-full flex flex-col gap-5"
          >
            {/* Hidden subject */}
            <input
              type="hidden"
              name="_subject"
              value={launch ? LAUNCH_FORM_SUBJECT : FORM_SUBJECT}
            />
            {launch ? <input type="hidden" name="intent" value="launch" /> : null}

            {/* Error banner */}
            {status === "error" && (
              <div
                role="alert"
                className="bg-black/30 border border-apricot/40 px-4 py-3 text-sm font-sans text-cream/80"
              >
                {ERROR_PREFIX}
                <a
                  href={`mailto:${ERROR_EMAIL}`}
                  className="text-apricot underline underline-offset-2 hover:text-apricot-light transition-colors duration-150"
                >
                  {ERROR_EMAIL}
                </a>
              </div>
            )}

            {/* Name */}
            <div>
              <label htmlFor="name" className={labelBase}>
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Your name"
                className={`${fieldBase} min-h-[44px]`}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className={labelBase}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className={`${fieldBase} min-h-[44px]`}
              />
            </div>

            {/* Role - controlled select */}
            <div>
              <label htmlFor="role" className={labelBase}>
                Role
              </label>
              <div className="relative">
                <select
                  id="role"
                  name="role"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={`${fieldBase} min-h-[44px] appearance-none pr-10 cursor-pointer`}
                  style={{ colorScheme: "dark" }}
                >
                  <option value="" disabled>
                    Select one…
                  </option>
                  <option value="Clinician">Clinician</option>
                  <option value="Investor">Investor</option>
                  <option value="Group Practice">Group Practice</option>
                  <option value="Other">Other</option>
                </select>
                {/* Custom chevron */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-cream/50"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M4 6l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className={labelBase}>
                Message (optional)
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder="Anything you'd like us to know…"
                className={fieldBase}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full inline-flex items-center justify-center min-h-[44px] px-6 rounded-full bg-apricot text-ink font-semibold font-sans text-base transition-colors duration-200 ease-out hover:bg-apricot-light disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === "submitting" ? "Sending…" : "Send message"}
            </button>
          </form>
        )}
        </div>
      </div>
      </div>
      <Footer />
      <ModeToggle active="human" />
    </div>
  );
}
