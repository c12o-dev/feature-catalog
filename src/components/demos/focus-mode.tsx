"use client";

import { useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FocusMode() {
  const [zen, setZen] = useState(false);
  return (
    <div className="space-y-2">
      <Button size="sm" variant="outline" onClick={() => setZen((z) => !z)}>
        {zen ? <><Minimize2 className="size-4" />通常モード</> : <><Maximize2 className="size-4" />Focus mode</>}
      </Button>
      <div className={`rounded-md border bg-background h-44 grid ${zen ? "grid-cols-1" : "grid-cols-3"}`}>
        {!zen && <aside className="border-r p-2 text-xs text-muted-foreground">サイドバー</aside>}
        <div className={`p-3 text-sm ${zen ? "" : "col-span-2"} ${zen ? "max-w-prose mx-auto" : ""}`}>
          {zen ? "余計なものを隠した執筆モード。コンテンツに集中できる。" : "通常表示: サイドバー + 本文 + その他 UI が見える状態。"}
        </div>
      </div>
    </div>
  );
}
