"use client";

import { useEffect, useRef, useState } from "react";
import { Xray } from "@/components/shell/xray";
import { cn } from "@/lib/utils";

/** Sticky contents for a category page: highlights the pattern in view, shows reading progress. */
export function Toc({ items }: { items: { slug: string; name: string; code: string }[] }) {
  const [active, setActive] = useState(items[0]?.slug);
  const [open, setOpen] = useState(false);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.slug)).filter((e): e is HTMLElement => !!e);
    // Any intersection change re-derives the active item from current positions (the last card
    // whose top has crossed 40% of the viewport), so jumps and anchor clicks can't leave it stale.
    const update = () => {
      const line = window.innerHeight * 0.4;
      let current = els[0];
      for (const el of els) if (el.getBoundingClientRect().top <= line) current = el;
      if (current) setActive(current.id);
    };
    const io = new IntersectionObserver(update, { rootMargin: "-20% 0px -60% 0px" });
    els.forEach((el) => io.observe(el));
    // Belt and braces for instant jumps (anchor clicks, "back to top"), where observer
    // notifications can coalesce: re-derive once per frame while scrolling.
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [items]);

  // keep the active row visible inside the scrolling list
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-slug="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const idx = Math.max(0, items.findIndex((i) => i.slug === active));
  const counter = `${String(idx + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`;
  const list = (onPick?: () => void) => (
    <ol ref={onPick ? undefined : listRef} aria-label="このカテゴリのパターン" className={cn("space-y-0.5 overscroll-contain [scrollbar-width:thin]", !onPick && "max-h-[calc(100dvh-12rem)] overflow-y-auto pr-2")}>
      {items.map((i) => (
        <li key={i.slug} data-slug={i.slug}>
          <a
            href={`#${i.slug}`}
            onClick={onPick}
            aria-current={active === i.slug ? "location" : undefined}
            className={cn(
              "flex items-baseline gap-2 rounded-md px-2 py-1 text-[13px] leading-snug transition-colors",
              onPick && "py-2 text-sm",
              active === i.slug ? "bg-cat-dim text-fg-1" : "text-fg-3 hover:text-fg-1",
            )}
          >
            <span className={cn("idx shrink-0 text-[10px]", active === i.slug ? "text-cat" : "text-fg-3")}>{i.code.slice(-2)}</span>
            <span className="line-clamp-2">{i.name}</span>
          </a>
        </li>
      ))}
    </ol>
  );
  return (
    <>
      {/* Phones / tablets: a pill with the position opens the same list as a sheet. */}
      <div data-toc-bar className="lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="toc-sheet"
          className="fixed inset-x-0 top-[var(--header-h)] z-40 flex h-10 items-center gap-3 border-b border-line-1 bg-bg-0/90 px-4 font-mono text-[11px] tracking-[0.14em] text-fg-1 backdrop-blur"
        >
          <span className="text-cat">{counter}</span>
          <span className="truncate text-fg-2">{items[idx]?.name}</span>
          <span className="ml-auto text-fg-3">目次 ▾</span>
        </button>
        {open && (
          <>
            <button type="button" aria-label="目次を閉じる" onClick={() => setOpen(false)} className="fixed inset-0 z-[55] bg-black/50" />
            <div id="toc-sheet" role="dialog" aria-label="このカテゴリのパターン" className="fixed inset-x-0 bottom-0 z-[60] max-h-[70dvh] overflow-y-auto rounded-t-2xl border-t border-line-2 bg-bg-1 p-4 pb-20 shadow-2xl">
              <p className="mb-2 font-mono text-[10px] tracking-[0.16em] text-fg-3 uppercase">{counter}</p>
              {list(() => setOpen(false))}
            </div>
          </>
        )}
      </div>
    <Xray slug="anchor-toc" as="nav" place="tr" className="sticky top-20 hidden lg:block">
      <div aria-hidden className="mb-4 h-px w-full bg-line-1">
        <Xray slug="progress-bar" as="span" place="br" className="block h-px">
          <span className="block h-px origin-left bg-cat transition-transform duration-500 ease-[var(--ease-out-expo)]" style={{ transform: `scaleX(${(idx + 1) / items.length})` }} />
        </Xray>
      </div>
      <p className="mb-3 font-mono text-[10px] tracking-[0.16em] text-fg-3 uppercase">{counter}</p>
      {list()}
    </Xray>
    </>
  );
}
