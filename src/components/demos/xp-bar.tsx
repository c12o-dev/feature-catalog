"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { motion, useAnimate, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PER_LEVEL = 1000;
const INITIAL_XP = 640;

const ACTIONS = [
  { label: "タスク完了", xp: 50 },
  { label: "週次目標達成", xp: 250 },
];

export default function XpBar() {
  const [xp, setXp] = useState(INITIAL_XP);
  const [celebrate, setCelebrate] = useState<number | null>(null);
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const reduce = useReducedMotion();
  const xpRef = useRef(INITIAL_XP);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const level = Math.floor(xp / PER_LEVEL) + 1;
  const inLevel = xp % PER_LEVEL;

  const gain = async (amount: number) => {
    const prev = xpRef.current;
    const next = prev + amount;
    xpRef.current = next;
    setXp(next);
    const target = (next % PER_LEVEL) / PER_LEVEL;
    const crossed = Math.floor(next / PER_LEVEL) > Math.floor(prev / PER_LEVEL);
    if (crossed) {
      setCelebrate(Math.floor(next / PER_LEVEL) + 1);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCelebrate(null), 2400);
    }
    if (!scope.current) return;
    if (reduce) {
      animate(scope.current, { scaleX: target }, { duration: 0 });
      return;
    }
    if (crossed) {
      // fill to the end, reset, then continue into the new level
      await animate(scope.current, { scaleX: 1 }, { duration: 0.35, ease: "easeOut" });
      if (!scope.current) return;
      await animate(scope.current, { scaleX: 0 }, { duration: 0 });
      if (!scope.current) return;
    }
    animate(scope.current, { scaleX: target }, { duration: 0.5, ease: [0.22, 1, 0.36, 1] });
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-3 rounded-lg border bg-card p-4">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-full border-2 border-amber-500 text-sm font-semibold tabular-nums text-amber-600 transition-transform duration-300 dark:border-amber-400 dark:text-amber-300",
            celebrate !== null && "scale-110"
          )}
          aria-hidden
        >
          {level}
        </div>
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-baseline justify-between gap-2">
            <span className="flex items-center gap-1 text-sm font-medium">
              <Sparkles className="size-3.5 text-amber-500 dark:text-amber-400" />
              レベル {level}
            </span>
            <span className="text-xs text-muted-foreground tabular-nums">
              {inLevel.toLocaleString()} / {PER_LEVEL.toLocaleString()} XP
            </span>
          </div>
          <div
            role="progressbar"
            aria-label={`レベル ${level} の経験値`}
            aria-valuemin={0}
            aria-valuemax={PER_LEVEL}
            aria-valuenow={inLevel}
            aria-valuetext={`${inLevel} / ${PER_LEVEL} XP、次のレベルまで ${PER_LEVEL - inLevel} XP`}
            className="h-2.5 overflow-hidden rounded-full bg-muted"
          >
            <motion.div
              ref={scope}
              initial={{ scaleX: INITIAL_XP / PER_LEVEL }}
              className="h-full origin-left rounded-full bg-amber-500 dark:bg-amber-400"
            />
          </div>
          <p className="text-[11px] text-muted-foreground tabular-nums">次のレベルまであと {(PER_LEVEL - inLevel).toLocaleString()} XP</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {ACTIONS.map((a) => (
          <Button key={a.label} size="sm" variant="outline" onClick={() => gain(a.xp)}>
            {a.label}
            <span className="text-xs text-muted-foreground tabular-nums">+{a.xp}</span>
          </Button>
        ))}
      </div>

      <div aria-live="polite" className="min-h-5 text-xs">
        {celebrate !== null && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 font-medium text-amber-700 dark:text-amber-300">
            <Sparkles className="size-3" />
            レベル {celebrate} に到達しました
          </span>
        )}
      </div>
    </div>
  );
}
