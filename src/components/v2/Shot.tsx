// A real product screenshot in a fixed 16:10 tile, so every shot on a page is
// the same size whatever its source. Phone captures sit centered on a quiet
// panel instead of being stretched to fill.

export default function Shot({
  src,
  alt,
  index,
  title,
  caption,
  phone = false,
}: {
  src: string;
  alt: string;
  index: string;
  title: string;
  caption: string;
  phone?: boolean;
}) {
  return (
    <figure className="group">
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-cream/15 bg-[#F7F5F2]">
        {phone ? (
          <div className="absolute inset-0 flex items-start justify-center bg-gradient-to-b from-teal/40 to-ink pt-[6%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              loading="lazy"
              className="w-[34%] rounded-[1.25rem] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] transition-transform duration-700 ease-out group-hover:-translate-y-1"
            />
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.015]"
          />
        )}
      </div>
      <figcaption className="mt-4 flex items-baseline gap-3">
        <span className="font-mono text-[11px] tracking-[0.14em] text-cream/35">{index}</span>
        <span>
          <span className="font-semibold text-cream">{title}</span>{" "}
          <span className="text-cream/60">{caption}</span>
        </span>
      </figcaption>
    </figure>
  );
}
