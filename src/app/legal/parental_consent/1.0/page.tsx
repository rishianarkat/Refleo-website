import type { Metadata } from "next";
import ImmutableLegalDocument from "@/components/ImmutableLegalDocument";

export const metadata: Metadata = {
  title: "Parental Consent (Version 1.0)",
  alternates: { canonical: "/legal/parental_consent/1.0/" },
};

export default function ParentalConsentV1Page() {
  return <ImmutableLegalDocument document="parental_consent" version="1.0" />;
}
