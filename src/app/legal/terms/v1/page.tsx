import type { Metadata } from "next";
import ImmutableLegalDocument from "@/components/ImmutableLegalDocument";

export const metadata: Metadata = { title: "Terms of Service (v1)" };

export default function TermsOfServiceV1Page() {
  return <ImmutableLegalDocument document="terms" version="v1" />;
}
