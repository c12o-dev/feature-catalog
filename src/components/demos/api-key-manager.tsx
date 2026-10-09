"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Check, Copy, Key, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type ApiKey = { id: number; name: string; prefix: string; createdAt: string; lastUsed: string | null };

const initial: ApiKey[] = [
  { id: 1, name: "Production", prefix: "sk_live_x9kQ", createdAt: "2026-08-04", lastUsed: "2 分前" },
  { id: 2, name: "Staging", prefix: "sk_test_3mPa", createdAt: "2026-07-20", lastUsed: "3 日前" },
  { id: 3, name: "ローカル開発", prefix: "sk_test_Hq8d", createdAt: "2026-05-12", lastUsed: null },
];

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeSecret(seed: number) {
  const rnd = mulberry32(seed * 7919);
  let s = "";
  for (let i = 0; i < 32; i++) s += ALPHABET[Math.floor(rnd() * ALPHABET.length)];
  return `sk_live_${s}`;
}

export default function ApiKeyManager() {
  const [keys, setKeys] = useState(initial);
  const [nextId, setNextId] = useState(4);
  const [name, setName] = useState("");
  const [revealed, setRevealed] = useState<{ name: string; secret: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [status, setStatus] = useState("");
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (copyTimer.current) clearTimeout(copyTimer.current);
  }, []);

  const create = () => {
    const keyName = name.trim() || `キー ${nextId}`;
    const secret = makeSecret(nextId);
    setKeys((k) => [...k, { id: nextId, name: keyName, prefix: secret.slice(0, 12), createdAt: "2026-10-01", lastUsed: null }]);
    setNextId(nextId + 1);
    setName("");
    setRevealed({ name: keyName, secret });
    setCopied(false);
    setStatus(`「${keyName}」を発行しました。シークレットはこの一度だけ表示されます。`);
  };

  const copy = async () => {
    if (!revealed) return;
    try {
      await navigator.clipboard.writeText(revealed.secret);
    } catch {
      /* clipboard unavailable — still show feedback */
    }
    setCopied(true);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 1500);
  };

  const remove = (k: ApiKey) => {
    setKeys((list) => list.filter((x) => x.id !== k.id));
    setConfirmId(null);
    setStatus(`「${k.name}」を失効しました。`);
  };

  return (
    <div className="space-y-3">
      <p className="sr-only" role="status" aria-live="polite">{status}</p>

      <form
        className="flex flex-wrap items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          create();
        }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.nativeEvent.isComposing) e.preventDefault();
          }}
          aria-label="キーの名前"
          placeholder="キーの名前（例: 本番 Webhook）"
          className="h-8 min-w-0 flex-1 basis-40 rounded-md border bg-background px-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Button type="submit" size="sm" className="h-8">
          <Plus className="size-4" />
          新規発行
        </Button>
      </form>

      {revealed && (
        <div className="space-y-2 rounded-lg border border-amber-300 bg-amber-50 p-3 dark:border-amber-500/40 dark:bg-amber-500/10">
          <div className="flex items-start gap-2 text-sm text-amber-900 dark:text-amber-200">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <p>
              <span className="font-medium">{revealed.name}</span> のシークレットです。この画面を閉じると二度と表示できません。今すぐ安全な場所に保存してください。
            </p>
          </div>
          <div className="flex items-center gap-2">
            <code className="min-w-0 flex-1 break-all rounded-md border bg-background px-2 py-1.5 font-mono text-xs">{revealed.secret}</code>
            <Button type="button" size="icon-sm" variant="outline" onClick={copy} aria-label={copied ? "コピーしました" : "シークレットをコピー"}>
              {copied ? <Check className="size-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="size-4" />}
            </Button>
          </div>
          <div className="flex justify-end">
            <Button type="button" size="sm" variant="secondary" onClick={() => setRevealed(null)}>
              保存しました
            </Button>
          </div>
        </div>
      )}

      <div className="divide-y rounded-lg border">
        <div className="px-3 py-2 text-xs font-medium text-muted-foreground">API キー（{keys.length}）</div>
        {keys.map((k) => (
          <div key={k.id} className="flex flex-wrap items-center gap-x-3 gap-y-2 p-3 text-sm">
            <Key className="size-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium">{k.name}</div>
              <div className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                <code className="font-mono">{k.prefix}••••••••</code>
                <span className="tabular-nums">{k.createdAt}</span>
                {k.lastUsed ? <span>最終使用 {k.lastUsed}</span> : <Badge variant="secondary" className="text-[10px]">未使用</Badge>}
              </div>
            </div>
            {confirmId === k.id ? (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">失効しますか？</span>
                <Button type="button" size="xs" variant="destructive" onClick={() => remove(k)}>
                  失効
                </Button>
                <Button type="button" size="xs" variant="ghost" onClick={() => setConfirmId(null)}>
                  キャンセル
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmId(k.id)}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                aria-label={`${k.name} を失効`}
              >
                <Trash2 className="size-4" />
              </button>
            )}
          </div>
        ))}
        {keys.length === 0 && <div className="p-6 text-center text-sm text-muted-foreground">API キーはありません</div>}
      </div>
    </div>
  );
}
