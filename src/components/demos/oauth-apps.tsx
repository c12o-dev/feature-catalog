"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, KeyRound, Pencil, Plus, Trash2, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

type App = { id: number; name: string; clientId: string; redirect: string; scopes: string };

const initial: App[] = [
  { id: 1, name: "社内 CLI ツール", clientId: "cli_x9k4P2mQ", redirect: "http://localhost:8080/callback", scopes: "read:user, write:repo" },
  { id: 2, name: "チャット連携ボット", clientId: "bot_3mPaB4tR", redirect: "https://bot.kumo.example/oauth/callback/v2/authorize", scopes: "read:user" },
];

// seeded PRNG so generated ids/secrets are deterministic
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const CHARS = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";

type Mode = { kind: "none" } | { kind: "form"; editId: number | null } | { kind: "secret"; app: App; secret: string } | { kind: "delete"; app: App };

export default function OauthApps() {
  const [apps, setApps] = useState(initial);
  const [mode, setMode] = useState<Mode>({ kind: "none" });
  const [name, setName] = useState("");
  const [redirect, setRedirect] = useState("");
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState("");
  const rng = useRef(mulberry32(20261001));
  const nextId = useRef(3);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (copyTimer.current) clearTimeout(copyTimer.current); }, []);

  const rand = (n: number) => Array.from({ length: n }, () => CHARS[Math.floor(rng.current() * CHARS.length)]).join("");

  const openForm = (app?: App) => {
    setName(app?.name ?? "");
    setRedirect(app?.redirect ?? "https://");
    setMode({ kind: "form", editId: app?.id ?? null });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode.kind !== "form" || !name.trim()) return;
    if (mode.editId !== null) {
      setApps((as) => as.map((a) => (a.id === mode.editId ? { ...a, name: name.trim(), redirect: redirect.trim() } : a)));
      setStatus(`「${name.trim()}」を更新しました`);
      setMode({ kind: "none" });
    } else {
      const app: App = { id: nextId.current++, name: name.trim(), clientId: `app_${rand(8)}`, redirect: redirect.trim(), scopes: "read:user" };
      setApps((as) => [...as, app]);
      setCopied(false);
      setMode({ kind: "secret", app, secret: `cs_live_${rand(32)}` });
      setStatus(`「${app.name}」を作成しました`);
    }
  };

  const copySecret = (secret: string) => {
    navigator.clipboard?.writeText(secret).catch(() => {});
    setCopied(true);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative mx-auto min-h-80 w-full max-w-md space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm font-medium">OAuth アプリケーション</div>
        <Button size="sm" onClick={() => openForm()}><Plus aria-hidden className="size-3.5" />新規</Button>
      </div>
      <ul className="divide-y rounded-lg border bg-card">
        {apps.map((a) => (
          <li key={a.id} className="space-y-1.5 p-3 text-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="flex min-w-0 items-center gap-2 font-medium">
                <KeyRound aria-hidden className="size-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{a.name}</span>
              </span>
              <div className="flex shrink-0 gap-0.5">
                <Button size="icon-sm" variant="ghost" aria-label={`${a.name} を編集`} onClick={() => openForm(a)}><Pencil aria-hidden className="size-3.5" /></Button>
                <Button size="icon-sm" variant="ghost" aria-label={`${a.name} を削除`} onClick={() => setMode({ kind: "delete", app: a })} className="hover:text-destructive"><Trash2 aria-hidden className="size-3.5" /></Button>
              </div>
            </div>
            <dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
              <dt>client_id</dt><dd><code className="font-mono text-foreground">{a.clientId}</code></dd>
              <dt>secret</dt><dd><code className="font-mono">••••••••••••</code></dd>
              <dt>redirect</dt><dd className="min-w-0"><code className="break-all font-mono">{a.redirect}</code></dd>
              <dt>scopes</dt><dd>{a.scopes}</dd>
            </dl>
          </li>
        ))}
        {apps.length === 0 && <li className="p-6 text-center text-xs text-muted-foreground">アプリはまだありません</li>}
      </ul>
      <p aria-live="polite" className="text-xs text-muted-foreground">{status}</p>

      {mode.kind !== "none" && (
        <div className="absolute inset-0 z-10 grid place-items-center rounded-lg bg-background/70 p-2 backdrop-blur-[2px]" onKeyDown={(e) => { if (e.key === "Escape" && mode.kind !== "secret") setMode({ kind: "none" }); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="oauth-dlg-title" className="w-full max-w-sm rounded-lg border bg-popover p-4 text-popover-foreground shadow-lg">
            {mode.kind === "form" && (
              <form onSubmit={submit} className="space-y-3">
                <h3 id="oauth-dlg-title" className="text-sm font-semibold">{mode.editId !== null ? "アプリを編集" : "新しい OAuth アプリ"}</h3>
                <label className="block space-y-1 text-xs">
                  <span className="text-muted-foreground">アプリ名</span>
                  <input autoFocus value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border bg-background px-2 py-1.5 text-sm" placeholder="例: 経費精算アプリ" />
                </label>
                <label className="block space-y-1 text-xs">
                  <span className="text-muted-foreground">リダイレクト URL</span>
                  <input value={redirect} onChange={(e) => setRedirect(e.target.value)} className="w-full rounded-md border bg-background px-2 py-1.5 font-mono text-xs" />
                </label>
                <div className="flex justify-end gap-2">
                  <Button type="button" size="sm" variant="ghost" onClick={() => setMode({ kind: "none" })}>キャンセル</Button>
                  <Button type="submit" size="sm" disabled={!name.trim()}>{mode.editId !== null ? "保存" : "作成"}</Button>
                </div>
              </form>
            )}
            {mode.kind === "secret" && (
              <div className="space-y-3">
                <h3 id="oauth-dlg-title" className="text-sm font-semibold">client_secret を保存してください</h3>
                <p className="flex gap-1.5 rounded-md bg-amber-50 p-2 text-xs text-amber-900 dark:bg-amber-950/50 dark:text-amber-200">
                  <TriangleAlert aria-hidden className="mt-0.5 size-3.5 shrink-0" />
                  この画面を閉じると二度と表示できません。
                </p>
                <div className="space-y-1 text-xs">
                  <div className="text-muted-foreground">client_id</div>
                  <code className="block break-all rounded-md bg-muted px-2 py-1 font-mono">{mode.app.clientId}</code>
                  <div className="pt-1 text-muted-foreground">client_secret</div>
                  <div className="flex items-start gap-1">
                    <code className="block min-w-0 flex-1 break-all rounded-md bg-muted px-2 py-1 font-mono">{mode.secret}</code>
                    <Button size="icon-sm" variant="outline" aria-label="client_secret をコピー" onClick={() => copySecret(mode.secret)}>
                      {copied ? <Check aria-hidden className="size-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy aria-hidden className="size-3.5" />}
                    </Button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button size="sm" onClick={() => setMode({ kind: "none" })}>保存しました</Button>
                </div>
              </div>
            )}
            {mode.kind === "delete" && (
              <div className="space-y-3">
                <h3 id="oauth-dlg-title" className="text-sm font-semibold">「{mode.app.name}」を削除しますか？</h3>
                <p className="text-xs text-muted-foreground">このアプリで発行されたトークンはすべて無効になります。</p>
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="ghost" autoFocus onClick={() => setMode({ kind: "none" })}>キャンセル</Button>
                  <Button size="sm" variant="destructive" onClick={() => { setApps((as) => as.filter((x) => x.id !== mode.app.id)); setStatus(`「${mode.app.name}」を削除しました`); setMode({ kind: "none" }); }}>削除</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
