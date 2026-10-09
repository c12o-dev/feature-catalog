"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Keyboard } from "lucide-react";

const shortcuts = [
  { keys: ["⌘", "K"], desc: "コマンドパレット" },
  { keys: ["⌘", "P"], desc: "ファイルを開く" },
  { keys: ["⌘", "/"], desc: "コメント切替" },
  { keys: ["⌘", "S"], desc: "保存" },
  { keys: ["?"], desc: "このヘルプを表示" },
];

export default function ShortcutsHelp() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = (e: KeyboardEvent) => { if (e.key === "?" && e.shiftKey) { e.preventDefault(); setOpen((o) => !o); } };
    document.addEventListener("keydown", on);
    return () => document.removeEventListener("keydown", on);
  }, []);
  return (
    <div className="text-center space-y-2">
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}><Keyboard className="size-4" />Shift+? を押すか、ここを押す</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>キーボードショートカット</DialogTitle></DialogHeader>
          <ul className="space-y-1.5">
            {shortcuts.map((s) => (
              <li key={s.desc} className="flex items-center justify-between text-sm">
                <span>{s.desc}</span>
                <span className="flex gap-1">{s.keys.map((k) => <kbd key={k} className="rounded border bg-muted px-1.5 py-0.5 text-xs font-mono">{k}</kbd>)}</span>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  );
}
