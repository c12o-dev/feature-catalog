"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Gift, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TABLE = [
  { rarity: "N", name: "コイン 100", p: 0.5, tone: "bg-muted text-muted-foreground" },
  { rarity: "R", name: "スタンプ", p: 0.3, tone: "bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-200" },
  { rarity: "SR", name: "限定アイコン枠", p: 0.15, tone: "bg-violet-100 text-violet-800 dark:bg-violet-900/60 dark:text-violet-200" },
  { rarity: "SSR", name: "秋限定テーマ", p: 0.05, tone: "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200" },
] as const;

// Seeded PRNG (mulberry32) so the draw sequence is reproducible.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(r: number) {
  let acc = 0;
  for (const item of TABLE) {
    acc += item.p;
    if (r < acc) return item;
  }
  return TABLE[0];
}

export default function Gacha() {
  const reduce = useReducedMotion();
  const rng = useRef(mulberry32(20261001));
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [coins, setCoins] = useState(500);
  const [state, setState] = useState<"idle" | "rolling" | "open">("idle");
  const [result, setResult] = useState<(typeof TABLE)[number] | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const draw = () => {
    if (state === "rolling" || coins < 100) return;
    const item = pick(rng.current());
    setCoins((c) => c - 100);
    setResult(null);
    setState("rolling");
    timer.current = setTimeout(
      () => {
        setResult(item);
        setHistory((h) => [item.rarity, ...h].slice(0, 8));
        setState("open");
      },
      reduce ? 0 : 1100,
    );
  };

  const rare = result && (result.rarity === "SR" || result.rarity === "SSR");

  return (
    <div className="mx-auto w-full max-w-sm space-y-4 rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">秋のガチャ</span>
        <span className="tabular-nums text-muted-foreground">所持コイン {coins}</span>
      </div>

      <div className="relative grid h-36 place-items-center overflow-hidden rounded-lg bg-muted/60">
        {state !== "open" && (
          <motion.div
            className="grid size-20 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-md"
            animate={state === "rolling" && !reduce ? { rotate: [0, -12, 12, -8, 8, 0], scale: [1, 1.05, 1] } : { rotate: 0, scale: 1 }}
            transition={state === "rolling" && !reduce ? { duration: 0.55, repeat: 1 } : { duration: 0 }}
          >
            <Gift className="size-9" aria-hidden />
          </motion.div>
        )}
        {state === "open" && result && (
          <motion.div
            className="flex flex-col items-center gap-2"
            initial={reduce ? false : { opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 320, damping: 18 }}
          >
            {rare && <Sparkles className="size-5 text-amber-500 dark:text-amber-400" aria-hidden />}
            <span className={cn("rounded-md px-2 py-0.5 text-xs font-bold", result.tone)}>{result.rarity}</span>
            <span className="text-sm font-medium">{result.name}</span>
          </motion.div>
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {state === "rolling" ? "抽選中" : result ? `${result.rarity}「${result.name}」を獲得しました` : ""}
      </p>

      {coins < 100 && state !== "rolling" ? (
        <Button variant="outline" onClick={() => setCoins(500)} className="w-full">
          コインを補充（デモ）
        </Button>
      ) : (
        <Button onClick={draw} disabled={state === "rolling"} className="w-full">
          {state === "rolling" ? "抽選中…" : "1 回まわす（100 コイン）"}
        </Button>
      )}

      <div className="flex items-start justify-between gap-3 text-[11px] text-muted-foreground">
        <dl className="grid grid-cols-[auto_auto] gap-x-2 tabular-nums">
          {TABLE.map((t) => (
            <div key={t.rarity} className="contents">
              <dt>{t.rarity}</dt>
              <dd>{(t.p * 100).toFixed(0)}%</dd>
            </div>
          ))}
        </dl>
        <div className="min-w-0 text-right">
          <div>履歴</div>
          <div className="mt-0.5 flex flex-wrap justify-end gap-1">
            {history.length === 0 && <span>—</span>}
            {history.map((h, i) => (
              <span key={i} className={cn("rounded px-1 font-medium", TABLE.find((t) => t.rarity === h)?.tone)}>
                {h}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
