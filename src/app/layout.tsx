import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import GlobalRipples from "@/components/GlobalRipples";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const SITE_URL = "https://www.refleohealth.com";
const TITLE = "Refleo · Helping clinicians capture life outside the session";
const DESCRIPTION =
  "Refleo is a between-session continuity platform for therapists, starting with adolescent care. Patients log voice or text entries between sessions, and their clinician receives a structured pre-session brief.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Refleo", template: "%s · Refleo" },
  description: DESCRIPTION,
  keywords: [
    "adolescent therapy",
    "behavioral health",
    "between-session",
    "voice journaling",
    "pre-session brief",
    "therapist tools",
    "clinical continuity",
    "mental health SaaS",
  ],
  authors: [{ name: "Refleo Health" }],
  alternates: {
    canonical: "https://www.refleohealth.com",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Refleo",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Refleo · Helping clinicians capture life outside the session",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Refleo Health",
  url: "https://www.refleohealth.com",
  logo: "https://www.refleohealth.com/svg/refleo-logo-dark.svg",
  description:
    "Refleo is a between-session continuity platform for therapists, starting with adolescent care. Patients log voice or text entries between sessions, and their clinician receives a structured pre-session brief.",
  founders: [
    { "@type": "Person", name: "Vishwas Vijayan" },
    { "@type": "Person", name: "Rishi Anarkat" },
  ],
  foundingDate: "2026",
  contactPoint: {
    "@type": "ContactPoint",
    email: "info@refleohealth.com",
    contactType: "customer support",
  },
};

const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Refleo",
  applicationCategory: "HealthApplication",
  operatingSystem: "Web",
  description:
    "Between-session continuity platform for behavioral health clinicians, starting with adolescent care",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="bg-teal-dark font-sans text-cream antialiased">
        <GlobalRipples />
        <div className="relative z-10">{children}</div>
        <CustomCursor />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationJsonLd) }}
        />
      </body>
    </html>
  );
}
