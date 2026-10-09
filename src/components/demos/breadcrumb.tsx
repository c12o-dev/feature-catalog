"use client";

import { useState } from "react";
import { ChevronRight, Home, MoreHorizontal } from "lucide-react";

const path = [
  { label: "ホーム", href: "#home", icon: Home },
  { label: "プロジェクト", href: "#projects" },
  { label: "デザインシステム", href: "#design-system" },
  { label: "コンポーネント", href: "#components" },
  { label: "ボタン", href: "#button" },
];

export default function Breadcrumb() {
  const [expanded, setExpanded] = useState(false);
  const [current, setCurrent] = useState(path.length - 1);
  const trail = path.slice(0, current + 1);
  const collapsible = !expanded && trail.length > 3;
  const visible = collapsible ? [trail[0], null, ...trail.slice(-2)] : trail;

  return (
    <div className="space-y-4">
      <nav aria-label="パンくずリスト">
        <ol className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm">
          {visible.map((p, i) => {
            const isLast = i === visible.length - 1;
            return (
              <li key={p ? p.href : "ellipsis"} className="flex min-w-0 items-center gap-1">
                {i > 0 && <ChevronRight aria-hidden className="size-3.5 shrink-0 text-muted-foreground" />}
                {p === null ? (
                  <button
                    type="button"
                    onClick={() => setExpanded(true)}
                    aria-label="省略された階層を表示"
                    className="grid size-6 place-items-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <MoreHorizontal className="size-4" />
                  </button>
                ) : isLast ? (
                  <span aria-current="page" className="max-w-[12rem] truncate rounded px-1.5 py-0.5 font-medium">
                    {p.label}
                  </span>
                ) : (
                  <a
                    href={p.href}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrent(path.indexOf(p));
                      setExpanded(false);
                    }}
                    className="flex items-center gap-1 rounded px-1.5 py-0.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {p.icon && <p.icon aria-hidden className="size-3.5" />}
                    <span className="truncate">{p.label}</span>
                  </a>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <div className="rounded-lg border bg-card p-4">
        <p className="text-xs text-muted-foreground">現在のページ</p>
        <p className="mt-1 text-sm font-medium">{path[current].label}</p>
        {current < path.length - 1 ? (
          <button
            type="button"
            onClick={() => {
              setCurrent(path.length - 1);
              setExpanded(false);
            }}
            className="mt-3 text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            最下層に戻る
          </button>
        ) : (
          <p className="mt-3 text-xs text-muted-foreground">リンクを押すとその階層へ移動します</p>
        )}
      </div>
    </div>
  );
}
