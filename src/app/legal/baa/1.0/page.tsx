import type { Metadata } from "next";
import ImmutableLegalDocument from "@/components/ImmutableLegalDocument";

export const metadata: Metadata = {
  title: "Business Associate Agreement (Version 1.0)",
  // Explicit: the inherited "./" loses the trailing slash on a path that ends
  // in "1.0", which Next reads as a file extension.
  alternates: { canonical: "/legal/baa/1.0/" },
};

export default function BusinessAssociateAgreementV1Page() {
  return <ImmutableLegalDocument document="baa" version="1.0" />;
}
