"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EditConflict() {
  const [show, setShow] = useState(true);
  if (!show) return <button onClick={() => setShow(true)} className="text-xs text-muted-foreground">警告を再表示</button>;
  return (
    <div className="rounded-md border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/30 p-3 max-w-md">
      <div className="flex items-start gap-2">
        <AlertTriangle className="size-4 text-amber-500 mt-0.5 shrink-0" />
        <div className="flex-1">
          <div className="text-sm font-medium">他の人が編集中です</div>
          <div className="text-xs text-muted-foreground mt-0.5">Alice が同じセクションを 2 分前から編集しています。</div>
          <div className="flex gap-2 mt-2">
            <Button size="xs" variant="outline" onClick={() => setShow(false)}>無視</Button>
            <Button size="xs" onClick={() => setShow(false)}>変更を確認</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
