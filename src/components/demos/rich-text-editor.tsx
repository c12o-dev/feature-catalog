"use client";

import { Bold, Italic, Underline, List, Link as LinkIcon, Code, Quote } from "lucide-react";

export default function RichTextEditor() {
  const tools = [
    { icon: Bold }, { icon: Italic }, { icon: Underline },
    { icon: List }, { icon: Quote }, { icon: Code }, { icon: LinkIcon },
  ];
  return (
    <div className="rounded-md border bg-background overflow-hidden">
      <div className="flex items-center gap-0.5 border-b bg-muted/30 px-2 py-1">
        {tools.map((t, i) => (
          <button key={i} className="size-7 grid place-items-center rounded hover:bg-accent">
            <t.icon className="size-3.5" />
          </button>
        ))}
      </div>
      <div contentEditable suppressContentEditableWarning className="p-3 min-h-[8rem] text-sm outline-none">
        ここに <strong>太字</strong>・<em>イタリック</em> など書けます。<br />
        <code className="bg-muted px-1 rounded text-xs">/</code> でブロックメニューが開く想定。
      </div>
    </div>
  );
}
