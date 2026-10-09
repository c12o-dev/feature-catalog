"use client";

import { useState } from "react";
import { FlaskConical, Radio } from "lucide-react";
import { cn } from "@/lib/utils";

type Env = "test" | "live";

const DATA: Record<Env, { revenue: string; payments: string; key: string }> = {
  test: { revenue: "¥48,200", payments: "36", key: "sk_test_4eC39H…qLyj" },
  live: { revenue: "¥1,284,600", payments: "912", key: "sk_live_51Hx7K…a9Te" },
};

export default function EnvSwitch() {
  const [env, setEnv] = useState<Env>("test");
  const d = DATA[env];
  const isTest = env === "test";

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-md overflow-hidden rounded-lg border bg-card shadow-sm transition-colors",
        isTest && "border-amber-400 dark:border-amber-500/60",
      )}
    >
      {isTest && (
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 bg-amber-100 px-3 py-1.5 text-center text-xs text-amber-900 dark:bg-amber-500/15 dark:text-amber-200">
          <FlaskConical className="size-3.5" aria-hidden />
          <span className="font-medium">テストモード</span>
          <span>実際の課金は発生しません</span>
        </div>
      )}
      <div className="space-y-4 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-medium">ダッシュボード</span>
          <div role="group" aria-label="環境" className="inline-flex rounded-md border bg-muted p-0.5">
            {(["test", "live"] as const).map((e) => (
              <button
                key={e}
                type="button"
                aria-pressed={env === e}
                onClick={() => setEnv(e)}
                className={cn(
                  "inline-flex items-center gap-1 rounded px-3 py-1 text-xs text-muted-foreground transition-colors",
                  env === e && "bg-background text-foreground shadow-sm",
                )}
              >
                {e === "test" ? <FlaskConical className="size-3" aria-hidden /> : <Radio className="size-3" aria-hidden />}
                {e === "test" ? "テスト" : "本番"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-md border p-3">
            <div className="text-xs text-muted-foreground">今月の売上</div>
            <div className="mt-1 text-lg font-semibold tabular-nums">{d.revenue}</div>
          </div>
          <div className="rounded-md border p-3">
            <div className="text-xs text-muted-foreground">決済件数</div>
            <div className="mt-1 text-lg font-semibold tabular-nums">{d.payments}</div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">シークレットキー</div>
          <code className="block truncate rounded-md bg-muted px-2 py-1.5 font-mono text-xs">{d.key}</code>
        </div>
        <p className="sr-only" aria-live="polite">
          {isTest ? "テスト環境に切り替えました" : "本番環境に切り替えました"}
        </p>
      </div>
    </div>
  );
}
