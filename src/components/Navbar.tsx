"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isV2Route } from "@/components/v2/routes";

const NAV_LINKS = [
  { label: "Product", href: "/product" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
] as const;

const CONTACT_HREF = "/contact?intent=invest";
const PORTAL_HREF = "https://app.refleohealth.com/?choose=1";
const CONTACT_LABEL = "Contact Us";
const PORTAL_LABEL = "Start free trial";
const MOBILE_MENU_ID = "mobile-menu";

const FILL_BUTTON =
  "inline-flex items-center justify-center rounded-full bg-apricot px-8 py-3 text-sm font-semibold font-sans text-teal-dark transition-all duration-200 ease-out hover:bg-apricot-light hover:scale-[1.04] hover:shadow-[0_0_24px_-4px_rgba(232,168,124,0.55)] active:scale-[0.98]";
const OUTLINE_BUTTON =
  "inline-flex items-center justify-center rounded-full border border-apricot bg-transparent px-8 py-3 text-sm font-semibold font-sans text-apricot transition-all duration-200 ease-out hover:bg-apricot/10 hover:scale-[1.04] hover:shadow-[0_0_24px_-4px_rgba(232,168,124,0.55)] active:scale-[0.98]";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // Close the mobile menu on any navigation, including the back button, not
  // only on a tap inside it. Adjusting state during render when a value
  // changes is React's recommended alternative to an effect for this.
  const [menuPathname, setMenuPathname] = useState(pathname);
  if (pathname !== menuPathname) {
    setMenuPathname(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // While the menu is open: Escape closes it and returns focus to the button
  // that opened it, and widening past the mobile breakpoint closes it so it
  // cannot reappear the next time the window narrows.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 768px)");
    const onBreakpoint = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [menuOpen]);

  // An open menu needs a solid header behind it even at the top of the page,
  // where the header is otherwise transparent over the hero.
  const solidHeader = scrolled || menuOpen;

  return (
    <header
      className={[
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        solidHeader
          ? isV2Route(pathname)
            ? "bg-ink/80 backdrop-blur-md border-b border-white/5"
            : "bg-teal-dark/95 backdrop-blur-md border-b border-white/5"
          : isV2Route(pathname)
            ? // Over the moving gradient: a soft ink scrim keeps the links
              // readable when the bright band drifts behind the bar.
              "bg-gradient-to-b from-ink/85 via-ink/50 to-transparent border-b border-transparent"
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
            className="h-9 w-auto md:h-12"
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
                        "relative text-sm font-sans transition-colors duration-200",
                        "after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:bg-apricot after:origin-left after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100",
                        active
                          ? "text-apricot after:scale-x-100"
                          : "text-cream/80 hover:text-cream",
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
            <Link href={PORTAL_HREF} className={`${FILL_BUTTON} !px-5 !py-2`}>
              {PORTAL_LABEL}
            </Link>
          </div>
        </div>

        {/* Mobile: the trial CTA stays in the header; everything else is in the
            menu. Below 360px there is no room for both, and the menu repeats
            the CTA, so the header copy steps aside. */}
        <div className="md:hidden flex items-center gap-2">
          <Link
            href={PORTAL_HREF}
            className={`${FILL_BUTTON} !px-4 !py-2 max-[359px]:hidden`}
          >
            {PORTAL_LABEL}
          </Link>
          <button
            ref={menuButtonRef}
            type="button"
            aria-expanded={menuOpen}
            aria-controls={MOBILE_MENU_ID}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-cream transition-colors duration-200 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-apricot"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {menuOpen ? (
                <>
                  <path d="M6 6l12 12" />
                  <path d="M18 6L6 18" />
                </>
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div
        id={MOBILE_MENU_ID}
        hidden={!menuOpen}
        className="md:hidden border-t border-white/5 bg-teal-dark/95 backdrop-blur-md"
      >
        <nav aria-label="Mobile navigation" className="px-6 pt-2 pb-6">
          <ul className="list-none m-0 p-0">
            {NAV_LINKS.map(({ label, href }) => {
              const active = pathname?.startsWith(href);
              return (
                <li key={href} className="border-b border-white/5">
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={[
                      "flex min-h-[52px] items-center text-base font-sans transition-colors duration-200",
                      active ? "text-apricot" : "text-cream/85 hover:text-cream",
                    ].join(" ")}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href={CONTACT_HREF}
              onClick={() => setMenuOpen(false)}
              className={`${OUTLINE_BUTTON} w-full`}
            >
              {CONTACT_LABEL}
            </Link>
            <Link
              href={PORTAL_HREF}
              onClick={() => setMenuOpen(false)}
              className={`${FILL_BUTTON} w-full`}
            >
              {PORTAL_LABEL}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
