"use client";

import { useRef, useState } from "react";
import { Heart } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

export default function LikeButton() {
  const reduce = useReducedMotion();
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(247);
  const [bursts, setBursts] = useState<number[]>([]);
  const nextId = useRef(0);

  const onClick = () => {
    const next = !liked;
    setLiked(next);
    setCount((c) => c + (next ? 1 : -1));
    if (next && !reduce) {
      nextId.current += 1;
      const id = nextId.current;
      setBursts((b) => [...b, id]);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <article className="w-full max-w-xs rounded-lg border bg-card p-4 text-card-foreground">
        <div className="flex items-center gap-2">
          <div className="grid size-8 place-items-center rounded-full bg-muted text-xs font-medium">佐</div>
          <div className="min-w-0">
            <div className="text-sm font-medium">佐藤 みのり</div>
            <div className="text-xs text-muted-foreground">2 時間前</div>
          </div>
        </div>
        <p className="mt-3 text-sm">週末に作った陶器のマグ、やっと焼き上がりました。釉薬のムラも味ということで。</p>
        <div className="mt-3 border-t pt-2">
          <button
            type="button"
            onClick={onClick}
            aria-pressed={liked}
            aria-label={`いいね（${count.toLocaleString()} 件）`}
            className="relative -ml-2 inline-flex items-center gap-2 rounded-full px-3 py-1.5 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="relative grid place-items-center">
              <motion.span
                key={liked ? "on" : "off"}
                initial={reduce ? false : { scale: liked ? 0.6 : 1 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
                className="grid place-items-center"
              >
                <Heart
                  aria-hidden
                  className={`size-5 transition-colors ${liked ? "fill-rose-500 text-rose-500 dark:fill-rose-400 dark:text-rose-400" : "text-muted-foreground"}`}
                />
              </motion.span>
              <AnimatePresence>
                {bursts.map((id) => (
                  <motion.span
                    key={id}
                    aria-hidden
                    initial={{ scale: 0, opacity: 0.8 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    onAnimationComplete={() => setBursts((b) => b.filter((x) => x !== id))}
                    className="absolute inset-0 rounded-full bg-rose-500/30 dark:bg-rose-400/30"
                  />
                ))}
              </AnimatePresence>
            </span>
            <span aria-hidden className="text-sm font-medium tabular-nums">{count.toLocaleString()}</span>
          </button>
        </div>
      </article>
    </div>
  );
}
