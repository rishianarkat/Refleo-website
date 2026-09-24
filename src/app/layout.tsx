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
const TITLE = "Refleo | Between-session check-ins for therapists";
const DESCRIPTION =
  "Refleo gives therapists a pre-session brief built from their clients' voice and text check-ins between appointments. HIPAA covered, parental consent built in, free for two months.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s · Refleo" },
  description: DESCRIPTION,
  keywords: [
    "between-session check-ins",
    "therapist software",
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
  // "./" resolves against each route, so every page is canonical to ITSELF.
  // The fixed homepage URL that used to sit here was inherited by every page
  // without its own canonical (all the legal pages), telling search engines
  // they were duplicates of the homepage.
  alternates: {
    canonical: "./",
  },
  // iOS Safari shows an "Open in the App Store" banner for the live app.
  itunes: {
    appId: "6807892935",
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

// One entity, three names: the brand is "Refleo", the company is "Refleo
// Health, Inc.", and the site copy says "Refleo Health" in places. The
// @id lets the WebSite and SoftwareApplication nodes point at this same
// Organization instead of restating it, so crawlers and AI systems see one
// entity rather than three near-duplicates.
const ORGANIZATION_ID = `${SITE_URL}/#organization`;

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: "Refleo",
  legalName: "Refleo Health, Inc.",
  alternateName: "Refleo Health",
  url: "https://www.refleohealth.com",
  logo: "https://www.refleohealth.com/svg/refleo-logo-dark.svg",
  description: DESCRIPTION,
  email: "support@refleohealth.com",
  founders: [
    { "@type": "Person", name: "Vishwas Vijayan" },
    { "@type": "Person", name: "Rishi Anarkat" },
  ],
  foundingDate: "2026",
  areaServed: "US",
  contactPoint: {
    "@type": "ContactPoint",
    email: "support@refleohealth.com",
    contactType: "customer support",
    url: "https://www.refleohealth.com/contact/",
  },
  sameAs: [
    "https://www.linkedin.com/company/refleo-health",
    "https://apps.apple.com/us/app/refleo/id6807892935",
  ],
};

const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "Refleo",
  url: SITE_URL,
  description: DESCRIPTION,
  inLanguage: "en-US",
  publisher: { "@id": ORGANIZATION_ID },
};

const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Refleo",
  applicationCategory: "HealthApplication",
  operatingSystem: "iOS, Web",
  url: "https://app.refleohealth.com/",
  downloadUrl: "https://apps.apple.com/us/app/refleo/id6807892935",
  installUrl: "https://apps.apple.com/us/app/refleo/id6807892935",
  publisher: { "@id": ORGANIZATION_ID },
  offers: {
    "@type": "Offer",
    price: "100.00",
    priceCurrency: "USD",
    description:
      "Two-month free trial for clinicians, then $100 per month. Free for patients and clients.",
    url: "https://www.refleohealth.com/pricing/",
  },
  description: DESCRIPTION,
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationJsonLd) }}
        />
      </body>
    </html>
  );
}
