"use client";

import { useEffect, useId, useRef, useState } from "react";
import { SendHorizontal, Users } from "lucide-react";
import { cn } from "@/lib/utils";

type Msg = { id: number; who: string; text: string; time: string };
type Thread = { id: string; title: string; group: boolean; members: string[]; msgs: Msg[]; reply: { who: string; text: string } };

const ME = "me";
const COLORS: Record<string, string> = { 田中: "bg-sky-600", 佐藤: "bg-amber-600", 鈴木: "bg-violet-600" };

const THREADS: Thread[] = [
  {
    id: "tanaka",
    title: "田中 美咲",
    group: false,
    members: ["田中"],
    msgs: [
      { id: 1, who: "田中", text: "例のプロジェクトの件、来週どこかで 30 分もらえますか？", time: "8:41" },
      { id: 2, who: ME, text: "火曜の午後なら空いてます", time: "8:43" },
      { id: 3, who: "田中", text: "では火曜 15 時でカレンダー送りますね", time: "8:44" },
    ],
    reply: { who: "田中", text: "了解です、資料も添付しておきます" },
  },
  {
    id: "design",
    title: "デザインチーム",
    group: true,
    members: ["田中", "佐藤", "鈴木"],
    msgs: [
      { id: 1, who: "佐藤", text: "トップページの案、共有フォルダに上げました", time: "昨日" },
      { id: 2, who: "鈴木", text: "ヒーローの余白いい感じですね", time: "昨日" },
      { id: 3, who: "田中", text: "明日のレビューで詰めましょう", time: "8:30" },
    ],
    reply: { who: "佐藤", text: "👍 了解です" },
  },
];

export default function DmThread() {
  const [threads, setThreads] = useState(THREADS);
  const [activeId, setActiveId] = useState(THREADS[0].id);
  const [draft, setDraft] = useState("");
  const [typingIn, setTypingIn] = useState<{ thread: string; who: string } | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const listRef = useRef<HTMLOListElement>(null);
  const inputId = useId();
  const t = threads.find((x) => x.id === activeId)!;
  const typing = typingIn?.thread === activeId ? typingIn.who : null;

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [t.msgs.length, typing, activeId]);

  const append = (threadId: string, m: Omit<Msg, "id">) =>
    setThreads((ts) => ts.map((x) => (x.id === threadId ? { ...x, msgs: [...x.msgs, { ...m, id: x.msgs.length + 1 }] } : x)));

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    append(t.id, { who: ME, text, time: "9:00" });
    setDraft("");
    const { reply } = t;
    const threadId = t.id;
    timers.current.push(
      setTimeout(() => setTypingIn({ thread: threadId, who: reply.who }), 600),
      setTimeout(() => {
        setTypingIn(null);
        append(threadId, { who: reply.who, text: reply.text, time: "9:01" });
      }, 2000),
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col overflow-hidden rounded-lg border bg-card">
      <div role="tablist" aria-label="会話" className="flex border-b">
        {threads.map((x) => (
          <button
            key={x.id}
            role="tab"
            aria-selected={x.id === activeId}
            tabIndex={x.id === activeId ? 0 : -1}
            onClick={() => setActiveId(x.id)}
            onKeyDown={(e) => {
              if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
              e.preventDefault();
              const i = threads.findIndex((y) => y.id === x.id);
              const n = (i + (e.key === "ArrowRight" ? 1 : -1) + threads.length) % threads.length;
              setActiveId(threads[n].id);
              (e.currentTarget.parentElement?.children[n] as HTMLElement | undefined)?.focus();
            }}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 border-b-2 px-3 py-2 text-xs",
              x.id === activeId ? "border-foreground font-medium" : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {x.group && <Users className="size-3.5" aria-hidden />}
            <span className="truncate">{x.title}</span>
            {x.group && <span className="text-muted-foreground tabular-nums">{x.members.length + 1}</span>}
          </button>
        ))}
      </div>

      <div role="tabpanel" aria-label={t.title}>
      <ol ref={listRef} role="log" aria-live="polite" aria-label={`${t.title} とのメッセージ`} className="h-64 space-y-2 overflow-y-auto p-3">
        {t.msgs.map((m, i) => {
          const mine = m.who === ME;
          const showName = t.group && !mine && t.msgs[i - 1]?.who !== m.who;
          return (
            <li key={m.id} className={cn("flex items-end gap-2", mine && "justify-end")}>
              {!mine && t.group && (
                <span className={cn("grid size-6 shrink-0 place-items-center rounded-full text-[10px] text-white", COLORS[m.who], !showName && "invisible")} aria-hidden>
                  {m.who[0]}
                </span>
              )}
              <div className={cn("max-w-[75%]", mine && "text-right")}>
                {showName && <div className="mb-0.5 text-[11px] text-muted-foreground">{m.who}</div>}
                <div
                  className={cn(
                    "inline-block rounded-2xl px-3 py-1.5 text-left text-sm",
                    mine ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md bg-muted",
                  )}
                >
                  {m.text}
                </div>
                <div className="mt-0.5 text-[10px] text-muted-foreground tabular-nums">{m.time}</div>
              </div>
            </li>
          );
        })}
        {typing && (
          <li className="text-xs text-muted-foreground">
            {typing}さんが入力中…
          </li>
        )}
      </ol>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="flex items-center gap-2 border-t p-2"
      >
        <label htmlFor={inputId} className="sr-only">
          {t.title} へのメッセージ
        </label>
        <input
          id={inputId}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.nativeEvent.isComposing) e.preventDefault();
          }}
          placeholder="メッセージを入力"
          autoComplete="off"
          className="h-9 min-w-0 flex-1 rounded-full border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          aria-label="送信"
          className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground disabled:opacity-40"
        >
          <SendHorizontal className="size-4" />
        </button>
      </form>
    </div>
  );
}
