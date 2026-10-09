"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const ARTICLE =
  "新しい社内ツールを設計するとき、私たちはまず「何を作らないか」を決めることから始めました。最初のリリースでは、問い合わせの一覧と担当者の割り当てだけに機能を絞り、通知やレポートは後回しにしています。2 週間で動くものを現場に渡し、毎朝 15 分のヒアリングで使われ方を観察しました。その結果、画面のラベルを開発者の用語から現場の言葉に置き換えるだけで、操作ミスが 4 割減ることが分かりました。複雑な機能は、利用データが十分に集まってから段階的に追加していく方針です。";
const POINTS = ["最初のリリースは一覧と担当割り当てだけに絞った", "2 週間で現場に渡し、毎朝のヒアリングで観察", "ラベルを現場の言葉に変えたら操作ミスが 4 割減", "複雑な機能はデータを見て段階的に追加する"];

export default function SummarizeButton() {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const run = () => {
    setState("loading");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("done"), 1200);
  };

  return (
    <div className="mx-auto w-full max-w-lg space-y-3">
      <article className="rounded-lg border bg-card p-4 text-card-foreground">
        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3">
          <h3 className="text-sm font-semibold">小さく出して、現場の言葉で育てる</h3>
          <span className="text-xs text-muted-foreground tabular-nums">約 {ARTICLE.length} 文字 · 3 分</span>
        </div>
        <p className="line-clamp-4 text-sm leading-relaxed text-muted-foreground">{ARTICLE}</p>
      </article>

      <div className="flex items-center gap-2">
        <Button onClick={run} disabled={state === "loading"} size="sm" variant={state === "done" ? "outline" : "default"}>
          {state === "loading" ? (
            <>
              <Loader2 aria-hidden className="size-3.5 animate-spin" />
              要約中…
            </>
          ) : state === "done" ? (
            <>
              <RotateCcw aria-hidden className="size-3.5" />
              もう一度要約
            </>
          ) : (
            <>
              <Sparkles aria-hidden className="size-3.5" />
              要約する
            </>
          )}
        </Button>
        {state === "done" && <span className="text-xs text-muted-foreground">AI による要約は誤りを含む場合があります</span>}
      </div>

      <div aria-live="polite" aria-busy={state === "loading"}>
        {state === "loading" && (
          <div className="space-y-2 rounded-lg border bg-muted/40 p-4" aria-label="要約を生成中">
            {[92, 80, 86, 64].map((w) => (
              <div key={w} className="h-3 animate-pulse rounded bg-muted" style={{ width: `${w}%` }} />
            ))}
          </div>
        )}
        {state === "done" && (
          <section className="rounded-lg border bg-muted/40 p-4 motion-safe:animate-in motion-safe:fade-in">
            <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold">
              <Sparkles aria-hidden className="size-3.5 text-primary" />
              TL;DR
            </h4>
            <ul className="space-y-1.5 text-sm">
              {POINTS.map((p) => (
                <li key={p} className="flex gap-2">
                  <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-foreground/60" />
                  {p}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
