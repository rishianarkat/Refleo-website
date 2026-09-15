import type { Metadata } from "next";
import ImmutableLegalDocument from "@/components/ImmutableLegalDocument";

export const metadata: Metadata = {
  title: "Terms of Service (Effective September 18, 2026)",
};

export default function TermsOfService20260918Page() {
  return <ImmutableLegalDocument document="terms" version="2026-09-18" />;
}
