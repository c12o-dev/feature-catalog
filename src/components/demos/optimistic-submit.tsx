"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, Check, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

type Comment = { id: number; author: string; text: string; time: string; status: "sent" | "pending" };

const initial: Comment[] = [
  { id: 1, author: "中村 葵", text: "図の差し替え、とても分かりやすくなりました。", time: "10:12", status: "sent" },
  { id: 2, author: "森 健太", text: "2 章の数字だけ最新版に更新お願いします。", time: "10:30", status: "sent" },
];

export default function OptimisticSubmit() {
  const [items, setItems] = useState<Comment[]>(initial);
  const [v, setV] = useState("");
  const [fail, setFail] = useState(false);
  const [notice, setNotice] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const nextId = useRef(100);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const set = timers.current;
    return () => {
      set.forEach(clearTimeout);
      set.clear();
    };
  }, []);

  const submit = () => {
    const text = v.trim();
    if (!text) return;
    const id = nextId.current++;
    const willFail = fail;
    // 1) update the UI immediately
    setItems((it) => [...it, { id, author: "あなた", text, time: "今", status: "pending" }]);
    setV("");
    setNotice(null);
    // 2) the "server" answers later
    const t = setTimeout(() => {
      timers.current.delete(t);
      if (willFail) {
        // 3a) roll back: remove the comment and give the text back
        setItems((it) => it.filter((c) => c.id !== id));
        setV((cur) => cur || text);
        setNotice({ kind: "error", text: "送信できませんでした。入力内容を戻しました。" });
      } else {
        // 3b) confirm
        setItems((it) => it.map((c) => (c.id === id ? { ...c, status: "sent" } : c)));
        setNotice({ kind: "ok", text: "コメントを投稿しました" });
      }
    }, 1200);
    timers.current.add(t);
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-3">
      <ul className="space-y-2" aria-label="コメント">
        {items.map((c) => (
          <li
            key={c.id}
            className={`rounded-lg border bg-card px-3 py-2 text-sm transition-opacity ${c.status === "pending" ? "opacity-60" : ""}`}
          >
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{c.author}</span>
              <span>{c.time}</span>
              <span className="ml-auto inline-flex items-center gap-1">
                {c.status === "pending" ? (
                  <><Loader2 className="size-3 motion-safe:animate-spin" />送信中</>
                ) : c.author === "あなた" ? (
                  <><Check className="size-3" />送信済み</>
                ) : null}
              </span>
            </div>
            <p className="mt-0.5 break-words">{c.text}</p>
          </li>
        ))}
      </ul>

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <input
          value={v}
          onChange={(e) => setV(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.nativeEvent.isComposing) e.preventDefault();
          }}
          aria-label="コメント"
          placeholder="コメントを書く…"
          className="min-w-0 flex-1 rounded-md border bg-background px-3 py-1.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        />
        <Button type="submit" size="sm" disabled={!v.trim()}>
          <Send /> 送信
        </Button>
      </form>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <label className="inline-flex items-center gap-2 text-muted-foreground">
          <Switch checked={fail} onCheckedChange={setFail} size="sm" />
          通信エラーを再現
        </label>
        <p
          aria-live="polite"
          className={`inline-flex items-center gap-1 ${notice?.kind === "error" ? "text-destructive" : "text-muted-foreground"}`}
        >
          {notice && (notice.kind === "error" ? <AlertCircle className="size-3.5" /> : <Check className="size-3.5" />)}
          {notice?.text}
        </p>
      </div>
    </div>
  );
}
