import type { Metadata } from "next";
import ShortLegalRedirect from "@/components/ShortLegalRedirect";

const destination = "/legal/parental_consent/1.0/";

export const metadata: Metadata = {
  title: "Parental Consent",
  alternates: { canonical: destination },
};

export default function ParentalConsentRedirectPage() {
  return <ShortLegalRedirect title="Parental Consent" destination={destination} />;
}
