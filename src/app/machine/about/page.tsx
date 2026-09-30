import type { Metadata } from "next";
import MachineDoc from "@/components/machine/MachineDoc";
import { aboutBlocks } from "@/machine/content/about";

export const metadata: Metadata = {
  title: "About (machine view)",
  description: 'Meet the team behind Refleo and what we believe: continuity between sessions makes therapy work better, starting with adolescent care.',
  alternates: { canonical: "https://www.refleohealth.com/about/" },
};

export default function Page() {
  return <MachineDoc title="About" blocks={aboutBlocks} humanPath="/about/" />;
}
