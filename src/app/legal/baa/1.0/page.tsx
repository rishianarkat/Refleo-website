import type { Metadata } from "next";
import ImmutableLegalDocument from "@/components/ImmutableLegalDocument";

export const metadata: Metadata = {
  title: "Business Associate Agreement (Version 1.0)",
};

export default function BusinessAssociateAgreementV1Page() {
  return <ImmutableLegalDocument document="baa" version="1.0" />;
}
