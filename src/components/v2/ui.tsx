import type { ReactNode } from "react";
import HeroGradient from "@/components/v2/HeroGradient";

// Shared pieces of the v2 look, so every page speaks the same way.

export const PORTAL_HREF = "https://app.refleohealth.com/?choose=1";
export const APP_STORE_HREF = "https://apps.apple.com/us/app/refleo/id6807892935";
export const TRIAL_LINE =
  "Free to try for 2 months, then $100 a month. Your clients never pay.";

export const FILL_BTN =
  "inline-flex items-center justify-center gap-2 rounded-full bg-apricot px-7 py-3 text-sm font-semibold text-ink transition-colors duration-200 ease-out hover:bg-apricot-light";
export const GHOST_BTN =
  "inline-flex items-center justify-center gap-2 rounded-full border border-cream/25 px-7 py-3 text-sm font-semibold text-cream transition-colors duration-200 ease-out hover:border-cream/60";

export const H2 =
  "font-serif text-[clamp(2.25rem,4.5vw,4rem)] font-medium leading-[0.98] tracking-[-0.03em]";

export function Label({ index, children }: { index?: string; children: ReactNode }) {
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-cream/50">
      {index && <span className="text-apricot">[{index}]</span>} {children}
    </p>
  );
}

/** Interior-page header: the homepage gradient at a shorter height. */
export function PageHero({
  label,
  title,
  sub,
  children,
}: {
  label: string;
  title: ReactNode;
  sub?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative flex min-h-[72svh] flex-col overflow-hidden">
      <HeroGradient />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-ink/60 via-ink/15 to-transparent"
      />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-6 pt-36 pb-16 lg:px-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-cream/70">
          {label}
        </p>
        <h1 className="mt-6 max-w-[18ch] text-balance font-serif text-[clamp(2.75rem,7vw,7rem)] font-medium leading-[0.92] tracking-[-0.035em] text-cream">
          {title}
        </h1>
        {sub && <p className="mt-8 max-w-xl text-lg text-cream/80">{sub}</p>}
        {children && <div className="mt-10">{children}</div>}
      </div>
    </section>
  );
}
