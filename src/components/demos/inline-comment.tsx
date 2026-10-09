"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";

export default function InlineComment() {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-2 text-sm leading-relaxed">
      <p>これは記事の本文です。</p>
      <p>
        これは
        <span className="relative bg-yellow-200 dark:bg-yellow-900 cursor-pointer" onClick={() => setOpen((o) => !o)}>
          ハイライトされた箇所
        </span>
        です。クリックでコメントが見られます。
        <button onClick={() => setOpen((o) => !o)} className="ml-1 inline-flex items-center text-xs text-muted-foreground hover:text-foreground">
          <MessageCircle className="size-3" />2
        </button>
      </p>
      {open && (
        <div className="ml-4 rounded-md border bg-background p-3 max-w-sm">
          <div className="space-y-2">
            <div className="text-xs"><span className="font-medium">Alice</span> <span className="text-muted-foreground">2分前</span></div>
            <div className="text-sm">この表現は曖昧かも。具体例を追加できますか？</div>
            <div className="text-xs pt-1 border-t"><span className="font-medium">Bob</span> <span className="text-muted-foreground">1分前</span></div>
            <div className="text-sm">同意。次のセクションで補足しました。</div>
          </div>
        </div>
      )}
    </div>
  );
}
