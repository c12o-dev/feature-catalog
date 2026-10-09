"use client";

import { useEffect, useRef, useState } from "react";
import { Xray } from "@/components/shell/xray";
import { cn } from "@/lib/utils";

/** Sticky contents for a category page: highlights the pattern in view, shows reading progress. */
export function Toc({ items }: { items: { slug: string; name: string; code: string }[] }) {
  const [active, setActive] = useState(items[0]?.slug);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.slug)).filter((e): e is HTMLElement => !!e);
    const visible = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.set(e.target.id, e.boundingClientRect.top);
          else visible.delete(e.target.id);
        }
        const first = items.find((i) => visible.has(i.slug));
        if (first) setActive(first.slug);
      },
      { rootMargin: "-20% 0px -60% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  // keep the active row visible inside the scrolling list
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-slug="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const idx = Math.max(0, items.findIndex((i) => i.slug === active));
  return (
    <Xray slug="anchor-toc" as="nav" place="tr" className="sticky top-20">
      <div aria-hidden className="mb-4 h-px w-full bg-line-1">
        <Xray slug="progress-bar" as="span" place="br" className="block h-px">
          <span className="block h-px origin-left bg-cat transition-transform duration-500 ease-[var(--ease-out-expo)]" style={{ transform: `scaleX(${(idx + 1) / items.length})` }} />
        </Xray>
      </div>
      <p className="mb-3 font-mono text-[10px] tracking-[0.16em] text-fg-4 uppercase">
        {String(idx + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
      </p>
      <ol ref={listRef} aria-label="このカテゴリのパターン" className="max-h-[calc(100dvh-12rem)] space-y-0.5 overflow-y-auto overscroll-contain pr-2 [scrollbar-width:thin]">
        {items.map((i) => (
          <li key={i.slug} data-slug={i.slug}>
            <a
              href={`#${i.slug}`}
              aria-current={active === i.slug ? "location" : undefined}
              className={cn(
                "flex items-baseline gap-2 rounded-md px-2 py-1 text-[13px] leading-snug transition-colors",
                active === i.slug ? "bg-cat-dim text-fg-1" : "text-fg-3 hover:text-fg-1",
              )}
            >
              <span className={cn("idx shrink-0 text-[10px]", active === i.slug ? "text-cat" : "text-fg-4")}>{i.code.slice(-2)}</span>
              <span className="line-clamp-2">{i.name}</span>
            </a>
          </li>
        ))}
      </ol>
    </Xray>
  );
}
