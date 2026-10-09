"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CircleDot } from "lucide-react";

export default function HoverPeek() {
  const [open, setOpen] = useState(false);
  const [visited, setVisited] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = useId();

  const clear = () => { if (timer.current) clearTimeout(timer.current); timer.current = null; };
  const show = () => { clear(); timer.current = setTimeout(() => setOpen(true), 250); };
  const hide = () => { clear(); timer.current = setTimeout(() => setOpen(false), 120); };
  useEffect(() => clear, []);

  return (
    <div className="relative min-h-56 rounded-lg border bg-card p-4 text-sm leading-relaxed">
      <p className="text-xs text-muted-foreground">#design-system · 11:42</p>
      <p className="mt-1">
        ⌘K の件は{" "}
        <span onMouseEnter={show} onMouseLeave={hide}>
          <a
            href="#feat-284"
            aria-describedby={open ? id : undefined}
            onFocus={() => { clear(); setOpen(true); }}
            onBlur={() => setOpen(false)}
            onKeyDown={(e) => { if (e.key === "Escape") setOpen(false); }}
            onClick={(e) => { e.preventDefault(); setOpen(false); setVisited(true); }}
            className="rounded font-medium text-primary underline decoration-dotted underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            FEAT-284
          </a>
        </span>{" "}
        で進めています。レビューお願いします。
      </p>
      {open && (
            <div
              id={id}
              role="tooltip"
              onMouseEnter={clear}
              onMouseLeave={hide}
              className="absolute inset-x-4 top-[4.5rem] z-10 rounded-lg border bg-popover p-3 text-popover-foreground shadow-lg sm:right-auto sm:w-72"
            >
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CircleDot aria-hidden className="size-3 text-amber-500 dark:text-amber-400" />
                進行中 · FEAT-284
              </span>
              <span className="mt-1 block text-sm font-medium">コマンドパレットを追加</span>
              <span className="mt-1 block text-xs text-muted-foreground">⌘K から画面遷移と主要操作を呼び出せるようにする。</span>
              <span className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="grid size-5 place-items-center rounded-full bg-muted text-[10px] font-medium text-foreground">高</span>
                高橋 · 期日 10/15
              </span>
            </div>
          )}
      <p className="mt-4 text-xs text-muted-foreground" aria-live="polite">
        {visited ? "FEAT-284 の詳細ページへ移動しました（デモ）" : "リンクにカーソルを合わせるかフォーカスでプレビュー、クリックで詳細へ"}
      </p>
    </div>
  );
}
