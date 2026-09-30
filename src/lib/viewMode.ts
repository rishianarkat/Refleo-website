export type ViewMode = "human" | "machine";
export const MODE_KEY = "refleo-mode";
const pages = ["", "product", "pricing", "about", "contact"] as const;

export function twinOf(pathname: string): string | null {
  const path = pathname.split(/[?#]/)[0].replace(/\/+$/, "") || "";
  if (path === "/machine") return "/";
  const machine = path.match(/^\/machine\/(product|pricing|about|contact)$/);
  if (machine) return `/${machine[1]}/`;
  const human = path.replace(/^\//, "");
  return pages.includes(human as (typeof pages)[number]) ? `/machine/${human ? `${human}/` : ""}` : null;
}

export function readViewMode(): ViewMode | null {
  if (typeof window === "undefined") return null;
  const cookie = document.cookie.match(/(?:^|; )refleo-mode=(human|machine)(?:;|$)/)?.[1];
  let stored: string | null = null;
  try { stored = localStorage.getItem(MODE_KEY); } catch { /* unavailable */ }
  return cookie === "human" || cookie === "machine" ? cookie : stored === "human" || stored === "machine" ? stored : null;
}

export function writeViewMode(mode: ViewMode) {
  try { localStorage.setItem(MODE_KEY, mode); } catch { /* unavailable */ }
  document.cookie = `${MODE_KEY}=${mode}; Path=/; Max-Age=31536000; SameSite=Lax`;
}
