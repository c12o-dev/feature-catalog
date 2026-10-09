"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Search, FileText, Settings, User, LogOut, Plus, Sun, Moon } from "lucide-react";

const items = [
  { icon: Plus, label: "新規ドキュメント", group: "Action" },
  { icon: FileText, label: "ファイル検索", group: "Action" },
  { icon: User, label: "プロフィール", group: "Navigation" },
  { icon: Settings, label: "設定", group: "Navigation" },
  { icon: Sun, label: "ライトモード", group: "Theme" },
  { icon: Moon, label: "ダークモード", group: "Theme" },
  { icon: LogOut, label: "ログアウト", group: "Account" },
];

export default function CommandPaletteDemo() {
  const [open, setOpen] = useState(false);
  const groups = Array.from(new Set(items.map((i) => i.group)));

  return (
    <div className="text-center">
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Search className="size-4" />
        コマンドパレットを開く
        <kbd className="ml-2 rounded border bg-muted px-1.5 py-0.5 text-[10px] font-mono">⌘K</kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="コマンドを検索..." />
        <CommandList>
          <CommandEmpty>該当なし</CommandEmpty>
          {groups.map((g) => (
            <CommandGroup key={g} heading={g}>
              {items.filter((i) => i.group === g).map((i) => (
                <CommandItem key={i.label} onSelect={() => setOpen(false)}>
                  <i.icon className="mr-2 size-4" />
                  {i.label}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </div>
  );
}
