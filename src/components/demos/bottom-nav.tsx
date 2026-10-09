"use client";

import { useState } from "react";
import { Bell, Home, Image as ImageIcon, PenLine, Plus, Search, User, X } from "lucide-react";

const tabs = [
  { id: "home", label: "ホーム", icon: Home },
  { id: "search", label: "検索", icon: Search },
  { id: "alerts", label: "通知", icon: Bell, badge: 3 },
  { id: "me", label: "マイページ", icon: User },
] as const;
type TabId = (typeof tabs)[number]["id"];

const content: Record<TabId, { title: string; rows: string[] }> = {
  home: { title: "ホーム", rows: ["今日のおすすめ: 秋の京都 3 選", "フォロー中の新着 12 件", "週末のイベント情報"] },
  search: { title: "検索", rows: ["最近の検索: 紅葉 見頃", "トレンド: #読書の秋", "トレンド: #新米"] },
  alerts: { title: "通知", rows: ["佐藤さんがあなたの投稿にいいね", "中村さんがフォローしました", "森さんがコメントしました"] },
  me: { title: "マイページ", rows: ["投稿 128 · フォロワー 2,340", "保存済み", "設定"] },
};

export default function BottomNav() {
  const [active, setActive] = useState<TabId>("home");
  const [compose, setCompose] = useState(false);
  const cur = content[active];
  const left = tabs.slice(0, 2);
  const right = tabs.slice(2);

  const renderTab = (t: (typeof tabs)[number]) => {
    const on = active === t.id;
    return (
      <button
        key={t.id}
        type="button"
        onClick={() => setActive(t.id)}
        aria-current={on ? "page" : undefined}
        className={`relative flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 ${
          on ? "text-primary" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <span className="relative">
          <t.icon className="size-5" strokeWidth={on ? 2.4 : 1.8} />
          {"badge" in t && t.badge > 0 && (
            <span className="absolute -right-2 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-white tabular-nums">
              {t.badge}
              <span className="sr-only">件の未読</span>
            </span>
          )}
        </span>
        <span className="max-w-full truncate text-[10px] font-medium">{t.label}</span>
      </button>
    );
  };

  return (
    <div className="relative mx-auto flex h-96 w-full max-w-xs flex-col overflow-hidden rounded-[1.75rem] border bg-background shadow-sm">
      <div className="border-b px-4 pb-2 pt-4 text-base font-semibold">{cur.title}</div>
      <ul className="flex-1 space-y-2 overflow-auto p-3">
        {cur.rows.map((r) => (
          <li key={r} className="rounded-lg border bg-card px-3 py-2.5 text-sm">{r}</li>
        ))}
      </ul>

      <nav aria-label="メイン" className="border-t bg-background/95 px-2 pb-3 pt-1.5">
        <div className="flex items-center">
          {left.map(renderTab)}
          <div className="flex flex-1 justify-center">
            <button
              type="button"
              aria-label="投稿を作成"
              aria-expanded={compose}
              onClick={() => setCompose(true)}
              className="grid size-11 place-items-center rounded-full bg-primary text-primary-foreground shadow-md outline-none transition-transform focus-visible:ring-2 focus-visible:ring-ring/50 active:scale-95"
            >
              <Plus className="size-5" />
            </button>
          </div>
          {right.map(renderTab)}
        </div>
      </nav>

      {compose && (
        <div className="absolute inset-0 z-10 flex flex-col justify-end bg-black/40" onClick={() => setCompose(false)}>
          <div
            role="dialog"
            aria-label="投稿を作成"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.key === "Escape" && setCompose(false)}
            className="rounded-t-2xl border-t bg-popover p-3 text-popover-foreground"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold">作成</span>
              <button type="button" aria-label="閉じる" onClick={() => setCompose(false)} className="rounded p-1 text-muted-foreground hover:text-foreground">
                <X className="size-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "テキスト", icon: PenLine },
                { label: "写真", icon: ImageIcon },
              ].map((a) => (
                <button
                  key={a.label}
                  type="button"
                  onClick={() => setCompose(false)}
                  className="flex flex-col items-center gap-1 rounded-lg border bg-card py-3 text-xs hover:bg-muted"
                >
                  <a.icon className="size-5 text-primary" />
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
