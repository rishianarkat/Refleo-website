import type { Metadata } from "next";
import ShortLegalRedirect from "@/components/ShortLegalRedirect";

export const metadata: Metadata = {
  title: "Subprocessors: the vendors that handle data for Refleo",
  alternates: { canonical: "/legal/subprocessors/" },
};

export default function SubprocessorsRedirectPage() {
  return (
    <ShortLegalRedirect
      title="Subprocessors"
      destination="/legal/subprocessors/"
    />
  );
}
