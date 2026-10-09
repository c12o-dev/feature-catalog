"use client";

import { useId, useMemo, useState } from "react";
import { Search, FileText, ChevronRight, Rocket, UserRound, CreditCard, Code2, X } from "lucide-react";
import { cn } from "@/lib/utils";

const cats = [
  { id: "start", name: "始め方", icon: Rocket },
  { id: "account", name: "アカウント", icon: UserRound },
  { id: "billing", name: "課金", icon: CreditCard },
  { id: "api", name: "API", icon: Code2 },
] as const;

type CatId = (typeof cats)[number]["id"];

const articles: { cat: CatId; title: string; excerpt: string }[] = [
  { cat: "start", title: "ワークスペースを作成する", excerpt: "最初のプロジェクトとメンバー招待までの手順。" },
  { cat: "start", title: "データをインポートする", excerpt: "CSV やスプレッドシートから一括で取り込む方法。" },
  { cat: "start", title: "通知の初期設定", excerpt: "メール・プッシュ通知の受け取り方を選ぶ。" },
  { cat: "account", title: "パスワードを再設定する", excerpt: "ログインできないときのリセット手順。" },
  { cat: "account", title: "二段階認証を有効にする", excerpt: "認証アプリを使ってアカウントを保護する。" },
  { cat: "account", title: "メールアドレスを変更する", excerpt: "確認メールを経由して新しいアドレスへ切り替える。" },
  { cat: "billing", title: "請求書をダウンロードする", excerpt: "過去の請求書を PDF で取得する。" },
  { cat: "billing", title: "プランを変更する", excerpt: "アップグレード・ダウングレード時の日割り計算。" },
  { cat: "billing", title: "支払い方法を更新する", excerpt: "クレジットカードの追加と削除。" },
  { cat: "api", title: "API キーを発行する", excerpt: "スコープを絞ったキーの作成とローテーション。" },
  { cat: "api", title: "レート制限について", excerpt: "429 が返ったときの再試行の考え方。" },
  { cat: "api", title: "Webhook の署名を検証する", excerpt: "リクエストヘッダの署名で改ざんを防ぐ。" },
];

function highlight(text: string, q: string) {
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-sm bg-amber-200/70 px-0.5 text-foreground dark:bg-amber-400/30">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

export default function KnowledgeBase() {
  const id = useId();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<CatId | null>(null);
  const query = q.trim();

  const results = useMemo(
    () =>
      articles.filter(
        (a) =>
          (!cat || a.cat === cat) &&
          (!query || (a.title + a.excerpt).toLowerCase().includes(query.toLowerCase())),
      ),
    [cat, query],
  );

  const catName = cats.find((c) => c.id === cat)?.name;

  return (
    <div className="w-full max-w-lg space-y-3">
      <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-ring/50">
        <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        <label htmlFor={`${id}-q`} className="sr-only">ヘルプ記事を検索</label>
        <input
          id={`${id}-q`}
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="例: パスワード、請求書"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        {q && (
          <button type="button" onClick={() => setQ("")} aria-label="検索語を消去" className="rounded p-0.5 text-muted-foreground hover:text-foreground">
            <X className="size-3.5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="カテゴリ">
        {cats.map((c) => {
          const n = articles.filter((a) => a.cat === c.id).length;
          const active = cat === c.id;
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={active}
              onClick={() => setCat(active ? null : c.id)}
              className={cn(
                "rounded-md border p-2.5 text-left transition-colors",
                active ? "border-primary bg-primary/5" : "bg-card hover:bg-muted",
              )}
            >
              <c.icon className={cn("mb-1 size-4", active ? "text-primary" : "text-muted-foreground")} aria-hidden />
              <div className="text-sm font-medium">{c.name}</div>
              <div className="text-xs text-muted-foreground tabular-nums">{n} 記事</div>
            </button>
          );
        })}
      </div>

      <div className="rounded-md border bg-card">
        <div className="flex items-center justify-between border-b px-3 py-2 text-xs text-muted-foreground">
          <span aria-live="polite" className="tabular-nums">
            {catName ? `${catName} · ` : ""}
            {results.length} 件
          </span>
          {(cat || query) && (
            <button type="button" onClick={() => { setCat(null); setQ(""); }} className="hover:text-foreground">
              条件をクリア
            </button>
          )}
        </div>
        {results.length === 0 ? (
          <div className="px-3 py-6 text-center text-sm text-muted-foreground">
            「{query}」に一致する記事はありません
          </div>
        ) : (
          <ul className="max-h-56 divide-y overflow-y-auto">
            {results.map((a) => (
              <li key={a.title}>
                <a href="#" onClick={(e) => e.preventDefault()} className="flex items-start gap-2 px-3 py-2 hover:bg-muted focus-visible:bg-muted focus-visible:outline-none">
                  <FileText className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{highlight(a.title, query)}</span>
                    <span className="block truncate text-xs text-muted-foreground">{highlight(a.excerpt, query)}</span>
                  </span>
                  <ChevronRight className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
