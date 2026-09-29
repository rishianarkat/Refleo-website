import Link from "next/link";

// Floating Human / Machine switch. Machine is a plain-text mirror of the site
// for AI agents and crawlers, built from the same facts as public/llms.txt.

const PILL =
  "rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-200";

export default function ModeToggle({ active }: { active: "human" | "machine" }) {
  return (
    <nav
      aria-label="View mode"
      className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 flex items-center gap-1 rounded-full border border-cream/15 bg-ink/80 p-1 backdrop-blur-md"
    >
      <Link
        href="/"
        aria-current={active === "human" ? "page" : undefined}
        className={`${PILL} ${active === "human" ? "text-apricot" : "text-cream/60 hover:text-cream"}`}
      >
        Human
      </Link>
      <Link
        href="/machine/"
        aria-current={active === "machine" ? "page" : undefined}
        className={`${PILL} ${active === "machine" ? "text-apricot" : "text-cream/60 hover:text-cream"}`}
      >
        Machine
      </Link>
    </nav>
  );
}
