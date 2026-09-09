import type { Metadata } from "next";
import ImmutableLegalDocument from "@/components/ImmutableLegalDocument";

export const metadata: Metadata = { title: "Privacy Policy (v1)" };

export default function PrivacyPolicyV1Page() {
  return <ImmutableLegalDocument document="privacy" version="v1" />;
}
