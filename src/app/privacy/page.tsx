import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TITLE = "Privacy Policy";
const DESCRIPTION =
  "How Refleo Health collects, uses, and protects information on refleohealth.com.";
const URL = "https://www.refleohealth.com/privacy";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    url: URL,
    siteName: "Refleo",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Refleo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
};

// Policy text is legal copy supplied by the founders. It must remain VERBATIM.
const EFFECTIVE_DATE = "Effective Date: 7/23/2026";
const LAST_UPDATED = "Last Updated: 7/23/2026";

const INTRO =
  'This Privacy Policy explains how Refleo Health, Inc. ("Refleo," "we," "us," or "our") collects, uses, and protects information when you visit refleohealth.com (the "Site"). This policy applies only to our public marketing website. It does not apply to the Refleo clinical platform used by clinicians and their clients, which is governed by a separate agreement and, where applicable, a Business Associate Agreement (BAA).';

interface PolicySection {
  heading: string;
  blocks: Array<
    | { type: "p"; text: string }
    | { type: "list"; intro?: string; items: string[] }
  >;
}

const SECTIONS: PolicySection[] = [
  {
    heading: "1. Information We Collect",
    blocks: [
      {
        type: "list",
        intro: "Information you provide directly:",
        items: [
          "Name, email address, organization/practice name, and any message content you submit through our contact or demo request forms",
          "Any information you voluntarily provide when corresponding with us by email",
        ],
      },
      {
        type: "list",
        intro: "Information collected automatically:",
        items: [
          "Standard technical data such as IP address, browser type, device type, and pages visited",
          "Usage data collected through analytics tools (e.g., page views, referral source, time on site)",
        ],
      },
      {
        type: "p",
        text: "We do not knowingly collect protected health information (PHI) or clinical data through this Site. If you are a clinician, client, or teen user of the Refleo platform, information you share within the product itself is handled under separate product terms, not this policy.",
      },
    ],
  },
  {
    heading: "2. How We Use Information",
    blocks: [
      {
        type: "list",
        intro: "We use the information we collect to:",
        items: [
          "Respond to inquiries, demo requests, and partnership or investment interest",
          "Operate, maintain, and improve the Site",
          "Understand aggregate usage trends and Site performance",
          "Communicate updates about Refleo, where you've opted in",
        ],
      },
      { type: "p", text: "We do not sell your personal information." },
    ],
  },
  {
    heading: "3. Third-Party Services",
    blocks: [
      {
        type: "list",
        intro:
          "We use the following third-party services to operate the Site. Each processes limited data on our behalf, subject to their own privacy policies:",
        items: [
          "Formspree — processes form submissions from our contact/demo request forms",
          "AWS (Amazon Web Services) — hosting infrastructure, including S3, CloudFront, and Route 53",
          "Analytics providers — if enabled, to understand Site traffic (see Cookies section below)",
        ],
      },
      {
        type: "p",
        text: "We do not share the information collected through this Site with third parties for their own marketing purposes.",
      },
    ],
  },
  {
    heading: "4. Cookies and Tracking",
    blocks: [
      {
        type: "p",
        text: "The Site may use cookies or similar technologies to support basic functionality and understand how visitors use the Site. You can control cookies through your browser settings. Disabling cookies may affect some Site features.",
      },
    ],
  },
  {
    heading: "5. Data Security",
    blocks: [
      {
        type: "p",
        text: "We take reasonable technical and organizational measures to protect information submitted through the Site. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.",
      },
    ],
  },
  {
    heading: "6. Data Retention",
    blocks: [
      {
        type: "p",
        text: "We retain information submitted through the Site for as long as needed to respond to your inquiry, maintain business records, or comply with legal obligations, after which it is deleted or anonymized.",
      },
    ],
  },
  {
    heading: "7. Children's Privacy",
    blocks: [
      {
        type: "p",
        text: "This Site is intended for clinicians, healthcare organizations, investors, and other business contacts. It is not directed at children, and we do not knowingly collect personal information from children through this Site.",
      },
    ],
  },
  {
    heading: "8. Your Rights and Choices",
    blocks: [
      {
        type: "p",
        text: "Depending on your location, you may have rights to access, correct, or delete personal information you've submitted to us. To exercise these rights, contact us at info@refleohealth.com.",
      },
    ],
  },
  {
    heading: "9. Changes to This Policy",
    blocks: [
      {
        type: "p",
        text: 'We may update this Privacy Policy from time to time. The "Last Updated" date above reflects the most recent revision. Continued use of the Site after changes take effect constitutes acceptance of the updated policy.',
      },
    ],
  },
];

const CONTACT_HEADING = "10. Contact Us";
const CONTACT_INTRO = "Questions about this Privacy Policy can be directed to:";
const CONTACT_ORG = "Refleo Health, Inc.";
const CONTACT_EMAIL = "info@refleohealth.com";
const CONTACT_SITE = "refleohealth.com";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-transparent pt-36 pb-24 md:pb-32">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <p className="font-sans text-xs uppercase tracking-widest text-apricot font-medium">
              <span
                aria-hidden="true"
                className="mr-3 inline-block h-px w-8 bg-apricot/40 align-middle"
              />
              Legal
            </p>

            <h1 className="mt-6 font-serif text-4xl sm:text-5xl tracking-tight text-cream">
              Refleo Health Privacy Policy
            </h1>

            <p className="mt-4 font-sans text-sm text-cream/50">
              {EFFECTIVE_DATE}
              <span aria-hidden="true" className="mx-2 text-cream/30">
                ·
              </span>
              {LAST_UPDATED}
            </p>

            <p className="mt-8 font-sans text-base text-cream/75 leading-relaxed">
              {INTRO}
            </p>

            {SECTIONS.map((section) => (
              <section key={section.heading} className="mt-12">
                <h2 className="font-serif text-2xl text-cream">
                  {section.heading}
                </h2>
                {section.blocks.map((block, i) =>
                  block.type === "p" ? (
                    <p
                      key={i}
                      className="mt-4 font-sans text-base text-cream/75 leading-relaxed"
                    >
                      {block.text}
                    </p>
                  ) : (
                    <div key={i} className="mt-4">
                      {block.intro && (
                        <p className="font-sans text-base text-cream/75 leading-relaxed">
                          {block.intro}
                        </p>
                      )}
                      <ul className="mt-3 flex flex-col gap-2 pl-1">
                        {block.items.map((item) => (
                          <li
                            key={item}
                            className="flex gap-3 font-sans text-base text-cream/75 leading-relaxed"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-apricot/70"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                )}
              </section>
            ))}

            <section className="mt-12">
              <h2 className="font-serif text-2xl text-cream">
                {CONTACT_HEADING}
              </h2>
              <p className="mt-4 font-sans text-base text-cream/75 leading-relaxed">
                {CONTACT_INTRO}
              </p>
              <p className="mt-3 font-sans text-base text-cream/75 leading-relaxed">
                {CONTACT_ORG}
                <br />
                Email:{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-apricot hover:text-apricot-light transition-colors"
                >
                  {CONTACT_EMAIL}
                </a>
                <br />
                Website: {CONTACT_SITE}
              </p>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
