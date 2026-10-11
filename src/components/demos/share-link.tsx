"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Globe, Link2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

const CHARS = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function ShareLink() {
  const [token, setToken] = useState<string | null>(null);
  const [pub, setPub] = useState(true);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState("");
  const rng = useRef(mulberry32(1001));
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const url = token ? `https://docs.kumo.example/p/${token}` : "";

  const issue = () => {
    const t = Array.from({ length: 10 }, () => CHARS[Math.floor(rng.current() * CHARS.length)]).join("");
    setToken(t);
    setCopied(false);
    setStatus(token ? "新しいリンクを発行しました。以前のリンクは無効です" : "共有リンクを発行しました");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setStatus("リンクをコピーしました");
    } catch {
      setStatus("コピーできませんでした。リンクを選択してコピーしてください");
      return;
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-3 rounded-lg border bg-card p-4">
      <div>
        <div className="text-sm font-medium">下書きを共有</div>
        <div className="text-xs text-muted-foreground">「2026 年下期 ロードマップ（草案）」</div>
      </div>

      {token ? (
        <>
          <div className="flex items-center gap-2 rounded-md border bg-background p-1.5 pl-3">
            <code className="min-w-0 flex-1 truncate text-xs text-muted-foreground" title={url}>{url}</code>
            <Button size="sm" variant="ghost" onClick={copy}>
              {copied ? <><Check aria-hidden className="size-3.5 text-emerald-600 dark:text-emerald-400" />コピー済</> : <><Copy aria-hidden className="size-3.5" />コピー</>}
            </Button>
          </div>
          <div role="radiogroup" aria-label="アクセス範囲" className="flex flex-wrap gap-2 text-xs">
            {[
              { v: true, label: "リンクを知る全員", Icon: Globe },
              { v: false, label: "招待した人のみ", Icon: Lock },
            ].map(({ v, label, Icon }) => (
              <button
                key={label}
                type="button"
                role="radio"
                aria-checked={pub === v}
                onClick={() => { setPub(v); setStatus(v ? "リンクを知る全員が閲覧できます" : "招待した人だけが閲覧できます"); }}
                className="inline-flex items-center gap-1 rounded-md border px-2 py-1 hover:bg-accent aria-checked:bg-foreground aria-checked:text-background"
              >
                <Icon aria-hidden className="size-3.5" />{label}
              </button>
            ))}
          </div>
          <button type="button" onClick={issue} className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline">
            リンクを再発行（古いリンクを無効化）
          </button>
        </>
      ) : (
        <Button size="sm" onClick={issue}><Link2 aria-hidden className="size-3.5" />公開リンクを発行</Button>
      )}
      <p aria-live="polite" className="min-h-4 text-xs text-muted-foreground">{status}</p>
    </div>
  );
}
