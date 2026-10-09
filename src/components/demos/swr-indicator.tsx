"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { RefreshCw } from "lucide-react";

// seeded deltas so the sequence is deterministic
const DELTAS = [3, -1, 2, 4, -2, 1, 5, -3, 2, 0];

export default function SwrIndicator() {
  const [count, setCount] = useState(1284);
  const [delta, setDelta] = useState(0);
  const [revalidating, setRevalidating] = useState(false);
  const [age, setAge] = useState(0);
  const step = useRef(0);
  const inner = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduce = useReducedMotion();

  const revalidate = () => {
    if (inner.current) return;
    setRevalidating(true);
    inner.current = setTimeout(() => {
      inner.current = null;
      const d = DELTAS[step.current++ % DELTAS.length];
      setCount((c) => c + d);
      setDelta(d);
      setAge(0);
      setRevalidating(false);
    }, 900);
  };
  const revalidateRef = useRef(revalidate);
  useEffect(() => {
    revalidateRef.current = revalidate;
  });

  useEffect(() => {
    const id = setInterval(() => revalidateRef.current(), 5000);
    const tick = setInterval(() => setAge((a) => a + 1), 1000);
    return () => {
      clearInterval(id);
      clearInterval(tick);
      if (inner.current) clearTimeout(inner.current);
      inner.current = null;
    };
  }, []);

  return (
    <div className="w-full max-w-sm space-y-2">
      <div className="rounded-lg border bg-card p-4 text-card-foreground">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-xs text-muted-foreground">アクティブユーザー</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-semibold tabular-nums">{count.toLocaleString("ja-JP")}</span>
              {delta !== 0 && (
                <span key={count} className={`text-xs tabular-nums ${delta > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                  {delta > 0 ? `+${delta}` : delta}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={revalidate}
            aria-label="今すぐ再検証"
            className="flex items-center gap-1 rounded-md px-1.5 py-1 text-xs text-muted-foreground hover:bg-muted"
          >
            <RefreshCw className={`size-3.5 ${revalidating && !reduce ? "animate-spin" : ""}`} />
          </button>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground" aria-live="polite">
          <span className={`size-1.5 rounded-full ${revalidating ? "bg-amber-500" : "bg-emerald-500"}`} />
          {revalidating ? "更新を確認中…（表示は前回の値）" : <span className="tabular-nums">{age} 秒前に更新</span>}
        </div>
      </div>
      <p className="text-center text-xs text-muted-foreground">古い値を出したまま裏で再取得し、差分だけそっと反映</p>
    </div>
  );
}
