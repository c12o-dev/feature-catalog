"use client";

import { useState } from "react";
import { Laptop, ShieldCheck, Smartphone, Tablet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

type Device = { id: string; name: string; meta: string; kind: "laptop" | "phone" | "tablet"; current?: boolean };

const INITIAL: Device[] = [
  { id: "d1", name: "iPhone 15", meta: "東京 · 9月28日に信頼", kind: "phone" },
  { id: "d2", name: "Windows PC (Edge)", meta: "大阪 · 9月12日に信頼", kind: "laptop" },
  { id: "d3", name: "iPad Air", meta: "東京 · 8月3日に信頼", kind: "tablet" },
];

const ICON = { laptop: Laptop, phone: Smartphone, tablet: Tablet };

export default function TrustedDevice() {
  const [code, setCode] = useState("");
  const [trust, setTrust] = useState(true);
  const [verified, setVerified] = useState(false);
  const [devices, setDevices] = useState<Device[]>(INITIAL);
  const [status, setStatus] = useState("");

  const verify = () => {
    if (code.length !== 6) return;
    setVerified(true);
    if (trust) {
      setDevices((d) => [
        { id: "cur", name: "MacBook Pro (Chrome)", meta: "東京 · たった今信頼", kind: "laptop", current: true },
        ...d,
      ]);
      setStatus("この端末を信頼済みに追加しました。30 日間は確認コードを省略します。");
    } else {
      setStatus("ログインしました。この端末は信頼済みに追加していません。");
    }
  };

  const revoke = (dev: Device) => {
    setDevices((d) => d.filter((x) => x.id !== dev.id));
    setStatus(`${dev.name} の信頼を取り消しました。次回ログイン時に確認コードが必要です。`);
  };

  const revokeAll = () => {
    setDevices([]);
    setStatus("すべての端末の信頼を取り消しました。");
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-3">
      {!verified ? (
        <form
          className="rounded-lg border bg-card p-4"
          onSubmit={(e) => {
            e.preventDefault();
            verify();
          }}
        >
          <label htmlFor="td-code" className="text-sm font-medium">
            確認コード
          </label>
          <p className="mt-0.5 text-xs text-muted-foreground">SMS で届いた 6 桁のコードを入力してください</p>
          <input
            id="td-code"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            placeholder="000000"
            className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-center font-mono text-base tracking-[0.4em] tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <label className="mt-3 flex cursor-pointer items-start gap-2 text-xs">
            <Switch checked={trust} onCheckedChange={setTrust} className="mt-0.5" />
            <span>
              この端末を信頼する
              <span className="block text-muted-foreground">30 日間は確認コードを省略します。共有端末ではオフにしてください。</span>
            </span>
          </label>
          <Button type="submit" size="sm" className="mt-3 w-full" disabled={code.length !== 6}>
            確認する
          </Button>
        </form>
      ) : (
        <div className="flex items-center justify-between gap-2 rounded-lg border bg-card px-4 py-3 text-sm">
          <span className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" aria-hidden />
            ログイン済み
          </span>
          <Button
            size="xs"
            variant="ghost"
            onClick={() => {
              setVerified(false);
              setCode("");
              setDevices(INITIAL);
              setStatus("");
            }}
          >
            やり直す
          </Button>
        </div>
      )}

      <section className="rounded-lg border bg-card" aria-labelledby="td-list">
        <div className="flex items-center justify-between gap-2 border-b px-4 py-2.5">
          <h3 id="td-list" className="text-sm font-medium">
            信頼済みの端末 <span className="text-xs text-muted-foreground tabular-nums">{devices.length}</span>
          </h3>
          <Button size="xs" variant="outline" onClick={revokeAll} disabled={devices.length === 0}>
            すべて取り消す
          </Button>
        </div>
        {devices.length === 0 ? (
          <p className="px-4 py-6 text-center text-xs text-muted-foreground">信頼済みの端末はありません</p>
        ) : (
          <ul className="divide-y">
            {devices.map((d) => {
              const Icon = ICON[d.kind];
              return (
                <li key={d.id} className="flex items-center gap-3 px-4 py-2.5">
                  <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 text-sm">
                      <span className="truncate">{d.name}</span>
                      {d.current && (
                        <span className="rounded bg-emerald-500/15 px-1.5 py-px text-[10px] font-medium text-emerald-700 dark:text-emerald-300">
                          この端末
                        </span>
                      )}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">{d.meta}</div>
                  </div>
                  <Button size="xs" variant="ghost" onClick={() => revoke(d)} aria-label={`${d.name} の信頼を取り消す`}>
                    取り消す
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
      <p aria-live="polite" className="min-h-4 text-xs text-muted-foreground">
        {status}
      </p>
    </div>
  );
}
