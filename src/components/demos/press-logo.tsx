"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

// fictional outlets — wordmarks are drawn with type only
const PRESS = [
  { name: "週刊テックラボ", cls: "font-bold tracking-tight", quote: "「チームの仕事の流れを、静かに変えるツール」", date: "2026 年 8 月号" },
  { name: "KUMO JOURNAL", cls: "font-semibold uppercase tracking-[0.2em] text-[11px]", quote: "“A calm, focused take on project management.”", date: "2026.07.14" },
  { name: "デザイン新報", cls: "font-serif font-medium", quote: "「余白の使い方に、作り手の思想が出ている」", date: "2026 年 6 月 2 日" },
  { name: "nightly byte", cls: "font-mono lowercase", quote: "“The onboarding is the best we've seen this year.”", date: "2026.05.30" },
  { name: "Startup Field", cls: "font-serif italic", quote: "「国内 SaaS の注目株 10 選に選出」", date: "2026 年 4 月" },
];

export default function PressLogo() {
  const [active, setActive] = useState(0);
  const p = PRESS[active];

  return (
    <div className="mx-auto max-w-2xl space-y-4 text-center">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">掲載メディア</div>
      <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
        {PRESS.map((m, i) => (
          <li key={m.name}>
            <button
              type="button"
              aria-pressed={active === i}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className={cn(
                "rounded px-1.5 py-1 text-sm grayscale transition-opacity",
                m.cls,
                active === i ? "text-foreground opacity-100" : "text-muted-foreground opacity-60 hover:opacity-100",
              )}
            >
              {m.name}
            </button>
          </li>
        ))}
      </ul>
      <figure className="mx-auto max-w-md rounded-lg border bg-card px-4 py-3" aria-live="polite">
        <blockquote className="text-sm">{p.quote}</blockquote>
        <figcaption className="mt-1 text-xs text-muted-foreground">
          — {p.name}・{p.date}
        </figcaption>
      </figure>
      <p className="text-[11px] text-muted-foreground">※ 媒体名はすべて架空です</p>
    </div>
  );
}
