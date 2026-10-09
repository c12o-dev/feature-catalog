"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion, useSpring } from "motion/react";
import { Pause, Play, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AmbientOrb() {
  const reduce = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 40, damping: 18 });
  const y = useSpring(0, { stiffness: 40, damping: 18 });
  const still = reduce || paused;

  const onMove = (e: React.PointerEvent) => {
    if (still || !box.current) return;
    const r = box.current.getBoundingClientRect();
    x.set(((e.clientX - r.left) / r.width - 0.5) * 80);
    y.set(((e.clientY - r.top) / r.height - 0.5) * 60);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const anim = (name: string, dur: number) => (still ? undefined : `${name} ${dur}s ease-in-out infinite`);

  return (
    <div
      ref={box}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative isolate mx-auto h-72 w-full max-w-2xl overflow-hidden rounded-lg border bg-slate-50 dark:bg-zinc-950"
    >
      <div aria-hidden className="absolute inset-0 -z-10">
        <div
          className="absolute -top-16 -left-12 size-56 rounded-full bg-sky-300/70 blur-3xl dark:bg-blue-600/45"
          style={{ animation: anim("orbA", 9) }}
        />
        <div
          className="absolute -right-10 -bottom-20 size-64 rounded-full bg-violet-300/70 blur-3xl dark:bg-violet-600/40"
          style={{ animation: anim("orbB", 11) }}
        />
        <div
          className="absolute top-10 left-1/3 size-40 rounded-full bg-rose-200/70 blur-3xl dark:bg-fuchsia-500/25"
          style={{ animation: anim("orbC", 7) }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -mt-20 -ml-20 size-40 rounded-full bg-amber-200/60 blur-2xl dark:bg-cyan-400/20"
          style={{ x, y }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(transparent_0,var(--color-background)_85%)] opacity-60" />
      </div>

      <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
        <span className="inline-flex items-center gap-1 rounded-full border bg-background/60 px-2.5 py-0.5 text-xs text-muted-foreground backdrop-blur">
          <Sparkles className="size-3" aria-hidden />
          新しいワークスペース
        </span>
        <h3 className="text-xl font-semibold tracking-tight text-balance sm:text-2xl">考えごとを、ひとつの場所に。</h3>
        <p className="max-w-sm text-sm text-muted-foreground">背景の光がゆっくり呼吸し、ポインターに少しだけついてきます。</p>
      </div>

      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
        aria-label={paused ? "背景アニメーションを再生" : "背景アニメーションを一時停止"}
        disabled={!!reduce}
        className={cn(
          "absolute right-3 bottom-3 grid size-8 place-items-center rounded-full border bg-background/70 text-muted-foreground backdrop-blur transition-colors hover:text-foreground disabled:opacity-50",
        )}
      >
        {paused || reduce ? <Play className="size-3.5" aria-hidden /> : <Pause className="size-3.5" aria-hidden />}
      </button>

      <style>{`
        @keyframes orbA { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(60px,40px) scale(1.15); } }
        @keyframes orbB { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-50px,-40px) scale(0.9); } }
        @keyframes orbC { 0%,100% { transform: translate(0,0) scale(1); opacity: .8; } 50% { transform: translate(40px,30px) scale(1.2); opacity: 1; } }
      `}</style>
    </div>
  );
}
