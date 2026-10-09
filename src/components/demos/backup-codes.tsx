"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Download, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const CHARS = "abcdefghjkmnpqrstuvwxyz23456789";

function makeCodes(seed: number) {
  let s = seed;
  const rnd = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
  return Array.from({ length: 10 }, () => {
    let c = "";
    for (let i = 0; i < 8; i++) c += CHARS[Math.floor(rnd() * CHARS.length)];
    return `${c.slice(0, 4)}-${c.slice(4)}`;
  });
}

const USED = new Set([2, 6]);

export default function BackupCodes() {
  const [gen, setGen] = useState(1);
  const [confirming, setConfirming] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const codes = makeCodes(gen * 48271);
  const used = gen === 1 ? USED : new Set<number>();
  const remaining = codes.length - used.size;

  useEffect(() => () => {
    if (flashTimer.current) clearTimeout(flashTimer.current);
  }, []);

  const show = (msg: string) => {
    setFlash(msg);
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlash(null), 2000);
  };

  const text = () =>
    [
      "Lumen バックアップコード",
      "各コードは 1 回だけ使用できます。",
      "",
      ...codes.map((c, i) => (used.has(i) ? `${c}  (使用済み)` : c)),
    ].join("\n");

  const download = () => {
    const url = URL.createObjectURL(new Blob([text()], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "lumen-backup-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
    show("lumen-backup-codes.txt を保存しました");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text());
      show("コードをコピーしました");
    } catch {
      show("コピーできませんでした。ダウンロードをご利用ください");
    }
  };

  const regenerate = () => {
    setGen((g) => g + 1);
    setConfirming(false);
    show("新しいコードを発行しました。以前のコードは無効です");
  };

  return (
    <div className="mx-auto max-w-md space-y-3 rounded-lg border bg-card p-4">
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
        <div className="min-w-0">
          <div className="text-sm font-medium">バックアップコード</div>
          <p className="text-xs text-muted-foreground">
            認証アプリの端末をなくしたときに使います。各コードは 1 回限り有効です。
            <span className="tabular-nums">（残り {remaining} / {codes.length}）</span>
          </p>
        </div>
      </div>

      <ol className="grid grid-cols-2 gap-1.5 font-mono text-sm" aria-label="バックアップコード一覧">
        {codes.map((c, i) => (
          <li
            key={c}
            className={
              used.has(i)
                ? "rounded bg-muted/50 px-2 py-1 text-muted-foreground line-through"
                : "rounded bg-muted px-2 py-1 motion-safe:animate-in motion-safe:fade-in"
            }
          >
            {c}
            {used.has(i) && <span className="sr-only">（使用済み）</span>}
          </li>
        ))}
      </ol>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={download} className="flex-1">
          <Download className="size-3.5" aria-hidden />
          ダウンロード
        </Button>
        <Button size="sm" variant="outline" onClick={copy} className="flex-1">
          <Copy className="size-3.5" aria-hidden />
          コピー
        </Button>
      </div>

      {confirming ? (
        <div className="space-y-2 rounded-md border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
          <p>再生成すると、今のコードはすべて使えなくなります。よろしいですか？</p>
          <div className="flex justify-end gap-2">
            <Button size="xs" variant="ghost" onClick={() => setConfirming(false)}>
              キャンセル
            </Button>
            <Button size="xs" variant="destructive" onClick={regenerate}>
              再生成する
            </Button>
          </div>
        </div>
      ) : (
        <Button size="xs" variant="ghost" onClick={() => setConfirming(true)} className="text-muted-foreground">
          <RefreshCw className="size-3" aria-hidden />
          コードを再生成
        </Button>
      )}

      <p role="status" aria-live="polite" className="min-h-4 text-xs text-emerald-700 dark:text-emerald-400">
        {flash && (
          <span className="inline-flex items-center gap-1">
            <Check className="size-3" aria-hidden />
            {flash}
          </span>
        )}
      </p>
    </div>
  );
}
