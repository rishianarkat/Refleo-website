"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Product", href: "/product" },
  { label: "About", href: "/about" },
] as const;

const CONTACT_HREF = "/contact?intent=invest";
const DEMO_HREF = "/contact?intent=demo";
const CONTACT_LABEL = "Contact Us";
const DEMO_LABEL = "Book a Demo";

const FILL_BUTTON =
  "inline-flex items-center justify-center rounded-full bg-apricot px-8 py-3 text-sm font-semibold font-sans text-teal-dark transition-all duration-200 ease-out hover:bg-apricot-light hover:scale-[1.04] hover:shadow-[0_0_24px_-4px_rgba(232,168,124,0.55)] active:scale-[0.98]";
const OUTLINE_BUTTON =
  "inline-flex items-center justify-center rounded-full border border-apricot bg-transparent px-8 py-3 text-sm font-semibold font-sans text-apricot transition-all duration-200 ease-out hover:bg-apricot/10 hover:scale-[1.04] hover:shadow-[0_0_24px_-4px_rgba(232,168,124,0.55)] active:scale-[0.98]";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={[
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-teal-dark/90 backdrop-blur-md border-b border-white/5"
          : "bg-transparent border-b border-transparent",
      ].join(" ")}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-12 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link
          href="/"
          aria-label="Refleo home"
          className="inline-flex min-h-[44px] items-center py-2.5 -my-2.5 shrink-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/svg/refleo-logo-dark.svg"
            alt="Refleo"
            width={132}
            height={40}
            className="h-8 w-auto"
          />
        </Link>

        {/* Desktop links + CTAs */}
        <div className="hidden md:flex items-center gap-8">
          <nav aria-label="Main navigation">
            <ul className="flex items-center gap-6 list-none m-0 p-0">
              {NAV_LINKS.map(({ label, href }) => {
                const active = pathname?.startsWith(href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={[
                        "text-sm font-sans transition-colors duration-200",
                        active ? "text-apricot" : "text-cream/80 hover:text-cream",
                      ].join(" ")}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href={CONTACT_HREF}
              className={`${OUTLINE_BUTTON} !px-5 !py-2`}
            >
              {CONTACT_LABEL}
            </Link>
            <Link href={DEMO_HREF} className={`${FILL_BUTTON} !px-5 !py-2`}>
              {DEMO_LABEL}
            </Link>
          </div>
        </div>

        {/* Mobile: logo + single CTA, no hamburger */}
        <div className="md:hidden">
          <Link href={DEMO_HREF} className={`${FILL_BUTTON} !px-5 !py-2`}>
            {DEMO_LABEL}
          </Link>
        </div>
      </div>
    </header>
  );
}
