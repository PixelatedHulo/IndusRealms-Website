// components/BackgroundClouds.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  src?: string;            // your 10s clip
  opacity?: number;        // 0..1
  hueRotateDeg?: number;   // warm tint
  brightness?: number;
  contrast?: number;
  zIndexClass?: string;    // e.g. "z-0"
  earlyMs?: number;        // how early next clip starts before end
  crossfadeMs?: number;    // fade overlap duration
};

export default function BackgroundClouds({
  src = "/videos/clouds.mp4",
  opacity = 0.28,
  hueRotateDeg = 10,
  brightness = 0.8,
  contrast = 1.05,
  zIndexClass = "z-0",
  earlyMs = 320,          // for 10s video, ~300–500ms works well
  crossfadeMs = 420,      // smooth overlap
}: Props) {
  const A = useRef<HTMLVideoElement | null>(null);
  const B = useRef<HTMLVideoElement | null>(null);
  const [active, setActive] = useState<"A" | "B">("A");
  const raf = useRef<number | null>(null);
  const durationRef = useRef<number>(0);
  const fadingRef = useRef<boolean>(false);

  const reducedMotion = useMemo(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const style = {
    opacity: 0,
    filter: `hue-rotate(${hueRotateDeg}deg) brightness(${brightness}) contrast(${contrast})`,
    transition: "opacity 120ms linear",
  } as React.CSSProperties;

  const playFromZero = (v: HTMLVideoElement) => {
    try {
      v.currentTime = 0.0001; // avoid black first-frame on some decoders
      const p = v.play();
      if (p && typeof p.then === "function") p.catch(() => {});
    } catch {}
  };

  useEffect(() => {
    const vA = A.current!;
    const vB = B.current!;
    if (!vA || !vB) return;

    // prepare both
    [vA, vB].forEach(v => {
      v.muted = true;
      v.loop = false;        // we manual-loop
      v.playsInline = true;
      v.preload = "auto";
      v.style.willChange = "opacity, transform, filter";
    });

    const onMeta = () => {
      const d = vA.duration || vB.duration || 0;
      if (isFinite(d) && d > 0) durationRef.current = d;
    };
    vA.addEventListener("loadedmetadata", onMeta, { once: true });
    vB.addEventListener("loadedmetadata", onMeta, { once: true });

    if (reducedMotion) {
      vA.pause(); vB.pause();
      return;
    }

    // start A visible
    vA.style.opacity = String(opacity);
    vB.style.opacity = "0";
    playFromZero(vA);
    vB.pause();

    const tick = () => {
      const main = active === "A" ? vA : vB;
      const other = active === "A" ? vB : vA;
      const dur = durationRef.current;

      if (dur > 0 && main.currentTime > 0 && !fadingRef.current) {
        const remainingMs = (dur - main.currentTime) * 1000;

        if (remainingMs <= earlyMs + 16) {
          // start other and fade
          fadingRef.current = true;
          playFromZero(other);

          const start = performance.now();
          const initialActive = active;

          const fade = () => {
            const t = Math.min(1, (performance.now() - start) / crossfadeMs);

            if (initialActive === "A") {
              vA.style.opacity = String(opacity * (1 - t));
              vB.style.opacity = String(opacity * t);
            } else {
              vB.style.opacity = String(opacity * (1 - t));
              vA.style.opacity = String(opacity * t);
            }

            if (t < 1) {
              raf.current = requestAnimationFrame(fade);
            } else {
              // switch roles
              setActive(prev => (prev === "A" ? "B" : "A"));
              main.pause();
              main.currentTime = 0.0001;
              fadingRef.current = false;
            }
          };

          raf.current = requestAnimationFrame(fade);
        }
      }

      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      vA.removeEventListener("loadedmetadata", onMeta);
      vB.removeEventListener("loadedmetadata", onMeta);
    };
  }, [opacity, crossfadeMs, earlyMs, reducedMotion, active]);

  return (
    <div className={`pointer-events-none fixed inset-0 ${zIndexClass} overflow-hidden`} aria-hidden="true">
      <video
        ref={A}
        className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover"
        src={src}
        muted
        playsInline
        preload="auto"
        style={style}
      />
      <video
        ref={B}
        className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover"
        src={src}
        muted
        playsInline
        preload="auto"
        style={style}
      />
      {/* subtle vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 85%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.35) 100%)",
        }}
      />
    </div>
  );
}
