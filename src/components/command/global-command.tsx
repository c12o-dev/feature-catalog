"use client";

import { lazy, Suspense, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Xray } from "@/components/shell/xray";
import { readRecent } from "@/lib/recent";
import { loadSearchIndex } from "@/lib/search-index";

export type CommandCategory = { slug: string; name: string; code: string; en: string; hue: number };
export type CommandGoal = { href: string; title: string; theme: string };

export const OPEN_COMMAND_EVENT = "fc:open-command";

const loadPalette = () => import("./command-palette");
const CommandPalette = lazy(loadPalette);

/** Warm the palette chunk and the index before the first open (hover / focus on the trigger). */
function preload() {
  void loadPalette();
  void loadSearchIndex();
}

export function GlobalCommand({ categories, goals }: { categories: CommandCategory[]; goals: CommandGoal[] }) {
  const [open, setOpen] = useState(false);
  // Bumped on every open so the palette starts with an empty query each time.
  const [session, setSession] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);

  const show = () => {
    setRecent(readRecent());
    setSession((s) => s + 1);
    setOpen(true);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setOpen((o) => {
          if (!o) {
            setRecent(readRecent());
            setSession((s) => s + 1);
          }
          return !o;
        });
      }
    };
    const onOpen = () => show();
    document.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_COMMAND_EVENT, onOpen);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_COMMAND_EVENT, onOpen);
    };
  }, []);

  return (
    <>
      <Xray slug="command-palette" as="span" place="below">
        <button
          type="button"
          onClick={show}
          onPointerEnter={preload}
          onFocus={preload}
          className="group inline-flex h-8 items-center gap-2 rounded-full border border-line-2 bg-bg-1/60 pl-3 pr-1.5 text-sm text-fg-3 transition-colors hover:border-fg-4 hover:text-fg-2"
        >
          <Search className="size-3.5" />
          <span className="hidden md:inline">パターンを検索</span>
          <span className="sr-only md:hidden">検索</span>
          <kbd className="hidden rounded-full border border-line-1 bg-bg-2 px-2 py-0.5 font-mono text-[10px] text-fg-3 md:inline">⌘K</kbd>
        </button>
      </Xray>
      {session > 0 && (
        <Suspense fallback={null}>
          <CommandPalette key={session} open={open} setOpen={setOpen} recent={recent} categories={categories} goals={goals} />
        </Suspense>
      )}
    </>
  );
}
