"use client";

import { useId, useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { cn } from "@/lib/utils";

type Comment = { author: string; initial: string; time: string; body: string };

const INITIAL: Comment[] = [
  { author: "田中 彩", initial: "田", time: "2 分前", body: "「すぐに」は曖昧かも。具体的な時間を書けますか？" },
  { author: "佐藤 健太", initial: "佐", time: "1 分前", body: "同意です。SLA に合わせて「1 営業日以内」にしましょう。" },
];

export default function InlineComment() {
  const id = useId();
  const [open, setOpen] = useState(true);
  const [comments, setComments] = useState(INITIAL);
  const [draft, setDraft] = useState("");

  const submit = () => {
    const body = draft.trim();
    if (!body) return;
    setComments([...comments, { author: "あなた", initial: "あ", time: "たった今", body }]);
    setDraft("");
  };

  return (
    <div className="mx-auto grid w-full max-w-2xl gap-3 sm:grid-cols-[1fr_15rem]">
      <article className="space-y-3 rounded-lg border bg-card p-4 text-sm leading-relaxed text-card-foreground">
        <h3 className="font-semibold">サポート対応ポリシー</h3>
        <p className="text-muted-foreground">お問い合わせはフォームまたはメールで受け付けます。受付後、担当者が内容を確認します。</p>
        <p className="text-muted-foreground">
          回答は
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls={`${id}-thread`}
            className={cn(
              "mx-0.5 rounded-sm px-0.5 text-foreground underline decoration-amber-500/70 decoration-2 underline-offset-4 transition-colors",
              open ? "bg-amber-200/80 dark:bg-amber-500/30" : "bg-amber-100/70 hover:bg-amber-200/80 dark:bg-amber-500/15 dark:hover:bg-amber-500/30",
            )}
          >
            受付後すぐに
          </button>
          お送りします。
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls={`${id}-thread`}
            aria-label={`コメント ${comments.length} 件を${open ? "閉じる" : "開く"}`}
            className="ml-1 inline-flex translate-y-0.5 items-center gap-0.5 rounded-full border bg-background px-1.5 py-0.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <MessageCircle aria-hidden className="size-3" />
            <span className="tabular-nums">{comments.length}</span>
          </button>
        </p>
        <p className="text-muted-foreground">緊急の障害については、ステータスページで最新情報をお知らせします。</p>
      </article>

      {open && (
        <aside id={`${id}-thread`} aria-label="「受付後すぐに」へのコメント" className="relative rounded-lg border bg-popover p-3 text-popover-foreground shadow-sm sm:self-center">
          <p className="mb-2 truncate border-l-2 border-amber-500/70 pl-2 text-xs text-muted-foreground">受付後すぐに</p>
          <ol aria-live="polite" className="space-y-3">
            {comments.map((c, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden className="grid size-6 shrink-0 place-items-center rounded-full bg-muted text-[11px] font-medium">
                  {c.initial}
                </span>
                <div className="min-w-0">
                  <p className="text-xs">
                    <span className="font-medium">{c.author}</span> <span className="text-muted-foreground">{c.time}</span>
                  </p>
                  <p className="text-sm break-words">{c.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <form
            className="mt-3 flex items-center gap-1.5 border-t pt-3"
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <input
              aria-label="返信を入力"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.nativeEvent.isComposing) e.preventDefault();
              }}
              placeholder="返信…"
              className="h-8 min-w-0 flex-1 rounded-md border bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
            />
            <button type="submit" aria-label="返信を送信" disabled={!draft.trim()} className="grid size-8 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground disabled:opacity-40">
              <Send aria-hidden className="size-3.5" />
            </button>
          </form>
        </aside>
      )}
    </div>
  );
}
