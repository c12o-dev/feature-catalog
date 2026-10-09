"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

type App = { id: string; name: string; scopes: string[]; lastUsed: string; color: string; risky?: boolean };

const apps: App[] = [
  { id: "flowline", name: "Flowline", scopes: ["プロフィール読取", "ワークフロー作成"], lastUsed: "2 日前", color: "bg-sky-500 dark:bg-sky-400" },
  { id: "chatter", name: "Chatterbox", scopes: ["メッセージ読取"], lastUsed: "今日", color: "bg-violet-500 dark:bg-violet-400" },
  { id: "legacy", name: "Legacy Sync", scopes: ["フルアクセス"], lastUsed: "214 日前", color: "bg-zinc-500 dark:bg-zinc-400", risky: true },
];

export default function AppPermissions() {
  const [list, setList] = useState(apps);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [undo, setUndo] = useState<{ app: App; index: number } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const revoke = (app: App) => {
    const index = list.findIndex((a) => a.id === app.id);
    setList((l) => l.filter((a) => a.id !== app.id));
    setConfirmId(null);
    setUndo({ app, index });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setUndo(null), 6000);
  };

  const restore = () => {
    if (!undo) return;
    const { app, index } = undo;
    setList((l) => { const n = [...l]; n.splice(Math.min(index, n.length), 0, app); return n; });
    setUndo(null);
    if (timer.current) clearTimeout(timer.current);
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-3">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-medium">連携中のアプリ</h3>
        <span className="text-xs text-muted-foreground tabular-nums">{list.length} 件</span>
      </div>
      <ul className="space-y-2">
        {list.map((a) => (
          <li key={a.id} className={`rounded-lg border bg-card p-3 ${a.risky ? "border-amber-500/60 dark:border-amber-400/50" : ""}`}>
            <div className="flex items-start gap-3">
              <div aria-hidden className={`grid size-9 shrink-0 place-items-center rounded-md text-sm font-medium text-white dark:text-zinc-950 ${a.color}`}>{a.name[0]}</div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 text-sm font-medium">
                  {a.name}
                  {a.risky && (
                    <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-1.5 py-0.5 text-[11px] font-normal text-amber-700 dark:text-amber-300">
                      <AlertTriangle className="size-3" aria-hidden />長期間未使用
                    </span>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {a.scopes.map((s) => <span key={s} className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">{s}</span>)}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">最終利用: {a.lastUsed}</div>
              </div>
              {confirmId !== a.id && (
                <Button size="sm" variant="outline" onClick={() => setConfirmId(a.id)} aria-label={`${a.name} のアクセスを解除`}>解除</Button>
              )}
            </div>
            {confirmId === a.id && (
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-md bg-muted/60 p-2">
                <span className="text-xs">{a.name} はデータにアクセスできなくなります。</span>
                <div className="flex gap-1.5">
                  <Button size="sm" variant="ghost" onClick={() => setConfirmId(null)}>キャンセル</Button>
                  <Button size="sm" variant="destructive" onClick={() => revoke(a)}>アクセスを解除</Button>
                </div>
              </div>
            )}
          </li>
        ))}
        {list.length === 0 && <li className="rounded-lg border border-dashed p-6 text-center text-xs text-muted-foreground">連携中のアプリはありません</li>}
      </ul>
      <div aria-live="polite" className="min-h-9">
        {undo && (
          <div className="flex items-center justify-between gap-2 rounded-md border bg-popover px-3 py-2 text-xs shadow-sm">
            <span>{undo.app.name} の連携を解除しました</span>
            <Button size="xs" variant="ghost" onClick={restore}>元に戻す</Button>
          </div>
        )}
      </div>
    </div>
  );
}
