"use client";

import { useState } from "react";
import { BookOpen, Coffee, Mountain, Sparkles, Tent, Utensils, X, type LucideIcon } from "lucide-react";

type Item = { id: string; title: string; meta: string; reason: string; icon: LucideIcon };

const POOL: Item[] = [
  { id: "a", title: "週末に行ける低山ハイク 5 選", meta: "アウトドア · 6 分", reason: "「登山」をよく読んでいるため", icon: Mountain },
  { id: "b", title: "浅煎りコーヒーの淹れ方入門", meta: "フード · 4 分", reason: "保存した記事に似ています", icon: Coffee },
  { id: "c", title: "初めてのソロキャンプ装備リスト", meta: "アウトドア · 8 分", reason: "今週よく読まれています", icon: Tent },
  { id: "d", title: "10 分で作れる作り置きおかず", meta: "フード · 5 分", reason: "フォロー中の人が保存", icon: Utensils },
  { id: "e", title: "秋に読みたい短編小説ガイド", meta: "カルチャー · 7 分", reason: "最近の閲覧履歴から", icon: BookOpen },
];

export default function Recommendation() {
  const [hidden, setHidden] = useState<string[]>([]);
  const [opened, setOpened] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  const visible = POOL.filter((it) => !hidden.includes(it.id)).slice(0, 3);

  return (
    <div className="@container mx-auto w-full max-w-2xl space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 text-sm font-medium">
          <Sparkles className="size-4 text-primary" />
          あなたへのおすすめ
        </h3>
        {hidden.length > 0 && (
          <button
            type="button"
            className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
            onClick={() => {
              setHidden([]);
              setStatus("非表示にしたおすすめを元に戻しました");
            }}
          >
            元に戻す
          </button>
        )}
      </div>

      <ul className="grid grid-cols-1 gap-2 @[480px]:grid-cols-3">
        {visible.map((it) => {
          const Icon = it.icon;
          const isOpen = opened === it.id;
          return (
            <li key={it.id} className="group relative">
              <button
                type="button"
                onClick={() => {
                  setOpened(it.id);
                  setStatus(`「${it.title}」を開きました`);
                }}
                className="flex h-full w-full gap-3 rounded-lg border bg-card p-2.5 text-left transition-colors hover:border-foreground/25 hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none @[480px]:flex-col @[480px]:gap-2"
              >
                <span className="grid size-14 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground @[480px]:h-20 @[480px]:w-full">
                  <Icon className="size-6" />
                </span>
                <span className="min-w-0 flex-1 space-y-1 pr-5 @[480px]:pr-0">
                  <span className="line-clamp-2 block text-sm font-medium leading-snug">{it.title}</span>
                  <span className="block text-xs text-muted-foreground">{it.meta}</span>
                  <span className="block text-[11px] text-primary/80">
                    {isOpen ? "閲覧済み" : it.reason}
                  </span>
                </span>
              </button>
              <button
                type="button"
                aria-label={`「${it.title}」に興味なし`}
                onClick={() => {
                  setHidden((h) => [...h, it.id]);
                  setStatus(`「${it.title}」を非表示にしました。似たおすすめを減らします`);
                }}
                className="absolute top-1.5 right-1.5 grid size-6 place-items-center rounded-md bg-card/80 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            </li>
          );
        })}
      </ul>
      {visible.length === 0 && <p className="text-center text-xs text-muted-foreground">おすすめはここまでです</p>}

      <p aria-live="polite" className="min-h-4 text-xs text-muted-foreground">
        {status}
      </p>
    </div>
  );
}
