"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, Settings, User, LogOut } from "lucide-react";

export default function Drawer() {
  const [open, setOpen] = useState(false);
  const items = [
    { icon: Home, label: "ホーム" }, { icon: User, label: "プロフィール" },
    { icon: Settings, label: "設定" }, { icon: LogOut, label: "ログアウト" },
  ];
  return (
    <div className="text-center">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger render={<Button variant="outline" size="icon"><Menu className="size-4" /></Button>} />
        <SheetContent side="left">
          <SheetHeader><SheetTitle>メニュー</SheetTitle></SheetHeader>
          <nav className="px-2 pb-3 space-y-0.5">
            {items.map((it) => (
              <button key={it.label} onClick={() => setOpen(false)} className="flex items-center gap-3 w-full text-left rounded-md px-3 py-2 text-sm hover:bg-accent">
                <it.icon className="size-4" />{it.label}
              </button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
