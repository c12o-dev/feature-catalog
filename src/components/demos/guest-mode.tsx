"use client";

import { useState } from "react";
import { ArrowRight, Lock, Plus, Share2, UserCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Mode = "landing" | "guest" | "member";

export default function GuestMode() {
  const [mode, setMode] = useState<Mode>("landing");
  const [items, setItems] = useState<string[]>(["牛乳を買う"]);
  const [draft, setDraft] = useState("");
  const [gate, setGate] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  const add = () => {
    const t = draft.trim();
    if (!t) return;
    setItems((x) => [...x, t]);
    setDraft("");
  };

  const restricted = (feature: string) => {
    if (mode === "member") {
      setStatus(`${feature}しました`);
      return;
    }
    setGate(feature);
  };

  const register = () => {
    setGate(null);
    setMode("member");
    setStatus(`登録しました。ゲスト中の ${items.length} 件はアカウントに引き継がれています`);
  };

  if (mode === "landing") {
    return (
      <div className="mx-auto w-full max-w-sm space-y-3 rounded-lg border bg-card p-5 text-center">
        <div className="text-sm font-semibold">Tsumugi Todo</div>
        <p className="text-xs text-muted-foreground">やることを、ひとつの場所に。</p>
        <Button className="w-full" onClick={register}>
          サインイン / 登録
        </Button>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          または
          <div className="h-px flex-1 bg-border" />
        </div>
        <button
          type="button"
          onClick={() => {
            setMode("guest");
            setStatus("ゲストとして開始しました");
          }}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <UserCircle2 className="size-4" aria-hidden />
          登録せずに試す
          <ArrowRight className="size-3" aria-hidden />
        </button>
      </div>
    );
  }

  return (
    <div className="relative mx-auto min-h-[300px] w-full max-w-md overflow-hidden rounded-lg border bg-card">
      {mode === "guest" ? (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          <span>ゲストモード · データはこのタブを閉じると消えます</span>
          <button type="button" onClick={() => setGate("保存")} className="font-medium underline underline-offset-2">
            登録して保存
          </button>
        </div>
      ) : (
        <div className="border-b px-3 py-2 text-xs text-muted-foreground">misaki@example.com でログイン中</div>
      )}

      <div className="space-y-3 p-3">
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            add();
          }}
        >
          <input
            aria-label="新しいタスク"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="タスクを追加"
            className="min-w-0 flex-1 rounded-md border bg-background px-2.5 py-1.5 text-sm"
          />
          <Button type="submit" size="icon-sm" aria-label="追加">
            <Plus />
          </Button>
        </form>
        <ul className="divide-y rounded-md border text-sm">
          {items.map((t, i) => (
            <li key={`${t}-${i}`} className="px-2.5 py-2">
              {t}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => restricted("保存")}>
            {mode === "guest" && <Lock className="size-3" aria-hidden />}
            保存
          </Button>
          <Button size="sm" variant="outline" onClick={() => restricted("共有リンクを作成")}>
            {mode === "guest" ? <Lock className="size-3" aria-hidden /> : <Share2 className="size-3" aria-hidden />}
            共有
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="ml-auto"
            onClick={() => {
              setMode("landing");
              setItems(["牛乳を買う"]);
              setStatus("");
            }}
          >
            最初から
          </Button>
        </div>
        <p aria-live="polite" className="min-h-4 text-xs text-muted-foreground">
          {status}
        </p>
      </div>

      {gate && (
        <div className="absolute inset-0 grid place-items-center bg-black/40 p-4" onKeyDown={(e) => e.key === "Escape" && setGate(null)}>
          <div role="dialog" aria-modal="true" aria-labelledby="gm-gate" className="w-full max-w-xs rounded-lg border bg-popover p-4 text-popover-foreground shadow-lg">
            <div className="flex items-start justify-between gap-2">
              <h3 id="gm-gate" className="text-sm font-semibold">
                {gate}するには登録が必要です
              </h3>
              <button type="button" aria-label="閉じる" onClick={() => setGate(null)} className="-m-1 rounded p-1 text-muted-foreground hover:bg-muted">
                <X className="size-3.5" />
              </button>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              今の {items.length} 件のタスクはそのまま引き継がれます。登録は 30 秒で終わります。
            </p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" className="flex-1" onClick={register} autoFocus>
                無料で登録
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setGate(null)}>
                あとで
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
