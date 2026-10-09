"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Mic, Square } from "lucide-react";
import { cn } from "@/lib/utils";

type Phase = "idle" | "listening" | "thinking" | "speaking";

const USER = "明日の朝、傘は必要かな？";
const AI = "明日の朝は曇りで、降水確率は 20% です。傘はなくても大丈夫そうです。";
const BARS = 24;
// Deterministic per-bar amplitude so the waveform looks organic without randomness.
const AMP = Array.from({ length: BARS }, (_, i) => 0.35 + 0.65 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6)));

const STATUS: Record<Phase, string> = {
  idle: "マイクをタップして話しかけてください",
  listening: "聞いています…",
  thinking: "考えています…",
  speaking: "応答中",
};

export default function VoiceMode() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const [log, setLog] = useState<{ who: "user" | "ai"; text: string }[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clear, []);

  const toggle = () => {
    clear();
    if (phase !== "idle") {
      setPhase("idle");
      return;
    }
    setLog([]);
    setPhase("listening");
    timers.current = [
      setTimeout(() => {
        setLog([{ who: "user", text: USER }]);
        setPhase("thinking");
      }, 2200),
      setTimeout(() => {
        setLog([
          { who: "user", text: USER },
          { who: "ai", text: AI },
        ]);
        setPhase("speaking");
      }, 3200),
      setTimeout(() => setPhase("idle"), 6500),
    ];
  };

  const active = phase !== "idle";
  const moving = (phase === "listening" || phase === "speaking") && !reduce;

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-4 rounded-lg border bg-card p-5">
      <div className="flex h-12 items-center gap-[3px]" aria-hidden>
        {AMP.map((a, i) => (
          <motion.span
            key={i}
            className={cn(
              "block h-12 w-1 origin-center rounded-full",
              phase === "speaking" ? "bg-violet-500 dark:bg-violet-400" : active ? "bg-foreground/70" : "bg-muted-foreground/30",
            )}
            initial={false}
            animate={moving ? { scaleY: [0.15, a, 0.25, a * 0.7, 0.15] } : { scaleY: active ? a * 0.5 : 0.12 }}
            transition={moving ? { duration: 1.1 + (i % 5) * 0.12, repeat: Infinity, ease: "easeInOut", delay: (i % 7) * 0.06 } : { duration: 0.2 }}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={toggle}
        aria-pressed={active}
        aria-label={active ? "音声モードを終了" : "音声モードを開始"}
        className={cn(
          "grid size-16 place-items-center rounded-full shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
          active ? "bg-red-600 text-white dark:bg-red-500" : "bg-primary text-primary-foreground",
        )}
      >
        {active ? <Square className="size-6 fill-current" /> : <Mic className="size-7" />}
      </button>

      <p role="status" className="text-xs text-muted-foreground">
        {STATUS[phase]}
      </p>

      <ul className="min-h-24 w-full space-y-2" aria-live="polite">
        {log.map((m, i) => (
          <li key={i} className={cn("flex", m.who === "user" ? "justify-end" : "justify-start")}>
            <span
              className={cn(
                "max-w-[85%] rounded-lg px-3 py-1.5 text-sm",
                m.who === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
              )}
            >
              {m.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
