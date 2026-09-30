// The product story, chapter by chapter. One typed config drives the copy, the
// media slots and the placeholders.
//
// Titles and bodies are legally reviewed wording: Refleo surfaces information,
// it never interprets, diagnoses, detects or predicts. Do not edit them here
// without that review.
//
// Media for chapter <id> lives in public/story/<id>/:
//   landscape.mp4  16:9, camera footage for the desktop panel ("scene" only)
//   portrait.mp4   9:16, mobile panel; for "screen" chapters also the desktop
//                  panel, shown inside a phone frame instead of being cropped
//   poster.jpg     still shown before playback, and under reduced motion
// Availability is checked at build time (see ProductStory.tsx); a missing file
// renders a placeholder card, never a broken <video>.

export type StoryMediaKind = "scene" | "screen" | "none";

export type StoryChapter = {
  id: string;
  title: string;
  body?: string;
  media: StoryMediaKind;
  /** One line describing the intended shot. Shown on the placeholder only. */
  shot?: string;
};

/** Which of a chapter's media files exist in public/story/<id>/. */
export type StoryMediaAvailability = {
  landscape: boolean;
  portrait: boolean;
  poster: boolean;
};

export const STORY_CHAPTERS: readonly StoryChapter[] = [
  {
    id: "evening",
    title: "Between sessions, life keeps happening.",
    media: "scene",
    shot: "Camera footage: an ordinary evening at home, a phone within reach.",
  },
  {
    id: "record",
    title: "A patient records a short check-in.",
    body: "Voice or text, about thirty seconds, whenever it happens.",
    media: "screen",
    shot: "iPhone screen recording: recording a short voice check-in.",
  },
  {
    id: "transcript",
    title: "Their words, in their own words.",
    body: "The recording becomes a transcript they review before it's saved.",
    media: "screen",
    shot: "iPhone screen recording: reviewing the transcript, then saving it.",
  },
  {
    id: "days",
    title: "Days pass between sessions.",
    body: "Check-ins collect over the week, in order.",
    media: "scene",
    shot: "Camera footage: the week going by, day to day.",
  },
  {
    id: "morning",
    title: "Before the session, the clinician opens Refleo.",
    media: "scene",
    shot: "Camera footage: the clinician's morning, opening Refleo before a session.",
  },
  {
    id: "dashboard",
    title: "Every client at a glance.",
    body: "New check-ins, and any matches on keywords the clinician chose.",
    media: "screen",
    shot: "iPhone screen recording: the client list with new check-ins.",
  },
  {
    id: "brief",
    title: "A one-screen brief, built from what the patient said.",
    body: "Their own words, surfaced before the session.",
    media: "screen",
    shot: "iPhone screen recording: scrolling the pre-session brief.",
  },
  {
    id: "boundary",
    title: "Refleo surfaces what was said. The judgment stays with the clinician.",
    body: "Safety flags are exact matches on keywords the clinician chose.",
    media: "none",
  },
];

export type StoryMediaFile = "landscape.mp4" | "portrait.mp4" | "poster.jpg";

export function storyMediaSrc(id: string, file: StoryMediaFile): string {
  return `/story/${id}/${file}`;
}
