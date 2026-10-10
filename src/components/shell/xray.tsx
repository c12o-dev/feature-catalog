"use client";

import { createContext, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/*
 * X-ray mode (v2-launch §4.7): overlays the site's own UI with labels naming the catalog
 * pattern each part is built from. State lives in sessionStorage so it survives client-side
 * navigation; `?x-ray=1` turns it on from a shared link.
 */

const KEY = "fc:x-ray";
const listeners = new Set<() => void>();

function read() {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function setXray(on: boolean) {
  try {
    if (on) sessionStorage.setItem(KEY, "1");
    else sessionStorage.removeItem(KEY);
  } catch {}
  document.documentElement.toggleAttribute("data-xray", on);
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useXray() {
  return useSyncExternalStore(subscribe, read, () => false);
}

export type XrayInfo = Record<string, { code: string; name: string; hue: number }>;
const XrayContext = createContext<XrayInfo>({});

export function XrayProvider({ info, children }: { info: XrayInfo; children: ReactNode }) {
  useEffect(() => {
    if (new URLSearchParams(location.search).get("x-ray") === "1") setXray(true);
    else document.documentElement.toggleAttribute("data-xray", read());

    // press "x" twice to toggle
    let last = 0;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "x" || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      const now = performance.now();
      if (now - last < 450) {
        setXray(!read());
        last = 0;
      } else last = now;
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <XrayContext.Provider value={info}>
      {children}
      <XrayLegend info={info} />
    </XrayContext.Provider>
  );
}

/** Patterns with no box of their own (skip link, cursor light, transitions…). */
const GLOBAL_PATTERNS = ["skip-link", "cursor-follower", "view-transition", "focus-ring", "reduced-motion", "prefetch-on-hover", "ambient-orb"];

function XrayLegend({ info }: { info: XrayInfo }) {
  const on = useXray();
  // Collapsed by default so the panel never sits on top of the page's own text.
  const [expanded, setExpanded] = useState(false);
  if (!on) return null;
  const count = GLOBAL_PATTERNS.filter((s) => info[s]).length;
  if (!expanded)
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="fixed right-4 bottom-4 z-[70] inline-flex h-8 items-center gap-2 rounded-full border border-brand bg-bg-1/90 px-3 font-mono text-[10px] tracking-[0.16em] text-fg-1 uppercase shadow-2xl backdrop-blur hover:bg-bg-2"
      >
        <span aria-hidden className="size-1.5 rounded-full bg-brand" />
        X-ray · ページ全体 {count}
      </button>
    );
  return (
    <aside
      aria-label="X-ray: ページ全体で使っているパターン"
      className="fixed right-4 bottom-4 z-[70] w-[min(20rem,calc(100vw-2rem))] rounded-lg border border-line-2 bg-bg-1/90 p-3 shadow-2xl backdrop-blur"
    >
      <div className="mb-2 flex items-center justify-between font-mono text-[10px] tracking-[0.16em] text-fg-3 uppercase">
        <span>X-ray · ページ全体</span>
        <button type="button" onClick={() => setExpanded(false)} className="rounded px-1 text-fg-3 hover:text-fg-1" aria-label="一覧をたたむ">
          ×
        </button>
      </div>
      <ul className="space-y-1">
        {GLOBAL_PATTERNS.flatMap((slug) => {
          const i = info[slug];
          return i
            ? [
                <li key={slug}>
                  <Link
                    href={`/p/${slug}`}
                    style={{ "--cat-hue": i.hue } as React.CSSProperties}
                    className="flex items-baseline gap-2 rounded px-1.5 py-1 text-xs text-fg-2 hover:bg-bg-3 hover:text-fg-1"
                  >
                    <span className="size-1.5 shrink-0 translate-y-[-1px] self-center rounded-full bg-cat" />
                    <span className="idx text-[10px] text-fg-3">{i.code}</span>
                    <span className="truncate">{i.name}</span>
                  </Link>
                </li>,
              ]
            : [];
        })}
      </ul>
    </aside>
  );
}

/** Marks a piece of the shell as built from catalog pattern `slug`. */
export function Xray({
  slug,
  children,
  className,
  as: Tag = "div",
  place = "tl",
}: {
  slug: string;
  children: ReactNode;
  className?: string;
  as?: "div" | "span" | "section" | "header" | "footer" | "nav";
  /** Corner of the box the label sits in; "below" hangs it under the box (for the header). */
  place?: "tl" | "tr" | "bl" | "br" | "below";
}) {
  const on = useXray();
  const info = useContext(XrayContext)[slug];
  return (
    <Tag data-pattern={slug} className={cn("relative", className)}>
      {children}
      {on && info && (
        <Link
          href={`/p/${slug}`}
          style={{ "--cat-hue": info.hue } as React.CSSProperties}
          className={cn(
            "xray-tag absolute z-[70] inline-flex max-w-[calc(100%-0.5rem)] items-center gap-1.5 truncate rounded-sm bg-cat px-1.5 py-0.5 font-mono text-[10px] leading-4 font-medium text-black shadow-lg",
            place === "tl" && "left-1 top-1",
            place === "below" && "left-1 top-full mt-1 max-w-[16rem]",
            place === "tr" && "right-1 top-1",
            place === "bl" && "bottom-1 left-1",
            place === "br" && "bottom-1 right-1",
          )}
        >
          <span className="opacity-60">{info.code}</span>
          <span className="truncate">{info.name}</span>
        </Link>
      )}
    </Tag>
  );
}

export function XrayToggle({ className }: { className?: string }) {
  const on = useXray();
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => setXray(!on)}
      title="X-ray: このサイトで使っているパターンを表示（x を 2 回）"
      aria-label="X-ray モード"
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-full border px-2.5 font-mono text-[11px] tracking-wider uppercase transition-colors sm:px-3",
        on ? "border-brand bg-brand text-black" : "border-line-2 text-fg-2 hover:border-fg-3 hover:text-fg-1",
        className,
      )}
    >
      <span aria-hidden className={cn("size-1.5 rounded-full", on ? "bg-black" : "bg-brand")} />
      X-ray
    </button>
  );
}
