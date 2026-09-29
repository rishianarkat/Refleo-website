import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import path from "node:path";
import Link from "next/link";
import ModeToggle from "@/components/v2/ModeToggle";

// Machine view: a plain-text mirror of the site for AI agents, crawlers, and
// people who prefer it raw. Rendered from public/llms.txt at build time so
// there is exactly one source for these facts.

export const metadata: Metadata = {
  title: "Machine view",
  description:
    "Plain-text index of Refleo for AI agents and crawlers: what it is, pricing, company, and legal documents.",
};

const BANNER = String.raw`
██████╗ ███████╗███████╗██╗     ███████╗ ██████╗
██╔══██╗██╔════╝██╔════╝██║     ██╔════╝██╔═══██╗
██████╔╝█████╗  █████╗  ██║     █████╗  ██║   ██║
██╔══██╗██╔══╝  ██╔══╝  ██║     ██╔══╝  ██║   ██║
██║  ██║███████╗██║     ███████╗███████╗╚██████╔╝
╚═╝  ╚═╝╚══════╝╚═╝     ╚══════╝╚══════╝ ╚═════╝`;

type Block =
  | { kind: "h2"; text: string }
  | { kind: "quote"; text: string }
  | { kind: "p"; text: string }
  | { kind: "link"; label: string; href: string; note: string };

function parse(src: string): Block[] {
  const blocks: Block[] = [];
  for (const raw of src.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("# ")) continue;
    if (line.startsWith("## ")) blocks.push({ kind: "h2", text: line.slice(3) });
    else if (line.startsWith("> ")) blocks.push({ kind: "quote", text: line.slice(2) });
    else {
      const m = line.match(/^- \[(.+?)\]\((.+?)\)(?::\s*(.*))?$/);
      if (m) blocks.push({ kind: "link", label: m[1], href: m[2], note: m[3] ?? "" });
      else blocks.push({ kind: "p", text: line });
    }
  }
  return blocks;
}

function rule(title: string) {
  return `── ${title.toUpperCase()} ${"─".repeat(Math.max(4, 72 - title.length))}`;
}

export default function MachinePage() {
  const src = readFileSync(path.join(process.cwd(), "public", "llms.txt"), "utf8");
  const blocks = parse(src);

  return (
    <div className="min-h-screen bg-ink">
      <main className="mx-auto max-w-4xl px-6 pb-32 pt-12 font-mono text-[13px] uppercase leading-relaxed text-cream/80">
        <nav aria-label="Machine index" className="flex flex-wrap gap-x-5 gap-y-1 text-cream/50">
          {[
            ["/", "/home"],
            ["/product/", "/product"],
            ["/pricing/", "/pricing"],
            ["/about/", "/about"],
            ["/contact/", "/contact"],
            ["/llms.txt", "/llms.txt"],
          ].map(([href, label]) => (
            <Link key={href} href={href} className="hover:text-apricot">
              {label}
            </Link>
          ))}
        </nav>

        <pre
          aria-label="Refleo"
          className="mt-10 overflow-x-auto text-[9px] leading-[1.15] text-apricot sm:text-[12px]"
          // The latin subset of JetBrains Mono has no box-drawing glyphs.
          style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" }}
        >
          {BANNER.trim()}
        </pre>

        <p className="mt-8 text-cream">Refleo :: machine-readable index</p>
        <p className="mt-1 text-cream/50">
          # Plain-text mirror of refleohealth.com for AI agents, crawlers, and humans who
          prefer it raw.
        </p>

        {blocks.map((b, i) => {
          switch (b.kind) {
            case "h2":
              return (
                <h2 key={i} className="mt-12 overflow-hidden whitespace-nowrap text-cream/40">
                  {rule(b.text)}
                </h2>
              );
            case "quote":
              return (
                <p key={i} className="mt-8 border-l-2 border-apricot pl-4 text-cream">
                  {b.text}
                </p>
              );
            case "p":
              return (
                <p key={i} className="mt-4">
                  {b.text}
                </p>
              );
            case "link":
              return (
                <p key={i} className="mt-3">
                  <span className="text-cream/40">* </span>
                  <a href={b.href} className="text-cream underline-offset-4 hover:text-apricot hover:underline">
                    [{b.label}]
                  </a>
                  {b.note && <span className="text-cream/60"> {b.note}</span>}
                </p>
              );
          }
        })}
      </main>
      <ModeToggle active="machine" />
    </div>
  );
}
