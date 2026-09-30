// The product story: one continuous pass through the Refleo app, scrubbed by
// scroll. The frames are an image sequence rendered from real simulator
// captures (refleo-video, composition StoryJourneyFrames) and shipped in
// public/journey/ with a manifest that says which frame belongs to which
// scroll position.
//
// Captions are legally reviewed wording: Refleo surfaces information, it never
// interprets, diagnoses, detects or predicts. Do not edit them here without
// that review. Their order matches the manifest's `captions`.

/**
 * The ground behind the phone while a caption is on screen: how warm the glow
 * is (0 all teal, 1 as much apricot as it gets) and where it sits, as offsets
 * in percent of its own size. Set here by hand, never sampled from the frames:
 * cooler on sign-in and the dashboard, warmer on the brief and "all set".
 */
export type JourneyGlow = { warm: number; x: number; y: number };

export type JourneyCaption = {
  title: string;
  body: string;
  /** One or two words for the progress rail. */
  label: string;
  glow: JourneyGlow;
};

export const JOURNEY_CAPTIONS: readonly JourneyCaption[] = [
  {
    title: "Open Refleo.",
    body: "One app for clinicians and the patients they see.",
    label: "Open",
    glow: { warm: 0.35, x: -4, y: 6 },
  },
  {
    title: "Sign in.",
    body: "Your caseload, and nothing else.",
    label: "Sign in",
    glow: { warm: 0.08, x: 3, y: -2 },
  },
  {
    title: "Every client at a glance.",
    body: "New check-ins, and any matches on keywords you chose.",
    label: "Dashboard",
    glow: { warm: 0.1, x: -3, y: -6 },
  },
  {
    title: "Open a client.",
    body: "Check-ins, sessions, and notes in one place.",
    label: "Client",
    glow: { warm: 0.28, x: 5, y: 0 },
  },
  {
    title: "Read the brief before the session.",
    body: "Their own words, surfaced. The judgment stays with you.",
    label: "Brief",
    glow: { warm: 0.62, x: -2, y: 5 },
  },
  {
    title: "Add a new client in seconds.",
    body: "A first name and last initial. Refleo never stores more.",
    label: "Add client",
    glow: { warm: 0.3, x: 4, y: -4 },
  },
  {
    title: "Hand them a code.",
    body: "They enter it once in their app, and you're connected.",
    label: "Code",
    glow: { warm: 0.7, x: 0, y: 3 },
  },
];

/** public/journey/manifest.json, written by refleo-video/scripts/journey. */
export type JourneyManifest = {
  version: 2;
  frames: number;
  width: number;
  height: number;
  /** MIME type of the frames, and their file extension. */
  format: "image/webp" | "image/jpeg";
  ext: "webp" | "jpg";
  /** Frame URL with `{i}` for the zero-padded index. */
  src: string;
  pad: number;
  /** Scroll progress (0..1) at which each caption takes over. */
  captions: { id: string; activeAt: number }[];
  /** Reduced motion: key frames, each with the captions it illustrates. */
  stills: { frame: number; captions: number[] }[];
  /**
   * Scroll progress at which each frame is exactly the one on screen. Between
   * two frames the page blends them.
   */
  keys: number[];
  /** Still frames: [frame, progress at which the still ends]. */
  holds: [number, number][];
  /** Touch-downs: scroll progress, and the touch point as fractions of the frame. */
  taps: { at: number; x: number; y: number }[];
};

export function journeyFrameSrc(m: JourneyManifest, i: number): string {
  return m.src.replace("{i}", String(i).padStart(m.pad, "0"));
}
