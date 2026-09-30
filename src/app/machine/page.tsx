import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import path from "node:path";
import MachineDoc, { parseMachineText } from "@/components/machine/MachineDoc";

export const metadata: Metadata = {
  title: "Machine view",
  description: "Plain-text index of Refleo for AI agents and crawlers: what it is, pricing, company, and legal documents.",
  alternates: { canonical: "https://www.refleohealth.com/" },
};

export default function MachinePage() {
  const src = readFileSync(path.join(process.cwd(), "public", "llms.txt"), "utf8");
  return <MachineDoc title="Refleo" blocks={parseMachineText(src)} humanPath="/" index />;
}
