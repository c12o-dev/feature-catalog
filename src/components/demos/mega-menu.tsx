"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const sections = {
  製品: [
    { title: "Pro", desc: "個人向け" }, { title: "Team", desc: "チーム向け" },
    { title: "Enterprise", desc: "企業向け" }, { title: "API", desc: "開発者向け" },
  ],
  ソリューション: [
    { title: "スタートアップ", desc: "シード〜A" }, { title: "エンタープライズ", desc: "大企業" },
    { title: "教育", desc: "学校・大学" }, { title: "非営利", desc: "NPO/NGO" },
  ],
  リソース: [
    { title: "ドキュメント" }, { title: "ブログ" }, { title: "コミュニティ" }, { title: "ステータス" },
  ],
};

export default function MegaMenu() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="relative">
      <nav className="flex gap-1 text-sm rounded-md border bg-background p-1 w-fit">
        {Object.keys(sections).map((s) => (
          <button
            key={s}
            onMouseEnter={() => setOpen(s)}
            onClick={() => setOpen(open === s ? null : s)}
            className={`px-3 py-1 rounded inline-flex items-center gap-1 ${open === s ? "bg-accent" : "hover:bg-accent"}`}
          >
            {s} <ChevronDown className="size-3" />
          </button>
        ))}
      </nav>
      {open && (
        <div onMouseLeave={() => setOpen(null)} className="absolute left-0 top-full mt-1 w-[28rem] rounded-md border bg-popover shadow-md p-3 grid grid-cols-2 gap-1 z-10">
          {sections[open as keyof typeof sections].map((it) => (
            <a key={it.title} className="rounded px-2 py-1.5 hover:bg-accent text-sm cursor-pointer">
              <div className="font-medium">{it.title}</div>
              {"desc" in it && <div className="text-xs text-muted-foreground">{it.desc}</div>}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
