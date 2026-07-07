// Ambient hero ripple field. Pure JSX, driven entirely by the .ripple-ring
// CSS keyframe defined in globals.css. No client-side logic needed, so no
// "use client" directive here. Reduced-motion handling lives in globals.css.

const RING_SIZES = [200, 340, 500, 680, 880];

export default function RippleField() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
    >
      <span className="absolute h-10 w-10 rounded-full bg-apricot" />
      {RING_SIZES.map((size, i) => (
        <span
          key={size}
          className={i === 0 ? "ripple-ring ripple-ring--accent" : "ripple-ring"}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            animationDelay: `${i * 1.2}s`,
            animationDuration: "9s",
          }}
        />
      ))}
    </div>
  );
}
