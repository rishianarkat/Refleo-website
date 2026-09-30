import type { Metadata } from "next";
import MachineDoc from "@/components/machine/MachineDoc";
import { pricingBlocks } from "@/machine/content/pricing";

export const metadata: Metadata = {
  title: "Pricing (machine view)",
  description: 'One plan for clinicians: $100 a month, with the first two months free during our launch offer, no card required. Billing, refund, and non-payment terms.',
  alternates: { canonical: "https://www.refleohealth.com/pricing/" },
};

export default function Page() {
  return <MachineDoc title="Pricing" blocks={pricingBlocks} humanPath="/pricing/" />;
}
