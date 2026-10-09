"use client";

import { useEffect, useState } from "react";
import { Check, FileText, Loader2, RotateCcw, Sparkles, X } from "lucide-react";

type Chip = { id: string; label: string; result: string };

const chips: Chip[] = [
  { id: "summary", label: "この議事録を要約しますか？", result: "要約: 11 月リリースは 2 週間後ろ倒し。QA 体制を 2 名追加し、告知は 10/20 に確定。" },
  { id: "todo", label: "ToDo を 3 件作成しますか？", result: "「QA 増員の稟議」「告知文の下書き」「スケジュール共有」を ToDo に追加しました。" },
  { id: "invite", label: "欠席者に共有しますか？", result: "欠席の 2 名（森さん・石田さん）に議事録を共有しました。" },
];

export default function ProactiveChip() {
  const [visible, setVisible] = useState<string[]>(chips.map((c) => c.id));
  const [running, setRunning] = useState<string | null>(null);
  const [done, setDone] = useState<Chip | null>(null);

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => {
      setDone(chips.find((c) => c.id === running) ?? null);
      setVisible((v) => v.filter((x) => x !== running));
      setRunning(null);
    }, 900);
    return () => clearTimeout(t);
  }, [running]);

  const dismiss = (id: string) => setVisible((v) => v.filter((x) => x !== id));
  const reset = () => {
    setVisible(chips.map((c) => c.id));
    setDone(null);
  };

  return (
    <div className="mx-auto w-full max-w-lg rounded-lg border bg-card">
      <div className="flex items-center gap-2 border-b px-4 py-2.5 text-sm">
        <FileText className="size-4 text-muted-foreground" />
        <span className="font-medium">定例ミーティング 10/01</span>
        <span className="ml-auto text-xs text-muted-foreground">保存済み</span>
      </div>
      <div className="space-y-1.5 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
        <p>・11 月リリースは QA 期間を確保するため 2 週間後ろ倒し</p>
        <p>・QA 担当を 2 名追加（稟議は中村さん）</p>
        <p>・告知文は 10/20 までに確定</p>
      </div>

      <div className="border-t px-4 py-3">
        <div className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Sparkles className="size-3.5 text-primary" /> おすすめの次のアクション
        </div>
        <ul className="flex flex-wrap gap-2">
          {chips
            .filter((c) => visible.includes(c.id))
            .map((c) => (
              <li
                key={c.id}
                className="inline-flex items-center rounded-full border border-primary/30 bg-primary/5 text-xs text-foreground transition-colors hover:bg-primary/10"
              >
                <button
                  type="button"
                  disabled={!!running}
                  onClick={() => setRunning(c.id)}
                  className="inline-flex items-center gap-1.5 rounded-l-full py-1.5 pl-3 pr-1.5 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-60"
                >
                  {running === c.id ? <Loader2 className="size-3 motion-safe:animate-spin" /> : <Sparkles className="size-3 text-primary" />}
                  {c.label}
                </button>
                <button
                  type="button"
                  aria-label={`「${c.label}」の提案を閉じる`}
                  onClick={() => dismiss(c.id)}
                  className="mr-1 rounded-full p-1 text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  <X className="size-3" />
                </button>
              </li>
            ))}
          {visible.length === 0 && (
            <li>
              <button type="button" onClick={reset} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                <RotateCcw className="size-3" /> 提案をもう一度表示
              </button>
            </li>
          )}
        </ul>
        <div aria-live="polite">
          {done && (
            <div className="mt-3 flex items-start gap-2 rounded-md bg-muted/60 px-3 py-2 text-xs">
              <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <p>{done.result}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
