"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, Copy, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SECRET = "JBSW Y3DP EHPK 3PXP";
const EXPECTED = "284915"; // デモ用: 認証アプリに表示されている想定のコード
const BACKUP = ["7KQ2-9DMA", "P4XW-21RT", "H8ZN-6CEV", "M3LB-0YSF", "Q9TD-5UGK", "W2JR-8NPH"];
const STEPS = ["QR を読み取る", "コードを確認", "バックアップ"];

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const QR_N = 25;
const QR_CELLS: [number, number][] = (() => {
  const r = mulberry32(7);
  const out: [number, number][] = [];
  const finder = (x: number, y: number) =>
    [
      [0, 0],
      [QR_N - 7, 0],
      [0, QR_N - 7],
    ].some(([fx, fy]) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7);
  for (let y = 0; y < QR_N; y++) for (let x = 0; x < QR_N; x++) if (!finder(x, y) && r() < 0.48) out.push([x, y]);
  return out;
})();

function Finder({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width="7" height="7" />
      <rect x={x + 1} y={y + 1} width="5" height="5" fill="white" />
      <rect x={x + 2} y={y + 2} width="3" height="3" />
    </g>
  );
}

/** QR 風の図案（実際にはデコードできない装飾） */
function FakeQr() {
  const N = QR_N;
  return (
    <svg viewBox={`-2 -2 ${N + 4} ${N + 4}`} role="img" aria-label="認証アプリ用 QR コード" className="size-32 shrink-0 rounded-md bg-white fill-zinc-900 p-1" shapeRendering="crispEdges">
      {QR_CELLS.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />
      ))}
      <Finder x={0} y={0} />
      <Finder x={N - 7} y={0} />
      <Finder x={0} y={N - 7} />
    </svg>
  );
}

export default function TwoFactorWizard() {
  const [step, setStep] = useState(0);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const id = useId();

  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (step === 1) inputRef.current?.focus();
    else if (step > 0) headingRef.current?.focus();
  }, [step]);

  const copySecret = async () => {
    try {
      await navigator.clipboard.writeText(SECRET.replace(/\s/g, ""));
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const verify = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError("6 桁の数字を入力してください");
      return;
    }
    if (code !== EXPECTED) {
      setError("コードが一致しません。アプリに表示中の最新コードを入力してください");
      return;
    }
    setError("");
    setStep(2);
  };

  const reset = () => {
    setStep(0);
    setCode("");
    setError("");
    setSaved(false);
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-3 rounded-lg border bg-card p-4 text-card-foreground">
      <ol className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs" aria-label="設定の進行状況">
        {STEPS.map((label, n) => {
          const done = step > n || step === 3;
          return (
            <li key={label} aria-current={step === n ? "step" : undefined} className={cn("flex items-center gap-1.5", step >= n ? "text-foreground" : "text-muted-foreground")}>
              <span
                className={cn(
                  "grid size-5 place-items-center rounded-full text-[10px] tabular-nums",
                  done ? "bg-emerald-600 text-white dark:bg-emerald-500" : step === n ? "bg-primary text-primary-foreground" : "bg-muted",
                )}
              >
                {done ? <Check aria-hidden className="size-3" /> : n + 1}
              </span>
              {label}
            </li>
          );
        })}
      </ol>

      {step === 0 && (
        <div className="space-y-3">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
            <FakeQr />
            <div className="min-w-0 space-y-2 text-sm">
              <p>認証アプリで QR コードを読み取ってください。</p>
              <div className="text-xs text-muted-foreground">読み取れない場合はキーを入力</div>
              <div className="flex items-center gap-1">
                <code className="min-w-0 truncate rounded bg-muted px-2 py-1 font-mono text-xs">{SECRET}</code>
                <button type="button" aria-label="セットアップキーをコピー" onClick={copySecret} className="grid size-7 shrink-0 place-items-center rounded-md hover:bg-muted">
                  {copied ? <Check aria-hidden className="size-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy aria-hidden className="size-3.5" />}
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setStep(1)}>
              次へ
            </Button>
          </div>
        </div>
      )}

      {step === 1 && (
        <form onSubmit={verify} noValidate className="space-y-2">
          <label htmlFor={`${id}-code`} className="text-sm font-medium">
            認証アプリに表示された 6 桁のコード
          </label>
          <input
            ref={inputRef}
            id={`${id}-code`}
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]*"
            maxLength={6}
            value={code}
            onChange={(e) => {
              setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
              setError("");
            }}
            aria-invalid={!!error}
            aria-describedby={`${id}-hint ${id}-err`}
            placeholder="000000"
            className={cn(
              "h-11 w-full rounded-md border bg-background px-3 text-center font-mono text-xl tracking-[0.4em] tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-ring",
              error && "border-destructive focus-visible:ring-destructive/40",
            )}
          />
          <p id={`${id}-hint`} className="text-xs text-muted-foreground">
            デモ用: アプリには <span className="font-mono tabular-nums">284 915</span> と表示されています
          </p>
          <p id={`${id}-err`} role="alert" className="min-h-4 text-xs text-destructive">
            {error}
          </p>
          <div className="flex justify-between gap-2">
            <Button type="button" size="sm" variant="ghost" onClick={() => setStep(0)}>
              戻る
            </Button>
            <Button type="submit" size="sm" disabled={code.length === 0}>
              確認
            </Button>
          </div>
        </form>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <h3 ref={headingRef} tabIndex={-1} className="text-sm font-medium outline-none">
            バックアップコードを保存してください
          </h3>
          <p className="text-xs text-muted-foreground">端末を紛失したときに 1 回ずつ使えます。</p>
          <ul className="grid grid-cols-2 gap-1.5 rounded-md border bg-muted/50 p-2 font-mono text-xs tabular-nums">
            {BACKUP.map((c) => (
              <li key={c} className="rounded bg-background px-2 py-1 text-center">
                {c}
              </li>
            ))}
          </ul>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={saved} onChange={(e) => setSaved(e.target.checked)} className="size-4 accent-primary" />
            安全な場所に保存しました
          </label>
          <div className="flex justify-end">
            <Button size="sm" disabled={!saved} onClick={() => setStep(3)}>
              有効化する
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col items-center gap-2 py-4 text-center">
          <ShieldCheck aria-hidden className="size-10 text-emerald-600 dark:text-emerald-400" />
          <h3 ref={headingRef} tabIndex={-1} className="text-sm font-medium outline-none" aria-live="polite">
            2 段階認証を有効にしました
          </h3>
          <p className="text-xs text-muted-foreground">次回のログインから確認コードが必要です。</p>
          <Button size="sm" variant="outline" onClick={reset}>
            最初から試す
          </Button>
        </div>
      )}
    </div>
  );
}
