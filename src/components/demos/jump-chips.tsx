"use client";

import { useState } from "react";

const cats = ["すべて", "ライブ配信", "音楽", "ゲーム", "ニュース", "学習", "スポーツ", "コメディ", "料理"];

export default function JumpChips() {
  const [active, setActive] = useState("すべて");
  return (
    <div className="overflow-x-auto -mx-2 px-2">
      <div className="flex gap-1.5 w-max">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`text-xs whitespace-nowrap rounded-full px-3 py-1.5 transition-colors ${active === c ? "bg-foreground text-background" : "bg-muted hover:bg-accent"}`}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
