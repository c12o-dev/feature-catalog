"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function BuildInfoModal() {
  const [open, setOpen] = useState(false);
  return (
    <div className="text-center">
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>ビルド情報</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Build Information</DialogTitle></DialogHeader>
          <dl className="text-xs font-mono grid grid-cols-[6rem_1fr] gap-y-1">
            <dt className="text-muted-foreground">Version</dt><dd>1.4.0</dd>
            <dt className="text-muted-foreground">Commit</dt><dd>a3f2e9c</dd>
            <dt className="text-muted-foreground">Built at</dt><dd>2026-04-27 09:42</dd>
            <dt className="text-muted-foreground">Node</dt><dd>22.16.0</dd>
            <dt className="text-muted-foreground">Next.js</dt><dd>16.2.4</dd>
          </dl>
        </DialogContent>
      </Dialog>
    </div>
  );
}
