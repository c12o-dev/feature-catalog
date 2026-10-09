"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";

const summary = "1. 設計はシンプルさを最優先\n2. 検証可能な MVP を最短で\n3. ユーザー語彙で命名\n4. 段階的に複雑性を導入";

export default function SummarizeButton() {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const run = () => {
    setState("loading");
    setTimeout(() => setState("done"), 1200);
  };
  return (
    <div className="space-y-3">
      <div className="rounded-md border bg-background p-3 text-xs leading-relaxed text-muted-foreground line-clamp-3">
        Lorem ipsum dolor sit amet... 800 文字くらいの長文記事がここに表示されている想定。要約ボタンを押すと AI が主要なポイントを抽出します。多くの読者が忙しい中で要点だけ知りたいというニーズに応えます。
      </div>
      <Button onClick={run} disabled={state === "loading"} size="sm">
        {state === "loading" ? <><Loader2 className="size-3.5 animate-spin" />要約中</> : <><Sparkles className="size-3.5" />要約する</>}
      </Button>
      {state === "done" && (
        <div className="rounded-md border bg-muted/30 p-3 text-xs whitespace-pre-line">
          <div className="font-medium mb-1">TL;DR</div>
          {summary}
        </div>
      )}
    </div>
  );
}
