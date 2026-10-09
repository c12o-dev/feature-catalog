"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sparkles } from "lucide-react";

export default function WelcomeModal() {
  const [open, setOpen] = useState(false);
  return (
    <div className="text-center">
      <Button variant="outline" onClick={() => setOpen(true)}>初回起動を再現</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-3 grid place-items-center size-12 rounded-full bg-primary/10">
              <Sparkles className="size-6 text-primary" />
            </div>
            <DialogTitle className="text-center">ようこそ Feature Catalog へ</DialogTitle>
            <DialogDescription className="text-center">
              モダンWeb の機能パターンを動くデモで網羅。25 カテゴリ・230 パターンから選んで使えます。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button variant="ghost" onClick={() => setOpen(false)}>後で</Button>
            <Button onClick={() => setOpen(false)}>始める</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
