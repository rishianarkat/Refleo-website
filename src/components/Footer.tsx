import Link from "next/link";

const MISSION_LINE = "Helping clinicians capture life outside the session.";

const EXPLORE_LINKS = [
  { label: "Home", href: "/" },
  { label: "Product", href: "/product" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

const ACTION_LINKS = [
  { label: "Book a Demo", href: "/contact?intent=demo" },
  { label: "Invest in Refleo", href: "/contact?intent=invest" },
] as const;

const COPYRIGHT = "© 2026 Refleo Health";
const SITE_LABEL = "www.refleohealth.com";
const SITE_URL = "https://www.refleohealth.com";
const EXPLORE_HEADING = "Explore";
const ACTIONS_HEADING = "Get started";

export default function Footer() {
  return (
    <footer className="bg-teal-deep border-t border-white/5 py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
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
            <p className="font-serif text-xl text-cream leading-snug">
              {MISSION_LINE}
            </p>
          </div>

          {/* Right: two nav columns */}
          <div className="flex gap-16 mt-12 md:mt-0">
            <div>
              <h2 className="font-sans text-xs uppercase tracking-widest text-cream/50 mb-4">
                {EXPLORE_HEADING}
              </h2>
              <ul className="list-none m-0 p-0 flex flex-col gap-3 font-sans text-sm">
                {EXPLORE_LINKS.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-cream/60 hover:text-cream transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-sans text-xs uppercase tracking-widest text-cream/50 mb-4">
                {ACTIONS_HEADING}
              </h2>
              <ul className="list-none m-0 p-0 flex flex-col gap-3 font-sans text-sm">
                {ACTION_LINKS.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
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

        {/* Bottom row */}
        <div className="border-t border-white/10 mt-12 pt-8 text-center text-xs text-cream/50">
          <span>{COPYRIGHT}</span>
          <span aria-hidden="true" className="mx-2 text-cream/30">
            ·
          </span>
          <a
            href={SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-apricot hover:text-apricot-light transition-colors"
          >
            {SITE_LABEL}
          </a>
        </div>
      </div>
    </footer>
  );
}
