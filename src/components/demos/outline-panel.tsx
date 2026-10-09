"use client";

const sections = [
  { lvl: 1, t: "1. はじめに" },
  { lvl: 2, t: "1.1 背景" },
  { lvl: 2, t: "1.2 目的" },
  { lvl: 1, t: "2. 設計" },
  { lvl: 2, t: "2.1 全体像" },
  { lvl: 3, t: "2.1.1 データフロー" },
  { lvl: 3, t: "2.1.2 セキュリティ" },
  { lvl: 2, t: "2.2 詳細" },
  { lvl: 1, t: "3. 実装" },
];

export default function OutlinePanel() {
  return (
    <aside className="rounded-md border bg-background p-3 max-w-xs">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2">アウトライン</div>
      <ul className="space-y-0.5 text-sm">
        {sections.map((s, i) => (
          <li key={i} style={{ paddingLeft: (s.lvl - 1) * 12 }}>
            <a className={`block hover:text-foreground cursor-pointer ${s.lvl === 1 ? "font-medium" : "text-muted-foreground"}`}>{s.t}</a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
