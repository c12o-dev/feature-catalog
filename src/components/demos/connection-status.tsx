"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Loader2, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function subscribe(cb: () => void) {
  window.addEventListener("online", cb);
  window.addEventListener("offline", cb);
  return () => {
    window.removeEventListener("online", cb);
    window.removeEventListener("offline", cb);
  };
}

type State = "online" | "offline" | "reconnecting";

const LOOK: Record<State, { label: string; pill: string; dot: string }> = {
  online: {
    label: "オンライン",
    pill: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  offline: {
    label: "オフライン",
    pill: "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
    dot: "bg-red-500",
  },
  reconnecting: {
    label: "再接続中…",
    pill: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
    dot: "bg-amber-500",
  },
};

export default function ConnectionStatus() {
  // Real network state from the browser's online/offline events (assume online on the server).
  const browserOnline = useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
  const [sim, setSim] = useState<State | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const simulate = () => {
    timers.current.forEach(clearTimeout);
    setSim("offline");
    timers.current = [setTimeout(() => setSim("reconnecting"), 2000), setTimeout(() => setSim(null), 3600)];
  };

  const state: State = sim ?? (browserOnline ? "online" : "offline");
  const look = LOOK[state];
  const Icon = state === "online" ? Wifi : state === "offline" ? WifiOff : Loader2;

  return (
    <div className="mx-auto w-full max-w-sm space-y-4">
      <div className="flex items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2">
        <span className="truncate text-sm font-medium">共同編集ドキュメント</span>
        <div role="status" aria-live="polite" className={cn("inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors", look.pill)}>
          <span className="relative flex size-2">
            {state === "online" && <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:hidden" />}
            <span className={cn("relative inline-flex size-2 rounded-full", look.dot)} />
          </span>
          <Icon className={cn("size-3.5", state === "reconnecting" && "animate-spin")} aria-hidden />
          {look.label}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        ブラウザの online / offline イベントを購読しています。機内モードや DevTools の「Offline」でも切り替わります。
      </p>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>
          実際の回線: <span className="font-medium text-foreground">{browserOnline ? "接続あり" : "接続なし"}</span>
        </span>
        <Button variant="outline" size="sm" onClick={simulate} disabled={sim !== null}>
          切断をシミュレート
        </Button>
      </div>
    </div>
  );
}
