"use client";

import { useEffect, useState } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const FULL = "Tailwind v4 は CSS-first な設定アプローチを採用し、@theme directive で OKLCH カラーや design tokens を直接 CSS に書けます。Lightning CSS による高速ビルドと、JIT 不要のシンプルさが特徴。";

export default function StreamingText() {
  const [text, setText] = useState("");
  const [streaming, setStreaming] = useState(true);
  const [seed, setSeed] = useState(0);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setText(FULL.slice(0, i));
      if (i >= FULL.length) {
        clearInterval(id);
        setStreaming(false);
      }
    }, 25);
    return () => clearInterval(id);
  }, [seed]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm">
        <Sparkles className="size-4 text-blue-500" />
        <span className="font-medium">AI 回答</span>
        {streaming && <span className="text-xs text-muted-foreground animate-pulse">ストリーミング中...</span>}
      </div>
      <div className="rounded-md border bg-background p-4 text-sm leading-relaxed min-h-[8rem]">
        {text}
        {streaming && <span className="inline-block w-2 h-4 bg-foreground animate-pulse ml-0.5 align-middle" />}
      </div>
      <Button size="sm" variant="outline" onClick={() => { setText(""); setStreaming(true); setSeed((s) => s + 1); }} disabled={streaming}>
        <RefreshCw className="size-3" />
        再生成
      </Button>
    </div>
  );
}
