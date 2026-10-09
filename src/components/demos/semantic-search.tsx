"use client";

import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";

// 概念軸: [課金, 検索, 共同編集, AI, 入力, 速度]
const AXES = ["課金", "検索", "共同編集", "AI", "入力", "速度"] as const;

const corpus: { t: string; vec: number[] }[] = [
  { t: "価格表ページの設計ガイド", vec: [0.9, 0, 0, 0, 0.1, 0] },
  { t: "サブスクの解約導線を見直す", vec: [0.8, 0, 0, 0, 0.2, 0] },
  { t: "コマンドパレットの実装", vec: [0, 0.8, 0, 0, 0.3, 0.2] },
  { t: "リアルタイム共同編集はどう動くか", vec: [0, 0, 0.9, 0, 0.2, 0.3] },
  { t: "生成 AI の回答をストリーミング表示する", vec: [0, 0, 0, 0.9, 0, 0.3] },
  { t: "フォーム入力をラクにする 10 の工夫", vec: [0.1, 0, 0, 0, 0.9, 0.1] },
  { t: "初期表示を 1 秒速くした話", vec: [0, 0.1, 0, 0, 0, 0.9] },
];

// クエリ語 → 概念軸（擬似的な埋め込み）
const LEXICON: [string, number][] = [
  ["お金", 0], ["支払", 0], ["払", 0], ["料金", 0], ["値段", 0], ["プラン", 0], ["課金", 0], ["購入", 0],
  ["探", 1], ["検索", 1], ["見つけ", 1], ["ジャンプ", 1],
  ["一緒", 2], ["同時", 2], ["共同", 2], ["チーム", 2], ["コラボ", 2],
  ["AI", 3], ["チャット", 3], ["生成", 3], ["要約", 3], ["LLM", 3],
  ["入力", 4], ["フォーム", 4], ["打", 4], ["記入", 4],
  ["速", 5], ["遅", 5], ["重", 5], ["待", 5], ["表示", 5],
];

function embed(q: string) {
  const v = new Array(AXES.length).fill(0);
  for (const [w, axis] of LEXICON) if (q.includes(w)) v[axis] += 1;
  return v;
}

function cosine(a: number[], b: number[]) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return na && nb ? dot / Math.sqrt(na * nb) : 0;
}

const SAMPLES = ["お金を払ってもらう画面", "みんなで同時に書きたい", "ページが重くて待たされる"];

export default function SemanticSearch() {
  const [q, setQ] = useState(SAMPLES[0]);
  const qv = useMemo(() => embed(q), [q]);
  const hasSignal = qv.some((x) => x > 0);
  const ranked = useMemo(
    () => corpus.map((c) => ({ ...c, s: cosine(qv, c.vec) })).sort((a, b) => b.s - a.s),
    [qv],
  );

  return (
    <div className="mx-auto w-full max-w-xl space-y-3">
      <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-ring">
        <Sparkles className="size-4 shrink-0 text-violet-600 dark:text-violet-400" aria-hidden />
        <input
          aria-label="意味で検索"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="min-w-0 flex-1 bg-transparent text-sm outline-none"
          placeholder="言いたいことを文章で入力"
        />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {SAMPLES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setQ(s)}
            aria-pressed={q === s}
            className="rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground hover:bg-muted aria-pressed:bg-muted aria-pressed:text-foreground"
          >
            {s}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground" aria-live="polite">
        {hasSignal
          ? `キーワードが一致しなくても、意味の近い順に並びます（上位: ${ranked[0].t}）`
          : "意味を読み取れませんでした。別の言い方を試してください"}
      </p>
      <ul className="space-y-1">
        {ranked.map((r) => {
          const pct = Math.round(r.s * 100);
          return (
            <li key={r.t} className="rounded-md border bg-background px-3 py-2">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className={pct < 20 ? "text-muted-foreground" : ""}>{r.t}</span>
                <span className="shrink-0 text-xs text-muted-foreground tabular-nums">{pct}%</span>
              </div>
              <div className="mt-1.5 h-1 rounded-full bg-muted">
                <div className="h-full rounded-full bg-violet-500 dark:bg-violet-400" style={{ width: `${pct}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
