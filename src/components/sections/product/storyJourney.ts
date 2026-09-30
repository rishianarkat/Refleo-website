// The product story: one continuous pass through the Refleo app, scrubbed by
// scroll. The frames are an image sequence rendered from real simulator
// captures (refleo-video, composition StoryJourneyFrames) and shipped in
// public/journey/ with a manifest that says which frame belongs to which
// scroll position.
//
// Captions are legally reviewed wording: Refleo surfaces information, it never
// interprets, diagnoses, detects or predicts. Do not edit them here without
// that review. Their order matches the manifest's `captions`.

export type JourneyCaption = { title: string; body: string };

export const JOURNEY_CAPTIONS: readonly JourneyCaption[] = [
  {
    title: "Open Refleo.",
    body: "One app for clinicians and the patients they see.",
  },
  {
    title: "Sign in.",
    body: "Your caseload, and nothing else.",
  },
  {
    title: "Every client at a glance.",
    body: "New check-ins, and any matches on keywords you chose.",
  },
  {
    title: "Open a client.",
    body: "Check-ins, sessions, and notes in one place.",
  },
  {
    title: "Read the brief before the session.",
    body: "Their own words, surfaced. The judgment stays with you.",
  },
  {
    title: "Add a new client in seconds.",
    body: "A first name and last initial. Refleo never stores more.",
  },
  {
    title: "Hand them a code.",
    body: "They enter it once in their app, and you're connected.",
  },
];

/** public/journey/manifest.json, written by refleo-video/scripts/journey. */
export type JourneyManifest = {
  version: 1;
  frames: number;
  width: number;
  height: number;
  /** Frame URL with `{i}` for the zero-padded index. */
  src: string;
  pad: number;
  /** Scroll progress (0..1) at which each caption takes over. */
  captions: { id: string; activeAt: number }[];
  /** Reduced motion: key frames, each with the captions it illustrates. */
  stills: { frame: number; captions: number[] }[];
  /** Scroll progress at which each frame becomes the one on screen. */
  keys: number[];
};

export function journeyFrameSrc(m: JourneyManifest, i: number): string {
  return m.src.replace("{i}", String(i).padStart(m.pad, "0"));
}
