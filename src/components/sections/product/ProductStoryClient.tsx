"use client";

// The product story. One DOM, three presentations, chosen by the same media
// queries in CSS and in JS so the server markup is already laid out right:
//
//   md and up, motion OK   ScrollTrigger pins the stage and steps through the
//                          chapters as the visitor scrolls; each change is a
//                          250 ms opacity crossfade. No scrub, no parallax, no
//                          snapping. The scroll length is reserved in CSS
//                          (pinSpacing off), so pinning never shifts layout.
//   under md, motion OK    A plain vertical sequence, portrait media above each
//                          caption; a video plays only while it is in view.
//
// Playback rule while pinned: the chapter on screen plays and every other clip
// is paused. "On screen" comes from ScrollTrigger itself (the same scroll
// measure that drives the pin), not from per-video observers: all the chapters
// share one grid cell, so an observer cannot tell them apart anyway.
//   reduced motion         The same plain stack at every width. No pinning, no
//                          video, no transitions: posters or placeholders only.
//
// Captions are always real DOM text. Media is decorative (aria-hidden): the
// caption carries the meaning.

import { useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  storyMediaSrc,
  type StoryChapter,
  type StoryMediaAvailability,
} from "./storyChapters";

gsap.registerPlugin(ScrollTrigger);

const WIDE_QUERY = "(min-width: 768px)"; // Tailwind `md`
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

// Scroll distance per chapter while pinned, in viewport heights.
const VH_PER_CHAPTER = 60;

type View = { wide: boolean; reduced: boolean };

function useView(): View | null {
  // null until mounted: the server and the first client render agree, and
  // media stays as poster or placeholder until the mode is known.
  const [view, setView] = useState<View | null>(null);

  useEffect(() => {
    const wide = window.matchMedia(WIDE_QUERY);
    const reduced = window.matchMedia(REDUCED_QUERY);
    const update = () => setView({ wide: wide.matches, reduced: reduced.matches });
    update();
    wide.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      wide.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  return view;
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function ProductStoryClient({
  chapters,
  media,
}: {
  chapters: readonly StoryChapter[];
  media: Record<string, StoryMediaAvailability>;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const view = useView();
  const [active, setActive] = useState(0);
  const [onScreen, setOnScreen] = useState(false);

  const pinned = view !== null && view.wide && !view.reduced;
  const count = chapters.length;

  useEffect(() => {
    if (!pinned) {
      setActive(0);
      setOnScreen(false);
      return;
    }

    const ctx = gsap.context(() => {
      const step = (progress: number) =>
        setActive(Math.min(count - 1, Math.floor(progress * count)));

      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: stageRef.current,
        // The wrapper's CSS height already reserves the scroll distance.
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => step(self.progress),
        onRefresh: (self) => step(self.progress),
      });

      // Is any of the section on screen? Same scroll measure as the pin, so it
      // is right after an instant jump or a reload that restores scroll too.
      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => setOnScreen(self.isActive),
        onRefresh: (self) => setOnScreen(self.isActive),
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, [pinned, count]);

  const wrapperStyle = {
    "--story-h": `${100 + count * VH_PER_CHAPTER}vh`,
  } as CSSProperties;

  return (
    <div
      ref={wrapperRef}
      style={wrapperStyle}
      className="mt-16 md:motion-safe:mt-0 md:motion-safe:h-[var(--story-h)]"
    >
      <div
        ref={stageRef}
        className="md:motion-safe:flex md:motion-safe:h-screen md:motion-safe:flex-col md:motion-safe:justify-center md:motion-safe:pt-16"
      >
        <ol className="mx-auto flex w-full max-w-7xl flex-col gap-24 px-6 lg:px-12 md:motion-safe:grid md:motion-safe:gap-0">
          {chapters.map((chapter, i) => {
            const isActive = i === active;
            return (
              <li
                key={chapter.id}
                className={`flex flex-col gap-8 md:grid md:grid-cols-12 md:items-center md:gap-12 md:motion-safe:col-start-1 md:motion-safe:row-start-1 md:motion-safe:transition-opacity md:motion-safe:duration-[250ms] md:motion-safe:ease-out ${
                  isActive ? "" : "md:motion-safe:pointer-events-none md:motion-safe:opacity-0"
                }`}
              >
                {chapter.media !== "none" && (
                  <div aria-hidden="true" className="md:col-span-7 md:col-start-6 md:row-start-1">
                    <ChapterMedia
                      chapter={chapter}
                      avail={media[chapter.id]}
                      view={view}
                      // Pinned: only the active chapter plays, and only while the
                      // section is on screen. Stacked: each video plays whenever
                      // it is itself in view (its own observer).
                      active={pinned ? isActive && onScreen : true}
                      observe={!pinned}
                    />
                  </div>
                )}
                <Caption chapter={chapter} index={i} />
              </li>
            );
          })}
        </ol>

        <div
          aria-hidden="true"
          className="mx-auto mt-10 hidden w-full max-w-7xl items-center gap-4 px-6 md:motion-safe:flex lg:px-12"
        >
          <span className="font-mono text-[11px] tabular-nums tracking-[0.14em] text-cream/50">
            {pad(active + 1)} / {pad(count)}
          </span>
          <span className="flex gap-1.5">
            {chapters.map((c, i) => (
              <span
                key={c.id}
                className={`h-px w-6 transition-colors duration-[250ms] ease-out ${
                  i === active ? "bg-apricot" : "bg-cream/20"
                }`}
              />
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}

function Caption({ chapter, index }: { chapter: StoryChapter; index: number }) {
  const closing = chapter.media === "none";
  return (
    <div
      className={
        closing
          ? "md:col-span-10 md:col-start-1 md:row-start-1"
          : "md:col-span-5 md:col-start-1 md:row-start-1"
      }
    >
      <span
        aria-hidden="true"
        className="font-mono text-[11px] tracking-[0.14em] text-cream/35"
      >
        {pad(index + 1)}
      </span>
      <h3
        className={`mt-4 text-balance font-serif font-medium tracking-[-0.02em] text-cream ${
          closing
            ? "max-w-[24ch] text-[clamp(2rem,4.5vw,3.75rem)] leading-[1]"
            : "text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.05]"
        }`}
      >
        {chapter.title}
      </h3>
      {chapter.body && (
        <p className={`mt-4 max-w-md text-lg ${closing ? "text-apricot-light" : "text-cream/65"}`}>
          {chapter.body}
        </p>
      )}
    </div>
  );
}

function ChapterMedia({
  chapter,
  avail,
  view,
  active,
  observe,
}: {
  chapter: StoryChapter;
  avail: StoryMediaAvailability | undefined;
  view: View | null;
  active: boolean;
  observe: boolean;
}) {
  const poster = avail?.poster ? storyMediaSrc(chapter.id, "poster.jpg") : undefined;
  const isScreen = chapter.media === "screen";

  // Which clip this slot plays, if any. Nothing before mount or under reduced
  // motion, and nothing unless the file was found at build time. Phone UI is
  // portrait on every width; camera footage switches with the frame.
  let video: string | undefined;
  if (view && !view.reduced && avail) {
    if (isScreen || !view.wide) {
      if (avail.portrait) video = storyMediaSrc(chapter.id, "portrait.mp4");
    } else if (avail.landscape) {
      video = storyMediaSrc(chapter.id, "landscape.mp4");
    }
  }

  const content = video ? (
    <StoryVideo key={video} src={video} poster={poster} active={active} observe={observe} />
  ) : poster ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={poster}
      alt=""
      loading="lazy"
      className="absolute inset-0 h-full w-full object-cover"
    />
  ) : (
    <Placeholder id={chapter.id} shot={chapter.shot} compact={isScreen} />
  );
  const hasMedia = Boolean(video || poster);

  if (isScreen) {
    // A quiet panel with the portrait clip in a phone frame, so a phone
    // recording reads as intentional on a wide layout instead of cropped.
    return (
      <div className="relative mx-auto aspect-[4/5] w-full max-w-[calc(64vh*4/5)] overflow-hidden rounded-lg border border-cream/10 bg-gradient-to-b from-teal/40 to-ink md:aspect-video md:max-w-none">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative aspect-[9/16] h-[88%] shrink-0 rounded-[1.75rem] border border-cream/20 bg-ink p-[5px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
            <div className="relative h-full w-full overflow-hidden rounded-[1.4rem]">
              {content}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto aspect-[9/16] w-full max-w-[calc(64vh*9/16)] overflow-hidden rounded-lg md:aspect-video md:max-w-none">
      {content}
      {hasMedia && (
        <span className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-cream/15" />
      )}
    </div>
  );
}

function Placeholder({
  id,
  shot,
  compact,
}: {
  id: string;
  shot?: string;
  compact: boolean;
}) {
  return (
    <div
      className={`absolute inset-0 flex flex-col justify-end rounded-[inherit] border border-dashed border-cream/25 bg-cream/[0.03] ${
        compact ? "gap-1.5 p-3" : "gap-2 p-5"
      }`}
    >
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-apricot">
        {id}
      </span>
      {shot && (
        <span className={`leading-snug text-cream/55 ${compact ? "text-[11px]" : "text-sm"}`}>
          {shot}
        </span>
      )}
    </div>
  );
}

function StoryVideo({
  src,
  poster,
  active,
  observe,
}: {
  src: string;
  poster?: string;
  active: boolean;
  observe: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);

  // Stacked layout only: track this video's own visibility. (Pinned layout
  // passes `active` already resolved from ScrollTrigger.)
  useEffect(() => {
    const el = ref.current;
    if (!observe || !el) return;
    const io = new IntersectionObserver(
      (entries) => setInView(entries[entries.length - 1].isIntersecting),
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [observe]);

  const wanted = active && (!observe || inView);

  // Make the element match `wanted`, and keep it matching. Anything can pause
  // or interrupt a clip behind React's back (the browser pausing muted video in
  // a hidden tab, an interrupted or refused play()), and `wanted` may not
  // change again afterwards, so the listeners below re-sync instead of leaving
  // the clip stopped.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // React sets `muted` as a property only; set it explicitly so play()
    // without a user gesture is allowed everywhere.
    el.muted = true;
    el.defaultMuted = true;

    let retried = false;
    let resumes = 0;
    let retryTimer: number | undefined;

    const sync = () => {
      if (!wanted) {
        if (!el.paused) el.pause();
        return;
      }
      if (!el.paused) return;
      el.play().catch(() => {
        // Refused or interrupted. The `canplay` listener retries when the
        // media is ready; if it already is, retry once shortly. If that is
        // refused too (e.g. Low Power Mode) the poster stays up.
        if (retried) return;
        retried = true;
        if (el.readyState >= 3) retryTimer = window.setTimeout(sync, 250);
      });
    };

    // Paused by someone else while it should be playing: resume, unless the
    // page is hidden (the browser would only pause it again), and never in a
    // tight loop.
    const onPause = () => {
      if (wanted && document.visibilityState === "visible" && resumes < 3) {
        resumes += 1;
        sync();
      }
    };
    const onVisible = () => {
      if (document.visibilityState === "visible") sync();
    };

    el.addEventListener("pause", onPause);
    el.addEventListener("canplay", sync);
    document.addEventListener("visibilitychange", onVisible);
    sync();

    return () => {
      window.clearTimeout(retryTimer);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("canplay", sync);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [wanted]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      playsInline
      loop
      preload="metadata"
      aria-hidden="true"
      tabIndex={-1}
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}
