import type { Metadata } from "next";
import ShortLegalRedirect from "@/components/ShortLegalRedirect";

export const metadata: Metadata = {
  title: "Terms of Service",
  alternates: { canonical: "/legal/terms/2026-09-18/" },
};

export default function TermsRedirectPage() {
  return (
    <ShortLegalRedirect
      title="Terms of Service"
      destination="/legal/terms/2026-09-18/"
    />
  );
}
