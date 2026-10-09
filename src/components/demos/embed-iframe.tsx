"use client";

import { Hash } from "lucide-react";

export default function EmbedIframe() {
  return (
    <div className="rounded-lg border bg-background p-3 max-w-md space-y-2">
      <div className="flex items-center gap-2">
        <Hash className="size-4 text-blue-500" />
        <div className="text-sm font-medium">@user</div>
        <div className="text-xs text-muted-foreground">· 2h</div>
      </div>
      <div className="text-sm leading-relaxed">これは X (Twitter) のポストを iframe で埋め込んだ例。実際は oEmbed API を使う。</div>
      <div className="aspect-video rounded bg-muted" />
      <div className="text-xs text-muted-foreground">12:34 PM · 2026-04-26</div>
    </div>
  );
}
