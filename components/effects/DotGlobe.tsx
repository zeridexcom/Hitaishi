"use client";

import { useEffect, useRef } from "react";

type Props = {
  className?: string;
  /** Hex color for the dots. */
  color?: string;
  /** Number of points distributed on the sphere. */
  points?: number;
  /** Radians per ms. */
  speed?: number;
};

export function DotGlobe({
  className,
  color = "#0e7490",
  points = 4500,
  speed = 0.00018,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let radius = 0;
    let cx = 0;
    let cy = 0;

    // Fibonacci sphere distribution — uniform points on a unit sphere
    const sphere: { x: number; y: number; z: number }[] = [];
    const phi = Math.PI * (Math.sqrt(5) - 1);
    for (let i = 0; i < points; i++) {
      const y = 1 - (i / (points - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phi * i;
      sphere.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r });
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      radius = Math.min(width, height) * 0.45;
      cx = width / 2;
      cy = height / 2;
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let raf = 0;
    let last = performance.now();
    let angleY = 0;
    const tiltX = Math.PI / 7; // slight axial tilt — feels less mechanical

    const cosTilt = Math.cos(tiltX);
    const sinTilt = Math.sin(tiltX);

    const draw = (now: number) => {
      const delta = now - last;
      last = now;
      if (!reduceMotion) angleY += delta * speed;

      ctx.clearRect(0, 0, width, height);

      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      for (let i = 0; i < sphere.length; i++) {
        const p = sphere[i];
        // Rotate around Y, then tilt around X
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;
        const y2 = p.y * cosTilt - z1 * sinTilt;
        const z2 = p.y * sinTilt + z1 * cosTilt;

        // Orthographic projection to 2D
        const sx = cx + x1 * radius;
        const sy = cy + y2 * radius;

        // Depth-based opacity: front dots crisper, back dots faded
        // z2 in [-1, 1] → front (1) bright, back (-1) faint
        const depth = (z2 + 1) / 2; // 0..1
        const alpha = 0.08 + depth * 0.55;
        const size = 0.6 + depth * 1.2;

        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        last = performance.now();
        raf = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [color, points, speed]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
