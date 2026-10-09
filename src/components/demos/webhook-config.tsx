"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Loader2, Send, XCircle } from "lucide-react";

const events = ["user.created", "order.paid", "subscription.cancelled"];

type Delivery = { ok: boolean; status: number; ms: number; at: string; event: string };

function isValidUrl(u: string) {
  try {
    const p = new URL(u);
    return p.protocol === "https:";
  } catch {
    return false;
  }
}

export default function WebhookConfig() {
  const id = useId();
  const [url, setUrl] = useState("https://api.example.com/webhooks/in");
  const [sel, setSel] = useState<string[]>(["user.created", "order.paid"]);
  const [saved, setSaved] = useState<{ url: string; sel: string[] }>({ url: "https://api.example.com/webhooks/in", sel: ["user.created", "order.paid"] });
  const [savedFlash, setSavedFlash] = useState(false);
  const [sending, setSending] = useState(false);
  const [log, setLog] = useState<Delivery[]>([]);
  const timers = useRef<number[]>([]);
  const seq = useRef(0);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const valid = isValidUrl(url);
  const dirty = url !== saved.url || sel.join() !== saved.sel.join();
  const toggle = (e: string) => setSel((s) => (s.includes(e) ? s.filter((x) => x !== e) : [...s, e]));

  const save = () => {
    if (!valid || sel.length === 0) return;
    setSaved({ url, sel });
    setSavedFlash(true);
    timers.current.push(window.setTimeout(() => setSavedFlash(false), 1800));
  };

  const test = () => {
    if (!valid || sending) return;
    setSending(true);
    const n = seq.current++;
    // Deterministic mock: endpoints containing "fail" return 500, others alternate latency.
    const ok = !url.includes("fail");
    const ms = 120 + ((n * 37) % 90);
    const event = sel[0] ?? "ping";
    timers.current.push(
      window.setTimeout(() => {
        setSending(false);
        const at = new Date(Date.parse("2026-10-01T09:00:00+09:00") + n * 61_000).toLocaleTimeString("ja-JP", { timeZone: "Asia/Tokyo", hour: "2-digit", minute: "2-digit", second: "2-digit" });
        setLog((l) => [{ ok, status: ok ? 200 : 500, ms, at, event }, ...l].slice(0, 3));
      }, 900),
    );
  };

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor={`${id}-url`} className="text-xs">エンドポイント URL</Label>
        <Input
          id={`${id}-url`}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          aria-invalid={!valid}
          aria-describedby={`${id}-url-hint`}
          className="font-mono text-xs"
          spellCheck={false}
        />
        <p id={`${id}-url-hint`} className={valid ? "text-xs text-muted-foreground" : "text-xs text-destructive"}>
          {valid ? "https の URL に POST で送信します（fail を含む URL は失敗を再現）" : "https:// で始まる有効な URL を入力してください"}
        </p>
      </div>

      <fieldset className="space-y-1.5">
        <legend className="text-xs font-medium">イベント</legend>
        {events.map((e) => (
          <label key={e} className="flex cursor-pointer items-center gap-2 text-sm">
            <input type="checkbox" checked={sel.includes(e)} onChange={() => toggle(e)} className="size-4 accent-primary" />
            <code className="font-mono text-xs">{e}</code>
          </label>
        ))}
        {sel.length === 0 && <p className="text-xs text-destructive">1 つ以上選択してください</p>}
      </fieldset>

      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={save} disabled={!valid || sel.length === 0 || !dirty}>
          {savedFlash ? <><Check className="size-3.5" />保存しました</> : "保存"}
        </Button>
        <Button size="sm" variant="outline" onClick={test} disabled={!valid || sending}>
          {sending ? <Loader2 className="size-3.5 motion-safe:animate-spin" /> : <Send className="size-3.5" />}
          テスト送信
        </Button>
        {dirty && <span className="text-xs text-muted-foreground">未保存の変更があります</span>}
      </div>

      <div className="rounded-md border bg-card">
        <div className="border-b px-3 py-1.5 text-xs font-medium text-muted-foreground">最近の配信</div>
        <ul aria-live="polite" className="divide-y">
          {log.length === 0 ? (
            <li className="px-3 py-3 text-xs text-muted-foreground">まだ送信していません</li>
          ) : (
            log.map((d, i) => (
              <li key={`${d.at}-${i}`} className="flex flex-wrap items-center gap-x-2 gap-y-0.5 px-3 py-2 text-xs">
                {d.ok ? <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden /> : <XCircle className="size-3.5 text-destructive" aria-hidden />}
                <span className={d.ok ? "font-medium text-emerald-700 dark:text-emerald-400" : "font-medium text-destructive"}>
                  {d.status} {d.ok ? "OK" : "Internal Server Error"}
                </span>
                <code className="font-mono text-muted-foreground">{d.event}</code>
                <span className="ml-auto text-muted-foreground tabular-nums">{d.ms}ms · {d.at}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
