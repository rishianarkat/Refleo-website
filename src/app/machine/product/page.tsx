import type { Metadata } from "next";
import MachineDoc from "@/components/machine/MachineDoc";
import { productBlocks } from "@/machine/content/product";

export const metadata: Metadata = {
  title: "Product (machine view)",
  description: 'Patients record short voice entries. Refleo turns them into a one-screen pre-session brief for their clinician.',
  alternates: { canonical: "https://www.refleohealth.com/product/" },
};

export default function Page() {
  return <MachineDoc title="Product" blocks={productBlocks} humanPath="/product/" />;
}
