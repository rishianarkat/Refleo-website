// Server component. Decides which story media exist at BUILD time (this site is
// a static export), so the client never renders a <video> for a file that
// isn't there and never probes for one with a request.

import fs from "fs";
import path from "path";
import Reveal from "@/components/v2/Reveal";
import { H2, Label } from "@/components/v2/ui";
import ProductStoryClient from "./ProductStoryClient";
import {
  STORY_CHAPTERS,
  storyMediaSrc,
  type StoryMediaAvailability,
  type StoryMediaFile,
} from "./storyChapters";

const PUBLIC_DIR = path.join(process.cwd(), "public");

function exists(id: string, file: StoryMediaFile): boolean {
  return fs.existsSync(path.join(PUBLIC_DIR, storyMediaSrc(id, file)));
}

function detectMedia(): Record<string, StoryMediaAvailability> {
  const out: Record<string, StoryMediaAvailability> = {};
  for (const c of STORY_CHAPTERS) {
    const none = c.media === "none";
    out[c.id] = {
      landscape: !none && c.media === "scene" && exists(c.id, "landscape.mp4"),
      portrait: !none && exists(c.id, "portrait.mp4"),
      poster: !none && exists(c.id, "poster.jpg"),
    };
  }
  return out;
}

export default function ProductStory() {
  return (
    <section className="border-t border-cream/10">
      <div className="mx-auto max-w-7xl px-6 pt-24 lg:px-12 lg:pt-32">
        <Reveal>
          <Label index="02">How it works</Label>
          <h2 className={`mt-6 ${H2}`}>
            Patients share. <em className="italic text-apricot-light">Refleo surfaces.</em>
          </h2>
        </Reveal>
      </div>
      <ProductStoryClient chapters={STORY_CHAPTERS} media={detectMedia()} />
    </section>
  );
}
