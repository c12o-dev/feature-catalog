"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";

export default function GestureNav() {
  const [page, setPage] = useState(2);
  return (
    <div className="space-y-2">
      <div className="text-xs text-muted-foreground">エッジから内側にスワイプで戻る (左端タップで疑似)</div>
      <div className="relative max-w-[200px] mx-auto h-44 rounded-2xl bg-background border overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-3 bg-foreground/5 cursor-pointer" onClick={() => page > 1 && setPage((p) => p - 1)}>
          <ChevronLeft className="absolute top-1/2 left-0 -translate-y-1/2 size-4 text-foreground/40" />
        </div>
        <div className="p-4 text-sm">Page {page}</div>
      </div>
    </div>
  );
}
