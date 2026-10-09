"use client";

import { useState } from "react";

const cats = ["すべて", "ライブ配信", "音楽", "ゲーム", "ニュース", "学習", "スポーツ", "コメディ", "料理"];

export default function JumpChips() {
  const [active, setActive] = useState("すべて");
  return (
    <div className="space-y-3">
      <div role="group" aria-label="カテゴリで絞り込み" className="-mx-2 overflow-x-auto px-2 pb-1 [scrollbar-width:thin]">
        <div className="flex w-max gap-1.5">
          {cats.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={active === c}
              onClick={(e) => { setActive(c); e.currentTarget.scrollIntoView({ block: "nearest", inline: "nearest" }); }}
              className={`rounded-full px-3 py-1.5 text-xs whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring ${active === c ? "bg-foreground text-background" : "bg-muted hover:bg-accent"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <p className="text-xs text-muted-foreground" aria-live="polite">「{active}」を表示中</p>
    </div>
  );
}
