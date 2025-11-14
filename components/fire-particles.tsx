// components/fire-particles.tsx
"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** Explicit particle count. If provided, overrides density calculation. */
  count?: number;
  /** Particles per 10k px² (defaults to 0.9 ≈ lively). */
  density?: number;
  /** Max distance (px) for link lines. */
  linkDistance?: number;
  /** Max speed (px/frame @ 60fps). */
  maxSpeed?: number;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  flicker: number;
};

export default function FireParticles({
  count,
  density = 0.9,         // ⬆️ more by default (per 10k px²)
  linkDistance = 160,     // a bit more reach
  maxSpeed = 0.55,        // slightly faster
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const lastTsRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    ctxRef.current = ctx;

    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const reducedMotion = media?.matches ?? false;

    const setSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { innerWidth: w, innerHeight: h } = window;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    };

    const initParticles = () => {
      const area = window.innerWidth * window.innerHeight;

      // If explicit count provided, use it. Otherwise compute from density per 10k px².
      let target = typeof count === "number"
        ? Math.max(0, Math.floor(count))
        : Math.round((area / 10000) * density);

      // Sensible caps: higher on desktop, moderate on mobile
      const cap = window.innerWidth < 640 ? 140 : 320;
      target = Math.min(target, cap);

      const arr: Particle[] = [];
      for (let i = 0; i < target; i++) arr.push(makeParticle());
      particlesRef.current = arr;
    };

    const makeParticle = (): Particle => {
      const speed = 0.18 + Math.random() * (maxSpeed - 0.18);
      const angle = Math.random() * Math.PI * 2;
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: 1.1 + Math.random() * 2.2,
        life: 0,
        flicker: Math.random() * Math.PI * 2,
      };
    };

    const mouse = { x: 0, y: 0, active: false };
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const onLeave = () => (mouse.active = false);

    const tick = (ts: number) => {
      const ctx = ctxRef.current!;
      const particles = particlesRef.current;
      const dt = Math.min((ts - (lastTsRef.current || ts)) / (1000 / 60), 3);
      lastTsRef.current = ts;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Subtle bottom glow
      const grd = ctx.createRadialGradient(
        window.innerWidth * 0.5,
        window.innerHeight * 0.85,
        40,
        window.innerWidth * 0.5,
        window.innerHeight * 0.85,
        Math.max(window.innerWidth, window.innerHeight) * 0.7
      );
      grd.addColorStop(0, "rgba(255, 180, 60, 0.06)");
      grd.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update + draw embers
      const repelRadius = 110;
      const repelStrength = 0.065;
      for (let p of particles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // wrap
        if (p.x < -20) p.x = window.innerWidth + 20;
        if (p.x > window.innerWidth + 20) p.x = -20;
        if (p.y < -20) p.y = window.innerHeight + 20;
        if (p.y > window.innerHeight + 20) p.y = -20;

        // mouse repel
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < repelRadius * repelRadius) {
            const d = Math.sqrt(d2) || 1;
            p.x += (dx / d) * repelStrength * (repelRadius - d);
            p.y += (dy / d) * repelStrength * (repelRadius - d);
          }
        }

        // flicker
        p.flicker += 0.04 * dt;
        const size = p.r + Math.sin(p.flicker) * 0.25;

        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 198, 80, 0.9)";
        ctx.shadowColor = "rgba(255, 160, 50, 0.35)";
        ctx.shadowBlur = 8;
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Lines
      ctx.shadowBlur = 0;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < linkDistance) {
            const alpha = 0.25 * (1 - dist / linkDistance);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 206, 90, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    const setSizeAndStart = () => {
      setSize();
      if (!reducedMotion) {
        lastTsRef.current = 0;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    setSizeAndStart();
    window.addEventListener("resize", setSizeAndStart);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    const onVisibility = () => {
      if (document.hidden) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      } else if (!reducedMotion) {
        lastTsRef.current = 0;
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", setSizeAndStart);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [count, density, linkDistance, maxSpeed]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[2] mix-blend-plus-lighter"
      aria-hidden="true"
    />
  );
}
