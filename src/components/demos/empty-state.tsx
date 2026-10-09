"use client";

import { Inbox, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-8 px-4">
      <div className="rounded-full bg-muted p-4 mb-4">
        <Inbox className="size-8 text-muted-foreground" />
      </div>
      <h3 className="font-semibold mb-1">まだ受信箱は空です</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-sm">
        新しいメッセージはここに表示されます。最初の招待を送って始めましょう。
      </p>
      <Button>
        <Plus className="size-4" />
        招待を送る
      </Button>
    </div>
  );
}
