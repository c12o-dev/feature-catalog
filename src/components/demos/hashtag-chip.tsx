"use client";

import { Fragment, useState } from "react";
import { ArrowLeft, Hash } from "lucide-react";

const POSTS = [
  { id: 1, user: "あおい", text: "朝の公園、紅葉が始まってた #秋散歩 #朝活" },
  { id: 2, user: "けんと", text: "今日は 5km だけ。涼しくて走りやすい #朝活 #ランニング" },
  { id: 3, user: "みさき", text: "栗ご飯を炊いた。皮むきが一番大変 #秋の味覚" },
  { id: 4, user: "りょう", text: "川沿いのイチョウ並木、来週が見頃かも #秋散歩" },
  { id: 5, user: "ゆい", text: "焼き芋の季節がきた #秋の味覚 #おやつ" },
  { id: 6, user: "そうた", text: "6 時起きが 1 週間続いた #朝活" },
];

const tagsOf = (t: string): string[] => t.match(/#[^\s#]+/g) ?? [];
const TRENDING = Object.entries(
  POSTS.flatMap((p) => tagsOf(p.text)).reduce<Record<string, number>>((acc, t) => ({ ...acc, [t]: (acc[t] ?? 0) + 1 }), {}),
).sort((a, b) => b[1] - a[1]);

export default function HashtagChip() {
  const [tag, setTag] = useState<string | null>(null);
  const posts = tag ? POSTS.filter((p) => tagsOf(p.text).includes(tag)) : POSTS;

  const tagLink = (t: string, key: number) => (
    <a
      key={key}
      href={`#tag-${encodeURIComponent(t.slice(1))}`}
      onClick={(e) => {
        e.preventDefault();
        setTag(t);
      }}
      className="font-medium text-sky-700 hover:underline dark:text-sky-400"
    >
      {t}
    </a>
  );

  return (
    <div className="mx-auto w-full max-w-md space-y-3">
      {tag ? (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTag(null)}
            aria-label="すべての投稿に戻る"
            className="grid size-7 place-items-center rounded-md border bg-background hover:bg-muted"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div>
            <div className="text-sm font-semibold">{tag}</div>
            <div className="text-xs text-muted-foreground tabular-nums">{posts.length} 件の投稿</div>
          </div>
        </div>
      ) : (
        <nav aria-label="トレンドのハッシュタグ">
          <ul className="flex flex-wrap gap-1.5">
            {TRENDING.map(([t, n]) => (
              <li key={t}>
                <button
                  type="button"
                  onClick={() => setTag(t)}
                  className="inline-flex items-center gap-1 rounded-full border bg-background px-2.5 py-1 text-xs hover:bg-muted"
                >
                  <Hash className="size-3 text-muted-foreground" aria-hidden />
                  {t.slice(1)}
                  <span className="text-muted-foreground tabular-nums">{n}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <ul className="divide-y rounded-lg border bg-card" aria-live="polite">
        {posts.map((p) => (
          <li key={p.id} className="flex gap-2.5 p-3">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-muted text-xs" aria-hidden>
              {p.user[0]}
            </span>
            <div className="min-w-0 text-sm">
              <div className="text-xs font-medium">{p.user}</div>
              <p className="leading-relaxed">
                {p.text.split(/(#[^\s#]+)/g).map((part, i) =>
                  part.startsWith("#") ? tagLink(part, i) : <Fragment key={i}>{part}</Fragment>,
                )}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
