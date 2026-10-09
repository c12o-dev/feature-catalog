"use client";

import { useState } from "react";

const initial = [
  { who: "agent", t: "こんにちは！どのようにお手伝いできますか？", time: "10:32" },
];

export default function LiveChat() {
  const [msgs, setMsgs] = useState(initial);
  const [v, setV] = useState("");
  const send = () => { if (!v) return; setMsgs((m) => [...m, { who: "me", t: v, time: "今" }]); setV(""); setTimeout(() => setMsgs((m) => [...m, { who: "agent", t: "確認します。少々お待ちください。", time: "今" }]), 800); };
  return (
    <div className="rounded-md border bg-background overflow-hidden max-w-md">
      <div className="px-3 py-2 border-b bg-muted/30 flex items-center gap-2 text-xs">
        <div className="size-6 rounded-full bg-emerald-400 grid place-items-center text-white text-[10px] font-medium">A</div>
        <span className="font-medium">Alice (サポート)</span>
        <span className="ml-auto text-emerald-600">●オンライン</span>
      </div>
      <div className="p-3 h-32 overflow-y-auto space-y-2">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.who === "me" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-lg px-2 py-1 text-xs ${m.who === "me" ? "bg-blue-500 text-white" : "bg-muted"}`}>{m.t}</div>
          </div>
        ))}
      </div>
      <div className="border-t p-2 flex gap-1">
        <input value={v} onChange={(e) => setV(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="メッセージ" className="flex-1 rounded border bg-background px-2 py-1 text-xs" />
      </div>
    </div>
  );
}
