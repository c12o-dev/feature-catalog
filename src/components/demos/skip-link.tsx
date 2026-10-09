"use client";

import { useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const nav = ["ホーム", "製品", "料金", "導入事例", "ブログ", "サポート"];

export default function SkipLink() {
  const id = useId();
  const mainId = `${id}-main`;
  const skipRef = useRef<HTMLAnchorElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const [mainFocused, setMainFocused] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">枠内で Tab を押すと最初に現れます</p>
        <button
          type="button"
          onClick={() => skipRef.current?.focus()}
          className="rounded-md border px-2.5 py-1 text-xs hover:bg-muted"
        >
          Tab を押した状態にする
        </button>
      </div>
      <div className="relative overflow-hidden rounded-lg border bg-background">
        <a
          ref={skipRef}
          href={`#${mainId}`}
          onClick={(e) => {
            e.preventDefault();
            mainRef.current?.focus();
          }}
          className="absolute left-2 top-2 z-10 -translate-y-[200%] rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-md transition-transform focus:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          本文へスキップ
        </a>
        <header className="border-b px-3 py-2">
          <div className="mb-1.5 text-sm font-semibold">Lumen Cloud</div>
          <nav aria-label="グローバル">
            <ul className="flex flex-wrap gap-x-3 gap-y-1">
              {nav.map((n) => (
                <li key={n}>
                  <a href={`#${id}-${n}`} onClick={(e) => e.preventDefault()} className="rounded-sm text-xs text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring">
                    {n}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </header>
        <main
          ref={mainRef}
          id={mainId}
          tabIndex={-1}
          onFocus={() => setMainFocused(true)}
          onBlur={() => setMainFocused(false)}
          className={cn("space-y-1.5 p-3 outline-none transition-colors", mainFocused && "bg-primary/5 ring-2 ring-inset ring-ring")}
        >
          <h3 className="text-sm font-semibold">本文: チームの作業を一か所に</h3>
          <p className="text-xs leading-relaxed text-muted-foreground">
            スキップリンクを使うと、ナビゲーションの 6 リンクを飛ばして、ここに 1 回でたどり着けます。
          </p>
        </main>
      </div>
      <p className="text-xs text-muted-foreground" aria-live="polite">
        {mainFocused ? "本文にフォーカスが移りました" : " "}
      </p>
    </div>
  );
}
