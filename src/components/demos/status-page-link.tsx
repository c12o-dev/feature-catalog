"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const STATES = {
  ok: {
    label: "すべてのシステムは正常です",
    detail: "最終確認 10月1日 09:00",
    icon: CheckCircle2,
    tone: "text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  incident: {
    label: "一部の機能で障害が発生中",
    detail: "通知の配信が遅延しています（08:42〜）",
    icon: AlertTriangle,
    tone: "text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500",
  },
} as const;

export default function StatusPageLink() {
  const [state, setState] = useState<keyof typeof STATES>("ok");
  const [opened, setOpened] = useState(false);
  const s = STATES[state];
  const Icon = s.icon;

  return (
    <div className="mx-auto w-full max-w-md space-y-3">
      <div className="rounded-lg border bg-card p-4">
        <p className="text-sm font-medium">ヘルプとサポート</p>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          <li>よくある質問</li>
          <li>お問い合わせ</li>
        </ul>
        <a
          href="#status"
          onClick={(e) => {
            e.preventDefault();
            setOpened(true);
          }}
          className="mt-3 flex items-start gap-2 rounded-md border bg-background px-3 py-2 text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Icon className={cn("mt-0.5 size-4 shrink-0", s.tone)} aria-hidden />
          <span className="min-w-0 flex-1" aria-live="polite">
            <span className="block">障害情報: {s.label}</span>
            <span className="block text-xs text-muted-foreground">{s.detail}</span>
          </span>
          <ExternalLink className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden />
          <span className="sr-only">（ステータスページを開く）</span>
        </a>
        {opened && <p className="mt-2 text-xs text-muted-foreground">（デモ）ステータスページを新しいタブで開きます</p>}
      </div>
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <span>状態を切り替え:</span>
        {(Object.keys(STATES) as (keyof typeof STATES)[]).map((k) => (
          <button
            key={k}
            type="button"
            aria-pressed={state === k}
            onClick={() => setState(k)}
            className={cn(
              "inline-flex items-center gap-1 rounded-md border px-2 py-0.5",
              state === k ? "bg-muted text-foreground" : "bg-background hover:bg-muted",
            )}
          >
            <span className={cn("size-1.5 rounded-full", STATES[k].dot)} aria-hidden />
            {k === "ok" ? "正常" : "障害"}
          </button>
        ))}
      </div>
    </div>
  );
}
