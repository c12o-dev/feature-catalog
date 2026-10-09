"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

const ARTICLES = [
  { id: 1, title: "雨の日でも走れるランニングコースの選び方", meta: "6 分で読める · 健康", saves: 48 },
  { id: 2, title: "冷凍ストックで平日の夕飯を 15 分にする", meta: "8 分で読める · 料理", saves: 132 },
  { id: 3, title: "初めての確定申告、前日までにやること", meta: "5 分で読める · お金", saves: 87 },
];

export default function BookmarkButton() {
  const reduce = useReducedMotion();
  const [saved, setSaved] = useState<number[]>([2]);
  const [msg, setMsg] = useState("");

  const toggle = (id: number, title: string) => {
    const on = !saved.includes(id);
    setSaved((s) => (on ? [...s, id] : s.filter((x) => x !== id)));
    setMsg(on ? `「${title}」を後で読むに保存しました` : `「${title}」を保存から外しました`);
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">おすすめ</span>
        <span className="inline-flex items-center gap-1 text-muted-foreground tabular-nums">
          <Bookmark className="size-3" aria-hidden />
          後で読む {saved.length}
        </span>
      </div>
      <ul className="divide-y rounded-lg border bg-card">
        {ARTICLES.map((a) => {
          const on = saved.includes(a.id);
          const count = a.saves - (a.id === 2 ? 1 : 0) + (on ? 1 : 0);
          return (
            <li key={a.id} className="flex items-start gap-3 p-3">
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium leading-snug">{a.title}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{a.meta}</div>
              </div>
              <button
                type="button"
                onClick={() => toggle(a.id, a.title)}
                aria-pressed={on}
                aria-label={`「${a.title}」を後で読む`}
                className="flex shrink-0 flex-col items-center gap-0.5 rounded-md px-1.5 py-1 hover:bg-muted"
              >
                <motion.span
                  key={on ? "on" : "off"}
                  initial={reduce || !on ? false : { scale: 0.6 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="grid"
                >
                  <Bookmark
                    className={cn("size-5 transition-colors", on ? "fill-amber-400 text-amber-500 dark:fill-amber-300 dark:text-amber-300" : "text-muted-foreground")}
                    aria-hidden
                  />
                </motion.span>
                <span className="text-[10px] text-muted-foreground tabular-nums" aria-hidden>
                  {count}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="sr-only" aria-live="polite">
        {msg}
      </p>
    </div>
  );
}
