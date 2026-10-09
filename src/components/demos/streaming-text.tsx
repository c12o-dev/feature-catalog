"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { ArrowUp, RefreshCw, Sparkles, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

const QUESTION = "Tailwind v4 の主な変更点を教えて";
const FULL =
  "Tailwind v4 は CSS ファーストの設定に移行しました。tailwind.config.js の代わりに、CSS の @theme で色やフォントなどのデザイントークンを直接定義します。ビルドエンジンも刷新され、フルビルドは従来より大幅に速くなりました。また、コンテンツの自動検出により content の設定が不要になっています。";
// Split into small "tokens" (2–4 chars) like an LLM stream would.
const TOKENS = FULL.match(/.{1,3}/gu) ?? [FULL];

export default function StreamingText() {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<"idle" | "streaming" | "done" | "stopped">("idle");
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  };
  useEffect(() => stop, []);

  const start = () => {
    stop();
    if (reduce) {
      setCount(TOKENS.length);
      setPhase("done");
      return;
    }
    setCount(0);
    setPhase("streaming");
    let i = 0;
    timer.current = setInterval(() => {
      i++;
      setCount(i);
      if (i >= TOKENS.length) {
        stop();
        setPhase("done");
      }
    }, 45);
  };

  const streaming = phase === "streaming";
  const text = TOKENS.slice(0, count).join("");

  return (
    <div className="mx-auto w-full max-w-lg space-y-3">
      <div className="ml-auto w-fit max-w-[85%] rounded-lg rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-foreground">{QUESTION}</div>

      <div className="rounded-lg border bg-card p-4 text-card-foreground">
        <div className="mb-2 flex items-center gap-2 text-xs">
          <Sparkles aria-hidden className="size-3.5 text-primary" />
          <span className="font-medium">アシスタント</span>
          <span aria-live="polite" className="text-muted-foreground">
            {streaming ? "生成中…" : phase === "done" ? "完了" : phase === "stopped" ? "停止しました" : ""}
          </span>
        </div>
        <p aria-live="polite" aria-busy={streaming} className="min-h-[7.5rem] text-sm leading-relaxed">
          {phase === "idle" ? <span className="text-muted-foreground">下のボタンで質問を送信すると、回答が少しずつ流れてきます。</span> : text}
          {streaming && <span aria-hidden className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 animate-pulse rounded-sm bg-foreground/70" />}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {streaming ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              stop();
              setPhase("stopped");
            }}
          >
            <Square aria-hidden className="size-3" />
            生成を停止
          </Button>
        ) : (
          <Button size="sm" variant={phase === "idle" ? "default" : "outline"} onClick={start}>
            {phase === "idle" ? <ArrowUp aria-hidden className="size-3.5" /> : <RefreshCw aria-hidden className="size-3.5" />}
            {phase === "idle" ? "質問を送信" : "再生成"}
          </Button>
        )}
      </div>
    </div>
  );
}
