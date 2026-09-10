import type { Metadata } from "next";
import ShortLegalRedirect from "@/components/ShortLegalRedirect";

const destination = "/legal/minor_acknowledgment/1.0/";

export const metadata: Metadata = {
  title: "Minor Acknowledgment (Version 1.0)",
  alternates: { canonical: destination },
};

export default function MinorAcknowledgmentHyphenRedirectPage() {
  return (
    <ShortLegalRedirect title="Minor Acknowledgment" destination={destination} />
  );
}
