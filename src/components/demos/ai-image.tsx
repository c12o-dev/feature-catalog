"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AiImage() {
  const [prompt, setPrompt] = useState("a serene mountain lake at dawn, watercolor");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const run = () => { setState("loading"); setTimeout(() => setState("done"), 1500); };
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="プロンプト" />
        <Button onClick={run} disabled={state === "loading"}>
          {state === "loading" ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
          生成
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[0, 1].map((i) => (
          <div key={i} className="aspect-square rounded-md overflow-hidden">
            {state === "loading" && <div className="h-full w-full bg-muted animate-pulse grid place-items-center text-xs text-muted-foreground">生成中...</div>}
            {state === "done" && <div className="h-full w-full bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 dark:from-blue-700 dark:via-purple-700 dark:to-pink-700" />}
            {state === "idle" && <div className="h-full w-full bg-muted/30 border border-dashed border-muted-foreground/30 grid place-items-center text-xs text-muted-foreground">画像 {i + 1}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
