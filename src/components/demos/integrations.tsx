"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Status = "connected" | "idle" | "connecting";
type App = { id: string; name: string; desc: string; status: Status; account?: string };

const initial: App[] = [
  { id: "chat", name: "Chatterbox", desc: "通知をチャンネルに送信", status: "connected", account: "#dev-alerts" },
  { id: "repo", name: "Codehaus", desc: "PR の状況を同期", status: "connected", account: "acme/web" },
  { id: "issue", name: "Trackly", desc: "イシューを自動作成", status: "idle" },
  { id: "pay", name: "Paywise", desc: "課金イベントを受信", status: "idle" },
];

export default function Integrations() {
  const [list, setList] = useState(initial);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const patch = (id: string, p: Partial<App>) => setList((l) => l.map((a) => (a.id === id ? { ...a, ...p } : a)));

  const connect = (a: App) => {
    patch(a.id, { status: "connecting" });
    setMsg(`${a.name} の認可画面を開いています…`);
    timers.current.push(setTimeout(() => {
      patch(a.id, { status: "connected", account: "seu@example.com" });
      setMsg(`${a.name} と接続しました`);
    }, 1200));
  };

  const disconnect = (a: App) => {
    patch(a.id, { status: "idle", account: undefined });
    setConfirmId(null);
    setMsg(`${a.name} との接続を解除しました`);
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-2">
      {list.map((a) => (
        <div key={a.id} className="rounded-lg border bg-card p-3">
          <div className="flex items-center gap-3">
            <div aria-hidden className="grid size-9 shrink-0 place-items-center rounded-md bg-muted text-sm font-medium">{a.name[0]}</div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium">{a.name}</div>
              <div className="truncate text-xs text-muted-foreground">
                {a.status === "connected" ? <>接続先: {a.account}</> : a.desc}
              </div>
            </div>
            {a.status === "connected" ? (
              <Button size="sm" variant="outline" onClick={() => setConfirmId(confirmId === a.id ? null : a.id)} aria-expanded={confirmId === a.id} aria-label={`${a.name}: 接続済み。解除する`}>
                <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden />接続済み
              </Button>
            ) : (
              <Button size="sm" onClick={() => connect(a)} disabled={a.status === "connecting"}>
                {a.status === "connecting" ? <><Loader2 className="size-3.5 motion-safe:animate-spin" aria-hidden />接続中</> : "接続"}
              </Button>
            )}
          </div>
          {confirmId === a.id && a.status === "connected" && (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-md bg-muted/60 p-2">
              <span className="text-xs">接続を解除すると同期が止まります。</span>
              <div className="flex gap-1.5">
                <Button size="sm" variant="ghost" onClick={() => setConfirmId(null)}>キャンセル</Button>
                <Button size="sm" variant="destructive" onClick={() => disconnect(a)}>解除する</Button>
              </div>
            </div>
          )}
        </div>
      ))}
      <p aria-live="polite" className="min-h-4 text-xs text-muted-foreground">{msg}</p>
    </div>
  );
}
