const COPYRIGHT = "© 2026 Refleo Health";
const SITE_URL = "https://www.refleohealth.com";
const SITE_LABEL = "www.refleohealth.com";
const PRIVACY_URL = "https://www.iubenda.com/privacy-policy/22396238";
const COOKIE_URL =
  "https://www.iubenda.com/privacy-policy/22396238/cookie-policy";

// Muted footer link: subtle by default, apricot + underline on hover.
const POLICY_LINK =
  "transition-colors duration-200 hover:text-apricot hover:underline";

/**
 * Shared site footer line:
 * "© 2026 Refleo Health · www.refleohealth.com · Privacy Policy · Cookie Policy"
 * Rendered on the main page (MissionCloser) and the /contact page.
 */
export default function Footer({ className = "" }: { className?: string }) {
  return (
    <footer className={`text-center text-xs text-cream/50 ${className}`}>
      {COPYRIGHT}
      <span aria-hidden="true" className="mx-2 text-cream/30">
        ·
      </span>
      <a
        href={SITE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-apricot transition-colors duration-200 hover:text-apricot-light"
      >
        {SITE_LABEL}
      </a>
      <span aria-hidden="true" className="mx-2 text-cream/30">
        ·
      </span>
      <a
        href={PRIVACY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={POLICY_LINK}
      >
        Privacy Policy
      </a>
      <span aria-hidden="true" className="mx-2 text-cream/30">
        ·
      </span>
      <a
        href={COOKIE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={POLICY_LINK}
      >
        Cookie Policy
      </a>
    </footer>
  );
}
