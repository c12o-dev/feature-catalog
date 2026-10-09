"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export default function CursorFollower() {
  const reduce = useReducedMotion();
  const areaRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const raf = useRef(0);
  const [inside, setInside] = useState(false);
  const [hot, setHot] = useState(false);

  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    target.current = { x: r.width / 2, y: r.height / 2 };
    ring.current = { ...target.current };
    const place = () => {
      const { x, y } = target.current;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%)`;
    };
    const tick = () => {
      const k = reduce ? 1 : 0.16;
      ring.current.x += (target.current.x - ring.current.x) * k;
      ring.current.y += (target.current.y - ring.current.y) * k;
      place();
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [reduce]);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    target.current = { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  return (
    <div
      ref={areaRef}
      onPointerMove={onMove}
      onPointerEnter={(e) => {
        onMove(e);
        setInside(true);
      }}
      onPointerLeave={() => {
        setInside(false);
        setHot(false);
      }}
      className={cn("relative h-56 overflow-hidden rounded-lg border bg-background", inside && "md:cursor-none")}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center">
        <p className="text-xs text-muted-foreground">エリア内でポインタを動かしてください</p>
        <div className="flex flex-wrap justify-center gap-2">
          {["作品を見る", "お問い合わせ"].map((t) => (
            <button
              key={t}
              type="button"
              onPointerEnter={() => setHot(true)}
              onPointerLeave={() => setHot(false)}
              className="rounded-full border bg-card px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div
        ref={ringRef}
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-0 top-0 rounded-full border border-foreground/40 transition-[width,height,opacity,background-color] duration-200",
          hot ? "size-14 bg-foreground/10" : "size-9",
          inside ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        ref={dotRef}
        aria-hidden
        className={cn("pointer-events-none absolute left-0 top-0 size-2 rounded-full bg-foreground transition-opacity", inside && !hot ? "opacity-100" : "opacity-0")}
      />
    </div>
  );
}
