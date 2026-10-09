"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { CloudOff, Wifi, WifiOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

function subscribe(cb: () => void) {
  window.addEventListener("online", cb);
  window.addEventListener("offline", cb);
  return () => {
    window.removeEventListener("online", cb);
    window.removeEventListener("offline", cb);
  };
}

export default function OfflineBanner() {
  // navigator.onLine + online/offline events; the server snapshot assumes online.
  const networkOnline = useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
  const [simulateOffline, setSimulateOffline] = useState(false);
  const online = networkOnline && !simulateOffline;

  const [justBack, setJustBack] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flashRef = useRef<() => void>(() => {});

  useEffect(() => {
    const flash = () => {
      setJustBack(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setJustBack(false), 2500);
    };
    flashRef.current = flash;
    window.addEventListener("online", flash);
    return () => {
      window.removeEventListener("online", flash);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
  const pending = online ? 0 : 2;

  return (
    <div className="mx-auto w-full max-w-md space-y-3">
      <div className="overflow-hidden rounded-lg border bg-card">
        <div role="status" aria-live="polite">
          {!online && (
            <div className="flex items-start gap-2 bg-zinc-900 px-3 py-2 text-xs text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900">
              <WifiOff className="mt-px size-3.5 shrink-0" aria-hidden />
              <span>オフラインです。変更はこの端末に保存され、接続が戻ると同期します。</span>
            </div>
          )}
          {online && justBack && (
            <div className="flex items-center gap-2 bg-emerald-600 px-3 py-2 text-xs text-white dark:bg-emerald-500 dark:text-emerald-950">
              <Wifi className="size-3.5 shrink-0" aria-hidden />
              オンラインに戻りました。同期しています…
            </div>
          )}
        </div>
        <div className="space-y-2 p-3">
          <div className="text-sm font-medium">買い物リスト</div>
          {["牛乳", "食パン", "卵 10 個"].map((t, i) => (
            <div key={t} className="flex items-center justify-between rounded-md border bg-background px-2.5 py-1.5 text-sm">
              {t}
              {!online && i < pending && (
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <CloudOff className="size-3" aria-hidden />
                  未同期
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>
          実際の回線:{" "}
          <span className={cn("font-medium", networkOnline ? "text-foreground" : "text-destructive")}>{networkOnline ? "オンライン" : "オフライン"}</span>
        </span>
        <label className="flex items-center gap-2">
          オフラインを再現
          <Switch
            aria-label="オフラインを再現"
            checked={simulateOffline}
            onCheckedChange={(v) => {
              setSimulateOffline(v);
              if (!v && networkOnline) flashRef.current();
            }}
          />
        </label>
      </div>
    </div>
  );
}
