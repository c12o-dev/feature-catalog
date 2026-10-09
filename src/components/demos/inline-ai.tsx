"use client";

import { useState } from "react";

export default function InlineAi() {
  const [text, setText] = useState("Tailwind CSS v4 の特徴は");
  const suggest = "、CSS-first なコンフィグと Lightning CSS を使った高速ビルド、そして JIT 不要のシンプルさです。";
  return (
    <div className="space-y-2">
      <div className="text-xs text-muted-foreground">入力中の文章に AI が続きを提案 (Tab で確定)</div>
      <div className="rounded-md border bg-background p-3 text-sm font-mono leading-relaxed">
        {text}
        <span className="text-muted-foreground/60">{suggest}</span>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setText(text + suggest)} className="rounded bg-primary text-primary-foreground px-3 py-1 text-xs">Tab で確定</button>
        <button onClick={() => setText("Tailwind CSS v4 の特徴は")} className="rounded border px-3 py-1 text-xs">リセット</button>
      </div>
    </div>
  );
}
