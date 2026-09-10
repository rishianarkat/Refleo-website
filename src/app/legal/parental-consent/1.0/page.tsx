import type { Metadata } from "next";
import ShortLegalRedirect from "@/components/ShortLegalRedirect";

const destination = "/legal/parental_consent/1.0/";

export const metadata: Metadata = {
  title: "Parental Consent (Version 1.0)",
  alternates: { canonical: destination },
};

export default function ParentalConsentHyphenRedirectPage() {
  return <ShortLegalRedirect title="Parental Consent" destination={destination} />;
}
