"use client";

import { Component, useState, type ReactNode } from "react";
import { AlertTriangle, RefreshCw, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

type BoundaryProps = { children: ReactNode; fallback: (error: Error, reset: () => void) => ReactNode };
type BoundaryState = { error: Error | null };

class ErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): BoundaryState {
    return { error };
  }

  componentDidCatch() {
    // 本番ではここでエラー監視サービスへ送信する
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) return this.props.fallback(this.state.error, this.reset);
    return this.props.children;
  }
}

const BARS = [42, 58, 51, 66, 72, 61, 80];

function SalesWidget({ broken }: { broken: boolean }) {
  if (broken) throw new Error("TypeError: 売上データ (sales.weekly) が undefined です");
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground">今週の売上</p>
          <p className="text-xl font-semibold tabular-nums">¥1,284,500</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
          <TrendingUp className="size-3" />
          +12.4%
        </span>
      </div>
      <div className="flex h-16 items-end gap-1.5" aria-hidden>
        {BARS.map((v, i) => (
          <div key={i} className="flex-1 rounded-sm bg-primary/70" style={{ height: `${v}%` }} />
        ))}
      </div>
    </div>
  );
}

export default function ErrorBoundaryDemo() {
  const [broken, setBroken] = useState(false);
  const [keepFailing, setKeepFailing] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [status, setStatus] = useState("");

  return (
    <div className="mx-auto w-full max-w-md space-y-3">
      <div className="rounded-lg border bg-card p-4">
        <ErrorBoundary
          fallback={(error, reset) => (
            <div role="alert" className="flex flex-col items-center gap-3 py-2 text-center">
              <span className="grid size-10 place-items-center rounded-full bg-destructive/10 text-destructive">
                <AlertTriangle className="size-5" />
              </span>
              <div className="space-y-1">
                <p className="text-sm font-medium">このウィジェットを表示できませんでした</p>
                <p className="text-xs text-muted-foreground">ページの他の部分は引き続き使えます</p>
              </div>
              <details className="w-full rounded-md bg-muted/60 px-2.5 py-1.5 text-left text-xs">
                <summary className="cursor-pointer text-muted-foreground">エラーの詳細</summary>
                <code className="mt-1 block font-mono text-[11px] break-all">{error.message}</code>
              </details>
              <Button
                size="sm"
                onClick={() => {
                  const n = attempts + 1;
                  setAttempts(n);
                  if (!keepFailing) {
                    setBroken(false);
                    setStatus(`再試行 ${n} 回目で復旧しました`);
                  } else {
                    setStatus(`再試行 ${n} 回目も失敗しました`);
                  }
                  reset();
                }}
              >
                <RefreshCw />
                再試行
              </Button>
            </div>
          )}
        >
          <SalesWidget broken={broken} />
        </ErrorBoundary>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed p-3">
        <Button
          size="sm"
          variant="outline"
          disabled={broken}
          onClick={() => {
            setBroken(true);
            setAttempts(0);
            setStatus("ウィジェットでエラーが発生しました");
          }}
        >
          <Zap />
          エラーを発生させる
        </Button>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <Switch aria-label="再試行も失敗させる" size="sm" checked={keepFailing} onCheckedChange={setKeepFailing} />
          再試行も失敗させる
        </label>
      </div>
      <p aria-live="polite" className="min-h-4 text-xs text-muted-foreground tabular-nums">
        {status}
      </p>
    </div>
  );
}
