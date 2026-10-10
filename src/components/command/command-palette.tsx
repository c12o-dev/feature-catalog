"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Command as CommandPrimitive } from "cmdk";
import { CornerDownLeft, Search, X } from "lucide-react";
import { CommandDialog } from "@/components/ui/command";
import { Stage } from "@/components/stage/stage";
import type { SearchItem } from "@/lib/catalog";
import { loadSearchIndex } from "@/lib/search-index";
import { cn } from "@/lib/utils";
import type { CommandCategory, CommandGoal } from "./global-command";

function dayIndex(n: number) {
  const d = new Date();
  const key = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  return (key * 2654435761) % n;
}

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  recent: string[];
  categories: CommandCategory[];
  goals: CommandGoal[];
};

/** The ⌘K dialog. Loaded on first use so cmdk and the dialog stay out of the initial bundle. */
export default function CommandPalette({ open, setOpen, recent, categories, goals }: Props) {
  const [items, setItems] = useState<SearchItem[]>([]);
  const [value, setValue] = useState("");
  const [query, setQuery] = useState("");
  const router = useRouter();
  const bySlug = useMemo(() => new Map(items.map((i) => [i.s, i])), [items]);
  const withDemo = useMemo(() => items.filter((i) => i.k), [items]);

  useEffect(() => {
    let live = true;
    loadSearchIndex().then((list) => live && setItems(list));
    return () => {
      live = false;
    };
  }, []);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const today = open && withDemo.length ? withDemo[dayIndex(withDemo.length)] : undefined;
  const recentItems = recent.map((s) => bySlug.get(s)).filter((x): x is SearchItem => !!x);
  // Until the user moves, today's pattern is selected so the preview is live on open. The list is
  // remounted once the index arrives so cmdk picks that up as its default (a controlled value set
  // after the items mount is ignored by cmdk).
  const todayValue = today ? `p:${today.s}#today` : "";
  const current = value || todayValue;
  const selected = current.startsWith("p:") ? bySlug.get(current.slice(2).split("#")[0]) : undefined;

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="パターンを検索"
      description="パターン名・カテゴリ・目的で検索。↑↓ で選び Enter で開く。"
      className="top-[12vh] w-[calc(100vw-2rem)] max-w-none border-line-2 bg-bg-1 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] sm:max-w-4xl"
    >
      <CommandPrimitive key={items.length ? "ready" : "loading"} defaultValue={todayValue} onValueChange={setValue} loop className="flex h-[min(70vh,560px)] flex-col">
        <div className="flex items-center gap-3 border-b border-line-1 px-4">
          <Search className="size-4 shrink-0 text-fg-3" />
          <CommandPrimitive.Input
            autoFocus
            value={query}
            onValueChange={setQuery}
            placeholder="パターン名・カテゴリ・目的で検索…"
            className="h-14 w-full min-w-0 flex-1 bg-transparent text-base text-fg-1 outline-none placeholder:text-fg-3"
          />
          <kbd className="hidden rounded border border-line-1 px-1.5 py-0.5 font-mono text-[10px] text-fg-3 sm:inline">esc</kbd>
          <button type="button" onClick={() => setOpen(false)} aria-label="検索を閉じる" className="grid size-9 shrink-0 place-items-center rounded-full text-fg-3 hover:bg-bg-3 hover:text-fg-1 sm:hidden">
            <X className="size-4" />
          </button>
        </div>
        <div className="flex min-h-0 flex-1">
          <CommandPrimitive.List className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2 md:max-w-[46%] md:border-r md:border-line-1">
            <CommandPrimitive.Empty className="px-3 py-10 text-center text-sm text-fg-3">該当するパターンはありません</CommandPrimitive.Empty>
            {!query && today && (
              <Group heading="今日のパターン">
                <PatternItem item={today} prefix="today" onSelect={go} />
              </Group>
            )}
            {!query && recentItems.length > 0 && (
              <Group heading="最近見たもの">
                {recentItems.map((i) => (
                  <PatternItem key={i.s} item={i} prefix="recent" onSelect={go} />
                ))}
              </Group>
            )}
            <Group heading="パターン">
              {items.map((i) => (
                <PatternItem key={i.s} item={i} onSelect={go} />
              ))}
            </Group>
            <Group heading="カテゴリ">
              {categories.map((c) => (
                <Item key={c.slug} value={`c:${c.slug}`} keywords={[c.name, c.en]} onSelect={() => go(`/c/${c.slug}`)}>
                  <Dot hue={c.hue} />
                  <span className="idx w-9 shrink-0 text-[11px] text-fg-3">{c.code}</span>
                  <span className="truncate">{c.name}</span>
                  <span className="ml-auto hidden font-serif text-xs text-fg-3 sm:inline">{c.en}</span>
                </Item>
              ))}
            </Group>
            <Group heading="目的">
              {goals.map((g) => (
                <Item key={g.href} value={`g:${g.href}`} keywords={[g.title, g.theme]} onSelect={() => go(g.href)}>
                  <span className="truncate">{g.title}</span>
                  <span className="ml-auto shrink-0 text-[11px] text-fg-3">{g.theme}</span>
                </Item>
              ))}
            </Group>
          </CommandPrimitive.List>
          <div aria-hidden className="hidden min-w-0 flex-1 flex-col md:flex">
            {selected ? (
              <div key={selected.s} className="flex h-full flex-col gap-4 p-5">
                <div>
                  <div className="idx text-[11px] text-fg-3" style={{ color: `oklch(0.8 0.13 ${selected.h})` }}>
                    {selected.c} · {selected.cat}
                  </div>
                  <div className="mt-1 text-xl leading-snug text-fg-1">{selected.n}</div>
                  <p className="mt-1 text-sm text-fg-3">{selected.d}</p>
                </div>
                {selected.k && (
                  <div className="min-h-0 flex-1 overflow-hidden">
                    <Stage demo={selected.k} label={selected.n} size="mini" eager toolbar={false} className="pointer-events-none max-h-full" />
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-[11px] text-fg-3">
                  <CornerDownLeft className="size-3" /> で開く
                </div>
              </div>
            ) : (
              <div className="m-auto max-w-[16rem] text-center text-sm text-fg-3">↑↓ でパターンを選ぶと、ここでデモが動きます</div>
            )}
          </div>
        </div>
      </CommandPrimitive>
    </CommandDialog>
  );
}

function Group({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <CommandPrimitive.Group
      heading={heading}
      className="mb-2 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:tracking-[0.14em] [&_[cmdk-group-heading]]:text-fg-3 [&_[cmdk-group-heading]]:uppercase"
    >
      {children}
    </CommandPrimitive.Group>
  );
}

function Item({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      className={cn(
        "flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 text-sm text-fg-2 select-none data-[selected=true]:bg-bg-3 data-[selected=true]:text-fg-1",
        className,
      )}
      {...props}
    />
  );
}

function PatternItem({ item, prefix, onSelect }: { item: SearchItem; prefix?: string; onSelect: (href: string) => void }) {
  return (
    <Item value={`p:${item.s}${prefix ? `#${prefix}` : ""}`} keywords={[item.n, item.d, item.cat, item.s]} onSelect={() => onSelect(`/p/${item.s}`)}>
      <Dot hue={item.h} />
      <span className="idx w-12 shrink-0 text-[11px] text-fg-3">{item.c}</span>
      <span className="truncate">{item.n}</span>
    </Item>
  );
}

function Dot({ hue }: { hue: number }) {
  return <span aria-hidden className="size-1.5 shrink-0 rounded-full" style={{ background: `oklch(0.8 0.13 ${hue})` }} />;
}
