// Decorative line-art kit. Pure JSX, no "use client" directive needed.
// Color is controlled by the parent's text-* class (e.g. text-teal-light)
// since every stroke uses stroke="currentColor". Purely decorative: all
// elements are aria-hidden and carry no semantic meaning.

type RippleArtProps = {
  className?: string;
};

export function ConcentricArcs({ className }: RippleArtProps) {
  return (
    <svg
      viewBox="0 0 400 200"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M 160 200 A 40 40 0 0 1 240 200"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.55"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M 130 200 A 70 70 0 0 1 270 200"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.45"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M 100 200 A 100 100 0 0 1 300 200"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.35"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M 70 200 A 130 130 0 0 1 330 200"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.25"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M 40 200 A 160 160 0 0 1 360 200"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.15"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx="200" cy="200" r="4" fill="#E8A87C" stroke="none" />
    </svg>
  );
}

export function WaveLines({ className }: RippleArtProps) {
  return (
    <svg
      viewBox="0 0 600 120"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M 0 30 C 75 -10, 125 70, 200 30 C 275 -10, 325 70, 400 30 C 475 -10, 525 70, 600 30"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.2"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M 0 60 C 75 20, 125 100, 200 60 C 275 20, 325 100, 400 60 C 475 20, 525 100, 600 60"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.35"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M 0 90 C 75 50, 125 130, 200 90 C 275 50, 325 130, 400 90 C 475 50, 525 130, 600 90"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function DotRipple({ className }: RippleArtProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle
        cx="100"
        cy="100"
        r="30"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.5"
        vectorEffect="non-scaling-stroke"
      />
      <circle
        cx="100"
        cy="100"
        r="60"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.3"
        vectorEffect="non-scaling-stroke"
      />
      <circle
        cx="100"
        cy="100"
        r="90"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.18"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx="100" cy="100" r="5" fill="#E8A87C" stroke="none" />
    </svg>
  );
}
