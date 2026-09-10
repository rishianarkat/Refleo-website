import type { Metadata } from "next";
import ImmutableLegalDocument from "@/components/ImmutableLegalDocument";

export const metadata: Metadata = {
  title: "Minor Acknowledgment (Version 1.0)",
  alternates: { canonical: "/legal/minor_acknowledgment/1.0/" },
};

export default function MinorAcknowledgmentV1Page() {
  return <ImmutableLegalDocument document="minor_acknowledgment" version="1.0" />;
}
