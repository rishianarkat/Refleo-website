"use client";

import { usePathname, useRouter } from "next/navigation";
import { twinOf, writeViewMode, type ViewMode } from "@/lib/viewMode";

const PILL = "rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-200";

export default function ModeToggle({ active }: { active: ViewMode }) {
  const pathname = usePathname();
  const router = useRouter();
  function switchMode(mode: ViewMode) {
    writeViewMode(mode);
    const twin = twinOf(pathname || "/");
    const destination = mode === active ? pathname || "/" : twin || (mode === "machine" ? "/machine/" : "/");
    router.push(destination);
  }
  return (
    <nav aria-label="View mode" className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 flex items-center gap-1 rounded-full border border-cream/15 bg-ink/80 p-1 backdrop-blur-md">
      {(["human", "machine"] as const).map((mode) => (
        <button key={mode} type="button" onClick={() => switchMode(mode)} aria-current={active === mode ? "page" : undefined} className={`${PILL} ${active === mode ? "text-apricot" : "text-cream/60 hover:text-cream"}`}>
          {mode === "human" ? "Human" : "Machine"}
        </button>
      ))}
    </nav>
  );
}
