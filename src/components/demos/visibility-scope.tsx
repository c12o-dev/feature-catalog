"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Globe, Lock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const opts = [
  { v: "public", l: "公開", icon: Globe, desc: "誰でも閲覧できます" },
  { v: "friends", l: "フォロワーのみ", icon: Users, desc: "あなたのフォロワーだけ" },
  { v: "private", l: "非公開", icon: Lock, desc: "自分だけが見られます" },
] as const;
type V = (typeof opts)[number]["v"];

export default function VisibilityScope() {
  const [v, setV] = useState<V>("friends");
  const [open, setOpen] = useState(false);
  const [posted, setPosted] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const cur = opts.find((o) => o.v === v)!;

  useEffect(() => {
    if (!open) return;
    const idx = opts.findIndex((o) => o.v === v);
    itemRefs.current[idx]?.focus();
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open, v]);

  const choose = (nv: V) => {
    setV(nv);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onMenuKey = (e: React.KeyboardEvent, i: number) => {
    const n = opts.length;
    let next: number | null = null;
    if (e.key === "ArrowDown") next = (i + 1) % n;
    if (e.key === "ArrowUp") next = (i + n - 1) % n;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = n - 1;
    if (next !== null) { e.preventDefault(); itemRefs.current[next]?.focus(); }
    if (e.key === "Escape" || e.key === "Tab") {
      if (e.key === "Escape") e.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    }
  };

  return (
    <div className="mx-auto min-h-64 max-w-md">
      <div ref={wrapRef} className="relative rounded-lg border bg-card p-3">
        <div className="flex items-center gap-2">
          <div aria-hidden className="grid size-8 place-items-center rounded-full bg-sky-500 text-sm font-medium text-white">さ</div>
          <div className="min-w-0">
            <div className="text-sm font-medium">佐藤 みく</div>
            <div>
              <button
                ref={triggerRef}
                type="button"
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label={`公開範囲: ${cur.l}`}
                onClick={() => setOpen((o) => !o)}
                onKeyDown={(e) => { if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); } }}
                className="mt-0.5 inline-flex items-center gap-1 rounded-full border bg-background px-2 py-0.5 text-xs hover:bg-muted"
              >
                <cur.icon aria-hidden className="size-3.5" />
                {cur.l}
                <ChevronDown aria-hidden className={cn("size-3 text-muted-foreground transition-transform", open && "rotate-180")} />
              </button>
              {open && (
                <div role="menu" aria-label="公開範囲" className="absolute left-3 right-3 top-[4.25rem] z-10 max-w-64 rounded-lg border bg-popover p-1 text-popover-foreground shadow-md">
                  {opts.map((o, i) => {
                    const checked = o.v === v;
                    return (
                      <button
                        key={o.v}
                        ref={(el) => { itemRefs.current[i] = el; }}
                        type="button"
                        role="menuitemradio"
                        aria-checked={checked}
                        tabIndex={-1}
                        onClick={() => choose(o.v)}
                        onKeyDown={(e) => onMenuKey(e, i)}
                        className={cn("flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left outline-none hover:bg-muted focus-visible:bg-muted", checked && "bg-muted/60")}
                      >
                        <o.icon aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm">{o.l}</span>
                          <span className="block text-xs text-muted-foreground">{o.desc}</span>
                        </span>
                        <Check aria-hidden className={cn("mt-0.5 size-4 shrink-0 text-primary", !checked && "invisible")} />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
        <p className="mt-3 text-sm">週末に行った湖の写真をまとめました。紅葉がちょうど見頃でした。</p>
        <div className="mt-3 flex items-center justify-between gap-2 border-t pt-3">
          <span className="text-xs text-muted-foreground">{cur.desc}</span>
          <Button size="sm" onClick={() => setPosted(cur.l)}>投稿</Button>
        </div>
      </div>
      <p aria-live="polite" className="mt-2 text-center text-xs text-muted-foreground">
        {posted ? `「${posted}」で投稿しました` : ""}
      </p>
    </div>
  );
}
