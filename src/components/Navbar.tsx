"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = [
  { label: "Problem", href: "#problem" },
  { label: "Solution", href: "#solution" },
  { label: "Story", href: "#story" },
  { label: "Product", href: "#product" },
  { label: "Team", href: "#team" },
] as const;

const OVERLAY_ID = "mobile-nav-overlay";

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // GSAP scroll-triggered background change
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      ScrollTrigger.create({
        start: "40px top",
        onToggle: (self) => {
          setScrolled(self.isActive);
        },
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      const handler = () => setScrolled(window.scrollY > 40);
      window.addEventListener("scroll", handler, { passive: true });
      handler();
      return () => window.removeEventListener("scroll", handler);
    });

    return () => mm.revert();
  }, []);

  // Page-load fade-in — nav appears first in the load sequence
  useLayoutEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const ctx = gsap.context(() => {
      gsap.from(navRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      });
    });
    return () => ctx.revert();
  }, []);

  // Body scroll lock
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Animate mobile overlay open/close
  useEffect(() => {
    const overlay = overlayRef.current;
    const linkItems = linksRef.current?.querySelectorAll("li");

    if (!overlay) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      if (menuOpen) {
        // Make visible before animating in
        gsap.set(overlay, { display: "flex", opacity: 0, scale: 0.97 });
        gsap.to(overlay, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
        if (linkItems && linkItems.length > 0) {
          gsap.fromTo(
            linkItems,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.35,
              stagger: 0.06,
              ease: "power2.out",
              delay: 0.1,
            }
          );
        }
      } else {
        gsap.to(overlay, {
          opacity: 0,
          scale: 0.97,
          duration: 0.25,
          ease: "power2.in",
          onComplete: () => {
            gsap.set(overlay, { display: "none" });
          },
        });
      }
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      if (menuOpen) {
        gsap.set(overlay, { display: "flex", opacity: 1, scale: 1 });
      } else {
        gsap.set(overlay, { display: "none", opacity: 0 });
      }
    });

    return () => mm.revert();
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleSmoothScroll(
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) {
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.getElementById(href.slice(1));
      target?.scrollIntoView({ behavior: "smooth" });
    }
    closeMenu();
  }

  function handleContactScroll(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    closeMenu();
  }

  return (
    <>
      <header
        ref={navRef}
        className={[
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-teal-dark/80 backdrop-blur-md border-b border-white/10 shadow-lg"
            : "bg-transparent",
        ].join(" ")}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-16 md:h-[72px]">
          {/* Logo */}
          <a
            href="#top"
            aria-label="Refleo home"
            className="inline-flex min-h-[44px] items-center py-2.5 -my-2.5 shrink-0"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/svg/refleo-logo-dark.svg"
              alt="Refleo"
              width={132}
              height={40}
              className="h-8 w-auto"
            />
          </a>

          {/* Desktop nav */}
          <nav
            className="hidden md:flex items-center gap-8"
            aria-label="Main navigation"
          >
            <ul className="flex items-center gap-6 list-none m-0 p-0">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    onClick={(e) => handleSmoothScroll(e, href)}
                    className="relative text-sm text-cream/80 hover:text-cream tracking-wide transition-colors duration-200 after:absolute after:left-0 after:-bottom-1 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-apricot after:transition-transform after:duration-300 hover:after:scale-x-100"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex items-center gap-3 ml-2">
              {/* Book a Demo — apricot fill */}
              <a
                href="mailto:info@refleohealth.com?subject=Demo Request"
                className="inline-flex items-center px-5 py-2 rounded-full bg-apricot text-teal-dark text-sm font-medium hover:bg-apricot-light transition-all duration-200 ease-out whitespace-nowrap hover:scale-[1.04] active:scale-[0.98] hover:shadow-[0_0_24px_-4px_rgba(232,168,124,0.55)]"
              >
                Book a Demo
              </a>
              {/* Contact Us — apricot outline */}
              <a
                href="#contact"
                onClick={handleContactScroll}
                className="inline-flex items-center px-5 py-2 rounded-full border border-apricot text-apricot bg-transparent text-sm font-medium hover:bg-apricot/10 transition-all duration-200 ease-out whitespace-nowrap hover:scale-[1.04] active:scale-[0.98] hover:shadow-[0_0_24px_-4px_rgba(232,168,124,0.55)]"
              >
                Contact Us
              </a>
            </div>
          </nav>

          {/* Hamburger (mobile only) */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-11 h-11 gap-1.5 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-apricot"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls={OVERLAY_ID}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span
              className={[
                "block w-6 h-0.5 bg-cream transition-all duration-300 origin-center",
                menuOpen ? "translate-y-2 rotate-45" : "",
              ].join(" ")}
            />
            <span
              className={[
                "block w-6 h-0.5 bg-cream transition-all duration-300",
                menuOpen ? "opacity-0 scale-x-0" : "",
              ].join(" ")}
            />
            <span
              className={[
                "block w-6 h-0.5 bg-cream transition-all duration-300 origin-center",
                menuOpen ? "-translate-y-2 -rotate-45" : "",
              ].join(" ")}
            />
          </button>
        </div>
      </header>

      {/* Mobile full-screen overlay */}
      <div
        id={OVERLAY_ID}
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="fixed inset-0 z-[60] bg-teal-dark flex-col items-center justify-center hidden"
      >
        {/* Close button */}
        <button
          className="absolute top-5 right-6 w-11 h-11 flex items-center justify-center text-cream/70 hover:text-cream transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-apricot rounded"
          aria-label="Close menu"
          onClick={closeMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Nav links */}
        <ul
          ref={linksRef}
          className="list-none m-0 p-0 flex flex-col items-center gap-8 mb-12"
        >
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                onClick={(e) => handleSmoothScroll(e, href)}
                className="relative text-3xl font-light text-cream/80 hover:text-cream tracking-wide transition-colors duration-200 after:absolute after:left-0 after:-bottom-1 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-apricot after:transition-transform after:duration-300 hover:after:scale-x-100"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile CTAs */}
        <div className="flex flex-col items-center gap-4">
          <a
            href="mailto:info@refleohealth.com?subject=Demo Request"
            onClick={closeMenu}
            className="inline-flex items-center px-8 py-3 rounded-full bg-apricot text-teal-dark text-base font-medium hover:bg-apricot-light transition-all duration-200 ease-out hover:scale-[1.04] active:scale-[0.98] hover:shadow-[0_0_24px_-4px_rgba(232,168,124,0.55)]"
          >
            Book a Demo
          </a>
          <a
            href="#contact"
            onClick={handleContactScroll}
            className="inline-flex items-center px-8 py-3 rounded-full border border-apricot text-apricot bg-transparent text-base font-medium hover:bg-apricot/10 transition-all duration-200 ease-out hover:scale-[1.04] active:scale-[0.98] hover:shadow-[0_0_24px_-4px_rgba(232,168,124,0.55)]"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </>
  );
}
