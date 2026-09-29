"use client";

// Slow, grainy WebGL water in Refleo's own colors, via ShaderGradient. The
// CSS gradient underneath is the whole effect under reduced motion and until
// the canvas loads, so the hero never flashes empty.

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ShaderGradientCanvas = dynamic(
  () => import("@shadergradient/react").then((m) => m.ShaderGradientCanvas),
  { ssr: false }
);
const ShaderGradient = dynamic(
  () => import("@shadergradient/react").then((m) => m.ShaderGradient),
  { ssr: false }
);

export default function HeroGradient() {
  const [live, setLive] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setLive(!reduced);
  }, []);

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 v2-gradient-fallback" />
      {live && (
        <ShaderGradientCanvas
          style={{ position: "absolute", inset: 0 }}
          pixelDensity={1}
          fov={45}
          pointerEvents="none"
          lazyLoad={false}
        >
          <ShaderGradient
            control="props"
            type="waterPlane"
            animate="on"
            uSpeed={0.07}
            uStrength={2.4}
            uDensity={1.1}
            uFrequency={5.5}
            uAmplitude={0}
            color1="#2A5866"
            color2="#E8A87C"
            color3="#0B1717"
            positionX={0.2}
            positionY={0.1}
            positionZ={0}
            rotationX={0}
            rotationY={0}
            rotationZ={235}
            cAzimuthAngle={180}
            cPolarAngle={115}
            cDistance={3.9}
            cameraZoom={1}
            lightType="3d"
            brightness={0.78}
            reflection={0.1}
            grain="on"
            grainBlending={0.3}
          />
        </ShaderGradientCanvas>
      )}
    </div>
  );
}
