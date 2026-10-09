"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Monitor, Smartphone, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

type Row = { id: number; time: string; device: string; mobile: boolean; ip: string; loc: string; suspicious: boolean };

const LOG: Row[] = [
  { id: 1, time: "10/01 08:52", device: "Chrome · macOS", mobile: false, ip: "198.51.100.24", loc: "東京, 日本", suspicious: false },
  { id: 2, time: "09/30 23:14", device: "Firefox · Windows", mobile: false, ip: "203.0.113.42", loc: "バンコク, タイ", suspicious: true },
  { id: 3, time: "09/30 12:03", device: "Safari · iOS", mobile: true, ip: "198.51.100.77", loc: "東京, 日本", suspicious: false },
  { id: 4, time: "09/29 19:40", device: "Chrome · macOS", mobile: false, ip: "198.51.100.24", loc: "東京, 日本", suspicious: false },
];

export default function LoginHistory() {
  const [resolved, setResolved] = useState<null | "me" | "secured">(null);
  const alertRow = LOG.find((r) => r.suspicious)!;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-3">
      <div aria-live="polite">
        {resolved === null ? (
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
            <div className="flex gap-2">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <div className="min-w-0 space-y-1">
                <p className="text-sm font-medium">新しい場所からログインがありました</p>
                <p className="text-xs opacity-80">
                  {alertRow.time} · {alertRow.loc} · {alertRow.device}
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 pl-6">
              <Button size="sm" onClick={() => setResolved("secured")}>
                パスワードを変更
              </Button>
              <Button size="sm" variant="outline" onClick={() => setResolved("me")}>
                自分のログインです
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-lg border bg-muted/40 p-3 text-sm">
            <ShieldCheck className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            {resolved === "me"
              ? "確認しました。このデバイスを信頼済みに追加しました。"
              : "他のセッションをすべてログアウトしました。新しいパスワードを設定してください。"}
          </div>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border bg-background">
        <table className="w-full min-w-[34rem] text-sm">
          <caption className="sr-only">最近のログイン履歴</caption>
          <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
            <tr>
              <th scope="col" className="px-3 py-2 text-left font-medium">日時</th>
              <th scope="col" className="px-3 py-2 text-left font-medium">デバイス</th>
              <th scope="col" className="px-3 py-2 text-left font-medium">IP / 場所</th>
              <th scope="col" className="px-3 py-2 text-left font-medium">状況</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {LOG.map((r) => {
              const flagged = r.suspicious && resolved !== "me";
              return (
                <tr key={r.id} className={flagged ? "bg-amber-50/70 dark:bg-amber-950/25" : ""}>
                  <td className="whitespace-nowrap px-3 py-2 text-xs tabular-nums">{r.time}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-xs">
                    <span className="inline-flex items-center gap-1.5">
                      {r.mobile ? <Smartphone className="size-3.5 text-muted-foreground" /> : <Monitor className="size-3.5 text-muted-foreground" />}
                      {r.device}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-xs">
                    <div className="font-mono">{r.ip}</div>
                    <div className="text-muted-foreground">{r.loc}</div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-xs">
                    {flagged ? (
                      <span className="inline-flex items-center gap-1 font-medium text-amber-700 dark:text-amber-400">
                        <AlertTriangle className="size-3.5" />
                        要確認
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="size-3.5" />
                        成功
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
