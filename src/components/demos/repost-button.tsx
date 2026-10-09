"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Heart, Link2, MessageCircle, Repeat2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RepostButton() {
  const reduce = useReducedMotion();
  const [reposted, setReposted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [msg, setMsg] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const base = 48;
  const count = base + (reposted ? 1 : 0);

  useEffect(() => () => clearTimeout(timer.current), []);

  const toggle = () => {
    const next = !reposted;
    setReposted(next);
    setMsg(next ? "リポストしました" : "リポストを取り消しました");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText("https://tsubuyaki.example/hiyori/post/20261001");
      setCopied(true);
      setMsg("リンクをコピーしました");
    } catch {
      setMsg("コピーできませんでした");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  };

  return (
    <article className="mx-auto w-full max-w-md rounded-lg border bg-card p-4 text-card-foreground">
      <header className="flex items-center gap-2">
        <div aria-hidden className="grid size-9 place-items-center rounded-full bg-muted text-sm font-semibold">
          ハ
        </div>
        <div className="min-w-0 text-sm leading-tight">
          <div className="font-medium">春野ひより</div>
          <div className="text-xs text-muted-foreground">@hiyori · 10月1日</div>
        </div>
      </header>
      <p className="mt-3 text-sm">
        社内ツールのダッシュボードを全面リニューアルしました。読み込みが 2.3 秒 → 0.8 秒に。地味だけど一番うれしい改善です。
      </p>

      <div className="mt-3 flex items-center justify-between gap-1 border-t pt-2 text-xs text-muted-foreground">
        <button type="button" aria-label="返信 12 件" className="flex items-center gap-1.5 rounded-full px-2 py-1.5 hover:bg-muted">
          <MessageCircle aria-hidden className="size-4" />
          <span className="tabular-nums">12</span>
        </button>

        <button
          type="button"
          aria-pressed={reposted}
          aria-label={`リポスト ${count} 件`}
          onClick={toggle}
          className={cn(
            "relative flex items-center gap-1.5 rounded-full px-2 py-1.5 transition-colors hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-400",
            reposted && "text-emerald-700 dark:text-emerald-400",
          )}
        >
          <motion.span
            aria-hidden
            className="grid"
            animate={reduce ? undefined : { rotate: reposted ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
          >
            <Repeat2 className="size-4" strokeWidth={reposted ? 2.5 : 2} />
          </motion.span>
          <span className="relative inline-block h-4 overflow-hidden tabular-nums">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={count}
                className="block"
                initial={reduce ? false : { y: reposted ? 12 : -12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={reduce ? { opacity: 0 } : { y: reposted ? -12 : 12, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {count}
              </motion.span>
            </AnimatePresence>
          </span>
        </button>

        <button type="button" aria-label="いいね 230 件" className="flex items-center gap-1.5 rounded-full px-2 py-1.5 hover:bg-muted">
          <Heart aria-hidden className="size-4" />
          <span className="tabular-nums">230</span>
        </button>

        <button
          type="button"
          aria-label="リンクをコピー"
          onClick={copy}
          className="grid size-7 place-items-center rounded-full hover:bg-muted"
        >
          {copied ? <Check aria-hidden className="size-4 text-emerald-700 dark:text-emerald-400" /> : <Link2 aria-hidden className="size-4" />}
        </button>
      </div>

      <p aria-live="polite" className="sr-only">
        {msg}
      </p>
    </article>
  );
}
