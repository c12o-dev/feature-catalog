"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function SidePeek() {
  const [open, setOpen] = useState(false);
  return (
    <div className="text-center">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger render={<Button variant="outline">Issue を開く</Button>} />
        <SheetContent side="right">
          <SheetHeader><SheetTitle>FEAT-284 Add command palette</SheetTitle></SheetHeader>
          <div className="px-4 pb-4 space-y-3 text-sm">
            <div><span className="text-muted-foreground">Status:</span> In progress</div>
            <div><span className="text-muted-foreground">Assignee:</span> Alice</div>
            <div><span className="text-muted-foreground">Priority:</span> High</div>
            <p className="text-muted-foreground">Issue の詳細がここに表示されます。フルページ遷移せず side peek で素早く確認できる。</p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
