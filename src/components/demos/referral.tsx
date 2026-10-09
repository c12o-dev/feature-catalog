"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Gift } from "lucide-react";

const URL_TEXT = "https://app.example.jp/r/haru-x9k4";

const STATS = [
  { label: "招待済み", value: "3" },
  { label: "登録完了", value: "2" },
  { label: "獲得ポイント", value: "2,000" },
];

const FRIENDS = [
  { name: "山本 葵", state: "登録完了", reward: "+1,000 P" },
  { name: "小林 蓮", state: "登録完了", reward: "+1,000 P" },
  { name: "中村 結衣", state: "招待中", reward: "—" },
];

export default function Referral() {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const copy = async () => {
    let next: "copied" | "error" = "copied";
    try {
      await navigator.clipboard.writeText(URL_TEXT);
    } catch {
      next = "error";
    }
    setState(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 2000);
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-3">
      <div className="flex gap-3 rounded-lg border bg-card p-4">
        <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
          <Gift className="size-5" aria-hidden />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold">友達を招待して 1,000 ポイント</div>
          <p className="text-xs text-muted-foreground">友達が登録すると、あなたと友達の両方に 1,000 ポイントを付与します</p>
        </div>
      </div>

      <div className="space-y-1.5">
        <div id="referral-link-label" className="text-xs font-medium">
          あなたの招待リンク
        </div>
        <div className="flex items-center gap-2 rounded-md border bg-background p-1.5 pl-3">
          <code aria-labelledby="referral-link-label" className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
            {URL_TEXT}
          </code>
          <button
            type="button"
            onClick={copy}
            className="inline-flex h-7 shrink-0 items-center gap-1 rounded-md border bg-background px-2.5 text-xs font-medium hover:bg-muted"
          >
            {state === "copied" ? (
              <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden />
            ) : (
              <Copy className="size-3.5" aria-hidden />
            )}
            {state === "copied" ? "コピー済み" : "リンクをコピー"}
          </button>
        </div>
        <p aria-live="polite" className="min-h-4 text-xs text-muted-foreground">
          {state === "copied" && "クリップボードにコピーしました"}
          {state === "error" && "コピーできませんでした。リンクを選択してコピーしてください"}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-md border p-2">
            <div className="text-base font-semibold tabular-nums">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <ul className="divide-y rounded-md border text-sm">
        {FRIENDS.map((f) => (
          <li key={f.name} className="flex items-center gap-2 px-3 py-2">
            <span className="min-w-0 flex-1 truncate">{f.name}</span>
            <span className="text-xs text-muted-foreground">{f.state}</span>
            <span className="w-16 text-right text-xs font-medium tabular-nums">{f.reward}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
