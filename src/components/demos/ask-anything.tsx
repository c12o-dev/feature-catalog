"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { ArrowUp, FileText, Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Answer = { text: string; sources: string[] };

const ANSWERS: Record<string, Answer> = {
  "先週デプロイされた変更は？": {
    text: "9/22〜9/28 に本番へ 4 件デプロイされました。主な変更は検索インデックスの再構築（9/24）と、決済画面のバリデーション修正（9/26）です。",
    sources: ["デプロイ履歴 #482", "リリースノート 9月第4週"],
  },
  "アクティブユーザーが多い時間帯は？": {
    text: "平日は 21〜23 時が最も多く、ピークは 22 時台（平均 1,240 人）です。週末は 10 時台にも山があります。",
    sources: ["分析ダッシュボード: 時間帯別 DAU"],
  },
  "課金エラーの原因トップ 3": {
    text: "直近 30 日では ①カードの有効期限切れ（41%）②3D セキュア認証の離脱（27%）③残高不足（18%）の順です。",
    sources: ["決済ログ集計", "サポートチケット #1203"],
  },
};

const FALLBACK = (q: string): Answer => ({
  text: `「${q}」に関連するドキュメントを 3 件見つけました。より具体的な期間や指標を含めると、精度の高い回答を返せます。`,
  sources: ["社内 Wiki 検索結果"],
});

export default function AskAnything() {
  const reduce = useReducedMotion();
  const [q, setQ] = useState("");
  const [asked, setAsked] = useState<string | null>(null);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [shown, setShown] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const id = useId();

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  const ask = (text: string) => {
    const query = text.trim();
    if (!query) return;
    if (timer.current) clearInterval(timer.current);
    const a = ANSWERS[query] ?? FALLBACK(query);
    setAsked(query);
    setAnswer(a);
    setQ("");
    if (reduce) {
      setShown(a.text.length);
      return;
    }
    setShown(0);
    let n = 0;
    timer.current = setInterval(() => {
      n = Math.min(n + 2, a.text.length);
      setShown(n);
      if (n >= a.text.length && timer.current) clearInterval(timer.current);
    }, 30);
  };

  const done = answer ? shown >= answer.text.length : false;

  return (
    <div className="mx-auto w-full max-w-lg space-y-3 rounded-lg border bg-card p-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(q);
        }}
        className="flex items-center gap-2 rounded-md border bg-background px-3 py-1.5 focus-within:ring-2 focus-within:ring-ring/40"
      >
        <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        <label htmlFor={id} className="sr-only">
          自然言語で質問
        </label>
        <input
          id={id}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.nativeEvent.isComposing) e.preventDefault();
          }}
          placeholder="なんでも聞いてください…"
          className="min-w-0 flex-1 bg-transparent py-1 text-sm outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          disabled={!q.trim()}
          aria-label="質問を送信"
          className="grid size-7 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground disabled:opacity-40"
        >
          <ArrowUp className="size-4" />
        </button>
      </form>

      {!asked && (
        <div className="space-y-1">
          <div className="px-1 text-xs text-muted-foreground">例えば</div>
          {Object.keys(ANSWERS).map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => ask(e)}
              className="block w-full rounded-md px-2 py-1.5 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {e}
            </button>
          ))}
        </div>
      )}

      {asked && answer && (
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">
            質問: <span className="text-foreground">{asked}</span>
          </div>
          <div className="rounded-md bg-muted/50 p-3" aria-live="polite" aria-busy={!done}>
            <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium">
              <Sparkles className="size-3.5 text-violet-600 dark:text-violet-400" aria-hidden />
              回答
            </div>
            <p className="text-sm leading-relaxed">
              {answer.text.slice(0, shown)}
              {!done && <span className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 animate-pulse bg-foreground/60" aria-hidden />}
            </p>
            <ul className={cn("mt-2 flex flex-wrap gap-1.5 transition-opacity", done ? "opacity-100" : "opacity-0")}>
              {answer.sources.map((s) => (
                <li key={s} className="inline-flex items-center gap-1 rounded border bg-background px-1.5 py-0.5 text-[11px] text-muted-foreground">
                  <FileText className="size-3" aria-hidden />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <button
            type="button"
            onClick={() => {
              setAsked(null);
              setAnswer(null);
            }}
            className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            別の質問をする
          </button>
        </div>
      )}
    </div>
  );
}
