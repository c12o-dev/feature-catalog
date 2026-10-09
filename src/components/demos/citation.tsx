"use client";

import { ExternalLink } from "lucide-react";

const sources = [
  { i: 1, t: "Tailwind v4 docs", url: "tailwindcss.com" },
  { i: 2, t: "shadcn/ui v4 release", url: "ui.shadcn.com" },
  { i: 3, t: "Next.js 16 changelog", url: "nextjs.org/blog" },
];

export default function Citation() {
  return (
    <div className="space-y-3">
      <p className="text-sm leading-relaxed">
        Tailwind v4 は CSS-first な設定アプローチを採用 [<sup>1</sup>] し、shadcn/ui v4 もこれに対応 [<sup>2</sup>] している。Next.js 16 でも Turbopack が安定化された [<sup>3</sup>]。
      </p>
      <div className="rounded-md border bg-background p-3">
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2">Sources</div>
        <ol className="space-y-1 text-xs">
          {sources.map((s) => (
            <li key={s.i} className="flex items-start gap-1.5">
              <span className="text-muted-foreground tabular-nums">[{s.i}]</span>
              <a className="hover:underline cursor-pointer flex items-center gap-1 text-blue-600">
                {s.t} <ExternalLink className="size-3" />
              </a>
              <span className="text-muted-foreground">— {s.url}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
