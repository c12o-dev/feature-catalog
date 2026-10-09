"use client";

import { useState } from "react";

export default function HoverPeek() {
  const [hov, setHov] = useState(false);
  return (
    <div className="text-sm">
      hover してみてください: <a onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} className="relative text-blue-600 underline cursor-pointer">
        FEAT-284
        {hov && (
          <div className="absolute left-0 top-full mt-1 w-72 rounded-md border bg-popover shadow-lg p-3 text-foreground z-10">
            <div className="text-xs text-muted-foreground mb-1">Linear · In progress</div>
            <div className="font-medium text-sm">Add command palette</div>
            <div className="text-xs text-muted-foreground mt-1">⌘K でナビゲーションを高速化する。Linear-style な実装が要件。</div>
          </div>
        )}
      </a> をクリックすると詳細ページに遷移します。
    </div>
  );
}
