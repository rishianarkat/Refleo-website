import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a demo to see how Refleo fits into your clinical workflow, or reach out about investment opportunities.",
  alternates: { canonical: "https://www.refleohealth.com/contact" },
  openGraph: {
    type: "website",
    url: "https://www.refleohealth.com/contact",
    siteName: "Refleo",
    title: "Contact Refleo",
    description:
      "Book a demo to see how Refleo fits into your clinical workflow, or reach out about investment opportunities.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Refleo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Refleo",
    description:
      "Book a demo to see how Refleo fits into your clinical workflow, or reach out about investment opportunities.",
    images: ["/og.png"],
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
