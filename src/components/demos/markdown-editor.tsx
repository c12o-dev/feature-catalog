"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

const initial = "# 見出し\n\n**太字** と *イタリック*。\n\n- リスト1\n- リスト2\n\n```ts\nconst x = 1;\n```";

export default function MarkdownEditor() {
  const [v, setV] = useState(initial);
  // very simple md -> html for preview
  const html = v
    .replace(/^# (.*)/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^- (.*)/gm, "<li>$1</li>")
    .replace(/```\w*\n([\s\S]*?)```/g, '<pre class="bg-muted p-2 rounded text-xs">$1</pre>')
    .replace(/\n/g, "<br>");
  return (
    <div className="grid grid-cols-2 gap-2 h-56">
      <Textarea value={v} onChange={(e) => setV(e.target.value)} className="font-mono text-xs h-full resize-none" />
      <div className="rounded-md border bg-background p-3 overflow-y-auto text-sm prose prose-sm dark:prose-invert max-w-none [&_h1]:text-lg [&_h1]:font-semibold" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
