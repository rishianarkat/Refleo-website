import Link from "next/link";
import ModeToggle from "@/components/v2/ModeToggle";

export type Block =
  | { kind: "h2"; text: string }
  | { kind: "quote"; text: string }
  | { kind: "p"; text: string }
  | { kind: "link"; label: string; href: string; note?: string };

export function parseMachineText(src: string): Block[] {
  const blocks: Block[] = [];
  for (const raw of src.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("# ")) continue;
    if (line.startsWith("## ")) blocks.push({ kind: "h2", text: line.slice(3) });
    else if (line.startsWith("> ")) blocks.push({ kind: "quote", text: line.slice(2) });
    else {
      const match = line.match(/^- \[(.+?)\]\((.+?)\)(?::\s*(.*))?$/);
      if (match) blocks.push({ kind: "link", label: match[1], href: match[2], note: match[3] ?? "" });
      else blocks.push({ kind: "p", text: line });
    }
  }
  return blocks;
}

export function rule(title: string) {
  return `── ${title.toUpperCase()} ${"─".repeat(Math.max(4, 72 - title.length))}`;
}

const BANNER = String.raw`
██████╗ ███████╗███████╗██╗     ███████╗ ██████╗
██╔══██╗██╔════╝██╔════╝██║     ██╔════╝██╔═══██╗
██████╔╝█████╗  █████╗  ██║     █████╗  ██║   ██║
██╔══██╗██╔══╝  ██╔══╝  ██║     ██╔══╝  ██║   ██║
██║  ██║███████╗██║     ███████╗███████╗╚██████╔╝
╚═╝  ╚═╝╚══════╝╚═╝     ╚══════╝╚══════╝ ╚═════╝`;

export default function MachineDoc({ title, blocks, humanPath, index = false }: { title: string; blocks: readonly Block[]; humanPath: string; index?: boolean }) {
  return (
    <div className="min-h-screen bg-ink">
      <main className="mx-auto max-w-4xl px-6 pb-32 pt-12 font-mono text-[13px] uppercase leading-relaxed text-cream/80">
        <nav aria-label="Machine index" className="flex flex-wrap gap-x-5 gap-y-1 text-cream/50">
          {[["/machine/", "/home"], ["/machine/product/", "/product"], ["/machine/pricing/", "/pricing"], ["/machine/about/", "/about"], ["/machine/contact/", "/contact"], ["/llms.txt", "/llms.txt"]].map(([href, label]) => <Link key={href} href={href} className="hover:text-apricot">{label}</Link>)}
        </nav>
        {index && <pre aria-label="Refleo" className="mt-10 max-w-full overflow-x-auto text-[9px] leading-[1.15] text-apricot sm:text-[12px]" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" }}>{BANNER.trim()}</pre>}
        <h1 className="mt-8 text-cream">{index ? "Refleo :: machine-readable index" : rule(title)}</h1>
        {index && <p className="mt-1 text-cream/50"># Plain-text mirror of refleohealth.com for AI agents, crawlers, and humans who prefer it raw.</p>}
        {blocks.map((b, i) => b.kind === "h2" ? <h2 key={i} className="mt-12 overflow-hidden whitespace-nowrap text-cream/40">{rule(b.text)}</h2> : b.kind === "quote" ? <p key={i} className="mt-8 border-l-2 border-apricot pl-4 text-cream">{b.text}</p> : b.kind === "p" ? <p key={i} className="mt-4 break-words">{b.text}</p> : <p key={i} className="mt-3 break-words"><span className="text-cream/40">* </span><a href={b.href} className="text-cream underline-offset-4 hover:text-apricot hover:underline">[{b.label}]</a>{b.note && <span className="text-cream/60"> {b.note}</span>}</p>)}
        <p className="mt-12 text-cream/60">human view: <Link href={humanPath} className="text-cream hover:text-apricot">{humanPath}</Link></p>
      </main>
      <ModeToggle active="machine" />
    </div>
  );
}
