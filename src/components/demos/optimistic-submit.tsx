"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type Comment = { id: number; text: string; pending?: boolean };

export default function OptimisticSubmit() {
  const [items, setItems] = useState<Comment[]>([{ id: 1, text: "良い記事ですね" }, { id: 2, text: "参考になりました" }]);
  const [v, setV] = useState("");

  const submit = () => {
    if (!v) return;
    const id = Date.now();
    setItems((it) => [...it, { id, text: v, pending: true }]);
    const text = v;
    setV("");
    setTimeout(() => {
      setItems((it) => it.map((c) => c.id === id ? { id, text } : c));
    }, 1200);
  };

  return (
    <div className="space-y-3 max-w-md">
      <ul className="space-y-1">
        {items.map((c) => (
          <li key={c.id} className={`flex items-center gap-2 text-sm rounded border bg-background px-3 py-1.5 ${c.pending ? "opacity-60" : ""}`}>
            {c.pending && <Loader2 className="size-3 animate-spin text-muted-foreground" />}
            <span>{c.text}</span>
            {c.pending && <span className="text-[10px] text-muted-foreground ml-auto">送信中...</span>}
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <input value={v} onChange={(e) => setV(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="コメントを書く..." className="flex-1 rounded-md border bg-background px-3 py-1.5 text-sm" />
        <Button size="sm" onClick={submit} disabled={!v}>送信</Button>
      </div>
    </div>
  );
}
