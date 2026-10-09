"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function LikeButton() {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(247);
  const [bursts, setBursts] = useState<number[]>([]);

  const onClick = () => {
    setLiked((p) => {
      setCount((c) => c + (p ? -1 : 1));
      if (!p) setBursts((b) => [...b, Date.now()]);
      return !p;
    });
  };

  return (
    <div className="flex items-center justify-center">
      <button
        onClick={onClick}
        className="relative flex items-center gap-2 rounded-full px-4 py-2 hover:bg-accent transition-colors"
      >
        <span className="relative">
          <Heart
            className={`size-6 transition-colors ${liked ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
          />
          <AnimatePresence>
            {bursts.map((id) => (
              <motion.span
                key={id}
                initial={{ scale: 0, opacity: 0.8 }}
                animate={{ scale: 2.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                onAnimationComplete={() => setBursts((b) => b.filter((x) => x !== id))}
                className="absolute inset-0 rounded-full bg-red-500/30"
              />
            ))}
          </AnimatePresence>
        </span>
        <span className="text-sm font-medium tabular-nums">{count.toLocaleString()}</span>
      </button>
    </div>
  );
}
