import type { Metadata } from "next";
import ImmutableLegalDocument from "@/components/ImmutableLegalDocument";

export const metadata: Metadata = {
  title: "Privacy Policy (Effective September 18, 2026)",
};

export default function PrivacyPolicy20260918Page() {
  return <ImmutableLegalDocument document="privacy" version="2026-09-18" />;
}
