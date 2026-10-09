"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

type Msg = { id: number; who: "agent" | "me"; text: string; time: string };

const initial: Msg[] = [
  { id: 0, who: "agent", text: "こんにちは、サポートの小林です。どのようなご用件でしょうか？", time: "10:32" },
];
const quick = ["注文の配送状況", "返品したい", "プランを変更したい"];

function replyFor(text: string) {
  if (/配送|届/.test(text)) return "ご注文番号 #20481 は本日発送済みです。明日 午前中にお届け予定です。";
  if (/返品|交換/.test(text)) return "お受け取りから 14 日以内であれば返品できます。返品フォームのリンクをお送りしますね。";
  if (/プラン|料金/.test(text)) return "設定 › プランからいつでも変更できます。差額は日割りで次回請求に反映されます。";
  return "ありがとうございます。担当者に確認しますので、少々お待ちください。";
}

const clock = (n: number) => {
  const t = 10 * 60 + 32 + n;
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
};

export default function LiveChat() {
  const [msgs, setMsgs] = useState<Msg[]>(initial);
  const [v, setV] = useState("");
  const [typing, setTyping] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, typing]);

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    const n = nextId.current;
    nextId.current += 2;
    setMsgs((m) => [...m, { id: n, who: "me", text, time: clock(n) }]);
    setV("");
    timers.current.push(setTimeout(() => setTyping(true), 400));
    timers.current.push(
      setTimeout(() => {
        setTyping(false);
        setMsgs((m) => [...m, { id: n + 1, who: "agent", text: replyFor(text), time: clock(n + 1) }]);
      }, 1600),
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col overflow-hidden rounded-lg border bg-card shadow-sm">
      <div className="flex items-center gap-2 border-b px-3 py-2">
        <div className="relative">
          <div className="grid size-8 place-items-center rounded-full bg-emerald-100 text-xs font-medium text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200">小</div>
          <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-card bg-emerald-500" aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium">小林（サポート）</p>
          <p className="text-xs text-muted-foreground">オンライン · 平均 1 分で返信</p>
        </div>
      </div>
      <div ref={listRef} role="log" aria-live="polite" aria-label="チャット履歴" className="h-56 space-y-3 overflow-y-auto p-3">
        {msgs.map((m) => (
          <div key={m.id} className={cn("flex flex-col gap-0.5", m.who === "me" ? "items-end" : "items-start")}>
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                m.who === "me" ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm bg-muted",
              )}
            >
              {m.text}
            </div>
            <span className="px-1 text-[10px] text-muted-foreground tabular-nums">{m.time}</span>
          </div>
        ))}
        {typing && (
          <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-muted px-3 py-2.5 w-fit" aria-label="入力中">
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-1.5 rounded-full bg-muted-foreground/60 motion-safe:animate-bounce" style={{ animationDelay: `${i * 120}ms` }} />
            ))}
          </div>
        )}
      </div>
      {msgs.length === 1 && (
        <div className="flex flex-wrap gap-1.5 px-3 pb-2">
          {quick.map((q) => (
            <button key={q} type="button" onClick={() => send(q)} className="rounded-full border px-2.5 py-1 text-xs transition-colors hover:bg-accent">
              {q}
            </button>
          ))}
        </div>
      )}
      <form
        className="flex items-center gap-2 border-t p-2"
        onSubmit={(e) => {
          e.preventDefault();
          send(v);
        }}
      >
        <label htmlFor="live-chat-input" className="sr-only">
          メッセージ
        </label>
        <input
          id="live-chat-input"
          value={v}
          onChange={(e) => setV(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.nativeEvent.isComposing) e.preventDefault();
          }}
          placeholder="メッセージを入力"
          className="h-9 min-w-0 flex-1 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <button
          type="submit"
          aria-label="送信"
          disabled={!v.trim()}
          className="grid size-9 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
        >
          <Send className="size-4" />
        </button>
      </form>
    </div>
  );
}
