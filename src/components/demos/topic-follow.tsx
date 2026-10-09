"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const TOPICS = [
  { name: "TypeScript", followers: 18200 },
  { name: "React", followers: 24100 },
  { name: "生成 AI", followers: 31800 },
  { name: "デザイン", followers: 12900 },
  { name: "プロダクト", followers: 9400 },
  { name: "キャリア", followers: 15600 },
  { name: "スタートアップ", followers: 7300 },
];

const FEED: Record<string, string[]> = {
  TypeScript: ["satisfies 演算子の使いどころ"],
  React: ["Server Components とキャッシュの関係"],
  "生成 AI": ["社内文書検索に RAG を入れて分かったこと"],
  デザイン: ["余白の 8pt グリッドをやめた理由"],
  プロダクト: ["指標を 1 つに絞ったら意思決定が速くなった"],
  キャリア: ["30 代でマネージャーから IC に戻る"],
  スタートアップ: ["シード期の採用で最初に見るポイント"],
};

const fmt = (n: number) => (n >= 10000 ? `${(n / 10000).toFixed(1)}万` : n.toLocaleString("ja-JP"));

export default function TopicFollow() {
  const [follow, setFollow] = useState<string[]>(["React", "生成 AI"]);
  const [msg, setMsg] = useState("");
  const toggle = (n: string) => {
    const on = !follow.includes(n);
    setFollow((f) => (on ? [...f, n] : f.filter((x) => x !== n)));
    setMsg(on ? `${n} をフォローしました` : `${n} のフォローを解除しました`);
  };
  const feed = follow.flatMap((t) => FEED[t].map((title) => ({ t, title })));

  return (
    <div className="mx-auto w-full max-w-md space-y-3">
      <div>
        <div className="text-sm font-medium">興味のあるトピック</div>
        <div className="text-xs text-muted-foreground tabular-nums">{follow.length} 件フォロー中 · 新着がホームに届きます</div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {TOPICS.map((tp) => {
          const on = follow.includes(tp.name);
          return (
            <button
              key={tp.name}
              type="button"
              onClick={() => toggle(tp.name)}
              aria-pressed={on}
              title={`${fmt(tp.followers + (on ? 1 : 0))} 人がフォロー`}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs transition-colors",
                on ? "border-foreground bg-foreground text-background" : "bg-background hover:bg-muted",
              )}
            >
              {on ? <Check className="size-3" aria-hidden /> : <Plus className="size-3" aria-hidden />}
              {tp.name}
            </button>
          );
        })}
      </div>
      <div className="rounded-lg border bg-card">
        <div className="border-b px-3 py-2 text-xs font-medium">あなたのフィード</div>
        <ul className="divide-y">
          {feed.map((f) => (
            <li key={f.title} className="px-3 py-2">
              <div className="text-[11px] text-muted-foreground">{f.t}</div>
              <div className="text-sm">{f.title}</div>
            </li>
          ))}
          {feed.length === 0 && <li className="px-3 py-4 text-center text-xs text-muted-foreground">トピックをフォローすると記事が表示されます</li>}
        </ul>
      </div>
      <p className="sr-only" aria-live="polite">
        {msg}
      </p>
    </div>
  );
}
