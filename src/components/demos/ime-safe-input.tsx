"use client";

import { useState } from "react";

export default function ImeSafeInput() {
  const [v, setV] = useState("");
  const [composing, setComposing] = useState(false);
  const [submitted, setSubmitted] = useState<string[]>([]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !composing) {
      if (v) { setSubmitted((s) => [...s, v]); setV(""); }
    }
  };

  return (
    <div className="space-y-2 max-w-md">
      <div className="text-xs text-muted-foreground">IME 入力中の Enter を無視（日本語確定 enter で誤送信防止）</div>
      <input
        value={v}
        onChange={(e) => setV(e.target.value)}
        onKeyDown={onKey}
        onCompositionStart={() => setComposing(true)}
        onCompositionEnd={() => setComposing(false)}
        placeholder={composing ? "変換中..." : "日本語で打って enter"}
        className="w-full rounded-md border bg-background px-3 py-2 text-sm"
      />
      <ul className="space-y-1">
        {submitted.map((s, i) => <li key={i} className="text-sm rounded border bg-background px-3 py-1">{s}</li>)}
      </ul>
    </div>
  );
}
