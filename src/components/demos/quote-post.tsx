"use client";

import { useState } from "react";
import { Quote, Repeat2, X } from "lucide-react";

const MAX = 140;
const original = {
  name: "小林 ゆい",
  handle: "@yui_design",
  time: "1 時間前",
  body: "フォームのエラーは「何が間違っているか」より「どう直せばいいか」を書くと、問い合わせが目に見えて減った。",
};

function Original({ compact }: { compact?: boolean }) {
  return (
    <div className={`space-y-1 rounded-lg border bg-muted/40 ${compact ? "p-2.5" : "p-3"}`}>
      <div className="flex items-center gap-1.5 text-xs">
        <span className="grid size-5 place-items-center rounded-full bg-primary/15 text-[10px] font-medium">小</span>
        <span className="font-medium">{original.name}</span>
        <span className="text-muted-foreground">{original.handle} · {original.time}</span>
      </div>
      <p className={`text-sm leading-relaxed ${compact ? "line-clamp-2" : ""}`}>{original.body}</p>
    </div>
  );
}

export default function QuotePost() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [posted, setPosted] = useState<string | null>(null);
  const left = MAX - text.length;

  const submit = () => {
    if (!text.trim() || left < 0) return;
    setPosted(text.trim());
    setText("");
    setOpen(false);
  };

  return (
    <div className="w-full max-w-md space-y-3">
      {posted ? (
        <article className="space-y-2 rounded-lg border bg-card p-3 text-card-foreground">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="grid size-6 place-items-center rounded-full bg-muted text-[10px] font-medium">あ</span>
            <span className="font-medium">あなた</span>
            <span className="text-muted-foreground">@you · たった今</span>
          </div>
          <p className="whitespace-pre-wrap text-sm">{posted}</p>
          <Original compact />
          <button onClick={() => setPosted(null)} className="text-xs text-muted-foreground underline underline-offset-2">もう一度試す</button>
        </article>
      ) : (
        <article className="space-y-2 rounded-lg border bg-card p-3 text-card-foreground">
          <Original />
          <div className="flex gap-2 pt-1">
            <button onClick={() => setOpen(true)} aria-expanded={open} className="flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs hover:bg-muted">
              <Quote className="size-3.5" />引用して投稿
            </button>
            <span className="flex items-center gap-1 text-xs text-muted-foreground"><Repeat2 className="size-3.5" /><span className="tabular-nums">128</span></span>
          </div>
        </article>
      )}
      {open && (
        <div className="space-y-2 rounded-lg border bg-card p-3 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">引用して投稿</span>
            <button aria-label="閉じる" onClick={() => setOpen(false)} className="grid size-6 place-items-center rounded hover:bg-muted"><X className="size-3.5" /></button>
          </div>
          <label htmlFor="qp-text" className="sr-only">コメント</label>
          <textarea
            id="qp-text"
            autoFocus
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && !e.nativeEvent.isComposing) { e.preventDefault(); submit(); }
            }}
            placeholder="コメントを追加…"
            className="w-full resize-none rounded-md border bg-background px-2.5 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <Original compact />
          <div className="flex items-center justify-end gap-3">
            <span className={`text-xs tabular-nums ${left < 0 ? "text-destructive" : left < 20 ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"}`} aria-live="polite">
              残り {left}
            </span>
            <button onClick={submit} disabled={!text.trim() || left < 0} className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-50">
              投稿
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
