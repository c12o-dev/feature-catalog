"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Ban, VolumeX } from "lucide-react";

export default function BlockMute() {
  const [s, setS] = useState<"none" | "muted" | "blocked">("none");
  return (
    <div className="space-y-2 max-w-sm text-center">
      <div className="rounded-md border bg-background p-4">
        <div className="size-12 rounded-full bg-rose-400 mx-auto grid place-items-center text-white font-medium mb-2">U</div>
        <div className="text-sm font-medium">@spammer</div>
        <div className="text-xs text-muted-foreground mb-3">{s === "blocked" ? "このアカウントはブロック済" : s === "muted" ? "このアカウントはミュート中" : "Active"}</div>
        <div className="flex gap-2 justify-center">
          <Button size="sm" variant={s === "muted" ? "default" : "outline"} onClick={() => setS(s === "muted" ? "none" : "muted")}><VolumeX className="size-3.5" />ミュート</Button>
          <Button size="sm" variant={s === "blocked" ? "destructive" : "outline"} onClick={() => setS(s === "blocked" ? "none" : "blocked")}><Ban className="size-3.5" />ブロック</Button>
        </div>
      </div>
    </div>
  );
}
