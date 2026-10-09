"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Share2, Bookmark, Link2, Flag } from "lucide-react";

export default function BottomSheet() {
  const [open, setOpen] = useState(false);
  const items = [
    { icon: Share2, label: "シェア" },
    { icon: Link2, label: "リンクをコピー" },
    { icon: Bookmark, label: "保存" },
    { icon: Flag, label: "通報", danger: true },
  ];
  return (
    <div className="text-center">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger render={<Button variant="outline">アクションを開く</Button>} />
        <SheetContent side="bottom" className="rounded-t-xl">
          <SheetHeader>
            <SheetTitle>アクション</SheetTitle>
            <SheetDescription>この投稿に対する操作を選んでください</SheetDescription>
          </SheetHeader>
          <div className="grid gap-1 p-4">
            {items.map((it) => (
              <button
                key={it.label}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-md hover:bg-accent text-left ${it.danger ? "text-red-600" : ""}`}
              >
                <it.icon className="size-5" />
                {it.label}
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
