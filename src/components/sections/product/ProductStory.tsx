// Server component. Reads the journey manifest at BUILD time (this site is a
// static export) and hands it to the client, so the page ships with the frame
// count and scroll mapping already in its HTML.

import fs from "fs";
import path from "path";
import Reveal from "@/components/v2/Reveal";
import { H2, Label } from "@/components/v2/ui";
import ProductStoryClient from "./ProductStoryClient";
import { JOURNEY_CAPTIONS, type JourneyManifest } from "./storyJourney";

function readManifest(): JourneyManifest {
  const file = path.join(process.cwd(), "public", "journey", "manifest.json");
  const manifest = JSON.parse(fs.readFileSync(file, "utf8")) as JourneyManifest;
  if (manifest.captions.length !== JOURNEY_CAPTIONS.length) {
    throw new Error(
      `journey manifest has ${manifest.captions.length} captions, the page has ${JOURNEY_CAPTIONS.length}`,
    );
  }
  return manifest;
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
      <ProductStoryClient manifest={readManifest()} captions={JOURNEY_CAPTIONS} />
    </section>
  );
}
