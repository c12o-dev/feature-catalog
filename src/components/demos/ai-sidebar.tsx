"use client";

import { Sparkles, Send } from "lucide-react";

export default function AiSidebar() {
  return (
    <div className="grid grid-cols-3 h-56 rounded-md border overflow-hidden">
      <div className="col-span-2 p-3 bg-background text-xs space-y-2">
        <div className="text-muted-foreground">main editor / app content</div>
        <div className="h-2 w-3/4 bg-muted rounded" />
        <div className="h-2 w-1/2 bg-muted rounded" />
        <div className="h-2 w-2/3 bg-muted rounded" />
      </div>
      <aside className="border-l bg-muted/30 p-2.5 flex flex-col">
        <div className="flex items-center gap-1.5 text-xs font-medium mb-2">
          <Sparkles className="size-3.5 text-blue-500" />
          AI Copilot
        </div>
        <div className="flex-1 space-y-1.5 text-xs overflow-y-auto">
          <div className="bg-blue-50 dark:bg-blue-950/40 rounded p-1.5">これを要約して</div>
          <div className="bg-background rounded p-1.5 border">3 つのポイント: 1) ... 2) ... 3) ...</div>
        </div>
        <div className="flex gap-1 mt-2">
          <input className="flex-1 rounded border bg-background px-2 py-1 text-xs" placeholder="質問..." />
          <button className="rounded bg-primary text-primary-foreground p-1.5"><Send className="size-3" /></button>
        </div>
      </aside>
    </div>
  );
}
