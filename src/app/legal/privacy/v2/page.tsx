import type { Metadata } from "next";
import ImmutableLegalDocument from "@/components/ImmutableLegalDocument";

export const metadata: Metadata = { title: "Privacy Policy (v2)" };

export default function PrivacyPolicyV2Page() {
  return <ImmutableLegalDocument document="privacy" version="v2" />;
}
