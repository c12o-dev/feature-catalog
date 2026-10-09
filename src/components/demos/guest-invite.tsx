"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Clock, Copy, Link2 } from "lucide-react";

const BASE = new Date("2026-10-01T09:00:00+09:00").getTime();
const HOUR = 3_600_000;
const opts = [
  { v: "1h", l: "1 時間", ms: HOUR },
  { v: "1d", l: "1 日", ms: 24 * HOUR },
  { v: "7d", l: "7 日", ms: 7 * 24 * HOUR },
  { v: "0", l: "無期限", ms: 0 },
] as const;
const TOKENS: Record<string, string> = { "1h": "h7Kq2", "1d": "d9Lm4", "7d": "Xq9k4", "0": "p3Zr8" };

function fmt(ms: number) {
  const d = new Date(ms + 9 * HOUR);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCMonth() + 1}/${d.getUTCDate()} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}`;
}

export default function GuestInvite() {
  const [exp, setExp] = useState<(typeof opts)[number]["v"]>("7d");
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const opt = opts.find((o) => o.v === exp)!;
  const url = `example.com/g/${TOKENS[exp]}P2nM`;

  const flash = (s: "copied" | "failed") => {
    setStatus(s);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 1600);
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`https://${url}`);
      flash("copied");
    } catch {
      flash("failed");
    }
  };

  return (
    <div className="w-full max-w-md space-y-4 rounded-lg border bg-card p-4 text-card-foreground">
      <div className="flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-md bg-muted"><Link2 className="size-4" /></span>
        <div className="min-w-0">
          <div className="text-sm font-medium">ゲスト招待リンク</div>
          <div className="text-xs text-muted-foreground">「2026 年度 企画書」を閲覧のみで共有</div>
        </div>
      </div>
      <div>
        <div id="gi-exp" className="mb-2 text-xs text-muted-foreground">有効期限</div>
        <div role="radiogroup" aria-labelledby="gi-exp" className="grid grid-cols-4 gap-1 rounded-md bg-muted p-1">
          {opts.map((o) => (
            <button
              key={o.v}
              role="radio"
              aria-checked={exp === o.v}
              onClick={() => setExp(o.v)}
              className={`rounded px-1 py-1 text-xs transition-colors ${exp === o.v ? "bg-background font-medium shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              {o.l}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-md border bg-background p-1.5 pl-3">
        <code className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{url}</code>
        <Button size="sm" variant="outline" onClick={copy} aria-label="招待リンクをコピー">
          {status === "copied" ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          <span className="hidden sm:inline">{status === "copied" ? "コピー済み" : "コピー"}</span>
        </Button>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Clock className="size-3.5 shrink-0" />
        {opt.ms === 0 ? (
          <span>期限なし。手動で無効化するまで有効です</span>
        ) : (
          <span className="tabular-nums">{fmt(BASE + opt.ms)} に自動で無効化されます</span>
        )}
      </div>
      <p aria-live="polite" className="sr-only">
        {status === "copied" ? "リンクをコピーしました" : status === "failed" ? "コピーできませんでした" : ""}
      </p>
      {status === "failed" && <p className="text-xs text-destructive">コピーできませんでした。リンクを選択してコピーしてください。</p>}
    </div>
  );
}
