"use client";

import { useEffect, useRef, useState } from "react";
import { Cloud, CloudOff, Loader2, RefreshCw, Wifi, WifiOff } from "lucide-react";

type State = "synced" | "syncing" | "offline";

function ago(sec: number) {
  if (sec < 60) return `${sec} 秒前`;
  return `${Math.floor(sec / 60)} 分前`;
}

export default function SyncIndicator() {
  const [state, setState] = useState<State>("synced");
  const [last, setLast] = useState(5);
  const [pending, setPending] = useState(0);
  const [text, setText] = useState("第 3 四半期の振り返り");
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // the "x 秒前" counter only runs while synced
  useEffect(() => {
    if (state !== "synced") return;
    const id = setInterval(() => setLast((l) => l + 1), 1000);
    return () => clearInterval(id);
  }, [state]);

  useEffect(() => () => {
    if (syncTimer.current) clearTimeout(syncTimer.current);
  }, []);

  const startSync = () => {
    setState("syncing");
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      setState("synced");
      setLast(0);
      setPending(0);
    }, 1200);
  };

  const onEdit = (v: string) => {
    setText(v);
    if (state === "offline") {
      setPending((p) => p + 1);
      return;
    }
    startSync();
  };

  const toggleOnline = () => {
    if (state === "offline") {
      startSync();
    } else {
      if (syncTimer.current) clearTimeout(syncTimer.current);
      setState("offline");
    }
  };

  return (
    <div className="mx-auto max-w-md overflow-hidden rounded-lg border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2">
        <span className="text-sm font-medium">メモ</span>
        <span role="status" aria-live="polite" className="sr-only">
          {state === "syncing" ? "同期中" : state === "synced" ? "同期しました" : "オフラインです。変更は端末に保存されます"}
        </span>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {state === "syncing" && (
            <>
              <Loader2 className="size-3.5 text-sky-600 motion-safe:animate-spin dark:text-sky-400" aria-hidden />
              同期中…
            </>
          )}
          {state === "synced" && (
            <>
              <Cloud className="size-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden />
              <span className="tabular-nums">{ago(last)}に同期</span>
            </>
          )}
          {state === "offline" && (
            <>
              <CloudOff className="size-3.5 text-amber-600 dark:text-amber-400" aria-hidden />
              オフライン{pending > 0 && <span className="tabular-nums">・未同期の変更 {pending} 件</span>}
            </>
          )}
        </div>
      </div>
      <textarea
        value={text}
        onChange={(e) => onEdit(e.target.value)}
        aria-label="メモ本文"
        rows={4}
        className="block w-full resize-none bg-transparent p-3 text-sm outline-none"
      />
      <div className="flex flex-wrap gap-2 border-t bg-muted/40 px-3 py-2">
        <button
          type="button"
          onClick={startSync}
          disabled={state !== "synced"}
          className="inline-flex items-center gap-1.5 rounded-md border bg-background px-2.5 py-1 text-xs hover:bg-muted disabled:opacity-50"
        >
          <RefreshCw className="size-3.5" aria-hidden />
          今すぐ同期
        </button>
        <button
          type="button"
          onClick={toggleOnline}
          aria-pressed={state === "offline"}
          className="inline-flex items-center gap-1.5 rounded-md border bg-background px-2.5 py-1 text-xs hover:bg-muted"
        >
          {state === "offline" ? <Wifi className="size-3.5" aria-hidden /> : <WifiOff className="size-3.5" aria-hidden />}
          {state === "offline" ? "オンラインに戻す" : "オフラインにする"}
        </button>
      </div>
    </div>
  );
}
