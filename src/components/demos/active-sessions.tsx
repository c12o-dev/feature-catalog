"use client";

import { useState } from "react";
import { Globe, Monitor, Smartphone, Tablet } from "lucide-react";
import { Button } from "@/components/ui/button";

const initialSessions = [
  { id: "mac", device: "MacBook Pro", browser: "Safari", icon: Monitor, location: "東京", time: "現在アクティブ", current: true },
  { id: "iphone", device: "iPhone 15", browser: "アプリ", icon: Smartphone, location: "東京", time: "5 分前" },
  { id: "win", device: "Windows PC", browser: "Chrome", icon: Globe, location: "大阪", time: "昨日 21:14" },
  { id: "ipad", device: "iPad Air", browser: "Safari", icon: Tablet, location: "福岡", time: "9 月 22 日" },
];

export default function ActiveSessions() {
  const [sessions, setSessions] = useState(initialSessions);
  const [status, setStatus] = useState("");
  const others = sessions.filter((s) => !s.current);

  const signOut = (id: string) => {
    const s = sessions.find((x) => x.id === id);
    setSessions((prev) => prev.filter((x) => x.id !== id));
    if (s) setStatus(`${s.device} からログアウトしました`);
  };

  const signOutAll = () => {
    setSessions((prev) => prev.filter((x) => x.current));
    setStatus(`他の ${others.length} 台の端末からサインアウトしました`);
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-2">
      <div className="flex items-baseline justify-between text-xs text-muted-foreground">
        <span className="font-medium text-foreground">ログイン中の端末</span>
        <span className="tabular-nums">{sessions.length} 台</span>
      </div>
      <ul className="divide-y rounded-lg border bg-card">
        {sessions.map((s) => (
          <li key={s.id} className="flex items-center gap-3 px-3 py-2.5 text-sm">
            <span className="grid size-8 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
              <s.icon className="size-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 font-medium">
                <span className="truncate">{s.device}</span>
                {s.current && (
                  <span className="rounded bg-emerald-500/15 px-1.5 text-[10px] text-emerald-700 dark:text-emerald-300">この端末</span>
                )}
              </div>
              <div className="truncate text-xs text-muted-foreground">
                {s.browser} · {s.location} · {s.time}
              </div>
            </div>
            {!s.current && (
              <Button size="xs" variant="ghost" onClick={() => signOut(s.id)} aria-label={`${s.device} からログアウト`}>
                ログアウト
              </Button>
            )}
          </li>
        ))}
      </ul>
      <p aria-live="polite" className="min-h-4 text-xs text-muted-foreground">
        {status}
      </p>
      {others.length > 0 ? (
        <Button size="sm" variant="destructive" className="w-full" onClick={signOutAll}>
          他の全端末からサインアウト
        </Button>
      ) : (
        <Button
          size="sm"
          variant="outline"
          className="w-full"
          onClick={() => {
            setSessions(initialSessions);
            setStatus("");
          }}
        >
          デモをリセット
        </Button>
      )}
    </div>
  );
}
