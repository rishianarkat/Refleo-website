import type { Metadata } from "next";
import ShortLegalRedirect from "@/components/ShortLegalRedirect";

export const metadata: Metadata = {
  title: "Business Associate Agreement",
  alternates: { canonical: "/legal/baa/1.0/" },
};

export default function BaaRedirectPage() {
  return (
    <ShortLegalRedirect
      title="Business Associate Agreement"
      destination="/legal/baa/1.0/"
    />
  );
}
