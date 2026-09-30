import type { Block } from "@/components/machine/MachineDoc";
import { JOURNEY_CAPTIONS } from "@/components/sections/product/storyJourney";
export const productBlocks: readonly Block[] = [
  { kind: "p", text: "A patient's voice notes become a one-screen brief their clinician reads before the session." },
  { kind: "h2", text: "The product" },
  { kind: "p", text: "Clients talk. Clinicians read one page." },
  ...[
    ["Your clients.", "Who checked in, and when you see them next."],
    ["The pre-session brief.", "Recurring themes, in the client's own words."],
    ["The client view.", "Mood over time, entries, and your keywords."],
    ["The client check-in.", "Voice or text, thirty seconds, whenever it happens."],
  ].map(([title, body]): Block => ({ kind: "p", text: `${title} ${body}` })),
  { kind: "h2", text: "How it works" },
  ...JOURNEY_CAPTIONS.map(({ title, body }): Block => ({ kind: "p", text: `${title} ${body}` })),
  { kind: "h2", text: "What's inside" },
  { kind: "p", text: "Built for the clinician. Scoped on purpose." },
  ...[
    ["Voice-first entries", "30-second journaling on phone, no prompts."],
    ["Clinician-tuned and patient customized", "Each clinician adjusts settings per client."],
    ["Pre-session brief", "One-screen narrative summary before the appointment."],
    ["Built-in scope guardrails", "No automated triage. No direct patient support. No SaMD territory."],
  ].map(([title, body]): Block => ({ kind: "p", text: `${title} ${body}` })),
  { kind: "link", label: "Start free trial", href: "https://app.refleohealth.com/?choose=1" },
  { kind: "link", label: "Book a demo", href: "/machine/contact/?intent=demo" },
];
