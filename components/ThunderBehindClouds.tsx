"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** strikes ke beech gap (ms) */
  intervalMs?: number;
  /** tiny pre-flash peak (0..1) */
  peak1?: number;
  /** main flash peak (0..1) */
  peak2?: number;
  /** pre-flash decay (ms) */
  decay1Ms?: number;
  /** 1st -> 2nd flash gap (ms) */
  interFlashGapMs?: number;
  /** main flash fast fade to mid (ms) */
  decay2Ms?: number;
  /** afterglow minimum opacity (0..1) – very low warm haze */
  afterglowMin?: number;
  /** afterglow tail slow fade to 0 (ms) */
  afterglowMs?: number;
  /** lightning → thunder delay (ms) */
  thunderDelayMs?: number;
  /** thunder volume (0..1) */
  volume?: number;
  /** assets */
  videoSrc?: string;
  audioSrc?: string;
};

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

/** raf-based opacity animation */
function animateOpacity(
  el: HTMLElement,
  from: number,
  to: number,
  duration: number,
  ease: (t: number) => number = (t) => 1 - Math.pow(1 - t, 2) // quadOut
) {
  let id: number;
  const start = performance.now();
  const step = (now: number) => {
    const t = clamp01((now - start) / Math.max(1, duration));
    const k = ease(t);
    el.style.opacity = String(from + (to - from) * k);
    if (t < 1) id = requestAnimationFrame(step);
  };
  cancelAnimationFrame(id!);
  id = requestAnimationFrame(step);
  return () => cancelAnimationFrame(id);
}

export default function ThunderBehindClouds({
  intervalMs = 15000, // ⬅️ longer cadence
  peak1 = 0.42,       // a bit stronger pre-flash
  peak2 = 0.80,       // brighter main flash
  decay1Ms = 160,
  interFlashGapMs = 130,
  decay2Ms = 1000,    // fast fade to mid
  afterglowMin = 0.18, // subtle warm haze that lingers
  afterglowMs = 2000, // very slow tail
  thunderDelayMs = 420,
  volume = 0.55,
  videoSrc = "/videos/lightning.mp4",
  audioSrc = "/sounds/thunder.wav",
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const flashRef = useRef<HTMLDivElement | null>(null);

  const intervalRef = useRef<number | null>(null);
  const clearersRef = useRef<(() => void)[]>([]);

  // 🔓 one-time audio unlock
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.preload = "auto";
    // @ts-ignore
    a.setAttribute("playsinline", "");

    const unlock = async () => {
      try {
        const prev = a.volume || volume;
        a.muted = true;
        a.volume = 0;
        await a.play().catch(() => {});
        a.pause();
        a.currentTime = 0;

        const lsMuted = localStorage.getItem("thunder:muted") !== "0";
        a.muted = lsMuted;
        a.volume = clamp01(prev);
      } finally {
        window.removeEventListener("pointerdown", unlock);
        window.removeEventListener("keydown", unlock);
        window.removeEventListener("touchstart", unlock);
      }
    };

    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    window.addEventListener("touchstart", unlock);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("touchstart", unlock);
    };
  }, [volume]);

  // 🎬 keep video paused; play only during flash window
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.loop = true;
    v.muted = true;
    v.currentTime = 0;
    v.pause();
    if (flashRef.current) flashRef.current.style.opacity = "0";
  }, []);

  // 🔁 schedule double-flash + afterglow
  useEffect(() => {
    const a = audioRef.current;
    const v = videoRef.current;
    const f = flashRef.current;
    if (!v || !f) return;

    if (a) {
      a.volume = clamp01(volume);
      a.loop = false;
      a.muted = localStorage.getItem("thunder:muted") !== "0";
    }

    const strike = () => {
      clearersRef.current.forEach((c) => c());
      clearersRef.current = [];

      // play organic texture while flashing
      v.currentTime = 0;
      v.play().catch(() => {});

      // 1) micro pop
      f.style.opacity = "0";
      clearersRef.current.push(animateOpacity(f, 0, peak1, 70));
      const t1 = window.setTimeout(() => {
        clearersRef.current.push(animateOpacity(f, peak1, 0, decay1Ms));
      }, 70);

      // 2) main burst then fade to afterglowMin, then long tail to 0
      const t2 = window.setTimeout(() => {
        // rise quickly to peak2
        clearersRef.current.push(animateOpacity(f, 0, peak2, 110));
        // fade down to warm afterglow
        const t3 = window.setTimeout(() => {
          clearersRef.current.push(animateOpacity(f, peak2, afterglowMin, decay2Ms));
          // and finally the long tail to 0
          const t4 = window.setTimeout(() => {
            clearersRef.current.push(animateOpacity(f, afterglowMin, 0, afterglowMs));
            // stop video near end of tail
            const t5 = window.setTimeout(() => {
              v.pause();
              v.currentTime = 0;
            }, Math.max(200, afterglowMs - 150));
            clearersRef.current.push(() => clearTimeout(t5));
          }, Math.max(40, decay2Ms - 20));
          clearersRef.current.push(() => clearTimeout(t4));
        }, 90);
        clearersRef.current.push(() => clearTimeout(t3));
      }, 70 + Math.max(20, interFlashGapMs));
      clearersRef.current.push(
        () => clearTimeout(t1),
        () => clearTimeout(t2)
      );

      // 3) thunder after delay
      if (a && !a.muted) {
        const ta = window.setTimeout(() => {
          a.currentTime = 0;
          a.play().catch(() => {});
        }, thunderDelayMs);
        clearersRef.current.push(() => clearTimeout(ta));
      }
    };

    const first = window.setTimeout(strike, 900);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(strike, intervalMs);

    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "t") strike();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      clearTimeout(first);
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener("keydown", onKey);
      clearersRef.current.forEach((c) => c());
      clearersRef.current = [];
    };
  }, [
    intervalMs,
    peak1,
    peak2,
    decay1Ms,
    interFlashGapMs,
    decay2Ms,
    afterglowMin,
    afterglowMs,
    thunderDelayMs,
    volume,
  ]);

  // 🔇 react to ThunderToggle
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onChange = (e: any) => (a.muted = e.detail?.muted ?? true);
    window.addEventListener("thunder:muted-change", onChange);
    return () => window.removeEventListener("thunder:muted-change", onChange);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* texture video (hidden; used during flash) */}
      <video
        ref={videoRef}
        src={videoSrc}
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover brightness-[0.95] contrast-[1.18] saturate-[1.15]"
        style={{ opacity: 0 }}
      />

      {/* WIDER golden bloom */}
      <div
        ref={flashRef}
        className="absolute inset-0"
        style={{
          opacity: 0,
          mixBlendMode: "screen",
          // much larger, layered gradients for wide-area glow
          background: [
            // small white core near top-center
            "radial-gradient(720px 520px at 52% 8%, rgba(255,255,255,0.92), transparent 60%)",
            // large warm bloom across upper third
            "radial-gradient(1500px 1000px at 50% 6%, rgba(255,220,150,0.88), transparent 72%)",
            // secondary warm spread to left
            "radial-gradient(1400px 950px at 35% 12%, rgba(255,190,90,0.55), transparent 75%)",
            // subtle blanket to right
            "radial-gradient(1600px 1100px at 70% 10%, rgba(255,170,60,0.35), transparent 78%)",
          ].join(","),
          filter: "contrast(1.25) brightness(1.32) saturate(1.18)",
          transition: "opacity 0.12s linear",
        }}
      />
      <audio ref={audioRef} src={audioSrc} preload="auto" />
    </div>
  );
}
