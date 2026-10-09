"use client";

import { useState } from "react";
import { Check, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";

// 背景は白文字で 4.5:1 以上になる 700 番台を使用
const items = [
  { id: "pass", label: "成功", icon: Check, count: 42, bg: "bg-emerald-700", pattern: {} },
  {
    id: "warn",
    label: "警告",
    icon: TriangleAlert,
    count: 11,
    bg: "bg-amber-700",
    pattern: { backgroundImage: "repeating-linear-gradient(45deg, rgb(255 255 255 / 0.35) 0 2px, transparent 2px 7px)" },
  },
  {
    id: "fail",
    label: "失敗",
    icon: X,
    count: 7,
    bg: "bg-red-700",
    pattern: {
      backgroundImage: "radial-gradient(rgb(255 255 255 / 0.5) 1.2px, transparent 1.5px)",
      backgroundSize: "6px 6px",
    },
  },
];

const total = items.reduce((s, i) => s + i.count, 0);

export default function ColorblindPattern() {
  const [gray, setGray] = useState(false);

  return (
    <div className="mx-auto w-full max-w-md space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium">テスト結果 · {total} 件</p>
        <button
          type="button"
          aria-pressed={gray}
          onClick={() => setGray((v) => !v)}
          className={cn(
            "rounded-md border px-2.5 py-1 text-xs transition-colors",
            gray ? "bg-foreground text-background" : "bg-background text-muted-foreground hover:bg-muted",
          )}
        >
          色なしで確認
        </button>
      </div>

      <div className={cn("space-y-4 transition-[filter] duration-300", gray && "grayscale")}>
        <ul className="flex flex-wrap gap-2">
          {items.map((it) => (
            <li
              key={it.id}
              className={cn("flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm text-white", it.bg)}
            >
              <it.icon className="size-3.5" aria-hidden />
              {it.label}
              <span className="tabular-nums">{it.count}</span>
            </li>
          ))}
        </ul>

        <div
          role="img"
          aria-label={items.map((i) => `${i.label} ${i.count} 件`).join("、")}
          className="flex h-6 overflow-hidden rounded-md"
        >
          {items.map((it) => (
            <div
              key={it.id}
              className={cn("h-full border-r-2 border-background last:border-r-0", it.bg)}
              style={{ width: `${(it.count / total) * 100}%`, ...it.pattern }}
            />
          ))}
        </div>

        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {items.map((it) => (
            <li key={it.id} className="flex items-center gap-1.5">
              <span
                aria-hidden
                className={cn("size-3 rounded-sm", it.bg)}
                style={it.pattern}
              />
              {it.label} ({it.id === "pass" ? "塗り" : it.id === "warn" ? "斜線" : "点"})
            </li>
          ))}
        </ul>
      </div>
      <p className="text-xs text-muted-foreground">色に加えてアイコン・模様・ラベルでも区別できます。</p>
    </div>
  );
}
