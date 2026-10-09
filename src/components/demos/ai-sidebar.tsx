"use client";

import { useEffect, useRef, useState } from "react";
import { PanelRightClose, PanelRightOpen, Send, Sparkles } from "lucide-react";

type Msg = { role: "user" | "ai"; text: string };

const replies: Record<string, string> = {
  要約: "要点は 3 つです。① 10 月から新料金に移行 ② 既存顧客は 3 か月据え置き ③ 告知は 9/20 にメールで実施。",
  タイトル: "案:「新料金プランのお知らせと移行スケジュール」",
  敬語: "「ご確認いただけますと幸いです」のように、文末をやわらげると丁寧になります。",
};
const suggestions = ["要約して", "タイトル案を出して", "敬語をチェック"];

function answer(q: string) {
  if (q.includes("要約")) return replies.要約;
  if (q.includes("タイトル")) return replies.タイトル;
  if (q.includes("敬語")) return replies.敬語;
  return "このドキュメントの内容に基づいて回答します。もう少し具体的に教えてください。";
}

export default function AiSidebar() {
  const [open, setOpen] = useState(true);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "ai", text: "開いているドキュメントについて質問できます。" }]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, thinking]);

  const send = (text: string) => {
    const q = text.trim();
    if (!q || thinking) return;
    setMsgs((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setThinking(true);
    timer.current = setTimeout(() => {
      setMsgs((m) => [...m, { role: "ai", text: answer(q) }]);
      setThinking(false);
    }, 700);
  };

  return (
    <div className="relative flex h-80 overflow-hidden rounded-lg border bg-background">
      <div className="min-w-0 flex-1 overflow-y-auto p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">ドキュメント / 料金改定のお知らせ</span>
          {!open && (
            <button type="button" aria-label="AI パネルを開く" onClick={() => setOpen(true)} className="grid size-7 shrink-0 place-items-center rounded-md hover:bg-accent">
              <PanelRightOpen aria-hidden className="size-4" />
            </button>
          )}
        </div>
        <h3 className="mt-2 text-sm font-semibold">料金改定のお知らせ（下書き）</h3>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          いつもご利用いただきありがとうございます。2026 年 10 月より、各プランの料金を改定いたします。既存のお客様は 12 月末まで現行料金のままご利用いただけます。
        </p>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">詳細は 9 月 20 日にメールでご案内します。ご確認ください。</p>
      </div>

      {open && (
        <aside aria-label="AI コパイロット" className="absolute inset-y-0 right-0 flex w-full flex-col border-l bg-card sm:static sm:w-64 sm:shrink-0">
          <div className="flex items-center justify-between border-b px-3 py-2">
            <span className="flex items-center gap-1.5 text-xs font-medium">
              <Sparkles aria-hidden className="size-3.5 text-violet-500 dark:text-violet-400" />
              コパイロット
            </span>
            <button type="button" aria-label="AI パネルを閉じる" onClick={() => setOpen(false)} className="grid size-7 place-items-center rounded-md hover:bg-accent">
              <PanelRightClose aria-hidden className="size-4" />
            </button>
          </div>
          <div ref={listRef} aria-live="polite" className="flex-1 space-y-2 overflow-y-auto p-3 text-xs">
            {msgs.map((m, i) => (
              <div key={i} className={m.role === "user" ? "ml-6 rounded-lg bg-primary px-2.5 py-1.5 text-primary-foreground" : "mr-4 rounded-lg border bg-background px-2.5 py-1.5"}>
                {m.text}
              </div>
            ))}
            {thinking && <div className="mr-4 w-fit rounded-lg border bg-background px-2.5 py-1.5 text-muted-foreground">考え中…</div>}
          </div>
          <div className="flex flex-wrap gap-1 px-3 pb-2">
            {suggestions.map((s) => (
              <button key={s} type="button" onClick={() => send(s)} className="rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground hover:bg-accent hover:text-foreground">
                {s}
              </button>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-1 border-t p-2">
            <input
              aria-label="コパイロットに質問"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-w-0 flex-1 rounded-md border bg-background px-2 py-1.5 text-xs"
              placeholder="質問を入力…"
            />
            <button type="submit" aria-label="送信" disabled={!input.trim() || thinking} className="grid size-8 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground disabled:opacity-50">
              <Send aria-hidden className="size-3.5" />
            </button>
          </form>
        </aside>
      )}
    </div>
  );
}
