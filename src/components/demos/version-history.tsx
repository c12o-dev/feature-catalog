"use client";

import { useState } from "react";
import { History, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Version = { n: number; time: string; who: string; title: string; body: string; note?: string };

const INITIAL: Version[] = [
  { n: 12, time: "9:02", who: "あなた", title: "秋のキャンペーン告知", body: "10/15 から全商品 15% オフ。会員は送料無料。" },
  { n: 11, time: "8:40", who: "高橋", title: "秋のキャンペーン告知", body: "10/15 から全商品 10% オフ。会員は送料無料。" },
  { n: 10, time: "昨日 17:42", who: "あなた", title: "秋のキャンペーン（案）", body: "10 月中旬から一部商品を値下げ予定。" },
  { n: 9, time: "9/28", who: "佐藤", title: "キャンペーン案メモ", body: "時期と割引率は未定。" },
];

export default function VersionHistory() {
  const [versions, setVersions] = useState(INITIAL);
  const [selected, setSelected] = useState(INITIAL[0].n);
  const [message, setMessage] = useState("");
  const current = versions[0];
  const sel = versions.find((v) => v.n === selected) ?? current;

  const restore = () => {
    // Restoring never deletes history: it creates a new version with the old content.
    const next: Version = { ...sel, n: current.n + 1, time: "たった今", who: "あなた", note: `v${sel.n} から復元` };
    setVersions((vs) => [next, ...vs]);
    setSelected(next.n);
    setMessage(`v${sel.n} の内容を v${next.n} として復元しました`);
  };

  return (
    <div className="@container w-full overflow-hidden rounded-lg border bg-card">
      <div className="flex items-center gap-1.5 border-b px-3 py-2 text-sm font-medium">
        <History className="size-4" aria-hidden />
        バージョン履歴
      </div>
      <div className="grid @lg:grid-cols-[13rem_1fr]">
        <ul className="max-h-60 divide-y overflow-y-auto border-b @lg:max-h-none @lg:border-b-0 @lg:border-r" aria-label="バージョン一覧">
          {versions.map((v, i) => (
            <li key={v.n}>
              <button
                type="button"
                onClick={() => setSelected(v.n)}
                aria-current={selected === v.n ? "true" : undefined}
                className={cn("flex w-full flex-col items-start px-3 py-2 text-left hover:bg-muted", selected === v.n && "bg-muted")}
              >
                <span className="flex w-full items-center gap-2 text-sm">
                  <span className="font-medium tabular-nums">v{v.n}</span>
                  {i === 0 && <span className="rounded bg-primary px-1.5 py-px text-[10px] text-primary-foreground">現在</span>}
                </span>
                <span className="text-xs text-muted-foreground">
                  {v.time} · {v.who}
                  {v.note && ` · ${v.note}`}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div className="flex min-w-0 flex-col gap-3 p-3">
          <div className="text-xs text-muted-foreground">v{sel.n} のプレビュー</div>
          <div className="rounded-md border bg-background p-3">
            <div className="text-sm font-medium">{sel.title}</div>
            <p className="mt-1 text-sm text-muted-foreground">{sel.body}</p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground" aria-live="polite">
              {message}
            </p>
            <Button size="sm" variant="outline" onClick={restore} disabled={sel.n === current.n}>
              <RotateCcw />
              このバージョンを復元
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
