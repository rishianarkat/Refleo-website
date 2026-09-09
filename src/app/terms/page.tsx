import type { Metadata } from "next";
import ShortLegalRedirect from "@/components/ShortLegalRedirect";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsRedirectPage() {
  return <ShortLegalRedirect title="Terms of Service" destination="/legal/terms/v1/" />;
}
