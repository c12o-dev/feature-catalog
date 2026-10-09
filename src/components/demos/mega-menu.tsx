"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, Building2, ChevronDown, Code2, GraduationCap, HeartHandshake, MessagesSquare, Activity, Rocket, User, Users, Newspaper } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Item = { title: string; desc: string; icon: LucideIcon };

const sections: Record<string, { items: Item[]; feature: string }> = {
  製品: {
    feature: "新しい Team プランで、共有ワークスペースが無制限に。",
    items: [
      { title: "Pro", desc: "個人のための全機能", icon: User },
      { title: "Team", desc: "最大 50 人で共同編集", icon: Users },
      { title: "Enterprise", desc: "SSO・監査ログ・SLA", icon: Building2 },
      { title: "API", desc: "REST と Webhook", icon: Code2 },
    ],
  },
  ソリューション: {
    feature: "導入事例: 架空の書店チェーン「ほしの書房」が在庫管理を一本化。",
    items: [
      { title: "スタートアップ", desc: "シード〜シリーズ A", icon: Rocket },
      { title: "大企業", desc: "部門横断の運用", icon: Building2 },
      { title: "教育", desc: "学校・大学向け割引", icon: GraduationCap },
      { title: "非営利団体", desc: "NPO / NGO 無償枠", icon: HeartHandshake },
    ],
  },
  リソース: {
    feature: "10 月のアップデートまとめを公開しました。",
    items: [
      { title: "ドキュメント", desc: "ガイドと API リファレンス", icon: BookOpen },
      { title: "ブログ", desc: "製品ニュースと Tips", icon: Newspaper },
      { title: "コミュニティ", desc: "質問と情報交換", icon: MessagesSquare },
      { title: "ステータス", desc: "稼働状況", icon: Activity },
    ],
  },
};
const keys = Object.keys(sections);

export default function MegaMenu() {
  const [open, setOpen] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && open) {
      const k = open;
      setOpen(null);
      triggerRefs.current[k]?.focus();
    }
  };

  return (
    <div ref={rootRef} onKeyDown={onKeyDown} onMouseLeave={() => setOpen(null)} className="min-h-72">
      <div className="relative">
      <div className="flex items-center justify-between gap-2 rounded-lg border bg-background px-3 py-2">
        <span className="text-sm font-semibold">Kumo</span>
        <nav aria-label="メイン" className="flex gap-0.5 text-sm">
          {keys.map((s) => (
            <button
              key={s}
              ref={(el) => { triggerRefs.current[s] = el; }}
              type="button"
              aria-expanded={open === s}
              aria-controls="mega-panel"
              onMouseEnter={() => setOpen(s)}
              onClick={() => setOpen(open === s ? null : s)}
              className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs sm:text-sm ${open === s ? "bg-accent" : "hover:bg-accent"}`}
            >
              {s}
              <ChevronDown aria-hidden className={`size-3 transition-transform ${open === s ? "rotate-180" : ""}`} />
            </button>
          ))}
        </nav>
      </div>
      {open && (
        <div id="mega-panel" className="absolute inset-x-0 top-full z-10 mt-1 rounded-lg border bg-popover p-2 text-popover-foreground shadow-lg">
          <ul className="grid grid-cols-1 gap-0.5 sm:grid-cols-2">
            {sections[open].items.map((it) => (
              <li key={it.title}>
                <a
                  href={`#${it.title}`}
                  onClick={(e) => { e.preventDefault(); setPicked(`${open} › ${it.title}`); setOpen(null); }}
                  className="flex items-start gap-3 rounded-md p-2 hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-md border bg-background">
                    <it.icon aria-hidden className="size-4 text-muted-foreground" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium">{it.title}</span>
                    <span className="block text-xs text-muted-foreground">{it.desc}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-2 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">{sections[open].feature}</div>
        </div>
      )}
      </div>
      <p aria-live="polite" className="mt-3 text-xs text-muted-foreground">
        {picked ? `選択: ${picked}` : "メニューにカーソルを合わせるか、クリックして開きます（Esc で閉じる）"}
      </p>
    </div>
  );
}
