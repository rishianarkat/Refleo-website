import type { Metadata } from "next";
import ShortLegalRedirect from "@/components/ShortLegalRedirect";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/legal/privacy/2026-09-18/" },
};

export default function PrivacyRedirectPage() {
  return (
    <ShortLegalRedirect
      title="Privacy Policy"
      destination="/legal/privacy/2026-09-18/"
    />
  );
}
