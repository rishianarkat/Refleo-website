import type { Metadata } from "next";
import MachineDoc from "@/components/machine/MachineDoc";
import { contactBlocks } from "@/machine/content/contact";

export const metadata: Metadata = {
  title: "Contact (machine view)",
  description: 'Book a demo to see how Refleo fits into your clinical workflow, or reach out about investment opportunities.',
  alternates: { canonical: "https://www.refleohealth.com/contact/" },
};

export default function Page() {
  return <MachineDoc title="Contact" blocks={contactBlocks} humanPath="/contact/" />;
}
