"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { categories } from "@/data/categories";
import { themes } from "@/data/goals";

export function GlobalCommand() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const go = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <Search className="size-4" />
        <span className="hidden md:inline">検索...</span>
        <kbd className="hidden md:inline ml-2 rounded border bg-muted px-1.5 py-0.5 text-[10px] font-mono">
          ⌘K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="パターン名・カテゴリ・目的で検索..." />
        <CommandList>
          <CommandEmpty>該当なし</CommandEmpty>
          <CommandGroup heading="カテゴリ">
            {categories.map((c) => (
              <CommandItem key={c.id} value={`${c.name} ${c.slug}`} onSelect={() => go(`/c/${c.slug}`)}>
                <span className="text-muted-foreground mr-2">§{c.id}</span>
                {c.name}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="目的">
            {themes.flatMap((t) =>
              t.goals.map((g, i) => (
                <CommandItem
                  key={`${t.id}-${i}`}
                  value={`${g.title} ${t.name}`}
                  onSelect={() => go(`/g/${t.slug}#${i}`)}
                >
                  <span className="text-muted-foreground mr-2">{t.name}</span>
                  {g.title}
                </CommandItem>
              ))
            )}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="パターン">
            {categories.flatMap((c) =>
              c.patterns.map((p) => (
                <CommandItem
                  key={`${c.id}-${p.name}`}
                  value={`${p.name} ${p.description} ${c.name}`}
                  onSelect={() => go(`/c/${c.slug}#${encodeURIComponent(p.name)}`)}
                >
                  <span className="text-muted-foreground mr-2 text-xs">§{c.id}</span>
                  {p.name}
                </CommandItem>
              ))
            )}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
