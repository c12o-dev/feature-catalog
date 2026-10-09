"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Heart } from "lucide-react";

const PARTICLES = 10;
const COLORS = ["text-rose-500", "text-pink-400", "text-amber-400", "text-rose-400", "text-fuchsia-400"];

type Burst = { id: number; seed: number };

/** Deterministic pseudo-random in [0,1) from an integer seed. */
function rand(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export default function LikeBurst() {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(128);
  const [mine, setMine] = useState(0);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const nextId = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach(clearTimeout);
  }, []);

  const tap = () => {
    setCount((c) => c + 1);
    setMine((m) => m + 1);
    if (reduce) return;
    const id = nextId.current++;
    setBursts((b) => [...b, { id, seed: id + 1 }]);
    timers.current.push(setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 900));
  };

  const liked = mine > 0;

  return (
    <div className="flex min-h-56 flex-col items-center justify-center gap-4">
      <div className="w-full max-w-xs rounded-lg border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="grid size-8 place-items-center rounded-full bg-muted text-xs font-medium">みな</div>
          <div className="min-w-0">
            <p className="text-sm font-medium">湊 さくら</p>
            <p className="text-xs text-muted-foreground">2 時間前</p>
          </div>
        </div>
        <p className="mt-3 text-sm">週末の朝焼け、早起きしてよかった。</p>
        <div className="mt-3 h-24 rounded-md bg-gradient-to-br from-orange-200 via-rose-200 to-indigo-300 dark:from-orange-900/60 dark:via-rose-900/60 dark:to-indigo-900/70" aria-hidden />
        <div className="mt-3 flex items-center gap-3">
          <div className="relative">
            <motion.button
              type="button"
              onClick={tap}
              aria-label="いいね"
              aria-pressed={liked}
              whileTap={reduce ? undefined : { scale: 0.85 }}
              className="relative z-10 grid size-10 place-items-center rounded-full outline-none transition-colors hover:bg-rose-500/10 focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <motion.span
                key={reduce ? "static" : mine}
                initial={reduce || mine === 0 ? false : { scale: 0.6 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 14 }}
                className="grid place-items-center"
              >
                <Heart className={liked ? "size-6 fill-rose-500 text-rose-500" : "size-6 text-muted-foreground"} />
              </motion.span>
            </motion.button>
            <AnimatePresence>
              {bursts.map((b) =>
                Array.from({ length: PARTICLES }, (_, i) => {
                  const angle = (i / PARTICLES) * Math.PI * 2 + rand(b.seed * 31 + i) * 0.5;
                  const dist = 26 + rand(b.seed * 17 + i) * 18;
                  const size = 8 + Math.round(rand(b.seed * 7 + i) * 6);
                  return (
                    <motion.span
                      key={`${b.id}-${i}`}
                      aria-hidden
                      className={`pointer-events-none absolute left-1/2 top-1/2 ${COLORS[i % COLORS.length]}`}
                      style={{ marginLeft: -size / 2, marginTop: -size / 2 }}
                      initial={{ x: 0, y: 0, scale: 0.4, opacity: 1 }}
                      animate={{ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, scale: 1, opacity: 0 }}
                      transition={{ duration: 0.7, ease: [0.2, 0.8, 0.3, 1] }}
                    >
                      <Heart style={{ width: size, height: size }} className="fill-current" />
                    </motion.span>
                  );
                }),
              )}
            </AnimatePresence>
          </div>
          <span className="text-sm tabular-nums" aria-live="polite">
            {count.toLocaleString("ja-JP")}
            <span className="sr-only"> 件のいいね</span>
          </span>
          {mine > 1 && <span className="ml-auto rounded-full bg-rose-500/10 px-2 py-0.5 text-xs font-medium tabular-nums text-rose-600 dark:text-rose-400">+{mine}</span>}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">連打するとそのたびにハートがはじけます</p>
    </div>
  );
}
