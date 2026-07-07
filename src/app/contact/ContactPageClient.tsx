"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// String consts to avoid raw JSX text with apostrophes / special chars
const HEADLINE = "Let's talk";
const SUBLINE =
  "Tell us a bit about yourself and we'll get back to you within one business day.";
const SUCCESS_MSG = "Thanks. We'll be in touch shortly.";
const ERROR_PREFIX = "Something went wrong. Email us directly at ";
const ERROR_EMAIL = "info@refleohealth.com";
const FORM_SUBJECT = "New Refleo website inquiry";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactPageClient() {
  const [role, setRole] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const containerRef = useRef<HTMLDivElement>(null);

  // Read intent from URL client-side (static-export safe - no useSearchParams)
  useEffect(() => {
    const intent = new URLSearchParams(window.location.search).get("intent");
    if (intent === "demo") {
      setRole("Clinician");
    } else if (intent === "invest") {
      setRole("Investor");
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
    "w-full rounded-xl bg-white/5 border border-teal-light/20 px-4 py-3 text-base text-cream placeholder-cream/40 focus:outline-none focus:border-apricot focus:ring-2 focus:ring-apricot/40 transition-colors duration-150";
  const labelBase = "block text-sm font-medium text-cream/80 mb-1.5 font-sans";

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Navbar />
      <div
        ref={containerRef}
        className="flex-1 flex flex-col px-6 pt-28 pb-12 md:pt-32 md:pb-20"
      >
      {/* Centered page content */}
      <div className="flex-1 flex flex-col items-center">
        {/* Headline + subline */}
        <div className="text-center mb-10">
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl tracking-tight text-cream">
            {HEADLINE}
          </h1>
          <p className="mt-3 font-sans text-cream/70 text-lg leading-relaxed max-w-[420px] mx-auto">
            {SUBLINE}
          </p>
        </div>

        {/* Success state */}
        {status === "success" ? (
          <div
            aria-live="polite"
            className="max-w-[520px] w-full mx-auto flex flex-col items-center gap-4 text-center py-10"
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
              {SUCCESS_MSG}
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
            className="w-full max-w-[520px] mx-auto flex flex-col gap-5"
          >
            {/* Hidden subject */}
            <input type="hidden" name="_subject" value={FORM_SUBJECT} />

            {/* Error banner */}
            {status === "error" && (
              <div
                role="alert"
                className="rounded-xl bg-white/5 border border-apricot/40 px-4 py-3 text-sm font-sans text-cream/80"
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
              className="w-full inline-flex items-center justify-center min-h-[44px] px-6 rounded-full bg-apricot text-teal-dark font-semibold font-sans text-base transition-all duration-200 ease-out hover:bg-apricot-light hover:scale-[1.04] active:scale-[0.98] hover:shadow-[0_0_24px_-4px_rgba(232,168,124,0.55)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
            >
              {status === "submitting" ? "Sending…" : "Send message"}
            </button>
          </form>
        )}
      </div>
      </div>
      <Footer />
    </div>
  );
}
