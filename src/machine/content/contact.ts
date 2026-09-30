import type { Block } from "@/components/machine/MachineDoc";
export const contactBlocks: readonly Block[] = [
  { kind: "p", text: "Let's talk" },
  { kind: "p", text: "Tell us a bit about yourself and we'll get back to you within one business day." },
  { kind: "p", text: "Reply: Within one business day" },
  { kind: "link", label: "support@refleohealth.com", href: "mailto:support@refleohealth.com" },
  { kind: "link", label: "Contact form", href: "/contact/" },
];
