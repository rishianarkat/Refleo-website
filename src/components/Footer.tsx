"use client";

import { usePathname } from "next/navigation";
import { twinOf } from "@/lib/viewMode";
import Link from "next/link";

const MISSION_LINE = "Helping clinicians capture life outside the session.";

const EXPLORE_LINKS = [
  { label: "Home", href: "/" },
  { label: "Product", href: "/product" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

const ACTION_LINKS = [
  { label: "Start free trial", href: "https://app.refleohealth.com/?choose=1" },
  { label: "Sign in", href: "https://app.refleohealth.com/sign-in/" },
  { label: "iPhone app", href: "https://apps.apple.com/us/app/refleo/id6807892935" },
  { label: "Book a Demo", href: "/contact?intent=demo" },
  { label: "Invest in Refleo", href: "/contact?intent=invest" },
] as const;

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/legal/privacy/2026-09-18/" },
  { label: "Terms of Service", href: "/legal/terms/2026-09-18/" },
  { label: "BAA", href: "/legal/baa/1.0/" },
  { label: "Parental Consent", href: "/legal/parental_consent/1.0/" },
  { label: "Subprocessors", href: "/legal/subprocessors/" },
  { label: "Pricing", href: "/pricing/" },
] as const;

const COPYRIGHT = "© 2026 Refleo Health, Inc.";
const SITE_LABEL = "www.refleohealth.com";
const SITE_URL = "https://www.refleohealth.com";
const EXPLORE_HEADING = "Explore";
const ACTIONS_HEADING = "Get started";

export default function Footer() {
  const machine = usePathname()?.startsWith("/machine/");
  const inMode = (href: string) => machine ? twinOf(href) || href : href;
  return (
    <footer className="relative overflow-hidden bg-ink border-t border-cream/10 pt-16 md:pt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="md:flex md:justify-between md:gap-12">
          {/* Left: ripple mark + mission line */}
          <div className="flex items-start gap-4 max-w-md">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              aria-hidden="true"
              className="shrink-0 mt-1"
            >
              <circle
                cx="20"
                cy="20"
                r="18"
                stroke="#7FB3B3"
                strokeOpacity="0.4"
                strokeWidth="1"
              />
              <circle
                cx="20"
                cy="20"
                r="11"
                stroke="#7FB3B3"
                strokeOpacity="0.4"
                strokeWidth="1"
              />
              <circle
                cx="20"
                cy="20"
                r="5"
                stroke="#7FB3B3"
                strokeOpacity="0.4"
                strokeWidth="1"
              />
              <circle cx="20" cy="20" r="2" fill="#E8A87C" />
            </svg>
            <p className="font-serif text-2xl text-cream leading-snug">
              {MISSION_LINE}
            </p>
          </div>

          {/* Right: two nav columns */}
          <div className="flex gap-16 mt-12 md:mt-0">
            <div>
              <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-cream/45 mb-4">
                {EXPLORE_HEADING}
              </h2>
              <ul className="list-none m-0 p-0 flex flex-col gap-3 font-sans text-sm">
                {EXPLORE_LINKS.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={inMode(href)}
                      className="text-cream/60 hover:text-cream transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-cream/45 mb-4">
                {ACTIONS_HEADING}
              </h2>
              <ul className="list-none m-0 p-0 flex flex-col gap-3 font-sans text-sm">
                {ACTION_LINKS.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={inMode(href)}
                      className="text-cream/60 hover:text-cream transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom row. Each item is one unbreakable unit carrying the dot that
            follows it, and the row wraps only between units: on a narrow
            screen "Refleo Health, Inc." and "Parental Consent" stay whole. The
            row must never be wider than the screen either, or the browser
            widens the layout viewport and the fixed header spills past it. */}
        <div className="relative z-10 border-t border-cream/10 mt-16 pt-8 flex flex-wrap items-center justify-center gap-y-1 text-center font-mono text-[11px] uppercase tracking-[0.08em] text-cream/45">
          {[
            <span key="copyright">{COPYRIGHT}</span>,
            <a
              key="site"
              href={SITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-apricot hover:text-apricot-light transition-colors"
            >
              {SITE_LABEL}
            </a>,
            // Plain anchors, not <Link>: Next treats the dot in "1.0" as a
            // file extension and strips the trailing slash from
            // /legal/baa/1.0/ — and the static host 404s the slash-less
            // path. An <a> keeps the href exactly as written.
            ...LEGAL_LINKS.map(({ label, href }) => (
              <a
                key={href}
                href={inMode(href)}
                className="transition-colors hover:text-cream/80 hover:underline"
              >
                {label}
              </a>
            )),
          ].map((item, index, items) => (
            <span key={item.key} className="whitespace-nowrap">
              {item}
              {index < items.length - 1 && (
                <span aria-hidden="true" className="mx-2 text-cream/30">
                  ·
                </span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Oversized wordmark, cropped by the page edge. Its glyphs rise above
          its tight line box and over the legal row at desktop widths, so it
          must never take clicks. */}
      <p
        aria-hidden="true"
        className="pointer-events-none relative z-0 mt-12 select-none text-center font-serif text-[clamp(6rem,24vw,22rem)] font-medium leading-[0.72] tracking-[-0.05em] text-cream/[0.06]"
      >
        refleo
      </p>
    </footer>
  );
}
