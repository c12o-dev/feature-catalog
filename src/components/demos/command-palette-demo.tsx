"use client";

import { useEffect, useRef, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { FileText, LogOut, Moon, Plus, Search, Settings, Sun, User, type LucideIcon } from "lucide-react";

const items: { icon: LucideIcon; label: string; group: string; shortcut?: string }[] = [
  { icon: Plus, label: "新規ドキュメント", group: "操作", shortcut: "N" },
  { icon: FileText, label: "ファイルを検索", group: "操作", shortcut: "P" },
  { icon: User, label: "プロフィール", group: "移動" },
  { icon: Settings, label: "設定", group: "移動", shortcut: "," },
  { icon: Sun, label: "ライトモード", group: "テーマ" },
  { icon: Moon, label: "ダークモード", group: "テーマ" },
  { icon: LogOut, label: "ログアウト", group: "アカウント" },
];
const groups = Array.from(new Set(items.map((i) => i.group)));

export default function CommandPaletteDemo() {
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState<string | null>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  // move focus into the search field when the palette opens
  useEffect(() => {
    if (!open) return;
    const t = requestAnimationFrame(() => areaRef.current?.querySelector<HTMLInputElement>("[cmdk-input]")?.focus());
    return () => cancelAnimationFrame(t);
  }, [open]);

  const close = () => {
    setOpen(false);
    requestAnimationFrame(() => openerRef.current?.focus());
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      // keep the site-wide palette from opening while the demo has focus
      e.stopPropagation();
      if (open) close();
      else setOpen(true);
    } else if (e.key === "Escape" && open) {
      e.stopPropagation();
      close();
    }
  };

  return (
    <div
      ref={areaRef}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) areaRef.current?.focus();
      }}
      className="relative min-h-[380px] overflow-hidden rounded-lg border bg-muted/30 outline-none"
    >
      <div className="flex flex-col items-center justify-center gap-3 px-4 pt-16 text-center">
        <button
          ref={openerRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          className="flex w-full max-w-xs items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground shadow-sm hover:bg-muted"
        >
          <Search className="size-4" aria-hidden />
          <span className="flex-1 text-left">検索・コマンド</span>
          <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
        </button>
        <p className="text-xs text-muted-foreground">
          デモ内にフォーカスがあるとき <kbd className="font-mono">⌘K</kbd> / <kbd className="font-mono">Ctrl+K</kbd> でも開けます
        </p>
        <p className="min-h-5 text-xs" role="status" aria-live="polite">
          {last && (
            <>
              「<span className="font-medium">{last}</span>」を実行しました
            </>
          )}
        </p>
      </div>

      {open && (
        <div
          className="absolute inset-0 flex items-start justify-center bg-black/30 p-3 pt-8 motion-safe:animate-in motion-safe:fade-in"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="コマンドパレット"
            className="w-full max-w-md overflow-hidden rounded-xl border shadow-2xl motion-safe:animate-in motion-safe:zoom-in-95"
          >
            <Command label="コマンドパレット">
              <CommandInput placeholder="コマンドを検索…" aria-label="コマンドを検索" />
              <CommandList className="max-h-64">
                <CommandEmpty>該当するコマンドはありません</CommandEmpty>
                {groups.map((g) => (
                  <CommandGroup key={g} heading={g}>
                    {items
                      .filter((i) => i.group === g)
                      .map((i) => (
                        <CommandItem
                          key={i.label}
                          value={i.label}
                          onSelect={() => {
                            setLast(i.label);
                            close();
                          }}
                        >
                          <i.icon className="size-4" aria-hidden />
                          {i.label}
                          {i.shortcut && <CommandShortcut>⌘{i.shortcut}</CommandShortcut>}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                ))}
              </CommandList>
            </Command>
            <div className="flex items-center gap-3 border-t bg-popover px-3 py-2 text-[11px] text-muted-foreground">
              <span><kbd className="font-mono">↑↓</kbd> 移動</span>
              <span><kbd className="font-mono">Enter</kbd> 実行</span>
              <span><kbd className="font-mono">Esc</kbd> 閉じる</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
