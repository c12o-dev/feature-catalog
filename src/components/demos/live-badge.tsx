"use client";

import { Eye } from "lucide-react";

export default function LiveBadge() {
  return (
    <div className="flex items-center gap-3">
      <span className="inline-flex items-center gap-1.5 rounded bg-red-500 text-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
        <span className="size-1.5 rounded-full bg-white animate-pulse" />Live
      </span>
      <div className="text-xs text-muted-foreground inline-flex items-center gap-1"><Eye className="size-3.5" />1,284 viewers</div>
    </div>
  );
}
