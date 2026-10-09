"use client";

const sections = ["はじめに", "インストール", "基本的な使い方", "高度な機能", "FAQ"];

export default function AnchorToc() {
  return (
    <div className="grid grid-cols-3 gap-4 h-48">
      <div className="col-span-2 rounded-md border bg-background p-3 text-xs space-y-2 overflow-y-auto">
        {sections.map((s) => (
          <div key={s}>
            <h3 className="font-semibold text-sm">{s}</h3>
            <p className="text-muted-foreground">セクション {s} の内容...</p>
          </div>
        ))}
      </div>
      <aside className="border-l pl-3">
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2">On this page</div>
        <ul className="space-y-1 text-xs">
          {sections.map((s, i) => (
            <li key={s}>
              <a className={`block hover:text-foreground cursor-pointer ${i === 1 ? "text-primary border-l-2 border-primary -ml-3 pl-3" : "text-muted-foreground"}`}>
                {s}
              </a>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
