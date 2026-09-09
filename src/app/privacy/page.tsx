import type { Metadata } from "next";
import ShortLegalRedirect from "@/components/ShortLegalRedirect";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyRedirectPage() {
  return (
    <ShortLegalRedirect
      title="Privacy Policy"
      destination="/legal/privacy/v1/"
    />
  );
}
