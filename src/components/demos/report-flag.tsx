"use client";

import { useId, useState } from "react";
import { Check, Flag, MoreHorizontal, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const REASONS = [
  { v: "spam", l: "スパム・宣伝", d: "無関係なリンクや繰り返しの投稿" },
  { v: "harassment", l: "嫌がらせ・誹謗中傷", d: "特定の人への攻撃や脅し" },
  { v: "misinfo", l: "誤情報", d: "健康・選挙などに関する誤った情報" },
  { v: "violence", l: "暴力的な内容", d: "暴力の扇動や残虐な表現" },
  { v: "other", l: "その他", d: "上記に当てはまらない" },
];

export default function ReportFlag() {
  const name = useId();
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);

  const reset = () => {
    setOpen(false);
    setSel(null);
    setNote("");
    setDone(false);
  };

  return (
    <div className="mx-auto max-w-md space-y-3">
      <article className="rounded-lg border bg-card p-3">
        <div className="flex items-start gap-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-muted text-xs font-medium" aria-hidden>
            ゆ
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-sm font-medium">yuki_0731</span>
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-label="投稿のメニュー"
                className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <MoreHorizontal className="size-4" />
              </button>
            </div>
            <p className={cn("mt-0.5 text-sm", done && "text-muted-foreground")}>
              {done ? "この投稿は通報済みのため非表示にしています。" : "今だけ！このリンクから登録すると 10 万円もらえます → bit.example/xxxx"}
            </p>
          </div>
        </div>
      </article>

      {open && !done && (
        <form
          className="space-y-3 rounded-lg border bg-card p-4 shadow-sm motion-safe:animate-in motion-safe:fade-in"
          onSubmit={(e) => {
            e.preventDefault();
            if (sel) setDone(true);
          }}
        >
          <fieldset className="space-y-1">
            <legend className="mb-2 flex items-center gap-1.5 text-sm font-medium">
              <Flag className="size-4 text-rose-600 dark:text-rose-400" aria-hidden />
              この投稿を通報する理由
            </legend>
            {REASONS.map((r) => (
              <label
                key={r.v}
                className={cn(
                  "flex cursor-pointer items-start gap-2.5 rounded-md border px-3 py-2 text-sm transition-colors",
                  sel === r.v ? "border-rose-400 bg-rose-50 dark:border-rose-500/50 dark:bg-rose-500/10" : "border-transparent hover:bg-muted",
                )}
              >
                <input
                  type="radio"
                  name={name}
                  value={r.v}
                  checked={sel === r.v}
                  onChange={() => setSel(r.v)}
                  className="mt-0.5 accent-rose-600"
                />
                <span>
                  <span className="block">{r.l}</span>
                  <span className="block text-xs text-muted-foreground">{r.d}</span>
                </span>
              </label>
            ))}
          </fieldset>
          {sel && (
            <label className="block space-y-1">
              <span className="text-xs text-muted-foreground">補足（任意）</span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                maxLength={200}
                placeholder="具体的な状況があれば入力してください"
                className="block w-full resize-none rounded-md border bg-background px-2.5 py-1.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </label>
          )}
          <div className="flex justify-end gap-2">
            <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>
              キャンセル
            </Button>
            <Button type="submit" size="sm" variant="destructive" disabled={!sel}>
              通報する
            </Button>
          </div>
        </form>
      )}

      <div role="status" aria-live="polite">
        {done && (
          <div className="flex items-start justify-between gap-2 rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-900 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200">
            <span className="flex items-start gap-2">
              <Check className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>
                通報を受け付けました。内容を確認のうえ、ガイドライン違反があれば対応します。
                <span className="mt-0.5 block text-xs opacity-80">受付番号 R-20261001-0042</span>
              </span>
            </span>
            <button type="button" onClick={reset} aria-label="デモをリセット" className="rounded p-1 hover:bg-emerald-100 dark:hover:bg-emerald-500/20">
              <RotateCcw className="size-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
