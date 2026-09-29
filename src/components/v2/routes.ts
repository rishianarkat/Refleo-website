// Routes on the v2 look: near-black ground, gradient headers, bordered grid.
// Legal pages keep the original teal until they're redesigned on purpose.
const V2_PREFIXES = ["/product", "/about", "/pricing", "/contact", "/machine"];

export function isV2Route(pathname: string | null): boolean {
  if (!pathname) return false;
  return pathname === "/" || V2_PREFIXES.some((p) => pathname.startsWith(p));
}
